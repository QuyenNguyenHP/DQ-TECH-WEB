---
name: dqtech-content-agent
description: Create draft laptop listings and blog posts, with optional image uploads, through the DQ Tech agent API. Use when publishing DQ Tech catalogue or blog content from a trusted automation agent; do not use for website deployment or manual admin work.
---

# DQ Tech Content Agent

Create accurate content for `dqtech.cloud` through its authenticated agent API.
Never reveal, persist in content, or place the API key in frontend/browser code.

## Preconditions

The caller must provide the DQ Tech agent API key securely. If it is absent,
stop and ask for it; do not use the legacy non-agent endpoints as a fallback.

Use the base URL `https://dqtech.cloud/api/content/agent` and send these
headers on every request:

```http
Authorization: Bearer <DQTECH_CONTENT_API_KEY>
Content-Type: application/json
```

## Workflow

1. Turn supplied inventory or source material into factual Vietnamese content.
   Do not invent laptop specifications, battery health, price, condition, or
   warranty. Ask for missing business-critical facts.
2. If local image files are supplied, upload them first. Read
   [the upload contract](references/api-contract.md#upload-an-image).
3. Create either a laptop or blog payload from the schemas in
   [the API contract](references/api-contract.md).
4. Treat a `201` response as success. Agent content normally becomes `draft`;
   tell the user to review it at `https://dqtech.cloud/admin/dashboard` and
   click `Nháp · Xuất bản`.
5. For `400`, fix only the reported invalid/missing fields. For `401`, stop:
   the key is missing, wrong, or the server has not been configured with it.

## Content rules

- Use a stable, lowercase, hyphenated and unique `id` for every item.
- Blog `slug` must also be lowercase, hyphenated, and unique.
- Product category must be one of `student`, `gaming`, `business`, `creator`.
- Product condition must be one of `Excellent`, `Good`, `Fair`.
- Blog category must be one of `laptop`, `website`, `camera`, `tech-tips`.
- Prices are VND integers, without separators or currency symbols.
- Use only image URLs returned by the upload endpoint or an explicitly supplied
  public HTTPS image URL.
- Do not attempt to publish unless the user specifically requests it and the
  server is configured to permit agent publishing.

## Boundaries

Only call `POST /upload`, `POST /products`, and `POST /blogs` under the agent
base URL. Do not delete or modify existing content, alter service configuration,
or bypass approval by calling the legacy API.
