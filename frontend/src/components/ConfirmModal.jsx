import { useTheme } from '../ThemeContext'

export default function ConfirmModal({ message, onConfirm, onCancel }) {
  const { theme } = useTheme()

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0,
      width: '100vw', height: '100vh',
      background: 'rgba(0,0,0,0.65)',
      backdropFilter: 'blur(3px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
    }}>
      <div style={{
        background: theme.card,
        border: `1px solid rgba(244,63,94,0.25)`,
        borderRadius: '10px',
        padding: '32px 28px',
        maxWidth: '380px',
        width: '90%',
        textAlign: 'center',
        boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 30px rgba(244,63,94,0.06)',
        animation: 'fadeIn 0.2s ease',
      }}>
        {/* Icon */}
        <div style={{
          width: '48px', height: '48px',
          borderRadius: '8px',
          background: 'rgba(244,63,94,0.1)',
          border: '1px solid rgba(244,63,94,0.25)',
          display: 'flex', alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px',
          fontSize: '1.4rem',
        }}>
          🗑️
        </div>

        {/* Title */}
        <div style={{
          fontFamily: "'Share Tech Mono', monospace",
          color: '#f43f5e',
          fontSize: '11px', letterSpacing: '2.5px',
          textTransform: 'uppercase', marginBottom: '10px',
        }}>
          CONFIRM_DELETE
        </div>

        {/* Message */}
        <p style={{
          fontFamily: "'Share Tech Mono', monospace",
          color: theme.faint,
          fontSize: '11px', lineHeight: '1.8',
          letterSpacing: '0.3px', marginBottom: '28px',
        }}>
          {message}
        </p>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <button
            onClick={onCancel}
            style={{
              background: 'transparent',
              border: `1px solid ${theme.border}`,
              borderRadius: '6px',
              padding: '9px 22px',
              color: theme.muted,
              fontSize: '11px', letterSpacing: '1.5px',
              cursor: 'pointer', minWidth: '100px',
              fontFamily: "'Share Tech Mono', monospace",
              transition: 'border-color 0.15s ease',
            }}
            onMouseEnter={e => e.target.style.borderColor = 'rgba(139,92,246,0.4)'}
            onMouseLeave={e => e.target.style.borderColor = theme.border}
          >
            CANCEL
          </button>
          <button
            onClick={onConfirm}
            style={{
              background: 'rgba(244,63,94,0.12)',
              border: `1px solid rgba(244,63,94,0.4)`,
              borderRadius: '6px',
              padding: '9px 22px',
              color: '#f43f5e',
              fontSize: '11px', letterSpacing: '1.5px',
              cursor: 'pointer', minWidth: '100px',
              fontFamily: "'Share Tech Mono', monospace",
              transition: 'background 0.15s ease, border-color 0.15s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(244,63,94,0.2)'
              e.currentTarget.style.borderColor = 'rgba(244,63,94,0.65)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(244,63,94,0.12)'
              e.currentTarget.style.borderColor = 'rgba(244,63,94,0.4)'
            }}
          >
            DELETE
          </button>
        </div>
      </div>
    </div>
  )
}