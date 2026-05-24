import { useTheme } from '../ThemeContext'

export default function ConfirmModal({ message, onConfirm, onCancel }) {
  const { theme } = useTheme()

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0,
      width: '100vw', height: '100vh',
      background: 'rgba(0,0,0,0.7)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
    }}>
      <div style={{
        background: theme.card,
        border: `1px solid rgba(244,63,94,0.3)`,
        borderRadius: '12px',
        padding: '36px 32px',
        maxWidth: '400px',
        width: '90%',
        textAlign: 'center',
        boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 40px rgba(244,63,94,0.08)',
        animation: 'fadeIn 0.2s ease',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Top accent line */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
          background: 'linear-gradient(90deg, #f43f5e, #7c3aed)',
        }} />

        {/* Icon */}
        <div style={{
          width: '52px', height: '52px',
          borderRadius: '10px',
          background: 'rgba(244,63,94,0.1)',
          border: '1px solid rgba(244,63,94,0.3)',
          display: 'flex', alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px',
          fontSize: '1.5rem',
          boxShadow: '0 0 16px rgba(244,63,94,0.15)',
        }}>
          🗑️
        </div>

        {/* Title */}
        <div style={{
          fontFamily: "'Share Tech Mono', monospace",
          color: '#f43f5e',
          fontSize: '11px', letterSpacing: '3px',
          textTransform: 'uppercase', marginBottom: '12px',
        }}>
          // CONFIRM_DELETE
        </div>

        {/* Message */}
        <p style={{
          fontFamily: "'Share Tech Mono', monospace",
          color: theme.faint,
          fontSize: '12px', lineHeight: '1.8',
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
              padding: '9px 24px',
              color: theme.muted,
              fontSize: '11px', letterSpacing: '1.5px',
              cursor: 'pointer', minWidth: '110px',
              fontFamily: "'Share Tech Mono', monospace",
              transition: 'border-color 0.15s ease, color 0.15s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'rgba(139,92,246,0.5)'
              e.currentTarget.style.color = '#ede9fe'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = theme.border
              e.currentTarget.style.color = theme.muted
            }}
          >
            CANCEL
          </button>
          <button
            onClick={onConfirm}
            style={{
              background: 'rgba(244,63,94,0.12)',
              border: `1px solid rgba(244,63,94,0.4)`,
              borderRadius: '6px',
              padding: '9px 24px',
              color: '#f43f5e',
              fontSize: '11px', letterSpacing: '1.5px',
              cursor: 'pointer', minWidth: '110px',
              fontFamily: "'Share Tech Mono', monospace",
              transition: 'background 0.15s ease, border-color 0.15s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(244,63,94,0.22)'
              e.currentTarget.style.borderColor = 'rgba(244,63,94,0.7)'
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
