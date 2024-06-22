import type { RouteConfigFunction } from "../../types"
import Root from "./Root"
import { Home } from "./components/home"
import { root_loader } from "./loader"

export const RootRoute: RouteConfigFunction = (children) => ({
  path: "/",
  element: <Root />,
  children: [
    {
      index: true,
      element: <Home />,
    },
    {
      path: "*",
      element: <div>404</div>,
    },
    ...(children ?? []),
  ],
  loader: root_loader,
})
