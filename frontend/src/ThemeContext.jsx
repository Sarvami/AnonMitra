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
  bg:        '#f0eeff',           // slightly purple-tinted white
  card:      '#ffffff',
  border:    'rgba(109,40,217,0.2)',
  input:     'rgba(109,40,217,0.07)',
  text:      '#1a1035',           // near-black with purple tint — was too light
  muted:     '#5b21b6',           // strong purple — was too faint
  faint:     '#7c3aed',           // visible purple — was nearly invisible
  blue:      '#6d28d9',
  green:     '#0d9488',
  yellow:    '#b45309',           // darker gold — was washed out on white
  red:       '#be123c',           // darker red — was too bright/thin
  teal:      '#0d9488',
  glow:      'rgba(109,40,217,0.1)',
}