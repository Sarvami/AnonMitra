import { useTheme } from '../ThemeContext'

export default function ConfirmModal({ message, onConfirm, onCancel }) {
  const { theme } = useTheme()

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0,
      width: '100vw', height: '100vh',
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
    }}>
      <div style={{
        background: theme.card,
        border: `1px solid ${theme.border}`,
        borderRadius: '14px',
        padding: '32px',
        maxWidth: '400px',
        width: '90%',
        textAlign: 'center',
        boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
      }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>🗑️</div>
        <h3 style={{ color: theme.text, fontWeight: '700', fontSize: '1.1rem', marginBottom: '8px' }}>
          Delete Identity
        </h3>
        <p style={{ color: theme.muted, fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '28px' }}>
          {message}
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button
            onClick={onCancel}
            style={{
              background: 'transparent',
              border: `1px solid ${theme.border}`,
              borderRadius: '8px',
              padding: '10px 24px',
              color: theme.muted,
              fontWeight: '600',
              fontSize: '0.9rem',
              cursor: 'pointer',
              minWidth: '100px',
            }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            style={{
              background: theme.red,
              border: 'none',
              borderRadius: '8px',
              padding: '10px 24px',
              color: '#fff',
              fontWeight: '700',
              fontSize: '0.9rem',
              cursor: 'pointer',
              minWidth: '100px',
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}