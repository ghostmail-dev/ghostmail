import type { LoaderFunctionArgs } from "react-router"
import { siteOriginFromRequest } from "../utils/seo"

export async function loader({ request }: LoaderFunctionArgs) {
  const origin = siteOriginFromRequest(request)
  const body = [
    "User-agent: *",
    "Allow: /",
    "Allow: /login",
    "Allow: /signup",
    "Disallow: /mailboxes",
    "Disallow: /settings",
    "Disallow: /logout",
    "",
    `Sitemap: ${origin}/sitemap.xml`,
  ].join("\n")

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  })
}
