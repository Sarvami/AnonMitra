import { useState } from 'react'
import { useTheme } from '../ThemeContext'

export function useToast() {
  const [toasts, setToasts] = useState([])

  const addToast = (message, type = 'success') => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 3000)
  }

  return { toasts, addToast }
}

export function ToastContainer({ toasts }) {
  const { theme } = useTheme()

  const typeConfig = {
    success: { color: '#2dd4bf',  border: 'rgba(45,212,191,0.4)',  label: 'OK'   },
    error:   { color: '#f43f5e',  border: 'rgba(244,63,94,0.4)',   label: 'ERR'  },
    info:    { color: '#8b5cf6',  border: 'rgba(139,92,246,0.4)',  label: 'INF'  },
    warning: { color: '#f59e0b',  border: 'rgba(245,158,11,0.4)',  label: 'WARN' },
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      zIndex: 99999,
    }}>
      {toasts.map(toast => {
        const c = typeConfig[toast.type] || typeConfig.success
        return (
          <div key={toast.id} style={{
            background: theme.card,
            border: `1px solid ${c.border}`,
            borderLeft: `3px solid ${c.color}`,
            borderRadius: '6px',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            minWidth: '260px',
            maxWidth: '340px',
            boxShadow: `0 8px 28px rgba(0,0,0,0.25), 0 0 12px ${c.color}18`,
            animation: 'slideIn 0.25s ease',
          }}>
            {/* Type tag */}
            <span style={{
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: '8px', letterSpacing: '1.5px',
              color: c.color,
              background: c.color + '15',
              border: `1px solid ${c.border}`,
              borderRadius: '3px',
              padding: '2px 6px',
              flexShrink: 0,
            }}>
              {c.label}
            </span>

            {/* Message */}
            <span style={{
              fontFamily: "'Share Tech Mono', monospace",
              color: theme.text,
              fontSize: '11px',
              letterSpacing: '0.3px',
              lineHeight: '1.5',
            }}>
              {toast.message}
            </span>
          </div>
        )
      })}
    </div>
  )
}