# Python backend deployment

This project now expects a standalone Python backend for:

- `/api/content/*`
- `/uploads/*`

The frontend can stay static under Apache, while Apache reverse proxies the API and upload paths to the Python process.

## 1. Start the backend manually

```bash
cd /var/www/dqtech-app
python3 backend/server.py
```

Environment variables:

- `CONTENT_API_HOST` default: `127.0.0.1`
- `CONTENT_API_PORT` default: `8000`
- `CONTENT_API_MAX_BODY_MB` default: `20`
- `CONTENT_API_ALLOW_ORIGIN` optional: CORS origin when not using reverse proxy

### Run on a different port

If you want the backend to listen on `8131` instead of `8000`:

```bash
cd /var/www/dqtech-app
CONTENT_API_PORT=8131 python3 backend/server.py
```

If you use `systemd`, set the same port in the service file:

```ini
Environment=CONTENT_API_HOST=127.0.0.1
Environment=CONTENT_API_PORT=8131
Environment=CONTENT_API_MAX_BODY_MB=20
```

After editing the service:

```bash
sudo systemctl daemon-reload
sudo systemctl restart dqtech-content-api
sudo systemctl status dqtech-content-api
```

## 2. Apache modules

```bash
sudo a2enmod proxy proxy_http rewrite headers
sudo systemctl reload apache2
```

## 3. Apache virtual host

Use the static frontend as `DocumentRoot`, then proxy API and upload traffic to Python:

```apache
<VirtualHost *:80>
    ServerName dqtech.cloud
    ServerAlias www.dqtech.cloud

    DocumentRoot /var/www/dqtech.cloud

    <Directory /var/www/dqtech.cloud>
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>

    ProxyPreserveHost On
    ProxyPass /api/content http://127.0.0.1:8000/api/content
    ProxyPassReverse /api/content http://127.0.0.1:8000/api/content
    ProxyPass /uploads http://127.0.0.1:8000/uploads
    ProxyPassReverse /uploads http://127.0.0.1:8000/uploads

    RewriteEngine On
    RewriteCond %{REQUEST_URI} !^/api/content
    RewriteCond %{REQUEST_URI} !^/uploads
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^ /index.html [L]

    ErrorLog ${APACHE_LOG_DIR}/dqtech.cloud_error.log
    CustomLog ${APACHE_LOG_DIR}/dqtech.cloud_access.log combined
</VirtualHost>
```

If the backend runs on `8131`, update the proxy target in Apache as well:

```apache
ProxyPass /api/content http://127.0.0.1:8131/api/content retry=0 timeout=60
ProxyPassReverse /api/content http://127.0.0.1:8131/api/content
ProxyPass /uploads http://127.0.0.1:8131/uploads retry=0 timeout=60
ProxyPassReverse /uploads http://127.0.0.1:8131/uploads
```

## 4. systemd service

Copy the example unit:

```bash
sudo cp /var/www/dqtech-app/backend/dqtech-content-api.service.example /etc/systemd/system/dqtech-content-api.service
sudo systemctl daemon-reload
sudo systemctl enable --now dqtech-content-api
sudo systemctl status dqtech-content-api
```

## 5. Writable directories

The Python backend writes to these paths:

- `backend/data/content-store.json`
- `backend/uploads/products`
- `backend/uploads/blogs`

Grant the service user write access:

```bash
sudo chown -R www-data:www-data /var/www/dqtech-app/backend/data /var/www/dqtech-app/backend/uploads
sudo chmod -R 775 /var/www/dqtech-app/backend/data /var/www/dqtech-app/backend/uploads
```

## 6. Frontend build

If Apache proxies `/api/content` and `/uploads` on the same domain, the default frontend config is enough:

```bash
cd /var/www/dqtech-app
npm run build
```

Then deploy `dist/` to your Apache document root.
