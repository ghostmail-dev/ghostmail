import { createContext, useCallback, useEffect, useMemo, useState } from "react"

type ThemeContextType = {
  theme: "dark" | "light"
  setTheme: (theme: "dark" | "light") => void
}

export const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined
)

const getThemeFromStorage = () => {
  const theme = localStorage.getItem("theme")
  if (theme === "dark" || theme === "light") {
    return theme
  }
  return "light"
}

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<"dark" | "light">("light")
  const setAndStoreTheme = useCallback((theme: "dark" | "light") => {
    localStorage.setItem("theme", theme)
    setTheme(theme)
  }, [])

  // have to use in an effect because window is not available in SSR
  useEffect(() => {
    setTheme(getThemeFromStorage())
  }, [])

  const context = useMemo(
    () => ({
      theme,
      setTheme: setAndStoreTheme,
    }),
    [theme, setAndStoreTheme]
  )
  return (
    <ThemeContext.Provider value={context}>{children}</ThemeContext.Provider>
  )
}
