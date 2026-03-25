import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTheme } from '../ThemeContext'

export default function Navbar() {
  const navigate = useNavigate()
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
    { to: '/detector',  label: 'AI Detector' },
    { to: '/analytics', label: 'Analytics' },
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
        <Link to="/dashboard" style={{ textDecoration: 'none' }}>
          <span style={{ color: theme.text, fontWeight: '800', fontSize: '1.2rem', letterSpacing: '-0.5px' }}>
            🛡️ AnonMitra
          </span>
        </Link>

        {/* Desktop links */}
        <div className="desktop-only" style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          {navLinks.map(link => (
            <Link key={link.to} to={link.to} style={{
              color: theme.muted,
              textDecoration: 'none',
              fontSize: '0.9rem',
              fontWeight: '500',
            }}>
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="desktop-only" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          
          {/* Theme Slider */}
          <div
            onClick={toggleTheme}
            style={{
              width: '52px',
              height: '28px',
              background: isDark ? theme.blue : '#e2e8f0',
              borderRadius: '99px',
              cursor: 'pointer',
              position: 'relative',
              transition: 'background 0.3s ease',
              flexShrink: 0,
            }}
          >
            <div style={{
              position: 'absolute',
              top: '4px',
              left: isDark ? '28px' : '4px',
              width: '20px',
              height: '20px',
              background: '#fff',
              borderRadius: '50%',
              transition: 'left 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '11px',
            }}>
              {isDark ? '🌙' : '☀️'}
            </div>
          </div>

          {/* Profile Avatar */}
          <div
            onClick={() => navigate('/profile')}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: theme.blue + '30',
              border: `2px solid ${theme.blue}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontWeight: '700',
              fontSize: '0.9rem',
              color: theme.blue,
              flexShrink: 0,
            }}
            title="Profile"
          >
            {initial}
          </div>

          {/* Logout */}
          <button onClick={logout} style={{
            background: theme.red + '20',
            color: theme.red,
            border: `1px solid ${theme.red}`,
            borderRadius: '8px',
            padding: '6px 16px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '0.85rem',
          }}>
            Logout
          </button>
        </div>

        {/* Mobile right */}
        <div className="mobile-only" style={{ display: 'none', alignItems: 'center', gap: '10px' }}>
          <div
            onClick={toggleTheme}
            style={{
              width: '44px', height: '24px',
              background: isDark ? theme.blue : '#e2e8f0',
              borderRadius: '99px', cursor: 'pointer',
              position: 'relative', transition: 'background 0.3s ease',
            }}
          >
            <div style={{
              position: 'absolute', top: '3px',
              left: isDark ? '22px' : '3px',
              width: '18px', height: '18px',
              background: '#fff', borderRadius: '50%',
              transition: 'left 0.3s ease',
              display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: '10px',
            }}>
              {isDark ? '🌙' : '☀️'}
            </div>
          </div>
          <div
            onClick={() => navigate('/profile')}
            style={{
              width: '32px', height: '32px',
              borderRadius: '50%',
              background: theme.blue + '30',
              border: `2px solid ${theme.blue}`,
              display: 'flex', alignItems: 'center',
              justifyContent: 'center', cursor: 'pointer',
              fontWeight: '700', fontSize: '0.85rem',
              color: theme.blue,
            }}
          >
            {initial}
          </div>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              background: 'transparent',
              border: `1px solid ${theme.border}`,
              borderRadius: '6px', padding: '6px 10px',
              cursor: 'pointer', color: theme.text, fontSize: '1.2rem',
            }}
          >
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
            <Link
              key={link.to} to={link.to}
              onClick={() => setMenuOpen(false)}
              style={{
                color: theme.blue, textDecoration: 'none',
                fontSize: '0.95rem', fontWeight: '500',
                padding: '10px 0',
                borderBottom: `1px solid ${theme.border}`,
              }}
            >
              {link.label}
            </Link>
          ))}
          <Link
            to="/profile"
            onClick={() => setMenuOpen(false)}
            style={{
              color: theme.blue, textDecoration: 'none',
              fontSize: '0.95rem', fontWeight: '500',
              padding: '10px 0',
              borderBottom: `1px solid ${theme.border}`,
            }}
          >
            Profile
          </Link>
          <button onClick={logout} style={{
            background: theme.red, color: '#fff',
            border: 'none', borderRadius: '6px',
            padding: '10px', cursor: 'pointer',
            fontWeight: '600', marginTop: '8px',
          }}>
            Logout
          </button>
        </div>
      )}
    </>
  )
}