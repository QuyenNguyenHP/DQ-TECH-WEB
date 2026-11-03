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

Create the systemd unit directly:

```bash
sudo nano /etc/systemd/system/dqtech-content-api.service
```

Enter the following configuration and save the file:

```ini
[Unit]
Description=DQ TECH Content API
After=network.target

[Service]
Type=simple
User=dq
Group=dq
WorkingDirectory=/home/dq/DQ-TECH-WEB
Environment=CONTENT_API_HOST=127.0.0.1
Environment=CONTENT_API_PORT=8000
Environment=CONTENT_API_MAX_BODY_MB=20
Environment=CONTENT_API_AGENT_KEY=replace-with-output-of-openssl-rand-hex-32
Environment=CONTENT_API_AGENT_CAN_PUBLISH=false
Environment=CONTENT_API_ADMIN_USERNAME=admin
Environment=CONTENT_API_ADMIN_PASSWORD_HASH=replace-with-output-of-hash-password
ExecStart=/usr/bin/python3 /home/dq/DQ-TECH-WEB/backend/server.py
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
```

Load and start the service:

```bash
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

## Admin login

The admin password is checked by the Python backend, never in frontend code.
Every create, update, delete, upload and draft request requires an admin
session (an HttpOnly cookie). Without a configured password, admin login is
disabled and all of those requests are refused.

Create a password hash on the server (at least 12 characters):

```bash
python3 ~/DQ-TECH-WEB/backend/server.py hash-password
```

Copy the printed line (it starts with `pbkdf2_sha256$`) into the systemd unit:

```bash
sudo nano /etc/systemd/system/dqtech-content-api.service
```

```ini
Environment=CONTENT_API_ADMIN_USERNAME=admin
Environment=CONTENT_API_ADMIN_PASSWORD_HASH=pbkdf2_sha256$600000$...$...
```

Apply it:

```bash
sudo systemctl daemon-reload
sudo systemctl restart dqtech-content-api
```

Notes:

- Sessions last 12 hours (`CONTENT_API_SESSION_HOURS`). Restarting the
  service logs the admin out.
- After 5 wrong passwords from one IP, login is blocked for 15 minutes.
- To change the password, generate a new hash and repeat the steps above.
- For local development only, `CONTENT_API_ADMIN_PASSWORD` (plain text) and
  `CONTENT_API_COOKIE_SECURE=false` may be used instead.

## Configure Apache for dqtech.cloud

Create the Apache virtual host directly:

```bash
sudo nano /etc/apache2/sites-available/dqtech.cloud.conf
```

Enter the following configuration and save the file:

```apache
<VirtualHost *:80>
    ServerName dqtech.cloud
    ServerAlias www.dqtech.cloud

    DocumentRoot /home/dq/DQ-TECH-WEB/frontend/dist

    <Directory /home/dq/DQ-TECH-WEB/frontend/dist>
        Options -Indexes +FollowSymLinks
        AllowOverride None
        Require all granted
    </Directory>

    ProxyPreserveHost On

    ProxyPass /api/content http://127.0.0.1:8000/api/content retry=0 timeout=60
    ProxyPassReverse /api/content http://127.0.0.1:8000/api/content

    ProxyPass /uploads http://127.0.0.1:8000/uploads retry=0 timeout=60
    ProxyPassReverse /uploads http://127.0.0.1:8000/uploads

    RewriteEngine On
    RewriteCond %{REQUEST_URI} !^/api/content [NC]
    RewriteCond %{REQUEST_URI} !^/uploads [NC]
    # In a VirtualHost rewrite context REQUEST_FILENAME can still be the URL
    # path. Test the document-root path explicitly so existing Vite assets
    # are served instead of being rewritten to index.html.
    RewriteCond %{DOCUMENT_ROOT}%{REQUEST_URI} !-f
    RewriteCond %{DOCUMENT_ROOT}%{REQUEST_URI} !-d
    RewriteRule ^ /index.html [L]

    ErrorLog ${APACHE_LOG_DIR}/dqtech.cloud_error.log
    CustomLog ${APACHE_LOG_DIR}/dqtech.cloud_access.log combined
</VirtualHost>
```

Enable and validate the site:

```bash
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

Live content (blog posts, products, uploaded images) lives in `backend/data/`
and `backend/uploads/`. Both are ignored by Git, so pulling new code never
changes them. Use the update script, which also backs them up first:

```bash
bash ~/DQ-TECH-WEB/deploy/update.sh
```

The script:

1. counts products and blog posts,
2. backs up `backend/data` and `backend/uploads` to `~/dqtech-backups/`
   (keeps the newest 20),
3. discards local changes to build output only (`frontend/dist`),
4. stops if any other tracked file was edited on the server,
5. runs `git pull --ff-only`, `npm ci`, `npm run build`,
6. restarts `dqtech-content-api` and checks the health endpoint,
7. checks that the product and blog counts did not drop.

Never run `git clean -x`, `git clean -fdx`, or delete the repository folder to
"start fresh": that removes `backend/data` and `backend/uploads`.
`git reset --hard` and `git stash` do not touch these ignored folders.

To restore a backup:

```bash
sudo systemctl stop dqtech-content-api
tar -xzf ~/dqtech-backups/content-YYYY-MM-DD-HHMMSS.tar.gz -C ~/DQ-TECH-WEB/backend
sudo systemctl start dqtech-content-api
```

Manual equivalent of the script:

```bash
cd ~/DQ-TECH-WEB
tar -czf ~/dqtech-backups/content-$(date +%F-%H%M%S).tar.gz -C backend data uploads
git checkout -- frontend/dist && git clean -fd -- frontend/dist
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
