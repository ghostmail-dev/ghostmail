/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SITE_URL?: string
}

declare module "*.css" {
  const content: string
  export default content
}
