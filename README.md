# 🚀 Deploy `DQ TECH WEB V2` lên VPS với Apache2

Hướng dẫn này dành cho repo:

- Project local: `C:\Users\Quyen PC\Desktop\DQ TECH WEB V2`
- VPS IP: `31.97.189.234`
- Domain: `dqtech.cloud`
- Web server: `Apache2`

Repo hiện tại là frontend dùng `Vite`, nên cách deploy phù hợp nhất là:

1. Build frontend ra thư mục `dist`
2. Copy `dist` lên VPS
3. Cấu hình `Apache2` để serve domain `dqtech.cloud`
4. Bật HTTPS bằng Let's Encrypt

## 📌 Mô hình triển khai

Frontend build tĩnh:

- `Vite` build ra file tĩnh trong `dist/`
- `Apache2` serve trực tiếp các file này

Nếu sau này bạn có backend API riêng:

- Có thể chạy backend ở port nội bộ như `3000` hoặc `8000`
- Dùng `Apache reverse proxy` để chuyển tiếp request API

README này ưu tiên cách triển khai frontend static vì đơn giản, ổn định và phù hợp với repo hiện tại.

## 1. ✅ Chuẩn bị domain

Vào nơi quản lý DNS của domain `dqtech.cloud` và tạo:

- Bản ghi `A`
- Host: `@`
- Value: `31.97.189.234`

Nếu muốn dùng thêm `www`:

- Bản ghi `A`
- Host: `www`
- Value: `31.97.189.234`

Kiểm tra DNS đã trỏ đúng:

```bash
ping dqtech.cloud
```

hoặc:

```bash
nslookup dqtech.cloud
```

Kết quả cần trả về IP `31.97.189.234`.

## 2. 🖥️ SSH vào VPS

Từ máy local:

```bash
ssh root@31.97.189.234
```

Nếu bạn dùng user khác:

```bash
ssh your_user@31.97.189.234
```

## 3. 📦 Cài các gói cần thiết trên VPS

Giả sử VPS dùng Ubuntu/Debian:

```bash
apt update && apt upgrade -y
apt install -y apache2 curl unzip rsync
```

Cài Node.js LTS để build nếu bạn muốn build trực tiếp trên VPS:

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs
node -v
npm -v
```

## 4. 🧱 Build project

Có 2 cách.

### Cách A: Build trên máy local rồi upload `dist` lên VPS

Tại máy local, trong thư mục project:

```bash
npm install
npm run build
```

Sau khi build xong sẽ có thư mục:

```text
dist/
```

### Cách B: Upload source lên VPS rồi build trên VPS

Tạo thư mục project trên VPS:

```bash
mkdir -p /var/www/dqtech-app
```

Upload source từ máy local lên VPS:

```bash
scp -r "C:\Users\Quyen PC\Desktop\DQ TECH WEB V2\*" root@31.97.189.234:/var/www/dqtech-app/
```

Vào thư mục project trên VPS:

```bash
cd /var/www/dqtech-app
npm install
npm run build
```

## 5. 📁 Tạo thư mục chạy web trên Apache

Tạo thư mục public cho domain:

```bash
mkdir -p /var/www/dqtech.cloud
```

Nếu bạn build trên local, dùng `scp` hoặc `rsync` để upload thư mục `dist`:

```bash
scp -r dist/* root@31.97.189.234:/var/www/dqtech.cloud/
```

Khuyến nghị dùng `rsync` để cập nhật nhanh hơn:

```bash
rsync -avz dist/ root@31.97.189.234:/var/www/dqtech.cloud/
```

Phân quyền:

```bash
chown -R www-data:www-data /var/www/dqtech.cloud
chmod -R 755 /var/www/dqtech.cloud
```

## 6. ⚙️ Tạo VirtualHost cho Apache2

Tạo file config:

```bash
nano /etc/apache2/sites-available/dqtech.cloud.conf
```

Dán nội dung sau:

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

    ErrorLog ${APACHE_LOG_DIR}/dqtech.cloud_error.log
    CustomLog ${APACHE_LOG_DIR}/dqtech.cloud_access.log combined

    RewriteEngine On
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^ /index.html [L]
</VirtualHost>
```

Lý do cần đoạn rewrite:

- App Vite/React thường dùng client-side routing
- Khi refresh các route như `/about` hoặc `/services`, Apache phải trả về `index.html`

## 7. 🔧 Bật site và module cần thiết

```bash
a2enmod rewrite
a2ensite dqtech.cloud.conf
a2dissite 000-default.conf
apache2ctl configtest
systemctl reload apache2
systemctl enable apache2
systemctl status apache2
```

Nếu `configtest` báo:

```text
Syntax OK
```

thì cấu hình hợp lệ.

## 8. 🔥 Mở firewall

Nếu VPS dùng `ufw`:

```bash
ufw allow OpenSSH
ufw allow 'Apache Full'
ufw enable
ufw status
```

## 9. 🌐 Kiểm tra web qua HTTP

Mở trình duyệt:

```text
http://dqtech.cloud
```

Nếu mọi thứ đúng, site sẽ lên qua HTTP.

## 10. 🔒 Bật HTTPS với Let's Encrypt

Cài Certbot:

```bash
apt install -y certbot python3-certbot-apache
```

Tạo SSL:

```bash
certbot --apache -d dqtech.cloud -d www.dqtech.cloud
```

Sau khi thành công, kiểm tra auto renew:

```bash
systemctl status certbot.timer
certbot renew --dry-run
```

Sau đó truy cập:

```text
https://dqtech.cloud
```

## 11. 🚀 Quy trình cập nhật bản mới

Mỗi lần update frontend:

### Nếu build ở local

```bash
npm run build
rsync -avz dist/ root@31.97.189.234:/var/www/dqtech.cloud/
```

### Nếu build trên VPS

```bash
cd /var/www/dqtech-app
git pull
npm install
npm run build
rm -rf /var/www/dqtech.cloud/*
cp -r dist/* /var/www/dqtech.cloud/
chown -R www-data:www-data /var/www/dqtech.cloud
systemctl reload apache2
```

## 12. 🧪 Lệnh kiểm tra nhanh

Kiểm tra Apache:

```bash
systemctl status apache2
apache2ctl configtest
```

Xem log lỗi:

```bash
tail -f /var/log/apache2/dqtech.cloud_error.log
```

Xem log truy cập:

```bash
tail -f /var/log/apache2/dqtech.cloud_access.log
```

Kiểm tra file đã lên đúng chưa:

```bash
ls -la /var/www/dqtech.cloud
```

## 13. 🛠️ Lỗi thường gặp

### `403 Forbidden`

Kiểm tra quyền thư mục:

```bash
chown -R www-data:www-data /var/www/dqtech.cloud
chmod -R 755 /var/www/dqtech.cloud
```

### `404` khi refresh route

Đảm bảo VirtualHost có đoạn:

```apache
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^ /index.html [L]
```

và đã bật module:

```bash
a2enmod rewrite
systemctl reload apache2
```

### Domain chưa vào được

Kiểm tra:

1. DNS đã trỏ về `31.97.189.234`
2. Port `80` và `443` đã mở
3. Apache đang chạy

### HTTPS không cấp được

Kiểm tra:

1. Domain đã trỏ đúng IP
2. Truy cập được `http://dqtech.cloud` trước khi chạy `certbot`
3. Port `80` và `443` không bị chặn

## 14. 🔁 Reverse proxy cho backend API (tùy chọn)

Nếu sau này bạn chạy backend ở:

```text
127.0.0.1:8000
```

thì bật module:

```bash
a2enmod proxy
a2enmod proxy_http
systemctl reload apache2
```

Rồi thêm vào file VirtualHost:

```apache
ProxyPreserveHost On
ProxyPass /api http://127.0.0.1:8000/api
ProxyPassReverse /api http://127.0.0.1:8000/api
```

Khi đó:

- Frontend vẫn chạy trên `dqtech.cloud`
- API sẽ đi qua `dqtech.cloud/api`

## 15. 📂 Cấu trúc deploy khuyến nghị

```text
/var/www/
├── dqtech-app/        # source code, nếu muốn build trên VPS
└── dqtech.cloud/      # file build cuối cùng để Apache serve
```

## 16. ✅ Checklist hoàn tất

- `dqtech.cloud` trỏ về `31.97.189.234`
- Apache2 đã cài
- `dist/` đã upload vào `/var/www/dqtech.cloud`
- VirtualHost đã enable
- `a2enmod rewrite` đã bật
- `https://dqtech.cloud` truy cập được

## 17. 💡 Khuyến nghị thực tế

- Cách ổn nhất: build ở local rồi `rsync` thư mục `dist/` lên VPS
- Không nên sửa trực tiếp file trong `/var/www/dqtech.cloud`
- Nếu có backend, nên chạy backend bằng `systemd` rồi reverse proxy qua Apache
- Trước mỗi lần deploy, luôn chạy `npm run build` để chắc chắn project build thành công

---

Nếu cần, có thể viết tiếp:

- file `deploy.sh` để deploy tự động bằng một lệnh
- file Apache config tối ưu sẵn cho production
- file `systemd service` cho backend
