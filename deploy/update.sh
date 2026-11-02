#!/usr/bin/env bash
# Safe production update for DQ TECH WEB.
#
# Live content lives in backend/data/ and backend/uploads/. Both are ignored by
# Git, so pulling new code never touches them. This script also:
#   1. backs them up before anything changes,
#   2. only discards local changes to build output (frontend/dist),
#   3. refuses to run if other tracked files were edited on the server,
#   4. checks that the number of products and blog posts is unchanged.
#
# Usage (on the server):  bash ~/DQ-TECH-WEB/deploy/update.sh
set -euo pipefail

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BACKUP_DIR="${BACKUP_DIR:-$HOME/dqtech-backups}"
KEEP_BACKUPS="${KEEP_BACKUPS:-20}"
SERVICE="dqtech-content-api"
DATA_FILE="$REPO_DIR/backend/data/content-store.json"

cd "$REPO_DIR"

count_content() {
  python3 - "$DATA_FILE" <<'PY'
import json, sys
try:
    with open(sys.argv[1], encoding="utf-8") as f:
        d = json.load(f)
    print(len(d.get("products", [])), len(d.get("blogs", [])))
except FileNotFoundError:
    print("0 0")
PY
}

echo "==> Kiểm tra dữ liệu hiện tại"
read -r PRODUCTS_BEFORE BLOGS_BEFORE < <(count_content)
echo "    Sản phẩm: $PRODUCTS_BEFORE | Bài viết: $BLOGS_BEFORE"

echo "==> Sao lưu backend/data và backend/uploads"
mkdir -p "$BACKUP_DIR" backend/data backend/uploads
BACKUP_FILE="$BACKUP_DIR/content-$(date +%F-%H%M%S).tar.gz"
tar -czf "$BACKUP_FILE" -C "$REPO_DIR/backend" data uploads
echo "    Đã lưu: $BACKUP_FILE"
# Keep only the newest backups.
ls -1t "$BACKUP_DIR"/content-*.tar.gz 2>/dev/null | tail -n +"$((KEEP_BACKUPS + 1))" | xargs -r rm -f

echo "==> Bỏ thay đổi cục bộ của file build (frontend/dist, __pycache__)"
git checkout -- frontend/dist 2>/dev/null || true
git clean -fdq -- frontend/dist
git checkout -- backend/__pycache__ 2>/dev/null || true

OTHER_CHANGES="$(git status --porcelain --untracked-files=no)"
if [ -n "$OTHER_CHANGES" ]; then
  echo "!! Có file mã nguồn bị sửa trực tiếp trên server, dừng lại để không mất thay đổi:"
  echo "$OTHER_CHANGES"
  echo "   Hãy commit/đưa các sửa đổi này vào Git trước, rồi chạy lại."
  exit 1
fi

echo "==> Lấy mã mới"
git pull --ff-only

echo "==> Build frontend"
npm --prefix frontend ci
npm --prefix frontend run build

echo "==> Khởi động lại API"
sudo systemctl restart "$SERVICE"
for _ in $(seq 1 10); do
  if curl --fail --silent http://127.0.0.1:8000/api/content/health >/dev/null; then
    break
  fi
  sleep 1
done
curl --fail --silent http://127.0.0.1:8000/api/content/health >/dev/null \
  || { echo "!! API không phản hồi. Xem: sudo journalctl -u $SERVICE -n 100"; exit 1; }

echo "==> Đối chiếu dữ liệu sau cập nhật"
read -r PRODUCTS_AFTER BLOGS_AFTER < <(count_content)
echo "    Sản phẩm: $PRODUCTS_AFTER | Bài viết: $BLOGS_AFTER"
if [ "$PRODUCTS_AFTER" -lt "$PRODUCTS_BEFORE" ] || [ "$BLOGS_AFTER" -lt "$BLOGS_BEFORE" ]; then
  echo "!! Số lượng dữ liệu giảm sau cập nhật. Khôi phục bằng:"
  echo "   sudo systemctl stop $SERVICE"
  echo "   tar -xzf $BACKUP_FILE -C $REPO_DIR/backend"
  echo "   sudo systemctl start $SERVICE"
  exit 1
fi

echo "==> Cập nhật xong. Dữ liệu được giữ nguyên."
