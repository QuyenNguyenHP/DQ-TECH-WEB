# DQ TECH WEB

The production image contains the Vite frontend, Nginx, and the Python content API. On the destination PC or VPS, Apache2 handles `dqtech.cloud` and HTTPS, then proxies traffic to Docker on `127.0.0.1:8081`.

```text
Internet -> Apache :80/:443 -> 127.0.0.1:8081 -> Nginx :8080
                                                   |-> frontend
                                                   `-> Python API :8000
```

The Docker host port is `8081`; the container port remains `8080`. Port `8000` is internal and must not be exposed publicly.

## Important files

```text
frontend/                                  Vite/React application
backend/                                   Python API, JSON data, uploads
docker/Dockerfile                          production image
docker/entrypoint.sh                       starts Python and Nginx
docker/nginx.conf                          frontend and API routing
docker/compose.yaml                        deployment on host port 8081
docker/apache/dqtech.cloud.conf.example    Apache reverse proxy
.dockerignore
```

## Local development

```bash
npm --prefix frontend install
npm --prefix frontend run dev:api
```

In a second terminal:

```bash
npm --prefix frontend run dev
```

The frontend uses the same-origin API path `/api/content`; no production domain is compiled into the image.

## Build and test the image

Run from the repository root:

```bash
docker build --file docker/Dockerfile --tag dqtech-web:latest .
docker image inspect dqtech-web:latest --format '{{.Os}}/{{.Architecture}}'
```

Test locally on port `8081`:

```bash
docker run --detach \
  --name dqtech-web-test \
  --publish 127.0.0.1:8081:8080 \
  dqtech-web:latest

curl --fail http://127.0.0.1:8081/api/content/health
docker rm --force dqtech-web-test
```

The image architecture must match the destination. `linux/amd64` is for Intel/AMD 64-bit PCs. For an ARM64 destination, use Buildx:

```bash
docker buildx build \
  --platform linux/arm64 \
  --file docker/Dockerfile \
  --tag dqtech-web:latest \
  --load .
```

## Export for another PC

```bash
docker save dqtech-web:latest | gzip -9 > dqtech-web-latest-amd64.tar.gz
sha256sum dqtech-web-latest-amd64.tar.gz > dqtech-web-latest-amd64.tar.gz.sha256
```

Copy these files to the destination:

- `dqtech-web-latest-amd64.tar.gz`
- `dqtech-web-latest-amd64.tar.gz.sha256`
- `docker/compose.yaml`
- `docker/apache/dqtech.cloud.conf.example` when Apache is used

Example VPS transfer:

```bash
ssh your_user@YOUR_SERVER_IP 'mkdir -p /opt/dqtech'
scp dqtech-web-latest-amd64.tar.gz* your_user@YOUR_SERVER_IP:/opt/dqtech/
scp docker/compose.yaml your_user@YOUR_SERVER_IP:/opt/dqtech/
scp docker/apache/dqtech.cloud.conf.example your_user@YOUR_SERVER_IP:/opt/dqtech/
```

## Deploy on the destination

Install Docker Engine and the Docker Compose plugin. Then verify and load the archive:

```bash
cd /opt/dqtech
sha256sum --check dqtech-web-latest-amd64.tar.gz.sha256
docker load --input dqtech-web-latest-amd64.tar.gz
docker image inspect dqtech-web:latest --format '{{.RepoTags}} {{.Os}}/{{.Architecture}}'
```

Place `compose.yaml` in `/opt/dqtech`, then start the application:

```bash
docker compose up --detach
docker compose ps
curl --fail http://127.0.0.1:8081/api/content/health
```

Without Docker Compose:

```bash
docker run --detach \
  --name dqtech-web \
  --publish 127.0.0.1:8081:8080 \
  --volume dqtech-data:/app/backend/data \
  --volume dqtech-uploads:/app/backend/uploads \
  --restart unless-stopped \
  dqtech-web:latest
```

The loopback binding is intentional: only Apache can reach the app. For local testing without Apache, use `--publish 8081:8080` and open `http://localhost:8081`.

## Persistent data

The deployment uses two named volumes:

- `dqtech-data` for `content-store.json`
- `dqtech-uploads` for uploaded product and blog images

Recreating the container does not delete these volumes. Do not run `docker compose down --volumes` or `docker volume rm dqtech-data dqtech-uploads` unless the data should be permanently deleted.

Back up both volumes:

```bash
mkdir -p /opt/dqtech/backups
docker run --rm \
  --volume dqtech-data:/source:ro \
  --volume /opt/dqtech/backups:/backup \
  alpine tar czf /backup/dqtech-data.tar.gz -C /source .
docker run --rm \
  --volume dqtech-uploads:/source:ro \
  --volume /opt/dqtech/backups:/backup \
  alpine tar czf /backup/dqtech-uploads.tar.gz -C /source .
```

## Apache2 for dqtech.cloud

Before configuring Apache:

1. Point DNS `A` records for `dqtech.cloud` and optionally `www.dqtech.cloud` to the server IP.
2. Allow inbound TCP ports `80` and `443`.
3. Keep Docker port `8081` on `127.0.0.1`; it needs no public firewall rule.

Install Apache and Certbot on Ubuntu/Debian:

```bash
sudo apt update
sudo apt install -y apache2 certbot python3-certbot-apache
sudo a2enmod proxy proxy_http headers ssl
```

Install the included site configuration:

```bash
sudo cp /opt/dqtech/dqtech.cloud.conf.example \
  /etc/apache2/sites-available/dqtech.cloud.conf
sudo a2ensite dqtech.cloud.conf
sudo apache2ctl configtest
sudo systemctl reload apache2
```

Confirm HTTP reaches Docker before requesting a certificate:

```bash
curl --fail http://dqtech.cloud/api/content/health
```

Configure HTTPS:

```bash
sudo certbot --apache --redirect -d dqtech.cloud -d www.dqtech.cloud
sudo apache2ctl configtest
sudo systemctl reload apache2
sudo certbot renew --dry-run
```

If there is no `www` DNS record, omit `-d www.dqtech.cloud` and remove `ServerAlias www.dqtech.cloud` from the Apache file.

Final checks:

```bash
curl -I https://dqtech.cloud
curl --fail https://dqtech.cloud/api/content/health
docker inspect --format '{{.State.Health.Status}}' dqtech-web
docker logs --tail 100 dqtech-web
```

Do not run the old `dqtech-content-api.service` systemd service with this deployment. The backend already runs inside Docker.

## Update and rollback

Rebuild and export on the build PC. On the destination PC:

```bash
cd /opt/dqtech
docker tag dqtech-web:latest dqtech-web:previous
docker load --input dqtech-web-latest-amd64.tar.gz
docker compose up --detach --force-recreate
curl --retry 10 --retry-delay 2 --retry-connrefused --fail \
  http://127.0.0.1:8081/api/content/health
```

The named volumes remain attached. To roll back:

```bash
docker compose down
docker run --detach \
  --name dqtech-web \
  --publish 127.0.0.1:8081:8080 \
  --volume dqtech-data:/app/backend/data \
  --volume dqtech-uploads:/app/backend/uploads \
  --restart unless-stopped \
  dqtech-web:previous
```

## Operations and troubleshooting

```bash
docker compose ps
docker logs --follow dqtech-web
docker restart dqtech-web
docker inspect --format '{{.State.Health.Status}}' dqtech-web
ss -ltnp | grep 8081
sudo apache2ctl configtest
sudo tail -f /var/log/apache2/dqtech.cloud_error.log
```

Common problems:

- `permission denied ... docker.sock`: add the user to the `docker` group, sign out and in again, or use `sudo`.
- Apache `503 Service Unavailable`: verify the container and `curl http://127.0.0.1:8081/api/content/health`.
- HTTP works but HTTPS fails: verify DNS, ports 80/443, and the Certbot result.
- Upload fails: check disk space, both volumes, container logs, and Apache's error log.
- Port allocated: check `sudo ss -ltnp | grep :8081`; stop that process or change the host port in both Compose and Apache.

The backend and Nginx upload limits default to 20 MB. To change the limit, update `CONTENT_API_MAX_BODY_MB` and `client_max_body_size` in `docker/nginx.conf`, then rebuild.
