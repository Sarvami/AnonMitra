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
  const [hovered, setHovered] = useState(false)

  const handleDelete = async () => {
    try {
      await deleteIdentity(identity.id)
      onDelete(identity.id)
    } catch {
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

      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: theme.card,
          border: `1px solid ${hovered ? 'rgba(139,92,246,0.35)' : theme.border}`,
          borderRadius: '10px',
          padding: '16px 18px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
          boxShadow: hovered ? '0 0 18px rgba(139,92,246,0.12)' : 'none',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Top accent line */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
          background: 'linear-gradient(90deg, #7c3aed, #0d9488)',
          opacity: hovered ? 1 : 0,
          transition: 'opacity 0.2s ease',
        }} />

        {/* Top row — username + nav buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{
            fontFamily: "'Share Tech Mono', monospace",
            color: theme.text, fontSize: '13px',
            letterSpacing: '0.5px', fontWeight: '700',
          }}>
            {identity.username}
          </span>
          <div style={{ display: 'flex', gap: '6px' }}>
            <IconBtn onClick={() => navigate('/inbox')} title="Inbox" theme={theme}>📬</IconBtn>
            <IconBtn onClick={() => navigate('/analytics')} title="Analytics" theme={theme}>📊</IconBtn>
          </div>
        </div>

        {/* Risk badge */}
        <div>
          <RiskBadge level={identity.risk_badge} />
        </div>

        {/* Divider */}
        <div style={{ height: '1px', background: theme.border, opacity: 0.5 }} />

        {/* Email */}
        <div style={{
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: '11px', letterSpacing: '0.3px',
        }}>
          <span style={{ color: 'rgba(139,92,246,0.4)' }}>email: </span>
          <span style={{ color: '#2dd4bf' }}>{identity.alias_email}</span>
        </div>

        {/* Platform */}
        <div style={{
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: '11px', letterSpacing: '0.3px',
        }}>
          <span style={{ color: 'rgba(139,92,246,0.4)' }}>platform: </span>
          <span style={{ color: theme.muted }}>{identity.platform}</span>
        </div>

        {/* Bottom row — date + delete */}
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', marginTop: '4px',
          paddingTop: '10px', borderTop: `1px solid ${theme.border}`,
          opacity: 0.8,
        }}>
          <span style={{
            fontFamily: "'Share Tech Mono', monospace",
            color: 'rgba(139,92,246,0.35)',
            fontSize: '9px', letterSpacing: '1px',
          }}>
            {new Date(identity.created_at).toLocaleDateString()}
          </span>
          <button
            onClick={() => setShowConfirm(true)}
            style={{
              background: 'transparent',
              border: `1px solid rgba(244,63,94,0.35)`,
              color: '#f43f5e',
              borderRadius: '4px',
              padding: '3px 12px',
              cursor: 'pointer',
              fontSize: '9px',
              letterSpacing: '1.5px',
              fontFamily: "'Share Tech Mono', monospace",
              transition: 'background 0.15s ease, border-color 0.15s ease',
            }}
            onMouseEnter={e => {
              e.target.style.background = 'rgba(244,63,94,0.1)'
              e.target.style.borderColor = 'rgba(244,63,94,0.6)'
            }}
            onMouseLeave={e => {
              e.target.style.background = 'transparent'
              e.target.style.borderColor = 'rgba(244,63,94,0.35)'
            }}
          >
            DELETE
          </button>
        </div>
      </div>
    </>
  )
}

function IconBtn({ onClick, title, theme, children }) {
  return (
    <button
      onClick={onClick}
      title={title}
      style={{
        background: theme.input,
        border: `1px solid ${theme.border}`,
        borderRadius: '5px',
        padding: '4px 8px',
        cursor: 'pointer',
        fontSize: '0.8rem',
        lineHeight: 1,
        transition: 'border-color 0.15s ease',
      }}
      onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(139,92,246,0.45)'}
      onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(139,92,246,0.18)'}
    >
      {children}
    </button>
  )
}