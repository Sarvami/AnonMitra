import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { register } from '../api/auth'
import { useTheme } from '../ThemeContext'

// Fix <option> background — inline styles don't work on <option> tags in browsers
const optionStyle = `
  select option {
    background: #1a1528 !important;
    color: #ede9fe !important;
  }
  select:focus option {
    background: #1a1528 !important;
  }
`

export default function Register() {
  const navigate = useNavigate()
  const { theme, isDark, toggleTheme } = useTheme()
  const [form, setForm] = useState({
    email: '', password: '', fullName: '', phone: '', dob: '', country: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await register({ email: form.email, password: form.password })
      localStorage.setItem('userProfile', JSON.stringify({
        fullName: form.fullName, phone: form.phone,
        dob: form.dob, country: form.country, email: form.email,
      }))
      navigate('/login')
    } catch (err) {
      const detail = err.response?.data?.detail
      setError(typeof detail === 'string' ? detail : 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    width: '100%', background: theme.input,
    border: `1px solid ${theme.border}`,
    borderRadius: '6px', padding: '10px 12px',
    color: theme.text, fontSize: '13px', outline: 'none',
    boxSizing: 'border-box', transition: 'border-color 0.2s',
    fontFamily: "'Share Tech Mono', monospace",
  }

  const labelStyle = {
    display: 'block', marginBottom: '6px',
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: '10px', letterSpacing: '2px',
    textTransform: 'uppercase', color: theme.muted,
  }

  const onFocus = (e) => { e.target.style.borderColor = 'rgba(139,92,246,0.55)' }
  const onBlur  = (e) => { e.target.style.borderColor = theme.border }

  return (
    <div style={{
      minHeight: '100vh', background: theme.bg,
      display: 'flex', alignItems: 'center',
      justifyContent: 'center', padding: '32px 16px',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Inject option styles — only way to style <option> tags */}
      <style>{optionStyle}</style>

      {/* Grid bg */}
      <div className="grid-bg" style={{ position: 'absolute', inset: 0, opacity: 0.6 }} />

      {/* Glow orb */}
      <div style={{
        position: 'absolute', width: '500px', height: '500px',
        borderRadius: '50%',
        background: `radial-gradient(circle, ${theme.glow} 0%, transparent 70%)`,
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)', pointerEvents: 'none',
      }} />

      {/* Theme toggle */}
      <button onClick={toggleTheme} style={{
        position: 'fixed', top: '16px', right: '16px',
        background: theme.input, border: `1px solid ${theme.border}`,
        borderRadius: '6px', padding: '6px 12px',
        cursor: 'pointer', fontSize: '1rem', color: theme.text, zIndex: 10,
      }}>
        {isDark ? '☀️' : '🌙'}
      </button>

      {/* Card */}
      <div style={{
        position: 'relative', background: theme.card,
        border: `1px solid ${theme.border}`, borderRadius: '14px',
        padding: '40px', width: '100%', maxWidth: '460px',
        boxShadow: `0 0 40px ${theme.glow}`,
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '2.2rem', marginBottom: '12px', filter: 'drop-shadow(0 0 12px rgba(139,92,246,0.5))' }}>🛡️</div>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: '2px', marginBottom: '8px' }}>
            <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '26px', color: theme.text }}>Anon</span>
            <span style={{ fontFamily: "'Noto Sans Devanagari', sans-serif", fontSize: '24px', fontWeight: '800', color: theme.teal }}>मित्र</span>
          </div>
          <div style={{
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: '10px', color: theme.faint,
            letterSpacing: '3px', textTransform: 'uppercase',
          }}>
            <span style={{ color: 'rgba(45,212,191,0.35)' }}>[ </span>
            create new identity
            <span style={{ color: 'rgba(45,212,191,0.35)' }}> ]</span>
          </div>
        </div>

        {error && (
          <div style={{
            background: theme.red + '15', border: `1px solid ${theme.red}`,
            color: theme.red, borderRadius: '6px', padding: '10px 12px',
            marginBottom: '20px', fontSize: '12px',
            fontFamily: "'Share Tech Mono', monospace", letterSpacing: '0.5px',
          }}>
            ⚠ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

          {/* Full Name */}
          <div>
            <label style={labelStyle}>Full Name</label>
            <input style={inputStyle} type="text" placeholder="Jane Doe"
              value={form.fullName} onChange={update('fullName')}
              onFocus={onFocus} onBlur={onBlur} />
          </div>

          {/* Email */}
          <div>
            <label style={labelStyle}>Email <span style={{ color: theme.red }}>*</span></label>
            <input style={inputStyle} type="email" placeholder="user@domain.com"
              value={form.email} onChange={update('email')} required
              onFocus={onFocus} onBlur={onBlur} />
          </div>

          {/* Password */}
          <div>
            <label style={labelStyle}>Password <span style={{ color: theme.red }}>*</span></label>
            <input style={inputStyle} type="password" placeholder="min. 8 characters"
              value={form.password} onChange={update('password')} required
              onFocus={onFocus} onBlur={onBlur} />
          </div>

          {/* Phone + DOB */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={labelStyle}>Phone</label>
              <input style={inputStyle} type="tel" placeholder="+91 98765 43210"
                value={form.phone} onChange={update('phone')}
                onFocus={onFocus} onBlur={onBlur} />
            </div>
            <div>
              <label style={labelStyle}>Date of Birth</label>
              <input style={{ ...inputStyle, colorScheme: isDark ? 'dark' : 'light' }}
                type="date" value={form.dob} onChange={update('dob')}
                onFocus={onFocus} onBlur={onBlur} />
            </div>
          </div>

          {/* Country */}
          <div>
            <label style={labelStyle}>Country</label>
            <select
              style={{
                ...inputStyle,
                cursor: 'pointer',
                background: '#1a1528',   /* dark bg for the select box itself */
                color: '#ede9fe',        /* always light text */
                colorScheme: 'dark',     /* tells browser to use dark scrollbar/chrome */
              }}
              value={form.country} onChange={update('country')}
              onFocus={onFocus} onBlur={onBlur}
            >
              <option value="">-- select --</option>
              <option value="IN">🇮🇳 India</option>
              <option value="US">🇺🇸 United States</option>
              <option value="GB">🇬🇧 United Kingdom</option>
              <option value="CA">🇨🇦 Canada</option>
              <option value="AU">🇦🇺 Australia</option>
              <option value="DE">🇩🇪 Germany</option>
              <option value="FR">🇫🇷 France</option>
              <option value="JP">🇯🇵 Japan</option>
              <option value="SG">🇸🇬 Singapore</option>
              <option value="AE">🇦🇪 UAE</option>
              <option value="OTHER">🌍 Other</option>
            </select>
          </div>

          <button
            type="submit" disabled={loading}
            style={{
              width: '100%',
              background: 'linear-gradient(135deg, #7c3aed, #0d9488)',
              border: 'none', borderRadius: '6px',
              padding: '11px', color: '#fff',
              fontSize: '13px', letterSpacing: '2px',
              cursor: 'pointer', marginTop: '4px',
              fontFamily: "'Share Tech Mono', monospace",
            }}
          >
            {loading ? 'INITIALIZING...' : 'CREATE_ACCOUNT →'}
          </button>
        </form>

        <div style={{
          textAlign: 'center', marginTop: '20px',
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: '11px', color: theme.faint, letterSpacing: '1px',
        }}>
          already registered?{' '}
          <Link to="/login" style={{ color: theme.blue, textDecoration: 'none' }}>sign in →</Link>
        </div>
      </div>
    </div>
  )
}