---
name: maintain-dqtech-web
description: Maintain, build, diagnose, and deploy the DQ TECH WEB project using its React/Vite frontend, Python content API, Apache2 virtual host, and systemd service. Use for changes or deployment work in this repository.
---

# Maintain DQ TECH WEB

Work within the existing application architecture and consult `README.md` for
the current deployment procedure before changing production configuration.

## Architecture

- `frontend/` is a Vite/React application.
- `frontend/dist/` is the production output served directly by Apache2.
- `backend/server.py` is the Python content API.
- The backend listens only on `127.0.0.1:8000` in production.
- Apache2 serves `dqtech.cloud` on ports 80 and 443.
- Apache proxies `/api/content` and `/uploads` to the Python backend.
- The backend runs as `dqtech-content-api.service` under Linux user `dq`.
- The production repository is `/home/dq/DQ-TECH-WEB`.
- Docker, Nginx, and Cloudflare Tunnel are not part of this deployment.
- Blog posts are Markdown rendered by `react-markdown` with `remark-gfm`
  (tables, strikethrough) in `BlogPostPage.tsx`, styled by the
  `@tailwindcss/typography` plugin (`@plugin` in `src/styles/tailwind.css`).
  Removing either makes blog posts lose spacing, bullets, and tables.
- Laptop battery is the free-text `batteryLife` field ("3-4 giờ"); the API
  stores agent payloads as sent.

## Preserve live data

Treat these directories as persistent production data:

- `backend/data/`
- `backend/uploads/`

Do not delete, replace, reset, or overwrite them during builds, source updates,
or deployment. Back them up before changes that could affect stored content.

## Make changes

Inspect the relevant source and existing conventions before editing. Keep the
frontend on same-origin paths `/api/content` and `/uploads`; do not compile a
production hostname into frontend code.

When backend behavior changes, preserve the API prefix and uploads URL unless
the user explicitly requests a coordinated migration. Keep the production API
bound to loopback rather than exposing port 8000 publicly.

When deployment paths or ports change, update all affected locations together:

- `README.md`
- `backend/dqtech-content-api.service.example`
- `backend/apache/dqtech.cloud.conf.example`
- `backend/DEPLOY_PYTHON.md`

## Verify changes

For frontend changes, run:

```bash
npm --prefix frontend ci
npm --prefix frontend run build
```

For backend changes, at minimum check Python syntax and exercise the affected
API behavior when the environment permits. The health endpoint is:

```text
http://127.0.0.1:8000/api/content/health
```

For Apache changes, require this check before reload:

```bash
sudo apache2ctl configtest
```

Report any verification that could not run because the required runtime or
service is unavailable.

## Deploy and update

Follow the commands in `README.md`; do not invent a separate deployment path.
Build the frontend into `~/DQ-TECH-WEB/frontend/dist`, restart the backend only
when backend code or its unit changes, and reload Apache only when Apache
configuration changes.

After deployment, verify both layers:

```bash
curl --fail http://127.0.0.1:8000/api/content/health
curl --fail https://dqtech.cloud/api/content/health
```

Never open port 8000 in the firewall. Public traffic must enter through Apache
on ports 80 and 443.
