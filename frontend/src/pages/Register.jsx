import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { register } from '../api/auth'
import { useTheme } from '../ThemeContext'

export default function Register() {
  const navigate = useNavigate()
  const { theme, isDark, toggleTheme } = useTheme()
  const [form, setForm] = useState({
    email: '',
    password: '',
    fullName: '',
    phone: '',
    dob: '',
    country: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      // Send only what backend accepts
      await register({ email: form.email, password: form.password })

      // Store extra fields locally
      localStorage.setItem('userProfile', JSON.stringify({
        fullName: form.fullName,
        phone: form.phone,
        dob: form.dob,
        country: form.country,
        email: form.email,
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
    background: theme.input,
    border: `1px solid ${theme.border}`,
    borderRadius: '8px',
    padding: '12px 16px',
    color: theme.text,
    fontSize: '0.95rem',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
    fontFamily: 'Inter, sans-serif',
  }

  const labelStyle = {
    color: theme.muted,
    fontSize: '0.8rem',
    fontWeight: '600',
    textAlign: 'left',
    display: 'block',
    marginBottom: '4px',
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: theme.bg,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '32px 16px',
    }}>
      {/* Theme toggle */}
      <button onClick={toggleTheme} style={{
        position: 'fixed', top: '16px', right: '16px',
        background: theme.card, border: `1px solid ${theme.border}`,
        borderRadius: '6px', padding: '6px 12px',
        cursor: 'pointer', fontSize: '1rem', color: theme.text,
      }}>
        {isDark ? '☀️' : '🌙'}
      </button>

      <div style={{
        background: theme.card,
        border: `1px solid ${theme.border}`,
        borderRadius: '14px',
        padding: '40px',
        width: '100%',
        maxWidth: '460px',
      }}>
        <h1 style={{ color: theme.text, fontSize: '1.8rem', fontWeight: '700', marginBottom: '8px', textAlign: 'center' }}>
          🛡️ AnonMitra
        </h1>
        <p style={{ color: theme.muted, marginBottom: '28px', fontSize: '0.95rem', textAlign: 'center' }}>
          Create your account
        </p>

        {error && (
          <div style={{
            background: theme.red + '20',
            border: `1px solid ${theme.red}`,
            color: theme.red,
            borderRadius: '8px', padding: '10px',
            marginBottom: '16px', fontSize: '0.85rem',
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Full Name */}
          <div>
            <label style={labelStyle}>Full Name</label>
            <input
              style={inputStyle}
              type="text"
              placeholder="Jane Doe"
              value={form.fullName}
              onChange={update('fullName')}
            />
          </div>

          {/* Email */}
          <div>
            <label style={labelStyle}>Email <span style={{ color: theme.red }}>*</span></label>
            <input
              style={inputStyle}
              type="email"
              placeholder="jane@example.com"
              value={form.email}
              onChange={update('email')}
              required
            />
          </div>

          {/* Password */}
          <div>
            <label style={labelStyle}>Password <span style={{ color: theme.red }}>*</span></label>
            <input
              style={inputStyle}
              type="password"
              placeholder="Min. 8 characters"
              value={form.password}
              onChange={update('password')}
              required
            />
          </div>

          {/* Phone + DOB side by side */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={labelStyle}>Phone Number</label>
              <input
                style={inputStyle}
                type="tel"
                placeholder="+91 98765 43210"
                value={form.phone}
                onChange={update('phone')}
              />
            </div>
            <div>
              <label style={labelStyle}>Date of Birth</label>
              <input
                style={inputStyle}
                type="date"
                value={form.dob}
                onChange={update('dob')}
              />
            </div>
          </div>

          {/* Country */}
          <div>
            <label style={labelStyle}>Country</label>
            <select
              style={{
                ...inputStyle,
                cursor: 'pointer',
              }}
              value={form.country}
              onChange={update('country')}
            >
              <option value="">Select your country</option>
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
            style={{
              background: theme.blue, color: '#fff',
              border: 'none', borderRadius: '8px',
              padding: '12px', fontWeight: '700',
              fontSize: '1rem', cursor: 'pointer', marginTop: '4px',
            }}
            type="submit"
            disabled={loading}
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p style={{ color: theme.muted, marginTop: '20px', fontSize: '0.9rem', textAlign: 'center' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: theme.blue, fontWeight: '600' }}>Login</Link>
        </p>
      </div>
    </div>
  )
}