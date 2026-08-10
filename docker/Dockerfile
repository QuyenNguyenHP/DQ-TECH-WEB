# syntax=docker/dockerfile:1

FROM node:22-alpine AS frontend-builder

WORKDIR /app/frontend

COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci

COPY frontend/ ./
RUN npm run build


FROM python:3.13-alpine AS runtime

RUN apk add --no-cache nginx \
    && rm -f /etc/nginx/http.d/default.conf

WORKDIR /app

COPY --from=frontend-builder /app/frontend/dist /usr/share/nginx/html
COPY backend ./backend
COPY docker/nginx.conf /etc/nginx/http.d/default.conf
COPY docker/entrypoint.sh /usr/local/bin/dqtech-entrypoint

RUN chmod +x /usr/local/bin/dqtech-entrypoint \
    && mkdir -p /app/backend/data /app/backend/uploads/products /app/backend/uploads/blogs

ENV CONTENT_API_HOST=127.0.0.1 \
    CONTENT_API_PORT=8000 \
    CONTENT_API_MAX_BODY_MB=20 \
    PYTHONUNBUFFERED=1

VOLUME ["/app/backend/data", "/app/backend/uploads"]

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget -qO- http://127.0.0.1:8080/api/content/health >/dev/null || exit 1

ENTRYPOINT ["/usr/local/bin/dqtech-entrypoint"]
