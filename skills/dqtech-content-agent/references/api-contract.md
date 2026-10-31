# DQ Tech agent API contract

Base URL: `https://dqtech.cloud/api/content/agent`

All requests require:

```http
Authorization: Bearer <DQTECH_CONTENT_API_KEY>
Content-Type: application/json
```

## Upload an image

`POST /upload`

```json
{
  "target": "products",
  "filename": "dell-latitude-5420-front.webp",
  "dataUrl": "data:image/webp;base64,BASE64_IMAGE_BYTES"
}
```

`target` is either `products` or `blogs`. Supported image types are PNG, JPEG,
WEBP, and GIF. A successful response is `201`:

```json
{ "url": "/uploads/products/1730000000000-dell-latitude-5420-front.webp" }
```

Use that exact URL in the item created next.

## Create a laptop

`POST /products`

```json
{
  "id": "dell-latitude-5420-i5-16gb-512gb",
  "name": "Dell Latitude 5420",
  "brand": "Dell",
  "price": 10500000,
  "originalPrice": 12500000,
  "condition": "Excellent",
  "batteryHealth": 88,
  "image": "/uploads/products/dell-5420-front.webp",
  "images": ["/uploads/products/dell-5420-front.webp"],
  "specs": {
    "cpu": "Intel Core i5-1145G7",
    "ram": "16GB DDR4",
    "ssd": "512GB NVMe",
    "gpu": "Intel Iris Xe",
    "screen": "14 inch FHD IPS",
    "os": "Windows 11 Pro",
    "weight": "1.37 kg"
  },
  "category": "business",
  "warranty": "6 tháng",
  "accessories": ["Sạc Dell 65W"],
  "description": "Laptop doanh nhân nhỏ gọn.",
  "inStock": true,
  "featured": false
}
```

Required by the API: `id`, `name`, `brand`, `price`, `image`, and `specs`.

## Create a blog post

`POST /blogs`

```json
{
  "id": "laptop-sinh-vien-2026-10-31",
  "title": "Laptop phù hợp cho sinh viên công nghệ",
  "slug": "laptop-sinh-vien-cong-nghe",
  "excerpt": "Các tiêu chí chọn laptop cho sinh viên.",
  "content": "# Laptop cho sinh viên\n\nNội dung Markdown...",
  "category": "laptop",
  "author": "DQ Tech AI Assistant",
  "date": "2026-10-31",
  "readTime": "5 phút đọc",
  "image": "/uploads/blogs/laptop-student.webp",
  "tags": ["laptop", "sinh viên"]
}
```

All fields shown are required. `id` and `slug` must be unique.

## Status and responses

The server creates agent content as `draft` by default. Public pages return
only `published` content; old content without a status remains published.

- `201`: item or image created.
- `400`: invalid/missing field, or duplicate item ID/blog slug.
- `401`: missing or invalid API key.
