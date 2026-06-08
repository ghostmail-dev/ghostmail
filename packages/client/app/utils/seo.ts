/** Default metadata when a route does not override `meta`. */
export const seoDefaults = {
  title: "GhostMail",
  description:
    "Catch-all SMTP server for development teams. Test email delivery without spamming real inboxes.",
} as const

type BuildMetaOptions = {
  pathname: string
  title?: string
  description?: string
  robots?: string
}

/**
 * Preferred public site origin for canonical URLs and Open Graph.
 * Set `VITE_SITE_URL` for an explicit base (e.g. https://ghostmail.dev).
 * Otherwise uses https://{VITE_MAIL_DOMAIN} when defined.
 */
export function getSiteOrigin(): string {
  const explicit = import.meta.env.VITE_SITE_URL?.trim().replace(/\/$/, "")
  if (explicit) return explicit
  const domain = import.meta.env.VITE_MAIL_DOMAIN?.trim()
  if (domain) return `https://${domain}`
  return ""
}

/** Origin for crawlers and dynamic SEO files; falls back to the request URL in dev. */
export function siteOriginFromRequest(request: Request): string {
  const fromEnv = getSiteOrigin()
  if (fromEnv) return fromEnv
  return new URL(request.url).origin
}

export function canonicalHref(pathname: string): string | undefined {
  const origin = getSiteOrigin()
  if (!origin) return undefined
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`
  return `${origin}${path}`
}

export function ogImageUrl(): string | undefined {
  const origin = getSiteOrigin()
  if (!origin) return undefined
  return `${origin}/og-image.png`
}

export function buildMeta({
  pathname,
  title = seoDefaults.title,
  description = seoDefaults.description,
  robots,
}: BuildMetaOptions) {
  const canonical = canonicalHref(pathname)
  const ogImage = ogImageUrl()

  return [
    { charset: "utf-8" },
    {
      name: "viewport",
      content: "width=device-width, initial-scale=1",
    },
    {
      name: "google-adsense-account",
      content: "ca-pub-5695883157519004",
    },
    { title },
    { name: "description", content: description },
    { property: "og:site_name", content: "GhostMail" },
    { property: "og:type", content: "website" },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    ...(canonical ? [{ property: "og:url", content: canonical }] : []),
    ...(ogImage
      ? [
          { property: "og:image", content: ogImage },
          { property: "og:image:width", content: "1200" },
          { property: "og:image:height", content: "630" },
        ]
      : []),
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    ...(ogImage ? [{ name: "twitter:image", content: ogImage }] : []),
    ...(canonical
      ? [{ tagName: "link", rel: "canonical", href: canonical }]
      : []),
    ...(robots ? [{ name: "robots", content: robots }] : []),
  ]
}

export function metaRobotsNoIndex(): { name: string; content: string } {
  return { name: "robots", content: "noindex, nofollow" }
}
