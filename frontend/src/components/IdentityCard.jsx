import { useState } from 'react'
import RiskBadge from './RiskBadge'
import ConfirmModal from './ConfirmModal'
import { deleteIdentity } from '../api/identities'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../ThemeContext'

export default function IdentityCard({ identity, onDelete }) {
  const navigate = useNavigate()
  const { theme } = useTheme()
  const [showConfirm, setShowConfirm] = useState(false)

  const handleDelete = async () => {
    try {
      await deleteIdentity(identity.id)
      onDelete(identity.id)
    } catch (err) {
      alert('Failed to delete identity')
    } finally {
      setShowConfirm(false)
    }
  }

  return (
    <>
      {showConfirm && (
        <ConfirmModal
          message="Are you sure you want to delete this identity? This action cannot be undone."
          onConfirm={handleDelete}
          onCancel={() => setShowConfirm(false)}
        />
      )}

      <div style={{
        background: theme.card,
        border: `1px solid ${theme.border}`,
        borderRadius: '10px',
        padding: '16px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
      }}>
        {/* Top row — username + quick buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: theme.text, fontWeight: '700' }}>{identity.username}</span>
          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              onClick={() => navigate('/inbox')}
              style={{
                background: theme.input,
                border: `1px solid ${theme.border}`,
                borderRadius: '6px',
                padding: '4px 8px',
                cursor: 'pointer',
                fontSize: '0.85rem',
              }}
              title="Inbox"
            >
              📬
            </button>
            <button
              onClick={() => navigate('/analytics')}
              style={{
                background: theme.input,
                border: `1px solid ${theme.border}`,
                borderRadius: '6px',
                padding: '4px 8px',
                cursor: 'pointer',
                fontSize: '0.85rem',
              }}
              title="Analytics"
            >
              📊
            </button>
          </div>
        </div>

        {/* Risk Badge */}
        <RiskBadge level={identity.risk_badge} />

        {/* Email */}
        <div style={{ color: theme.blue, fontSize: '0.85rem' }}>
          📧 {identity.alias_email}
        </div>

        {/* Platform */}
        <div style={{ color: theme.muted, fontSize: '0.8rem' }}>
          🏷️ {identity.platform}
        </div>

        {/* Bottom row — date + delete */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
          <span style={{ color: theme.faint, fontSize: '0.75rem' }}>
            Created: {new Date(identity.created_at).toLocaleDateString()}
          </span>
          <button
            onClick={() => setShowConfirm(true)}
            style={{
              background: 'transparent',
              border: `1px solid ${theme.red}`,
              color: theme.red,
              borderRadius: '6px',
              padding: '4px 12px',
              cursor: 'pointer',
              fontSize: '0.8rem',
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </>
  )
}