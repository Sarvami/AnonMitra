import { useState, useEffect } from 'react'
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
    success: { bg: theme.green,  icon: '✅' },
    error:   { bg: theme.red,    icon: '❌' },
    info:    { bg: theme.blue,   icon: 'ℹ️' },
    warning: { bg: theme.yellow, icon: '⚠️' },
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      zIndex: 99999,
    }}>
      {toasts.map(toast => {
        const config = typeConfig[toast.type] || typeConfig.success
        return (
          <div key={toast.id} style={{
            background: theme.card,
            border: `1px solid ${theme.border}`,
            borderLeft: `4px solid ${config.bg}`,
            borderRadius: '10px',
            padding: '14px 18px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            minWidth: '280px',
            maxWidth: '360px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
            animation: 'slideIn 0.3s ease',
          }}>
            <span style={{ fontSize: '1.1rem' }}>{config.icon}</span>
            <span style={{ color: theme.text, fontSize: '0.9rem', fontWeight: '500' }}>
              {toast.message}
            </span>
          </div>
        )
      })}
    </div>
  )
}