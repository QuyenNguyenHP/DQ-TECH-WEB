# DQ TECH WEB V2

README này chuẩn hóa lại tài liệu cho dự án `DQ TECH WEB V2`, gồm:

- Frontend build bằng `Vite`
- Backend nhẹ bằng `Python` để phục vụ content API và upload ảnh
- Mô hình deploy production trên `Apache2`

## Tổng quan

Thông tin đang dùng:

- Project local: `C:\Users\Quyen PC\Desktop\DQ TECH WEB V2`
- VPS IP: `31.97.189.234`
- Domain: `dqtech.cloud`
- Web server: `Apache2`
- Frontend: `Vite`
- Backend content/upload: `Python`

Mô hình triển khai khuyến nghị:

- Frontend build ra thư mục `dist/`
- Apache serve file tĩnh từ `dist/`
- Backend Python chạy nội bộ trên `127.0.0.1:8000`
- Apache reverse proxy cho:
  - `/api/content`
  - `/uploads`

Lợi ích:

- Frontend và backend tách rõ trách nhiệm
- Dễ quản lý bằng `systemd`
- Upload ảnh không phụ thuộc vào Vite dev server

## Cấu trúc chính

```text
DQ TECH WEB V2/
|-- backend/
|   |-- apache/
|   |   `-- dqtech.cloud.conf.example
|   |-- data/
|   |-- uploads/
|   |-- dqtech-content-api.service.example
|   `-- server.py
|-- src/
|-- .env.example
|-- package.json
`-- README.md
```

## Chạy local

### 1. Cài dependencies frontend

```bash
npm install
```

### 2. Chạy frontend dev

```bash
npm run dev
```

### 3. Chạy backend local

```bash
npm run dev:api
```

Hoặc:

```bash
python backend/server.py
```

### 4. Build frontend

```bash
npm run build
```

## Biến môi trường

### Frontend

File mẫu:

```text
.env.example
```

Nội dung hiện tại:

```env
VITE_CONTENT_API_BASE=/api/content
```

Với cấu hình này, frontend gọi API qua cùng domain, phù hợp khi Apache đang reverse proxy backend.

### Backend

Backend `backend/server.py` hỗ trợ các biến môi trường sau:

- `CONTENT_API_HOST`: mặc định `127.0.0.1`
- `CONTENT_API_PORT`: mặc định `8000`
- `CONTENT_API_MAX_BODY_MB`: mặc định `20`
- `CONTENT_API_ALLOW_ORIGIN`: tùy chọn, dùng khi cần CORS

Ví dụ chạy backend ở cổng khác:

```bash
CONTENT_API_PORT=8131 python3 backend/server.py
```

## Backend content API

Backend hiện phục vụ:

- `GET /api/content/health`
- `GET /api/content/bootstrap`
- `GET /api/content/assets?target=products`
- `GET /api/content/assets?target=blogs`
- `POST /api/content/upload`
- CRUD cho:
  - `/api/content/products`
  - `/api/content/blogs`

Backend ghi dữ liệu vào:

- `backend/data/content-store.json`
- `backend/uploads/products`
- `backend/uploads/blogs`

Nếu deploy production, các thư mục trên phải có quyền ghi cho user chạy service.

## Chuẩn bị domain

Tạo DNS:

- Bản ghi `A`
- Host: `@`
- Value: `31.97.189.234`

Nếu dùng thêm `www`:

- Bản ghi `A`
- Host: `www`
- Value: `31.97.189.234`

Kiểm tra:

```bash
ping dqtech.cloud
nslookup dqtech.cloud
```

## SSH vào VPS

```bash
ssh root@31.97.189.234
```

Hoặc:

```bash
ssh your_user@31.97.189.234
```

## Cài gói cần thiết trên VPS

```bash
apt update && apt upgrade -y
apt install -y apache2 curl unzip rsync python3 python3-venv python3-pip
```

Nếu muốn build trực tiếp trên VPS:

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs
node -v
npm -v
```

## Upload source lên VPS

Tạo thư mục source:

```bash
mkdir -p /var/www/dqtech-app
```

Upload source từ máy local:

```bash
scp -r "C:\Users\Quyen PC\Desktop\DQ TECH WEB V2\*" root@31.97.189.234:/var/www/dqtech-app/
```

Hoặc dùng `rsync`:

```bash
rsync -avz "C:\Users\Quyen PC\Desktop\DQ TECH WEB V2\" root@31.97.189.234:/var/www/dqtech-app/
```

## Deploy frontend

Có 2 cách.

### Cách A: Build ở local

Trên máy local:

```bash
npm install
npm run build
```

Trên VPS:

```bash
mkdir -p /var/www/dqtech.cloud
rsync -avz dist/ root@31.97.189.234:/var/www/dqtech.cloud/
chown -R www-data:www-data /var/www/dqtech.cloud
chmod -R 755 /var/www/dqtech.cloud
```

### Cách B: Build trên VPS

```bash
cd /var/www/dqtech-app
npm install
npm run build
mkdir -p /var/www/dqtech.cloud
cp -r dist/* /var/www/dqtech.cloud/
chown -R www-data:www-data /var/www/dqtech.cloud
chmod -R 755 /var/www/dqtech.cloud
```

## Deploy backend Python

### Chạy thử thủ công

```bash
cd /var/www/dqtech-app
python3 backend/server.py
```

### Cấp quyền ghi cho backend

```bash
chown -R www-data:www-data /var/www/dqtech-app/backend/data /var/www/dqtech-app/backend/uploads
chmod -R 775 /var/www/dqtech-app/backend/data /var/www/dqtech-app/backend/uploads
```

### Chạy bằng systemd

Repo đã có file mẫu:

```text
backend/dqtech-content-api.service.example
```

Copy sang `systemd`:

```bash
cp /var/www/dqtech-app/backend/dqtech-content-api.service.example /etc/systemd/system/dqtech-content-api.service
```

Kích hoạt service:

```bash
systemctl daemon-reload
systemctl enable --now dqtech-content-api
systemctl restart dqtech-content-api
systemctl status dqtech-content-api
```

Nếu muốn đổi cổng backend, sửa biến:

```ini
Environment=CONTENT_API_PORT=8131
```

## Cấu hình Apache

### Bật các module cần thiết

```bash
a2enmod rewrite proxy proxy_http ssl headers
systemctl reload apache2
```

### Dùng file VirtualHost mẫu

Repo đã có file:

```text
backend/apache/dqtech.cloud.conf.example
```

Copy vào Apache:

```bash
cp /var/www/dqtech-app/backend/apache/dqtech.cloud.conf.example /etc/apache2/sites-available/dqtech.cloud.conf
```

File này đã gồm:

- Redirect HTTP sang HTTPS
- Serve frontend từ `/var/www/dqtech.cloud`
- Proxy `/api/content` về `127.0.0.1:8000`
- Proxy `/uploads` về `127.0.0.1:8000`
- Rewrite về `index.html` để hỗ trợ client-side routing

Nếu backend chạy ở cổng `8131`, sửa các dòng proxy trong file Apache:

```apache
ProxyPass /api/content http://127.0.0.1:8131/api/content retry=0 timeout=60
ProxyPassReverse /api/content http://127.0.0.1:8131/api/content
ProxyPass /uploads http://127.0.0.1:8131/uploads retry=0 timeout=60
ProxyPassReverse /uploads http://127.0.0.1:8131/uploads
```

### Enable site

```bash
a2ensite dqtech.cloud.conf
a2dissite 000-default.conf
apache2ctl configtest
systemctl reload apache2
systemctl enable apache2
systemctl status apache2
```

Nếu kết quả:

```text
Syntax OK
```

thì cấu hình hợp lệ.

## Bật HTTPS bằng Let's Encrypt

```bash
apt install -y certbot python3-certbot-apache
certbot --apache -d dqtech.cloud -d www.dqtech.cloud
systemctl status certbot.timer
certbot renew --dry-run
```

## Mở firewall

Nếu VPS dùng `ufw`:

```bash
ufw allow OpenSSH
ufw allow 'Apache Full'
ufw enable
ufw status
```

## Quy trình cập nhật bản mới

### Trường hợp build ở local

```bash
npm run build
rsync -avz dist/ root@31.97.189.234:/var/www/dqtech.cloud/
```

Nếu backend thay đổi, đồng bộ lại thư mục `backend/` và restart service:

```bash
systemctl restart dqtech-content-api
systemctl reload apache2
```

### Trường hợp build trên VPS

```bash
cd /var/www/dqtech-app
git pull
npm install
npm run build
cp -r dist/* /var/www/dqtech.cloud/
chown -R www-data:www-data /var/www/dqtech.cloud
systemctl restart dqtech-content-api
systemctl reload apache2
```

## Kiểm tra nhanh

Kiểm tra Apache:

```bash
systemctl status apache2
apache2ctl configtest
```

Kiểm tra backend:

```bash
systemctl status dqtech-content-api
ss -tulpn | grep 8000
```

Nếu backend chạy cổng `8131`:

```bash
ss -tulpn | grep 8131
```

Xem log Apache:

```bash
tail -f /var/log/apache2/dqtech.cloud_error.log
tail -f /var/log/apache2/dqtech.cloud_access.log
```

Xem log backend:

```bash
journalctl -u dqtech-content-api -f
```

Kiểm tra file frontend:

```bash
ls -la /var/www/dqtech.cloud
```

## Lỗi thường gặp

### Không upload được ảnh

Kiểm tra:

1. Backend Python có đang chạy không
2. Apache có proxy đúng `/api/content` và `/uploads` không
3. Thư mục `backend/uploads` có quyền ghi cho `www-data` không
4. Backend đang chạy cổng `8000` hay `8131`
5. Đã restart `dqtech-content-api` sau khi sửa service chưa

### `403 Forbidden`

Kiểm tra quyền:

```bash
chown -R www-data:www-data /var/www/dqtech.cloud
chmod -R 755 /var/www/dqtech.cloud
chown -R www-data:www-data /var/www/dqtech-app/backend/data /var/www/dqtech-app/backend/uploads
chmod -R 775 /var/www/dqtech-app/backend/data /var/www/dqtech-app/backend/uploads
```

### `404` khi refresh route

Đảm bảo VirtualHost có đoạn:

```apache
RewriteEngine On
RewriteCond %{REQUEST_URI} !^/api/content [NC]
RewriteCond %{REQUEST_URI} !^/uploads [NC]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^ /index.html [L]
```

### Domain chưa vào được

Kiểm tra:

1. DNS đã trỏ đúng IP `31.97.189.234`
2. Port `80` và `443` đã mở
3. Apache đang chạy

### HTTPS không cấp được

Kiểm tra:

1. Domain đã trỏ đúng IP
2. Truy cập được `http://dqtech.cloud` trước khi chạy `certbot`
3. Port `80` và `443` không bị chặn

### Apache proxy sai cổng

Nếu backend chạy `8131` mà Apache vẫn trỏ `8000`, toàn bộ upload và CRUD sẽ lỗi. Kiểm tra lại:

```apache
ProxyPass /api/content http://127.0.0.1:8131/api/content
ProxyPass /uploads http://127.0.0.1:8131/uploads
```

Sau đó:

```bash
apache2ctl configtest
systemctl reload apache2
```

## Cấu trúc deploy khuyến nghị

```text
/var/www/
|-- dqtech-app/      # source code, backend Python, file mẫu
`-- dqtech.cloud/    # file build cuối cùng để Apache serve
```

## Checklist hoàn tất

- `dqtech.cloud` trỏ về `31.97.189.234`
- Apache2 đã cài
- Frontend `dist/` đã deploy vào `/var/www/dqtech.cloud`
- Backend Python đang chạy bằng `systemd`
- Apache đang proxy đúng `/api/content` và `/uploads`
- Thư mục `backend/data` và `backend/uploads` có quyền ghi
- `https://dqtech.cloud` truy cập được
- Upload ảnh trong admin hoạt động bình thường
