# SEO review: `packages/client`

This document summarizes what the GhostMail client already does well for search and sharing, where gaps are, and practical improvements ordered by impact. It assumes you care mainly about **discoverability of the marketing homepage** (`/`) and **avoiding indexing of private app surfaces** (mailboxes, settings, individual emails).

---

## Current strengths

1. **Server-rendered UI** — The app builds with React Router 7 and is served via `react-router-serve`, so HTML responses can include meaningful content for crawlers **if** you expose that content in route loaders and `<meta>` (today most marketing copy lives in components, which helps).

2. **`lang="en"` on `<html>`** — Declaring language in `root.tsx` helps search engines and accessibility.

3. **Baseline `<meta>`** — Charset and viewport are set in `root.tsx`. Mobile-friendly viewport is a technical SEO baseline.

4. **Favicons** — Light/dark icons via `<link rel="icon">` improve brand recognition in tabs and some search result contexts.

5. **Landing page copy** — `routes/Home.tsx` has a clear value proposition (“Catch-all SMTP server for development teams”), benefit bullets, and natural language that could rank for intent around SMTP testing and dev email capture—once titles and descriptions exist.

6. **Ads verification** — `google-adsense-account` meta and `public/ads.txt` align with monetization; they are not substitutes for organic SEO but do not conflict with it.

---

## High-impact gaps

### 1. No document `<title>` or meta description

**Observation:** Only `app/root.tsx` exports `meta`, and it does not define `title`, `description`, Open Graph (`og:*`), or Twitter Card tags.

**Why it matters:** The `<title>` is still one of the strongest signals for relevance in results snippets. Descriptions influence click-through even when they do not directly “rank” you higher.

**Suggestion:** Add a default title and description in root `meta`, then **override per route** for `/`, `/login`, and `/signup` using React Router’s route `meta` exports (with `matches` / parents if you want inheritance). Include `og:title`, `og:description`, `og:url`, `og:type`, and `og:image` for link previews; use `twitter:card` at minimum (`summary` or `summary_large_image`).

### 2. Duplicate `<h1>` on the homepage

**Observation:** The global header in `root.tsx` wraps the logo label in `<h1 className="text-lg">GhostMail</h1>`, while `routes/Home.tsx` also uses `<h1>` for the main hero heading.

**Why it matters:** Multiple `<h1>` elements on one URL dilute semantic clarity for accessibility tooling and some parsers; many teams prefer a single `<h1>` per view.

**Suggestion:** Use `<p>`, `<span>`, or a site-title pattern with lower heading levels for the chrome brand (e.g. keep one `<h1>` in the hero only). Ensure logged-in views still use a sensible heading hierarchy.

### 3. App and sensitive URLs likely indexable by default

**Observation:** Routes such as `/mailboxes`, `/mailboxes/:id`, settings, and email detail URLs do not export `meta` with `robots` `noindex`, and there is no `robots.txt` in `public/` restricting crawlers.

**Why it matters:** Ephemeral inboxes and message content should not appear in public search indexes. Even login/signup may be fine to index or not—product decision—but **authenticated workflows almost always should be `noindex, nofollow`** (or blocked at HTTP/`robots.txt`).

**Suggestion:**

- Add route-level `meta` for authenticated layouts with `{ name: "robots", content: "noindex, nofollow" }`.
- Optionally serve `robots.txt` with `Disallow` rules for `/mailboxes`, `/settings`, etc., if those paths should never be crawled regardless of meta support.

### 4. No `robots.txt` or XML sitemap

**Observation:** `public/` currently contains only `ads.txt`.

**Why it matters:** A small, explicit `robots.txt` documents intent. An XML sitemap listing only **public marketing URLs** helps discovery and consolidation (especially when paired with canonical URLs).

**Suggestion:** Add `public/robots.txt` (and optionally generate `sitemap.xml` at build time with your canonical origin). Keep the sitemap minimal: e.g. `/` only, or `/`, `/login`, `/signup` depending on whether you want those indexed.

### 5. No canonical URL

**Observation:** No `<link rel="canonical">`.

**Why it matters:** If the site is reachable under multiple hosts or schemes (`www` vs apex, staging vs prod), duplicates can split signals.

**Suggestion:** Emit a canonical per public route using your production origin from environment configuration (`import.meta.env`).

---

## Medium-impact improvements

### 6. Structured data (JSON-LD)

For the homepage, consider `SoftwareApplication` or `WebApplication` JSON-LD describing GhostMail as an SMTP testing tool, including `url`, `name`, `description`, and `applicationCategory` (`DeveloperApplication`). This can enhance eligible rich results over time (Google policies apply).

### 7. Social preview image

There is no `og:image`. Adding one branded image (1200×630 is a common safe size) improves Slack, Discord, and LinkedIn previews when someone shares your URL.

### 8. Performance-related signals

You already use `preconnect` for Google Fonts. External render-blocking CSS still affects Core Web Vitals; self-hosting Outfit or using `font-display` strategies may help LCP/CLS. Good performance supports SEO indirectly.

### 9. Brand consistency in headings

`AuthenticationWrapper` uses “Ghostmail” while other surfaces use “GhostMail”. Consistent spelling helps branded queries and snippet consistency.

---

## Lower priority / nice-to-have

- **`manifest.webmanifest`** — Improves installability and some mobile contexts; minor for a dev-tool web app.
- **`theme-color` meta** — Minor UX for browser chrome.
- **`hreflang`** — Only if you add localized copies of pages.

---

## Suggested implementation order

| Priority | Action                                                                               |
| -------- | ------------------------------------------------------------------------------------ |
| 1        | Add default + route-specific `meta` (`title`, `description`, OG/Twitter, canonical). |
| 2        | Fix duplicate `<h1>` on `/`.                                                         |
| 3        | `noindex` (and/or `robots.txt` `Disallow`) for authenticated app routes.             |
| 4        | `robots.txt` + small public-only `sitemap.xml`.                                      |
| 5        | OG image asset + JSON-LD on homepage.                                                |

---

## References in this package

- Global meta and document shell: `app/root.tsx`
- Marketing content and headings: `app/routes/Home.tsx`
- Auth chrome headings: `app/components/AuthenticationWrapper.tsx`
- Route tree: `app/routes.ts`

For React Router 7, route-level `meta` functions receive route context and parent matches—use that to avoid duplicating long descriptions while keeping titles unique per URL.
