import type { LoaderFunctionArgs } from "react-router"
import { siteOriginFromRequest } from "../utils/seo"

export async function loader({ request }: LoaderFunctionArgs) {
  const origin = siteOriginFromRequest(request)
  const urls: { loc: string; changefreq: string; priority: string }[] = [
    { loc: `${origin}/`, changefreq: "weekly", priority: "1.0" },
    { loc: `${origin}/login`, changefreq: "monthly", priority: "0.5" },
    { loc: `${origin}/signup`, changefreq: "monthly", priority: "0.5" },
  ]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${escapeXml(u.loc)}</loc>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>`

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  })
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}
