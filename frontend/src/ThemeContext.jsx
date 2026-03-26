import { createContext, useContext, useState } from 'react'

const ThemeContext = createContext()

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(true)
  const toggleTheme = () => setIsDark(prev => !prev)
  const theme = isDark ? darkTheme : lightTheme
  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, theme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}

export const darkTheme = {
  bg:        '#0d0a1a',
  card:      '#13102a',
  border:    'rgba(139,92,246,0.18)',
  input:     'rgba(139,92,246,0.07)',
  text:      '#ede9fe',
  muted:     'rgba(139,92,246,0.55)',
  faint:     'rgba(139,92,246,0.35)',
  blue:      '#8b5cf6',
  green:     '#2dd4bf',
  yellow:    '#f59e0b',
  red:       '#f43f5e',
  teal:      '#2dd4bf',
  glow:      'rgba(139,92,246,0.15)',
}

export const lightTheme = {
  bg:        '#f5f3ff',
  card:      '#ffffff',
  border:    'rgba(139,92,246,0.25)',
  input:     'rgba(139,92,246,0.06)',
  text:      '#1e1b4b',
  muted:     '#6d28d9',
  faint:     '#a78bfa',
  blue:      '#7c3aed',
  green:     '#0d9488',
  yellow:    '#d97706',
  red:       '#e11d48',
  teal:      '#0d9488',
  glow:      'rgba(139,92,246,0.08)',
}