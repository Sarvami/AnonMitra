import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useTheme } from '../ThemeContext'

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { isDark, toggleTheme, theme } = useTheme()
  const [menuOpen, setMenuOpen] = useState(false)

  const profile = JSON.parse(localStorage.getItem('userProfile') || '{}')
  const initial = profile.fullName ? profile.fullName[0].toUpperCase() : '?'

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userProfile')
    navigate('/login')
  }

  const navLinks = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/inbox',     label: 'Inbox' },
    { to: '/detector',  label: 'AI_Detect' },
    { to: '/analytics', label: 'Analytics' },
  ]

  const isActive = (path) => location.pathname === path

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
        boxShadow: `0 1px 20px ${theme.glow}`,
      }}>
        {/* Logo */}
        <Link to="/dashboard" style={{ textDecoration: 'none', display: 'flex', alignItems: 'baseline', gap: '2px' }}>
          <span style={{
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: '20px', color: theme.text,
            letterSpacing: '-0.5px',
          }}>Anon</span>
          <span style={{
            fontFamily: "'Noto Sans Devanagari', sans-serif",
            fontSize: '18px', fontWeight: '800', color: theme.teal,
          }}>मित्र</span>
        </Link>

        {/* Desktop links */}
        <div className="desktop-only" style={{ display: 'flex', gap: '28px', alignItems: 'center' }}>
          {navLinks.map(link => (
            <Link key={link.to} to={link.to} style={{
              fontFamily: "'Share Tech Mono', monospace",
              color: isActive(link.to) ? theme.teal : theme.muted,
              textDecoration: 'none',
              fontSize: '12px',
              letterSpacing: '1.5px',
              borderBottom: isActive(link.to) ? `1px solid ${theme.teal}` : '1px solid transparent',
              paddingBottom: '2px',
              transition: 'color 0.2s',
            }}>
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="desktop-only" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Theme toggle slider */}
          <div onClick={toggleTheme} style={{
            width: '48px', height: '26px',
            background: isDark ? 'rgba(139,92,246,0.3)' : 'rgba(45,212,191,0.3)',
            borderRadius: '99px', cursor: 'pointer',
            position: 'relative',
            border: `1px solid ${theme.border}`,
            transition: 'background 0.3s ease',
          }}>
            <div style={{
              position: 'absolute', top: '3px',
              left: isDark ? '24px' : '3px',
              width: '18px', height: '18px',
              background: isDark ? '#8b5cf6' : '#2dd4bf',
              borderRadius: '50%',
              transition: 'left 0.3s ease',
              display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: '10px',
            }}>
              {isDark ? '🌙' : '☀️'}
            </div>
          </div>

          {/* Profile avatar */}
          <div onClick={() => navigate('/profile')} style={{
            width: '34px', height: '34px',
            borderRadius: '50%',
            background: 'rgba(139,92,246,0.15)',
            border: `1px solid rgba(139,92,246,0.4)`,
            display: 'flex', alignItems: 'center',
            justifyContent: 'center', cursor: 'pointer',
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: '14px', color: theme.blue,
            fontWeight: '700',
            boxShadow: '0 0 10px rgba(139,92,246,0.2)',
          }}>
            {initial}
          </div>

          {/* Logout */}
          <button onClick={logout} style={{
            background: 'transparent',
            border: `1px solid ${theme.red}`,
            borderRadius: '6px', padding: '6px 14px',
            color: theme.red, fontSize: '11px',
            letterSpacing: '1.5px', cursor: 'pointer',
          }}>
            LOGOUT
          </button>
        </div>

        {/* Mobile right */}
        <div className="mobile-only" style={{ display: 'none', alignItems: 'center', gap: '10px' }}>
          <div onClick={() => navigate('/profile')} style={{
            width: '30px', height: '30px',
            borderRadius: '50%',
            background: 'rgba(139,92,246,0.15)',
            border: `1px solid rgba(139,92,246,0.4)`,
            display: 'flex', alignItems: 'center',
            justifyContent: 'center', cursor: 'pointer',
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: '12px', color: theme.blue,
          }}>
            {initial}
          </div>
          <button onClick={() => setMenuOpen(!menuOpen)} style={{
            background: 'transparent',
            border: `1px solid ${theme.border}`,
            borderRadius: '6px', padding: '6px 10px',
            cursor: 'pointer', color: theme.text, fontSize: '1.1rem',
          }}>
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="mobile-only" style={{
          display: 'flex', flexDirection: 'column',
          background: theme.card,
          borderBottom: `1px solid ${theme.border}`,
          padding: '12px 24px', gap: '4px', zIndex: 99,
        }}>
          {navLinks.map(link => (
            <Link key={link.to} to={link.to}
              onClick={() => setMenuOpen(false)}
              style={{
                color: theme.blue, textDecoration: 'none',
                fontFamily: "'Share Tech Mono', monospace",
                fontSize: '12px', letterSpacing: '1.5px',
                padding: '10px 0',
                borderBottom: `1px solid ${theme.border}`,
              }}
            >
              {link.label}
            </Link>
          ))}
          <button onClick={logout} style={{
            background: 'transparent',
            border: `1px solid ${theme.red}`,
            borderRadius: '6px', color: theme.red,
            padding: '10px', cursor: 'pointer',
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: '11px', letterSpacing: '1.5px',
            marginTop: '8px',
          }}>
            LOGOUT
          </button>
        </div>
      )}
    </>
  )
}