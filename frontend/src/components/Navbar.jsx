import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTheme } from '../ThemeContext'

export default function Navbar() {
  const navigate = useNavigate()
  const { isDark, toggleTheme, theme } = useTheme()
  const [menuOpen, setMenuOpen] = useState(false)

  const logout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  const navLinks = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/inbox',     label: 'Inbox' },
    { to: '/detector',  label: 'AI Detector' },
    { to: '/analytics', label: 'Analytics' },
    { to: '/profile',   label: 'Profile' },
  ]

  return (
    <>
      <nav style={{
        background: theme.card,
        padding: '12px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: `1px solid ${theme.border}`,
        position: 'relative',
        zIndex: 100,
      }}>
        {/* Logo */}
        <span style={{ color: theme.text, fontWeight: '700', fontSize: '1.2rem' }}>
          🛡️ AnonMitra
        </span>

        {/* Desktop links */}
        <div className="desktop-only" style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          {navLinks.map(link => (
            <Link key={link.to} to={link.to} style={{
              color: theme.blue,
              textDecoration: 'none',
              fontSize: '0.95rem',
              fontWeight: '500',
            }}>
              {link.label}
            </Link>
          ))}
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
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            padding: '6px 16px',
            cursor: 'pointer',
            fontWeight: '600',
          }}>
            Logout
          </button>
        </div>

        {/* Mobile hamburger */}
        <div className="mobile-only" style={{
          display: 'none',
          alignItems: 'center',
          gap: '12px',
        }}>
          <button onClick={toggleTheme} style={{
            background: theme.input,
            border: `1px solid ${theme.border}`,
            borderRadius: '6px',
            padding: '6px 10px',
            cursor: 'pointer',
            fontSize: '1rem',
          }}>
            {isDark ? '☀️' : '🌙'}
          </button>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              background: 'transparent',
              border: `1px solid ${theme.border}`,
              borderRadius: '6px',
              padding: '6px 10px',
              cursor: 'pointer',
              color: theme.text,
              fontSize: '1.2rem',
            }}
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </nav>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="mobile-only" style={{
          display: 'flex',
          flexDirection: 'column',
          background: theme.card,
          borderBottom: `1px solid ${theme.border}`,
          padding: '12px 24px',
          gap: '4px',
          zIndex: 99,
        }}>
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              style={{
                color: theme.blue,
                textDecoration: 'none',
                fontSize: '0.95rem',
                fontWeight: '500',
                padding: '10px 0',
                borderBottom: `1px solid ${theme.border}`,
              }}
            >
              {link.label}
            </Link>
          ))}
          <button
            onClick={logout}
            style={{
              background: theme.red,
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              padding: '10px',
              cursor: 'pointer',
              fontWeight: '600',
              marginTop: '8px',
            }}
          >
            Logout
          </button>
        </div>
      )}
    </>
  )
}