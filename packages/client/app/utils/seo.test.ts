import { describe, expect, it } from "vitest"
import { buildMeta } from "./seo"
import { meta as rootMeta } from "../root"
import { meta as homeMeta } from "../routes/Home"
import { meta as loginMeta } from "../routes/login/Login"
import { meta as signupMeta } from "../routes/signup/Signup"
import { meta as mailboxesMeta } from "../routes/mailboxes/Mailboxes"
import { meta as settingsMeta } from "../routes/settings.$userid/Route"

type MetaEntry = Record<string, unknown>

const getViewportMeta = (entries: MetaEntry[]) =>
  entries.find((entry) => entry.name === "viewport")

const expectViewportMeta = (entries: MetaEntry[]) => {
  expect(getViewportMeta(entries)).toEqual({
    name: "viewport",
    content: "width=device-width, initial-scale=1",
  })
}

describe("SEO metadata", () => {
  it("buildMeta includes the viewport baseline", () => {
    const entries = buildMeta({ pathname: "/login" })

    expectViewportMeta(entries)
  })

  it("root meta includes the viewport baseline", () => {
    const entries = rootMeta({ location: { pathname: "/" } } as never)

    expectViewportMeta(entries as MetaEntry[])
  })

  it("public route metas retain the viewport baseline", () => {
    const publicRouteMetas = [
      homeMeta({ location: { pathname: "/" } } as never),
      loginMeta({ location: { pathname: "/login" } } as never),
      signupMeta({ location: { pathname: "/signup" } } as never),
    ]

    for (const entries of publicRouteMetas) {
      expectViewportMeta(entries as MetaEntry[])
    }
  })

  it("authenticated route metas retain the viewport baseline", () => {
    const authenticatedRouteMetas = [
      mailboxesMeta({ location: { pathname: "/mailboxes" } } as never),
      settingsMeta({
        location: { pathname: "/settings/user-123/password" },
      } as never),
    ]

    for (const entries of authenticatedRouteMetas) {
      expectViewportMeta(entries as MetaEntry[])
    }
  })
})
