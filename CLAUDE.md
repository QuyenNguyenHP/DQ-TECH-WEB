# CLAUDE.md

Guidance for Claude Code when working in this repository.

## Project

DQ TECH website (dqtech.cloud). Vietnamese-language site for DQ TECH: used
premium laptops, plus consulting and deployment of AI solutions and process
automation for small businesses and individual sellers. Website design is also
offered. All user-facing text is Vietnamese.

## Stack and layout

```text
frontend/            Vite 6 + React 18 + TypeScript + Tailwind CSS 4 (dark theme)
  src/app/App.tsx    Routes (react-router v7)
  src/app/pages/     One file per page
  src/app/components/  Navbar, Footer, ProductCard, admin modals, ShareButtons
  src/app/components/ui/  shadcn/Radix primitives (generated, rarely edited)
  src/app/lib/contentApi.ts  All calls to the content API
  src/app/data/      Types and seed data (blogPosts.ts, products.ts)
  src/imports/       Logo and images imported by components
  public/            Static files, incl. standalone course pages
  dist/              Build output, committed and served by Apache
backend/server.py    Python content API (stdlib HTTP server), JSON storage
backend/data/        Live content JSON (not in Git, never delete)
backend/uploads/     Uploaded images (not in Git, never delete)
deploy/update.sh     Safe production update script (backup + pull + build)
SKILL.md             Maintenance/deploy notes for the production server
README.md            Full production deployment procedure
```

## Routes

Navbar: Trang Chủ · Dịch Vụ · Blog · Liên Hệ (flat links, no dropdown).

- `/` - Homepage: hero, laptop + AI services intro, featured laptops, latest posts
- `/giai-phap-ai` - "Dịch Vụ": AI consulting and process automation page
- `/blog` - Blog list, newest post first
- `/blog/:slug` - Blog post, with social share buttons
- `/laptops`, `/laptops/:id` - Laptop catalogue
- `/contact` - Contact
- `/thiet-ke-website` - Website design page, kept but not linked from nav/footer
- `/admin/login`, `/admin/dashboard` - Admin (no Navbar/Footer)
- `/gioi-thieu`, `/camera-giam-sat` - removed; redirect to `/`

## Commands

Run from the repo root:

```bash
npm --prefix frontend install
npm --prefix frontend run dev:api   # Python API on 127.0.0.1:8000
npm --prefix frontend run dev       # Vite; proxies /api/content and /uploads
npm --prefix frontend run build     # outputs frontend/dist
```

There is no test suite or linter. Verify changes with `npm run build` and by
checking the page in the browser.

## Conventions

- Content (blogs, products) comes from the API via `contentApi.ts`; the seed
  files in `src/data/` are mainly types and fallback data.
- Blog posts are Markdown rendered with `react-markdown` + `remark-gfm` and
  styled by `@tailwindcss/typography` (`@plugin` in `src/styles/tailwind.css`).
  Do not remove either.
- Blog dates are ISO strings in `post.date`; sort with `Date.parse`.
- Blog categories live only in `src/app/lib/blogCategories.ts`: `tech-tips`
  (Tech Tip), `robotic`, `ai`, `laptop`. `website` and `camera` are retired but
  old posts still show their badge. The backend does not validate categories.
- Laptop brands (catalogue filter + admin select) live in
  `src/app/lib/laptopBrands.ts`; the filter matches brands case-insensitively.
- Colors: background `#0F1115` / `#0A0D11`, primary blue `#3B82F6`. Icons from
  `lucide-react`, animation from `motion/react`, toasts from `sonner`.
- Keep `vite.config.ts` React and Tailwind plugins in place.

## Deployment

Production runs on Apache2 serving `frontend/dist`, with `/api/content` and
`/uploads` proxied to the Python service (`dqtech-content-api.service`). See
`README.md` and `SKILL.md`. Update the server with `deploy/update.sh` (backs
up content, pulls, builds, restarts, checks counts).

Content safety rules:

- Never overwrite, delete or move `backend/data` or `backend/uploads`, and
  never suggest `git clean -x`/`-fdx` on the server.
- Changes to the stored data shape in `backend/server.py` must stay backward
  compatible with existing `content-store.json` (old posts and products must
  still load). Keep existing blog slugs and product ids working as URLs.
- Keep old blog categories readable even if they are hidden from the UI.
