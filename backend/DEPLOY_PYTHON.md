# Python backend service

The production API runs as `dqtech-content-api.service` on
`127.0.0.1:8000`. Apache proxies `/api/content` and `/uploads` to it.

Install the service from the repository root:

```bash
sudo cp backend/dqtech-content-api.service.example \
  /etc/systemd/system/dqtech-content-api.service
sudo systemctl daemon-reload
sudo systemctl enable --now dqtech-content-api
```

The service expects the repository at `/var/www/dqtech-app`. If it is stored
elsewhere, update both `WorkingDirectory` and `ExecStart` in the unit first.

Writable directories:

```bash
sudo mkdir -p backend/data backend/uploads/products backend/uploads/blogs
sudo chown -R www-data:www-data backend/data backend/uploads
sudo chmod -R 775 backend/data backend/uploads
```

Check the service and API:

```bash
sudo systemctl status dqtech-content-api
sudo journalctl -u dqtech-content-api -n 100 --no-pager
curl --fail http://127.0.0.1:8000/api/content/health
```

Supported environment variables in the systemd unit:

- `CONTENT_API_HOST`, production default `127.0.0.1`
- `CONTENT_API_PORT`, production default `8000`
- `CONTENT_API_MAX_BODY_MB`, production default `20`
- `CONTENT_API_ALLOW_ORIGIN`, normally unset because Apache provides a
  same-origin frontend and API

After changing the unit:

```bash
sudo systemctl daemon-reload
sudo systemctl restart dqtech-content-api
```

See the repository `README.md` for the complete Apache2 and HTTPS deployment.
