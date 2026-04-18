import { type RouteConfig, index, route } from "@react-router/dev/routes"

export default [
  index("routes/home.tsx"),
  route("inbox/:username", "routes/inbox.tsx"),
  route("dashboard", "routes/dashboard.tsx"),
] satisfies RouteConfig
