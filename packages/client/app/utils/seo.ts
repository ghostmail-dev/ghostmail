/** Default metadata when a route does not override `meta`. */
export const seoDefaults = {
  title: "GhostMail",
  description:
    "Catch-all SMTP server for development teams. Test email delivery without spamming real inboxes.",
} as const

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

export function metaRobotsNoIndex(): { name: string; content: string } {
  return { name: "robots", content: "noindex, nofollow" }
}
