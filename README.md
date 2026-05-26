<<<<<<< HEAD
# Deploy `DQ TECH WEB V2` len VPS voi Apache + Python backend

Tai lieu nay gop frontend static va backend Python vao 1 cho de de theo doi.

Thong tin dang dung:
=======
# 🚀 Deploy `DQ TECH WEB V2` lên VPS với Apache2

Hướng dẫn này dành cho repo:
>>>>>>> fabbd4c732a55ab20e28e0a05e5e3314a974ba09

- Project local: `C:\Users\Quyen PC\Desktop\DQ TECH WEB V2`
- VPS IP: `31.97.189.234`
- Domain: `dqtech.cloud`
- Web server: `Apache2`
<<<<<<< HEAD
- Frontend: `Vite`
- Backend content/upload: `Python`

## 1. Mo hinh deploy

Project hien tai nen deploy theo mo hinh:

- Frontend build ra `dist/`
- Apache serve file tinh tu `dist`
- Backend Python chay noi bo tren `127.0.0.1`
- Apache reverse proxy:
  - `/api/content/*`
  - `/uploads/*`

Loi ich:

- Frontend va backend tach ro rang
- De chay bang `systemd`
- Upload anh khong con phu thuoc vao Vite dev server

## 2. Chuan bi domain

Tao DNS:

- Ban ghi `A`
- Host: `@`
- Value: `31.97.189.234`

Neu dung them `www`:

- Ban ghi `A`
- Host: `www`
- Value: `31.97.189.234`

Kiem tra:

```bash
ping dqtech.cloud
nslookup dqtech.cloud
```

## 3. SSH vao VPS
=======

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
>>>>>>> fabbd4c732a55ab20e28e0a05e5e3314a974ba09

```bash
ssh root@31.97.189.234
```

<<<<<<< HEAD
Hoac:
=======
Nếu bạn dùng user khác:
>>>>>>> fabbd4c732a55ab20e28e0a05e5e3314a974ba09

```bash
ssh your_user@31.97.189.234
```

<<<<<<< HEAD
## 4. Cai goi can thiet tren VPS

```bash
apt update && apt upgrade -y
apt install -y apache2 curl unzip rsync python3 python3-venv python3-pip
```

Neu muon build tren VPS:
=======
## 3. 📦 Cài các gói cần thiết trên VPS

Giả sử VPS dùng Ubuntu/Debian:

```bash
apt update && apt upgrade -y
apt install -y apache2 curl unzip rsync
```

Cài Node.js LTS để build nếu bạn muốn build trực tiếp trên VPS:
>>>>>>> fabbd4c732a55ab20e28e0a05e5e3314a974ba09

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs
node -v
npm -v
```

<<<<<<< HEAD
## 5. Upload source len VPS

Tao thu muc source:
=======
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
>>>>>>> fabbd4c732a55ab20e28e0a05e5e3314a974ba09

```bash
mkdir -p /var/www/dqtech-app
```

<<<<<<< HEAD
Upload source tu local:
=======
Upload source từ máy local lên VPS:
>>>>>>> fabbd4c732a55ab20e28e0a05e5e3314a974ba09

```bash
scp -r "C:\Users\Quyen PC\Desktop\DQ TECH WEB V2\*" root@31.97.189.234:/var/www/dqtech-app/
```

<<<<<<< HEAD
Hoac dung `rsync`:

```bash
rsync -avz "C:\Users\Quyen PC\Desktop\DQ TECH WEB V2\" root@31.97.189.234:/var/www/dqtech-app/
```

## 6. Build frontend

Co 2 cach.

### Cach A: Build o may local

```bash
npm install
npm run build
```

Sau do upload `dist/`:

```bash
mkdir -p /var/www/dqtech.cloud
rsync -avz dist/ root@31.97.189.234:/var/www/dqtech.cloud/
```

### Cach B: Build tren VPS
=======
Vào thư mục project trên VPS:
>>>>>>> fabbd4c732a55ab20e28e0a05e5e3314a974ba09

```bash
cd /var/www/dqtech-app
npm install
npm run build
<<<<<<< HEAD
mkdir -p /var/www/dqtech.cloud
cp -r dist/* /var/www/dqtech.cloud/
```

Cap quyen:
=======
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
>>>>>>> fabbd4c732a55ab20e28e0a05e5e3314a974ba09

```bash
chown -R www-data:www-data /var/www/dqtech.cloud
chmod -R 755 /var/www/dqtech.cloud
```

<<<<<<< HEAD
## 7. Backend Python

Backend hien tai nam o:

- `backend/server.py`

Backend phuc vu:

- `/api/content/*`
- `/uploads/*`

### Chay thu cong de test

```bash
cd /var/www/dqtech-app
python3 backend/server.py
```

Backend doc cac bien moi truong:

- `CONTENT_API_HOST` mac dinh: `127.0.0.1`
- `CONTENT_API_PORT` mac dinh: `8000`
- `CONTENT_API_MAX_BODY_MB` mac dinh: `20`
- `CONTENT_API_ALLOW_ORIGIN` tuy chon

### Doi cong backend

Neu muon chay backend o cong `8131` thay vi `8000`:

```bash
cd /var/www/dqtech-app
CONTENT_API_PORT=8131 python3 backend/server.py
```

### Thu muc backend can duoc ghi

Backend ghi du lieu vao:

- `backend/data/content-store.json`
- `backend/uploads/products`
- `backend/uploads/blogs`

Cap quyen:

```bash
sudo chown -R www-data:www-data /var/www/dqtech-app/backend/data /var/www/dqtech-app/backend/uploads
sudo chmod -R 775 /var/www/dqtech-app/backend/data /var/www/dqtech-app/backend/uploads
```

## 8. Chay backend bang systemd

File mau da co san:

- `backend/dqtech-content-api.service.example`

Copy sang `systemd`:

```bash
sudo cp /var/www/dqtech-app/backend/dqtech-content-api.service.example /etc/systemd/system/dqtech-content-api.service
```

Noi dung co the dung:

```ini
[Unit]
Description=DQ TECH Content API
After=network.target

[Service]
Type=simple
User=www-data
Group=www-data
WorkingDirectory=/var/www/dqtech-app
Environment=CONTENT_API_HOST=127.0.0.1
Environment=CONTENT_API_PORT=8000
Environment=CONTENT_API_MAX_BODY_MB=20
ExecStart=/usr/bin/python3 /var/www/dqtech-app/backend/server.py
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
```

Neu muon doi cong sang `8131`, sua:

```ini
Environment=CONTENT_API_PORT=8131
```

Sau do:

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now dqtech-content-api
sudo systemctl restart dqtech-content-api
sudo systemctl status dqtech-content-api
```

## 9. Bat module Apache can thiet

```bash
sudo a2enmod rewrite proxy proxy_http ssl headers
sudo systemctl reload apache2
```

## 10. VirtualHost Apache cho `dqtech.cloud`

File mau da co san:

- `backend/apache/dqtech.cloud.conf.example`

Copy:

```bash
sudo cp /var/www/dqtech-app/backend/apache/dqtech.cloud.conf.example /etc/apache2/sites-available/dqtech.cloud.conf
```

Noi dung day du:
=======
## 6. ⚙️ Tạo VirtualHost cho Apache2

Tạo file config:

```bash
nano /etc/apache2/sites-available/dqtech.cloud.conf
```

Dán nội dung sau:
>>>>>>> fabbd4c732a55ab20e28e0a05e5e3314a974ba09

```apache
<VirtualHost *:80>
    ServerName dqtech.cloud
    ServerAlias www.dqtech.cloud

<<<<<<< HEAD
    RewriteEngine On
    RewriteCond %{HTTP_HOST} ^(www\.)?dqtech\.cloud$ [NC]
    RewriteRule ^ https://dqtech.cloud%{REQUEST_URI} [R=301,L]
</VirtualHost>

<IfModule mod_ssl.c>
<VirtualHost *:443>
    ServerName dqtech.cloud
    ServerAlias www.dqtech.cloud

=======
>>>>>>> fabbd4c732a55ab20e28e0a05e5e3314a974ba09
    DocumentRoot /var/www/dqtech.cloud

    <Directory /var/www/dqtech.cloud>
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>

<<<<<<< HEAD
    ProxyPreserveHost On
    RequestHeader set X-Forwarded-Proto "https"
    ProxyPass /api/content http://127.0.0.1:8000/api/content retry=0 timeout=60
    ProxyPassReverse /api/content http://127.0.0.1:8000/api/content
    ProxyPass /uploads http://127.0.0.1:8000/uploads retry=0 timeout=60
    ProxyPassReverse /uploads http://127.0.0.1:8000/uploads

    RewriteEngine On
    RewriteCond %{REQUEST_URI} !^/api/content [NC]
    RewriteCond %{REQUEST_URI} !^/uploads [NC]
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^ /index.html [L]

    ErrorLog ${APACHE_LOG_DIR}/dqtech.cloud_error.log
    CustomLog ${APACHE_LOG_DIR}/dqtech.cloud_access.log combined

    SSLEngine on
    SSLCertificateFile /etc/letsencrypt/live/dqtech.cloud/fullchain.pem
    SSLCertificateKeyFile /etc/letsencrypt/live/dqtech.cloud/privkey.pem
    Include /etc/letsencrypt/options-ssl-apache.conf
</VirtualHost>
</IfModule>
```

### Neu backend chay cong 8131

Sua cac dong proxy thanh:

```apache
ProxyPass /api/content http://127.0.0.1:8131/api/content retry=0 timeout=60
ProxyPassReverse /api/content http://127.0.0.1:8131/api/content
ProxyPass /uploads http://127.0.0.1:8131/uploads retry=0 timeout=60
ProxyPassReverse /uploads http://127.0.0.1:8131/uploads
```

## 11. Enable site va reload Apache

```bash
sudo a2ensite dqtech.cloud.conf
sudo a2dissite 000-default.conf
sudo apache2ctl configtest
sudo systemctl reload apache2
sudo systemctl enable apache2
sudo systemctl status apache2
```

Neu `configtest` bao:
=======
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
>>>>>>> fabbd4c732a55ab20e28e0a05e5e3314a974ba09

```text
Syntax OK
```

<<<<<<< HEAD
thi cau hinh hop le.

## 12. Bat HTTPS bang Let's Encrypt

```bash
sudo apt install -y certbot python3-certbot-apache
sudo certbot --apache -d dqtech.cloud -d www.dqtech.cloud
sudo systemctl status certbot.timer
sudo certbot renew --dry-run
```

## 13. Mo firewall

Neu VPS dung `ufw`:

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Apache Full'
sudo ufw enable
sudo ufw status
```

## 14. Frontend config

Frontend hien tai mac dinh goi API qua:

```text
/api/content
```

Nen neu Apache proxy cung domain thi khong can sua gi them.

Neu can doi base URL frontend, tao file `.env`:

```bash
VITE_CONTENT_API_BASE=/api/content
```

## 15. Quy trinh cap nhat ban moi

### Update source

```bash
cd /var/www/dqtech-app
git pull
```

### Neu build tren VPS

```bash
cd /var/www/dqtech-app
npm install
npm run build
rm -rf /var/www/dqtech.cloud/*
cp -r dist/* /var/www/dqtech.cloud/
chown -R www-data:www-data /var/www/dqtech.cloud
sudo systemctl restart dqtech-content-api
sudo systemctl reload apache2
```

### Neu build o local
=======
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
>>>>>>> fabbd4c732a55ab20e28e0a05e5e3314a974ba09

```bash
npm run build
rsync -avz dist/ root@31.97.189.234:/var/www/dqtech.cloud/
```

<<<<<<< HEAD
Neu source backend thay doi, dong bo lai `backend/` len VPS va restart service:

```bash
sudo systemctl restart dqtech-content-api
```

## 16. Lenh kiem tra nhanh

Kiem tra Apache:

```bash
sudo systemctl status apache2
sudo apache2ctl configtest
```

Kiem tra backend:

```bash
sudo systemctl status dqtech-content-api
ss -tulpn | grep 8000
```

Neu backend chay cong `8131`:

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

Kiem tra file frontend:
=======
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
>>>>>>> fabbd4c732a55ab20e28e0a05e5e3314a974ba09

```bash
ls -la /var/www/dqtech.cloud
```

<<<<<<< HEAD
## 17. Loi thuong gap

### Khong upload duoc anh

Kiem tra:

1. Backend Python co dang chay khong
2. Apache co proxy `/api/content` va `/uploads` dung cong khong
3. Thu muc `backend/uploads` co quyen ghi cho `www-data` khong
4. Backend dang chay cong `8000` hay `8131`
5. Da restart `dqtech-content-api` sau khi sua service chua

### `403 Forbidden`

Kiem tra quyen:
=======
## 13. 🛠️ Lỗi thường gặp

### `403 Forbidden`

Kiểm tra quyền thư mục:
>>>>>>> fabbd4c732a55ab20e28e0a05e5e3314a974ba09

```bash
chown -R www-data:www-data /var/www/dqtech.cloud
chmod -R 755 /var/www/dqtech.cloud
```

<<<<<<< HEAD
Va voi backend:

```bash
sudo chown -R www-data:www-data /var/www/dqtech-app/backend/data /var/www/dqtech-app/backend/uploads
sudo chmod -R 775 /var/www/dqtech-app/backend/data /var/www/dqtech-app/backend/uploads
```

### `404` khi refresh route

Dam bao VirtualHost co:

```apache
RewriteEngine On
RewriteCond %{REQUEST_URI} !^/api/content [NC]
RewriteCond %{REQUEST_URI} !^/uploads [NC]
=======
### `404` khi refresh route

Đảm bảo VirtualHost có đoạn:

```apache
RewriteEngine On
>>>>>>> fabbd4c732a55ab20e28e0a05e5e3314a974ba09
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^ /index.html [L]
```

<<<<<<< HEAD
### Domain chua vao duoc

Kiem tra:

1. DNS da tro dung IP `31.97.189.234`
2. Port `80` va `443` da mo
3. Apache dang chay

### HTTPS khong cap duoc

Kiem tra:

1. Domain da tro dung IP
2. Truy cap duoc `http://dqtech.cloud` truoc khi chay `certbot`
3. Port `80` va `443` khong bi chan

### Apache proxy sai cong

Neu backend chay `8131` ma Apache van tro `8000`, upload va CRUD se loi ngay. Kiem tra lai:

```apache
ProxyPass /api/content http://127.0.0.1:8131/api/content
ProxyPass /uploads http://127.0.0.1:8131/uploads
```

Sau do:

```bash
sudo apache2ctl configtest
sudo systemctl reload apache2
```

## 18. Cau truc deploy khuyen nghi

```text
/var/www/
|-- dqtech-app/      # source code, backend Python, file service mau
`-- dqtech.cloud/    # file build cuoi cung de Apache serve
```

## 19. Checklist hoan tat

- `dqtech.cloud` tro ve `31.97.189.234`
- Apache2 da cai
- Frontend `dist/` da deploy vao `/var/www/dqtech.cloud`
- Backend Python dang chay bang `systemd`
- Apache dang proxy dung `/api/content` va `/uploads`
- Thu muc `backend/data` va `backend/uploads` co quyen ghi
- `https://dqtech.cloud` truy cap duoc
- Upload anh trong admin hoat dong binh thuong
=======
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
>>>>>>> fabbd4c732a55ab20e28e0a05e5e3314a974ba09
