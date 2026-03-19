import { Link, useNavigate } from 'react-router-dom'

export default function Navbar() {
  const navigate = useNavigate()

  const logout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <nav style={{
  background: '#1e1e2e',
  padding: '12px 32px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  borderBottom: '1px solid #313244',
}}>
      <span style={{ color: '#cdd6f4', fontWeight: '700', fontSize: '1.2rem' }}>
        🛡️ AnonMitra
      </span>
      <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
        <Link to="/dashboard" style={linkStyle}>Dashboard</Link>
        <Link to="/inbox"     style={linkStyle}>Inbox</Link>
        <Link to="/detector"  style={linkStyle}>AI Detector</Link>
        <Link to="/analytics" style={linkStyle}>Analytics</Link>
        <button onClick={logout} style={btnStyle}>Logout</button>
      </div>
    </nav>
  )
}

const linkStyle = {
  color: '#89b4fa',
  textDecoration: 'none',
  fontSize: '0.95rem',
  fontWeight: '500'
}

const btnStyle = {
  background: '#f38ba8',
  color: '#1e1e2e',
  border: 'none',
  borderRadius: '6px',
  padding: '6px 16px',
  cursor: 'pointer',
  fontWeight: '600'
}
