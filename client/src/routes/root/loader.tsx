import { LoaderFunctionArgs } from "react-router-dom"

export const root_loader = async ({ request }: LoaderFunctionArgs) => {
  request
  return { status: 200 }
}

export type RootLoaderData = typeof root_loader
