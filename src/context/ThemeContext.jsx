import { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext(null)

function getStoredTheme() {
  try {
    return localStorage.getItem('aurora_theme')
  } catch {
    return null
  }
}

function storeTheme(theme) {
  try {
    localStorage.setItem('aurora_theme', theme)
  } catch {
    // Ignore storage failures; the in-memory theme still works.
  }
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'dark'
    return getStoredTheme() || 'dark'
  })

  useEffect(() => {
    const root = document.documentElement
    root.classList.remove('dark', 'light')
    root.classList.add(theme)
    storeTheme(theme)
  }, [theme])

  const toggle = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggle }}>
      {children}
    </ThemeContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>')
  return ctx
}
