import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { login } from '../api/auth'

export default function Login() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', password: '' })
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
    <div style={pageStyle}>
      <div style={cardStyle}>
        <h1 style={titleStyle}>🛡️ AnonMitra</h1>
        <p style={subtitleStyle}>Login to your account</p>

        {error && <div style={errorStyle}>{error}</div>}

        <form onSubmit={handleSubmit} style={formStyle}>
          <input
  style={inputStyle}
  type="email"
  placeholder="Email"
  value={form.email}
  onChange={(e) => setForm({ ...form, email: e.target.value })}
  required
/>
          <input
            style={inputStyle}
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          <button style={btnStyle} type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p style={{ color: '#a6adc8', marginTop: '16px', fontSize: '0.9rem' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: '#89b4fa' }}>Register</Link>
        </p>
      </div>
    </div>
  )
}

const pageStyle = {
  minHeight: '100vh',
  background: '#181825',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}

const cardStyle = {
  background: '#1e1e2e',
  border: '1px solid #313244',
  borderRadius: '14px',
  padding: '40px',
  width: '100%',
  maxWidth: '400px',
  textAlign: 'center',
}

const titleStyle = {
  color: '#cdd6f4',
  fontSize: '1.8rem',
  fontWeight: '700',
  marginBottom: '8px',
}

const subtitleStyle = {
  color: '#a6adc8',
  marginBottom: '24px',
  fontSize: '0.95rem',
}

const errorStyle = {
  background: '#f38ba820',
  border: '1px solid #f38ba8',
  color: '#f38ba8',
  borderRadius: '8px',
  padding: '10px',
  marginBottom: '16px',
  fontSize: '0.85rem',
}

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '14px',
}

const inputStyle = {
  background: '#313244',
  border: '1px solid #45475a',
  borderRadius: '8px',
  padding: '12px 16px',
  color: '#cdd6f4',
  fontSize: '0.95rem',
  outline: 'none',
}

const btnStyle = {
  background: '#89b4fa',
  color: '#1e1e2e',
  border: 'none',
  borderRadius: '8px',
  padding: '12px',
  fontWeight: '700',
  fontSize: '1rem',
  cursor: 'pointer',
  marginTop: '4px',
}