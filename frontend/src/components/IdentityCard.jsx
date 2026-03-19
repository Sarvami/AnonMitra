import RiskBadge from './RiskBadge'
import { deleteIdentity } from '../api/identities'
import { useNavigate } from 'react-router-dom'

export default function IdentityCard({ identity, onDelete }) {
  const navigate = useNavigate()

  const handleDelete = async () => {
    try {
      await deleteIdentity(identity.id)
      onDelete(identity.id)
    } catch (err) {
      alert('Failed to delete identity')
    }
  }

  return (
    <div style={{
      background: '#1e1e2e',
      border: '1px solid #313244',
      borderRadius: '10px',
      padding: '16px 20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
    }}>
      {/* Top row — username + quick buttons */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: '#cdd6f4', fontWeight: '700' }}>{identity.username}</span>
        <div style={{ display: 'flex', gap: '6px' }}>
          <button onClick={() => navigate('/inbox')} style={iconBtnStyle} title="Inbox">📬</button>
          <button onClick={() => navigate('/analytics')} style={iconBtnStyle} title="Analytics">📊</button>
        </div>
      </div>

      {/* Risk Badge */}
      <RiskBadge level={identity.risk_badge} />

      {/* Email */}
      <div style={{ color: '#89b4fa', fontSize: '0.85rem' }}>
        📧 {identity.alias_email}
      </div>

      {/* Platform */}
      <div style={{ color: '#a6adc8', fontSize: '0.8rem' }}>
        🏷️ {identity.platform}
      </div>

      {/* Bottom row — date + delete */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
        <span style={{ color: '#6c7086', fontSize: '0.75rem' }}>
          Created: {new Date(identity.created_at).toLocaleDateString()}
        </span>
        <button onClick={handleDelete} style={deleteBtnStyle}>
          Delete
        </button>
      </div>
    </div>
  )
}

const iconBtnStyle = {
  background: '#313244',
  border: '1px solid #45475a',
  borderRadius: '6px',
  padding: '4px 8px',
  cursor: 'pointer',
  fontSize: '0.85rem',
}

const deleteBtnStyle = {
  background: 'transparent',
  border: '1px solid #f38ba8',
  color: '#f38ba8',
  borderRadius: '6px',
  padding: '4px 12px',
  cursor: 'pointer',
  fontSize: '0.8rem',
}