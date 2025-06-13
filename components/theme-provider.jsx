"use client"

import { createContext, useContext, useEffect, useState } from "react"

const ThemeProviderContext = createContext({
  theme: "light",
  setTheme: () => null,
})

export function ThemeProvider({
  children,
  defaultTheme = "light",
  attribute = "class",
  ...props
}) {
  const [theme, setTheme] = useState(() => {
    // During SSR, we'll always use the defaultTheme
    if (typeof window === 'undefined') return defaultTheme
    
    // On client, try to read from localStorage or use default
    try {
      const stored = localStorage.getItem('theme')
      return stored || defaultTheme
    } catch (e) {
      return defaultTheme
    }
  })

  useEffect(() => {
    const root = window.document.documentElement
    
    // Clean up all theme attributes
    root.classList.remove('light', 'dark')
    if (attribute === 'class') {
      root.classList.add(theme)
    } else if (attribute === 'data-theme') {
      root.setAttribute('data-theme', theme)
    }
    
    // Persist to localStorage
    try {
      localStorage.setItem('theme', theme)
    } catch (e) {
      // localStorage may be unavailable in some environments
    }
  }, [theme, attribute])

  const value = {
    theme,
    setTheme: (newTheme) => {
      setTheme(newTheme)
    },
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)
  if (context === undefined) throw new Error("useTheme must be used within a ThemeProvider")
  return context
}