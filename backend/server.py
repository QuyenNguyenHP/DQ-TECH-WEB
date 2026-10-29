import json
import mimetypes
import os
import re
import threading
import time
from base64 import b64decode
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.parse import parse_qs, unquote, urlparse
from urllib.request import Request, urlopen


ROOT_DIR = Path(__file__).resolve().parent.parent
CONFIG_PATH = ROOT_DIR / "backend" / "config.json"
DEFAULT_CONFIG = {
    "apiPrefix": "/api/content",
    "dataFile": "backend/data/content-store.json",
    "uploadsDir": "backend/uploads",
    "uploadsUrlPrefix": "/uploads",
}
EMPTY_STORE = {"products": [], "blogs": []}
BODY_LIMIT_BYTES = int(float(os.environ.get("CONTENT_API_MAX_BODY_MB", "20")) * 1024 * 1024)
HOST = os.environ.get("CONTENT_API_HOST", "127.0.0.1")
PORT = int(os.environ.get("CONTENT_API_PORT", "8000"))
ALLOW_ORIGIN = os.environ.get("CONTENT_API_ALLOW_ORIGIN", "").strip()
STORE_LOCK = threading.Lock()
OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY", "").strip()
OPENAI_MODEL = os.environ.get("OPENAI_MODEL", "gpt-5-mini").strip()
OPENAI_API_URL = "https://api.openai.com/v1/responses"


BLOG_DRAFT_SCHEMA = {
    "type": "object",
    "properties": {
        "title": {"type": "string"},
        "excerpt": {"type": "string"},
        "content": {"type": "string"},
        "tags": {"type": "array", "items": {"type": "string"}},
        "readTime": {"type": "string"},
    },
    "required": ["title", "excerpt", "content", "tags", "readTime"],
    "additionalProperties": False,
}


def generate_blog_draft(topic: str, category: str):
    if not OPENAI_API_KEY:
        raise RuntimeError("OPENAI_API_KEY is not configured on the server")

    clean_topic = (topic or "").strip()
    if len(clean_topic) < 10:
        raise ValueError("Topic must contain at least 10 characters")
    if len(clean_topic) > 3000:
        raise ValueError("Topic is too long. Limit is 3000 characters")

    payload = {
        "model": OPENAI_MODEL,
        "max_output_tokens": 5000,
        "instructions": (
            "Bạn là biên tập viên công nghệ của DQ TECH. Viết bài blog tiếng Việt hữu ích, "
            "chính xác, dễ hiểu, không bịa đặt thông số hoặc cam kết. Nội dung dùng Markdown, "
            "có tiêu đề phụ, đoạn văn ngắn, danh sách khi phù hợp và kết luận thực tế. "
            "Không chèn tiêu đề H1 vào content vì title được hiển thị riêng."
        ),
        "input": f"Danh mục: {category}\nChủ đề và yêu cầu của admin:\n{clean_topic}",
        "text": {
            "format": {
                "type": "json_schema",
                "name": "dqtech_blog_draft",
                "strict": True,
                "schema": BLOG_DRAFT_SCHEMA,
            }
        },
    }
    request = Request(
        OPENAI_API_URL,
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "Authorization": f"Bearer {OPENAI_API_KEY}",
            "Content-Type": "application/json",
        },
        method="POST",
    )

    try:
        with urlopen(request, timeout=90) as response:
            result = json.loads(response.read().decode("utf-8"))
    except HTTPError as error:
        detail = error.read().decode("utf-8", errors="replace")
        raise RuntimeError(f"OpenAI API error ({error.code}): {detail[:500]}") from error
    except URLError as error:
        raise RuntimeError(f"Could not connect to OpenAI API: {error.reason}") from error

    output_text = ""
    for item in result.get("output", []):
        if item.get("type") != "message":
            continue
        for content in item.get("content", []):
            if content.get("type") == "output_text":
                output_text += content.get("text", "")

    if not output_text:
        raise RuntimeError("OpenAI API returned no blog content")

    try:
        return json.loads(output_text)
    except json.JSONDecodeError as error:
        raise RuntimeError("OpenAI API returned invalid structured content") from error


def load_config():
    config = DEFAULT_CONFIG.copy()
    if CONFIG_PATH.exists():
        config.update(json.loads(CONFIG_PATH.read_text(encoding="utf-8")))

    config["apiPrefix"] = config["apiPrefix"].rstrip("/")
    config["uploadsUrlPrefix"] = config["uploadsUrlPrefix"].rstrip("/")
    config["dataFile"] = ROOT_DIR / config["dataFile"]
    config["uploadsDir"] = (ROOT_DIR / config["uploadsDir"]).resolve()
    config["productUploadsDir"] = config["uploadsDir"] / "products"
    config["blogUploadsDir"] = config["uploadsDir"] / "blogs"
    return config


CONFIG = load_config()


def ensure_dir(path: Path):
    path.mkdir(parents=True, exist_ok=True)


def ensure_store():
    data_file = CONFIG["dataFile"]
    ensure_dir(data_file.parent)

    if not data_file.exists():
        data_file.write_text(json.dumps(EMPTY_STORE, indent=2), encoding="utf-8")
        return

    try:
        current = json.loads(data_file.read_text(encoding="utf-8"))
    except json.JSONDecodeError:
        current = None

    if not current or not isinstance(current.get("products"), list) or not isinstance(current.get("blogs"), list):
        data_file.write_text(json.dumps(EMPTY_STORE, indent=2), encoding="utf-8")


def ensure_upload_dirs():
    ensure_dir(CONFIG["uploadsDir"])
    ensure_dir(CONFIG["productUploadsDir"])
    ensure_dir(CONFIG["blogUploadsDir"])


def read_store():
    with STORE_LOCK:
        return json.loads(CONFIG["dataFile"].read_text(encoding="utf-8"))


def write_store(store):
    with STORE_LOCK:
        CONFIG["dataFile"].write_text(json.dumps(store, indent=2), encoding="utf-8")


def sanitize_name(name: str) -> str:
    normalized = re.sub(r"[^a-z0-9.-]+", "-", (name or "").lower())
    normalized = re.sub(r"-+", "-", normalized).strip("-")
    return normalized or "file"


def normalize_upload_basename(name: str, fallback: str) -> str:
    sanitized = sanitize_name(name or fallback)
    known_suffixes = (".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg")

    # Remove one or more existing image suffixes before appending the
    # extension inferred from the uploaded MIME type.
    while True:
        lowered = sanitized.lower()
        matched_suffix = next((suffix for suffix in known_suffixes if lowered.endswith(suffix)), None)
        if not matched_suffix:
            break
        sanitized = sanitized[: -len(matched_suffix)].rstrip(".-")
        if not sanitized:
            sanitized = sanitize_name(fallback)
            break

    return sanitized or sanitize_name(fallback)


def data_url_to_bytes(data_url: str):
    match = re.match(r"^data:(.+);base64,(.+)$", data_url or "")
    if not match:
        raise ValueError("Invalid data URL")

    mime_type = match.group(1)
    base64_data = match.group(2)
    extension_map = {
        "image/png": ".png",
        "image/jpeg": ".jpg",
        "image/webp": ".webp",
        "image/gif": ".gif",
    }
    extension = extension_map.get(mime_type)
    if not extension:
        raise ValueError(f"Unsupported image type: {mime_type}")

    return b64decode(base64_data), extension


def list_image_assets(directory: Path, url_prefix: str):
    if not directory.exists():
        return []

    assets = []
    for entry in directory.iterdir():
        if not entry.is_file():
            continue
        if entry.suffix.lower() not in {".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg"}:
            continue
        assets.append(
            {
                "name": entry.name,
                "url": f"{url_prefix}/{entry.name}",
                "createdAt": int(entry.stat().st_mtime * 1000),
            }
        )

    assets.sort(key=lambda item: item["createdAt"], reverse=True)
    return assets


def resolve_asset_path(target: str, asset_url: str) -> Path:
    if not isinstance(asset_url, str) or not asset_url:
        raise ValueError("Asset URL is required")

    expected_prefix = f'{CONFIG["uploadsUrlPrefix"]}/{target}/'
    if not asset_url.startswith(expected_prefix):
        raise ValueError("Invalid asset URL")

    filename = asset_url[len(expected_prefix) :]
    if not filename or "/" in filename or "\\" in filename:
        raise ValueError("Invalid asset path")

    target_dir = CONFIG["blogUploadsDir"] if target == "blogs" else CONFIG["productUploadsDir"]
    file_path = (target_dir / filename).resolve()
    if file_path.parent != target_dir.resolve():
        raise ValueError("Invalid asset path")

    return file_path


def get_content_image_urls(resource: str, item: dict) -> set:
    urls = set()
    image = item.get("image")
    if isinstance(image, str) and image:
        urls.add(image)

    if resource == "products":
        images = item.get("images", [])
        if isinstance(images, list):
            urls.update(url for url in images if isinstance(url, str) and url)

    return urls


def get_store_image_urls(store: dict) -> set:
    urls = set()
    for resource in ("products", "blogs"):
        for item in store.get(resource, []):
            urls.update(get_content_image_urls(resource, item))
    return urls


def remove_asset_references(store: dict, asset_url: str) -> int:
    updated_items = 0

    for product in store.get("products", []):
        original_image = product.get("image")
        original_images = product.get("images", [])
        images = original_images if isinstance(original_images, list) else []
        next_images = [url for url in images if url != asset_url]
        next_image = next_images[0] if original_image == asset_url and next_images else original_image
        if original_image == asset_url and not next_images:
            next_image = ""

        if next_image != original_image or next_images != images:
            product["image"] = next_image
            product["images"] = next_images
            updated_items += 1

    for blog in store.get("blogs", []):
        if blog.get("image") == asset_url:
            blog["image"] = ""
            updated_items += 1

    return updated_items


def get_asset_target(asset_url: str):
    for target in ("products", "blogs"):
        if asset_url.startswith(f'{CONFIG["uploadsUrlPrefix"]}/{target}/'):
            return target
    return None


def delete_orphaned_assets(asset_urls: set, remaining_store: dict) -> list:
    referenced_urls = get_store_image_urls(remaining_store)
    deleted_urls = []

    for asset_url in asset_urls - referenced_urls:
        target = get_asset_target(asset_url)
        if not target:
            continue

        try:
            file_path = resolve_asset_path(target, asset_url)
        except ValueError:
            continue

        if file_path.exists() and file_path.is_file():
            file_path.unlink()
            deleted_urls.append(asset_url)

    return deleted_urls


class ContentApiHandler(BaseHTTPRequestHandler):
    server_version = "DQTechContentAPI/1.0"

    def end_headers(self):
        if ALLOW_ORIGIN:
            self.send_header("Access-Control-Allow-Origin", ALLOW_ORIGIN)
            self.send_header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
            self.send_header("Access-Control-Allow-Headers", "Content-Type")
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(204)
        self.end_headers()

    def do_GET(self):
        self.handle_request("GET")

    def do_POST(self):
        self.handle_request("POST")

    def do_PUT(self):
        self.handle_request("PUT")

    def do_DELETE(self):
        self.handle_request("DELETE")

    def handle_request(self, method: str):
        parsed = urlparse(self.path)
        pathname = parsed.path

        try:
            if self.serve_upload(pathname):
                return

            if not pathname.startswith(CONFIG["apiPrefix"]):
                self.send_json(404, {"message": "Not found"})
                return

            if pathname == f'{CONFIG["apiPrefix"]}/health' and method == "GET":
                self.send_json(200, {"ok": True})
                return

            if pathname == f'{CONFIG["apiPrefix"]}/bootstrap' and method == "GET":
                self.send_json(200, read_store())
                return

            if pathname == f'{CONFIG["apiPrefix"]}/ai/blog-draft' and method == "POST":
                payload = self.read_json_body()
                draft = generate_blog_draft(payload.get("topic", ""), payload.get("category", "laptop"))
                self.send_json(200, draft)
                return

            if pathname == f'{CONFIG["apiPrefix"]}/assets' and method == "GET":
                query = parse_qs(parsed.query)
                target = "blogs" if query.get("target", ["products"])[0] == "blogs" else "products"
                target_dir = CONFIG["blogUploadsDir"] if target == "blogs" else CONFIG["productUploadsDir"]
                target_url_prefix = f'{CONFIG["uploadsUrlPrefix"]}/{target}'
                self.send_json(200, list_image_assets(target_dir, target_url_prefix))
                return

            if pathname == f'{CONFIG["apiPrefix"]}/assets' and method == "DELETE":
                query = parse_qs(parsed.query)
                target = "blogs" if query.get("target", ["products"])[0] == "blogs" else "products"
                asset_url = query.get("url", [""])[0]
                file_path = resolve_asset_path(target, asset_url)

                if not file_path.exists() or not file_path.is_file():
                    self.send_json(404, {"message": "File not found"})
                    return

                store = read_store()
                references_updated = remove_asset_references(store, asset_url)
                if references_updated:
                    write_store(store)

                file_path.unlink()
                self.send_json(200, {"ok": True, "referencesUpdated": references_updated})
                return

            if pathname == f'{CONFIG["apiPrefix"]}/upload' and method == "POST":
                payload = self.read_json_body()
                target = "blogs" if payload.get("target") == "blogs" else "products"
                target_dir = CONFIG["blogUploadsDir"] if target == "blogs" else CONFIG["productUploadsDir"]
                filename_base = normalize_upload_basename(
                    payload.get("filename", ""),
                    f"{target}-{self.timestamp_ms()}",
                )
                raw_bytes, extension = data_url_to_bytes(payload.get("dataUrl", ""))
                final_name = f"{self.timestamp_ms()}-{filename_base}{extension}"
                final_path = target_dir / final_name
                final_path.write_bytes(raw_bytes)
                self.send_json(201, {"url": f'{CONFIG["uploadsUrlPrefix"]}/{target}/{final_name}'})
                return

            for resource in ("products", "blogs"):
                resource_path = f'{CONFIG["apiPrefix"]}/{resource}'
                if pathname == resource_path and method == "GET":
                    store = read_store()
                    self.send_json(200, store[resource])
                    return

                if pathname == resource_path and method == "POST":
                    payload = self.read_json_body()
                    store = read_store()
                    store[resource].append(payload)
                    write_store(store)
                    self.send_json(201, payload)
                    return

                if pathname.startswith(f"{resource_path}/") and method == "PUT":
                    resource_id = unquote(pathname[len(resource_path) + 1 :])
                    payload = self.read_json_body()
                    store = read_store()
                    index = next((i for i, item in enumerate(store[resource]) if item.get("id") == resource_id), -1)
                    if index == -1:
                        self.send_json(404, {"message": f"{resource[:-1]} not found"})
                        return
                    store[resource][index] = payload
                    write_store(store)
                    self.send_json(200, payload)
                    return

                if pathname.startswith(f"{resource_path}/") and method == "DELETE":
                    resource_id = unquote(pathname[len(resource_path) + 1 :])
                    store = read_store()
                    deleted_item = next((item for item in store[resource] if item.get("id") == resource_id), None)
                    if deleted_item is None:
                        self.send_json(404, {"message": f"{resource[:-1]} not found"})
                        return
                    next_items = [item for item in store[resource] if item.get("id") != resource_id]
                    store[resource] = next_items
                    write_store(store)
                    deleted_assets = delete_orphaned_assets(get_content_image_urls(resource, deleted_item), store)
                    self.send_json(200, {"ok": True, "deletedAssets": deleted_assets})
                    return

            self.send_json(404, {"message": "Not found"})
        except ValueError as error:
            self.send_json(400, {"message": "Bad request", "detail": str(error)})
        except Exception as error:
            self.send_json(500, {"message": "Backend error", "detail": str(error)})

    def serve_upload(self, pathname: str) -> bool:
        prefix = f'{CONFIG["uploadsUrlPrefix"]}/'
        if not pathname.startswith(prefix):
            return False

        relative_path = pathname[len(prefix) :]
        file_path = (CONFIG["uploadsDir"] / relative_path).resolve()
        uploads_dir = CONFIG["uploadsDir"]

        if not str(file_path).startswith(str(uploads_dir)):
            self.send_json(403, {"message": "Forbidden"})
            return True

        if not file_path.exists() or not file_path.is_file():
            self.send_json(404, {"message": "File not found"})
            return True

        content_type = mimetypes.guess_type(file_path.name)[0] or "application/octet-stream"
        file_bytes = file_path.read_bytes()
        self.send_response(200)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(file_bytes)))
        self.end_headers()
        self.wfile.write(file_bytes)
        return True

    def read_json_body(self):
        content_length_header = self.headers.get("Content-Length")
        if not content_length_header:
            return {}

        try:
            content_length = int(content_length_header)
        except ValueError as error:
            raise ValueError("Invalid Content-Length") from error

        if content_length > BODY_LIMIT_BYTES:
            raise ValueError(f"Payload too large. Limit is {BODY_LIMIT_BYTES // (1024 * 1024)} MB")

        raw_body = self.rfile.read(content_length)
        if not raw_body:
            return {}

        try:
            return json.loads(raw_body.decode("utf-8"))
        except json.JSONDecodeError as error:
            raise ValueError("Invalid JSON body") from error

    def send_json(self, status_code: int, payload):
        raw = json.dumps(payload).encode("utf-8")
        self.send_response(status_code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(raw)))
        self.end_headers()
        self.wfile.write(raw)

    def log_message(self, format, *args):
        print(f"[{self.log_date_time_string()}] {self.address_string()} {format % args}")

    @staticmethod
    def timestamp_ms():
        return int(time.time() * 1000)


def main():
    ensure_store()
    ensure_upload_dirs()
    server = ThreadingHTTPServer((HOST, PORT), ContentApiHandler)
    print(f"Content API listening on http://{HOST}:{PORT}")
    server.serve_forever()


if __name__ == "__main__":
    main()
