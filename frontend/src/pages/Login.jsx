import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { login } from '../api/auth'
import { useTheme } from '../ThemeContext'

export default function Login() {
  const navigate = useNavigate()
  const { theme, isDark, toggleTheme } = useTheme()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await login(form)
      localStorage.setItem('token', res.data.access_token)
      navigate('/dashboard')
    } catch (err) {
      const detail = err.response?.data?.detail
      setError(typeof detail === 'string' ? detail : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: theme.bg,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Grid bg */}
      <div className="grid-bg" style={{ position: 'absolute', inset: 0, opacity: 0.6 }} />

      {/* Glow orb */}
      <div style={{
        position: 'absolute',
        width: '500px', height: '500px',
        borderRadius: '50%',
        background: `radial-gradient(circle, ${theme.glow} 0%, transparent 70%)`,
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
      }} />

      {/* Theme toggle */}
      <button onClick={toggleTheme} style={{
        position: 'fixed', top: '16px', right: '16px',
        background: theme.input,
        border: `1px solid ${theme.border}`,
        borderRadius: '6px', padding: '6px 12px',
        cursor: 'pointer', fontSize: '1rem', color: theme.text,
        zIndex: 10,
      }}>
        {isDark ? '☀️' : '🌙'}
      </button>

      {/* Card */}
      <div style={{
        position: 'relative',
        background: theme.card,
        border: `1px solid ${theme.border}`,
        borderRadius: '14px',
        padding: '40px',
        width: '100%',
        maxWidth: '380px',
        boxShadow: `0 0 40px ${theme.glow}`,
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '12px', filter: 'drop-shadow(0 0 12px rgba(139,92,246,0.5))' }}>🛡️</div>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: '2px', marginBottom: '8px' }}>
            <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '28px', color: theme.text }}>Anon</span>
            <span style={{ fontFamily: "'Noto Sans Devanagari', sans-serif", fontSize: '26px', fontWeight: '800', color: theme.teal }}>मित्र</span>
          </div>
          <div style={{
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: '10px', color: theme.faint,
            letterSpacing: '3px', textTransform: 'uppercase',
          }}>
            <span style={{ color: 'rgba(45,212,191,0.35)' }}>[ </span>
            secure access
            <span style={{ color: 'rgba(45,212,191,0.35)' }}> ]</span>
          </div>
        </div>

        {error && (
          <div style={{
            background: theme.red + '15',
            border: `1px solid ${theme.red}`,
            color: theme.red,
            borderRadius: '6px', padding: '10px 12px',
            marginBottom: '20px', fontSize: '12px',
            fontFamily: "'Share Tech Mono', monospace",
            letterSpacing: '0.5px',
          }}>
            ⚠ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{
              display: 'block', marginBottom: '6px',
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: '10px', letterSpacing: '2px',
              textTransform: 'uppercase', color: theme.muted,
            }}>Email</label>
            <input
              style={{
                width: '100%', background: theme.input,
                border: `1px solid ${theme.border}`,
                borderRadius: '6px', padding: '10px 12px',
                color: theme.text, fontSize: '13px', outline: 'none',
                boxSizing: 'border-box',
                transition: 'border-color 0.2s',
              }}
              type="email"
              placeholder="user@domain.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              onFocus={e => e.target.style.borderColor = 'rgba(139,92,246,0.55)'}
              onBlur={e => e.target.style.borderColor = 'rgba(139,92,246,0.18)'}
            />
          </div>
          <div>
            <label style={{
              display: 'block', marginBottom: '6px',
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: '10px', letterSpacing: '2px',
              textTransform: 'uppercase', color: theme.muted,
            }}>Password</label>
            <input
              style={{
                width: '100%', background: theme.input,
                border: `1px solid ${theme.border}`,
                borderRadius: '6px', padding: '10px 12px',
                color: theme.text, fontSize: '13px', outline: 'none',
                boxSizing: 'border-box',
                transition: 'border-color 0.2s',
              }}
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              onFocus={e => e.target.style.borderColor = 'rgba(139,92,246,0.55)'}
              onBlur={e => e.target.style.borderColor = 'rgba(139,92,246,0.18)'}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              background: 'linear-gradient(135deg, #7c3aed, #0d9488)',
              border: 'none', borderRadius: '6px',
              padding: '11px', color: '#fff',
              fontSize: '13px', letterSpacing: '2px',
              cursor: 'pointer', marginTop: '4px',
            }}
          >
            {loading ? 'AUTHENTICATING...' : 'SIGN_IN →'}
          </button>
        </form>

        <div style={{
          textAlign: 'center', marginTop: '20px',
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: '11px', color: theme.faint, letterSpacing: '1px',
        }}>
          no account?{' '}
          <Link to="/register" style={{ color: theme.blue, textDecoration: 'none' }}>register →</Link>
        </div>
      </div>
    </div>
  )
}