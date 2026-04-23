export const toggleTheme = () => {
  const html = document.documentElement
  const theme = html.getAttribute("data-theme") as
    | "ghostmail"
    | "ghostmail-dark"
  const newTheme = theme === "ghostmail-dark" ? "ghostmail" : "ghostmail-dark"
  html.setAttribute("data-theme", newTheme)
  localStorage.setItem("theme", newTheme)
}

export const getSystemTheme = () => {
  if (typeof window === "undefined") return "ghostmail-dark"
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "ghostmail-dark"
    : "ghostmail"
}

export const getTheme = () => {
  if (typeof localStorage === "undefined" || typeof document === "undefined") {
    return "ghostmail-dark"
  }
  const theme =
    (localStorage.getItem("theme") as "ghostmail" | "ghostmail-dark" | null) ??
    getSystemTheme()
  const html = document.documentElement
  const currentTheme = html.getAttribute("data-theme") as
    | "ghostmail"
    | "ghostmail-dark"
    | null
  if (currentTheme !== theme) {
    html.setAttribute("data-theme", theme)
  }
  return theme
}
