# DQ TECH WEB

Production uses Apache2 and a standalone Python service.

```text
Internet -> Apache2 :80/:443
              |-> frontend/dist
              |-> /api/content -> Python :8000
              `-> /uploads     -> Python :8000
```

Apache serves the Vite frontend, terminates HTTPS for `dqtech.cloud`, and
proxies API and upload requests to the Python backend. The backend listens only
on `127.0.0.1:8000` and must not be exposed publicly.

## Repository layout

```text
frontend/                                      Vite/React application
backend/server.py                              Python content API
backend/dqtech-content-api.service.example     systemd unit
backend/apache/dqtech.cloud.conf.example       Apache virtual host
backend/data/                                  persistent JSON data (not in Git)
backend/uploads/                               persistent uploads (not in Git)
```

## Local development

Install dependencies:

```bash
npm --prefix frontend install
```

Start the backend:

```bash
npm --prefix frontend run dev:api
```

In another terminal, start Vite:

```bash
npm --prefix frontend run dev
```

The frontend uses same-origin paths `/api/content` and `/uploads`.

## Production prerequisites

These instructions assume:

- Ubuntu or Debian
- the repository is at `~/DQ-TECH-WEB` for Linux user `dq`
- DNS `A` records for `dqtech.cloud` and `www.dqtech.cloud` point to the server
- inbound TCP ports 80 and 443 are open

If `www.dqtech.cloud` is not configured in DNS, remove its `ServerAlias` from
the Apache file and omit it from the Certbot command.

Install Apache, Python, and Certbot:

```bash
sudo apt update
sudo apt install -y apache2 certbot python3-certbot-apache python3
sudo a2enmod proxy proxy_http rewrite headers ssl
```

Install Node.js 22 and npm using your preferred Node.js installation method,
then verify them before building:

```bash
node --version
npm --version
```

## Build the frontend

```bash
cd ~/DQ-TECH-WEB
npm --prefix frontend ci
npm --prefix frontend run build
```

Apache serves the generated files directly from
`/home/dq/DQ-TECH-WEB/frontend/dist`. Apache configuration cannot expand `~`,
so it uses the equivalent absolute path.

Allow Apache to traverse the home directory and read the built frontend:

```bash
chmod o+x /home/dq
chmod o+x ~/DQ-TECH-WEB ~/DQ-TECH-WEB/frontend
chmod -R a+rX ~/DQ-TECH-WEB/frontend/dist
```

## Prepare persistent backend data

```bash
mkdir -p \
  ~/DQ-TECH-WEB/backend/data \
  ~/DQ-TECH-WEB/backend/uploads/products \
  ~/DQ-TECH-WEB/backend/uploads/blogs

sudo chown -R dq:dq \
  ~/DQ-TECH-WEB/backend/data \
  ~/DQ-TECH-WEB/backend/uploads
```

Do not replace or delete `backend/data` or `backend/uploads` during an update.
They contain the live website content and uploaded images.

## Install the backend service

```bash
sudo cp \
  ~/DQ-TECH-WEB/backend/dqtech-content-api.service.example \
  /etc/systemd/system/dqtech-content-api.service

sudo systemctl daemon-reload
sudo systemctl enable --now dqtech-content-api
sudo systemctl status dqtech-content-api
```

Verify the backend before configuring Apache:

```bash
curl --fail http://127.0.0.1:8000/api/content/health
sudo ss -ltnp | grep :8000
```

The listener should be `127.0.0.1:8000`, not `0.0.0.0:8000`.

## Configure Apache for dqtech.cloud

Install the included HTTP virtual host:

```bash
sudo cp \
  ~/DQ-TECH-WEB/backend/apache/dqtech.cloud.conf.example \
  /etc/apache2/sites-available/dqtech.cloud.conf

sudo a2dissite 000-default.conf
sudo a2ensite dqtech.cloud.conf
sudo apache2ctl configtest
sudo systemctl reload apache2
```

Test HTTP before requesting a certificate:

```bash
curl --fail http://dqtech.cloud/api/content/health
curl -I http://dqtech.cloud
```

Enable HTTPS and automatic HTTP-to-HTTPS redirection:

```bash
sudo certbot --apache --redirect -d dqtech.cloud -d www.dqtech.cloud
sudo apache2ctl configtest
sudo systemctl reload apache2
sudo certbot renew --dry-run
```

Final checks:

```bash
curl -I https://dqtech.cloud
curl --fail https://dqtech.cloud/api/content/health
sudo systemctl status dqtech-content-api apache2
```

## Firewall

With UFW, expose only SSH, HTTP, and HTTPS:

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Apache Full'
sudo ufw enable
sudo ufw status
```

Do not open port 8000. It is an internal backend port.

## Updating the website

Back up live content before an important update:

```bash
mkdir -p ~/dqtech-backups
tar -czf ~/dqtech-backups/content-$(date +%F-%H%M%S).tar.gz \
  -C ~/DQ-TECH-WEB/backend data uploads
```

Pull and deploy the updated application:

```bash
cd ~/DQ-TECH-WEB
git pull --ff-only
npm --prefix frontend ci
npm --prefix frontend run build
sudo systemctl restart dqtech-content-api
```

Apache reads the new `frontend/dist` files immediately, so an Apache reload is
not needed for ordinary frontend changes. Run a configuration test and reload
Apache only when its virtual-host configuration changes:

```bash
sudo apache2ctl configtest
sudo systemctl reload apache2
```

Verify the deployment:

```bash
curl --fail http://127.0.0.1:8000/api/content/health
curl --fail https://dqtech.cloud/api/content/health
sudo journalctl -u dqtech-content-api -n 100 --no-pager
```

## Operations and troubleshooting

```bash
sudo systemctl status dqtech-content-api apache2
sudo journalctl -u dqtech-content-api -f
sudo tail -f /var/log/apache2/dqtech.cloud_error.log
sudo apache2ctl configtest
sudo ss -ltnp | grep -E ':(80|443|8000)'
```

Common problems:

- Apache `503`: check `dqtech-content-api` and test port 8000 directly.
- HTTPS issuance fails: confirm DNS points to this server and ports 80/443 are open.
- Upload fails: check ownership of `backend/data` and `backend/uploads`, disk
  space, the 20 MB backend limit, and Apache logs.
- Frontend route returns 404: confirm `mod_rewrite` is enabled and the included
  SPA fallback rules are installed.

To change the backend port, update `CONTENT_API_PORT` in the systemd unit and
all Apache `ProxyPass` targets, then reload systemd and Apache.
