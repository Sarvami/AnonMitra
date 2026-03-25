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
  bg:         '#181825',
  card:       '#1e1e2e',
  border:     '#313244',
  input:      '#313244',
  text:       '#cdd6f4',
  muted:      '#a6adc8',
  faint:      '#6c7086',
  blue:       '#89b4fa',
  green:      '#a6e3a1',
  yellow:     '#f9e2af',
  red:        '#f38ba8',
}

export const lightTheme = {
  bg:         '#eff1f5',
  card:       '#ffffff',
  border:     '#dce0e8',
  input:      '#e6e9ef',
  text:       '#4c4f69',
  muted:      '#6c6f85',
  faint:      '#9ca0b0',
  blue:       '#1e66f5',
  green:      '#40a02b',
  yellow:     '#df8e1d',
  red:        '#d20f39',
}