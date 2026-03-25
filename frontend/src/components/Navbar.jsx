import { Link, useNavigate } from 'react-router-dom'
import { useTheme } from '../ThemeContext'

export default function Navbar() {
  const navigate = useNavigate()
  const { isDark, toggleTheme, theme } = useTheme()

  const logout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <nav style={{
      background: theme.card,
      padding: '12px 32px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottom: `1px solid ${theme.border}`,
    }}>
      <span style={{ color: theme.text, fontWeight: '700', fontSize: '1.2rem' }}>
        🛡️ AnonMitra
      </span>
      <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
        <Link to="/dashboard" style={{ color: theme.blue, textDecoration: 'none', fontSize: '0.95rem', fontWeight: '500' }}>Dashboard</Link>
        <Link to="/inbox"     style={{ color: theme.blue, textDecoration: 'none', fontSize: '0.95rem', fontWeight: '500' }}>Inbox</Link>
        <Link to="/detector"  style={{ color: theme.blue, textDecoration: 'none', fontSize: '0.95rem', fontWeight: '500' }}>AI Detector</Link>
        <Link to="/analytics" style={{ color: theme.blue, textDecoration: 'none', fontSize: '0.95rem', fontWeight: '500' }}>Analytics</Link>
        <Link to="/profile" style={{ color: theme.blue, textDecoration: 'none', fontSize: '0.95rem', fontWeight: '500' }}>Profile</Link>
        <button onClick={toggleTheme} style={{
          background: theme.input,
          border: `1px solid ${theme.border}`,
          borderRadius: '6px',
          padding: '6px 12px',
          cursor: 'pointer',
          fontSize: '1rem',
          color: theme.text,
        }}>
          {isDark ? '☀️' : '🌙'}
        </button>
        <button onClick={logout} style={{
          background: theme.red,
          color: '#1e1e2e',
          border: 'none',
          borderRadius: '6px',
          padding: '6px 16px',
          cursor: 'pointer',
          fontWeight: '600',
        }}>
          Logout
        </button>
      </div>
    </nav>
  )
}