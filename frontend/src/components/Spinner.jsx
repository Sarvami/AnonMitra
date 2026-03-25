import { useTheme } from '../ThemeContext'

export default function Spinner({ size = 32 }) {
  const { theme } = useTheme()
  return (
    <div style={{
      width: size,
      height: size,
      border: `3px solid ${theme.border}`,
      borderTop: `3px solid ${theme.blue}`,
      borderRadius: '50%',
      animation: 'spin 0.7s linear infinite',
      margin: '0 auto',
    }} />
  )
}