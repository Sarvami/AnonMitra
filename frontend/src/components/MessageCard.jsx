import { useState } from 'react'
import RiskBadge from './RiskBadge'
import { useTheme } from '../ThemeContext'
import { toggleSpam } from '../api/messages'

export default function MessageCard({ message, onToggleSpam }) {
  const { theme } = useTheme()
  const [loading, setLoading] = useState(false)

  const isSpam = message.is_spam
  const riskLevel =
    message.risk_score >= 0.7 ? 'high' :
    message.risk_score >= 0.4 ? 'moderate' : 'safe'

  const handleToggle = async () => {
    setLoading(true)
    try {
      const res = await toggleSpam(message.id)
      if (onToggleSpam) {
        onToggleSpam(res.data)
      }
    } catch {
      alert('Failed to update spam status')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      background: isSpam ? 'rgba(244,63,94,0.04)' : 'rgba(139,92,246,0.04)',
      border: `1px solid ${isSpam ? 'rgba(244,63,94,0.2)' : 'rgba(139,92,246,0.15)'}`,
      borderRadius: '8px',
      padding: '14px 16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      transition: 'border-color 0.15s ease',
    }}>

      {/* Top row: subject + risk badge */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
        <span style={{
          fontFamily: "'Share Tech Mono', monospace",
          color: theme.text, fontSize: '12px',
          letterSpacing: '0.3px', fontWeight: '600',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {message.subject || '// no subject'}
        </span>
        <RiskBadge level={riskLevel} />
      </div>

      {/* Sender */}
      <div style={{
        fontFamily: "'Share Tech Mono', monospace",
        color: 'rgba(139,92,246,0.55)',
        fontSize: '10px', letterSpacing: '1px',
      }}>
        from: <span style={{ color: '#2dd4bf' }}>{message.sender}</span>
      </div>

      {/* Body */}
      <div style={{
        fontFamily: "'Inter', sans-serif",
        color: 'rgba(237,233,254,0.7)',
        fontSize: '13px', lineHeight: '1.6',
      }}>
        {message.body}
      </div>

      {/* Bottom row: timestamp + spam tag + feedback actions */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '2px',
        paddingTop: '8px',
        borderTop: '1px solid rgba(139,92,246,0.08)',
      }}>
        <span style={{
          fontFamily: "'Share Tech Mono', monospace",
          color: 'rgba(139,92,246,0.35)',
          fontSize: '10px', letterSpacing: '0.5px',
        }}>
          {new Date(message.received_at).toLocaleString()}
        </span>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={handleToggle}
            disabled={loading}
            style={{
              background: 'transparent',
              border: `1px solid ${isSpam ? 'rgba(45,212,191,0.35)' : 'rgba(244,63,94,0.35)'}`,
              color: isSpam ? theme.teal : theme.red,
              borderRadius: '4px',
              padding: '3px 10px',
              cursor: 'pointer',
              fontSize: '9px',
              fontFamily: "'Share Tech Mono', monospace",
              letterSpacing: '1px',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={e => {
              e.target.style.background = isSpam ? 'rgba(45,212,191,0.08)' : 'rgba(244,63,94,0.08)'
            }}
            onMouseLeave={e => {
              e.target.style.background = 'transparent'
            }}
          >
            {loading ? 'SCALING...' : isSpam ? 'MARK_CLEAN ✓' : 'REPORT_SPAM ⚠'}
          </button>
          
          <span style={{
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: '9px', letterSpacing: '1.5px',
            color: isSpam ? '#f43f5e' : '#2dd4bf',
            background: isSpam ? 'rgba(244,63,94,0.1)' : 'rgba(45,212,191,0.1)',
            border: `1px solid ${isSpam ? 'rgba(244,63,94,0.3)' : 'rgba(45,212,191,0.3)'}`,
            borderRadius: '4px', padding: '2px 8px',
          }}>
            {isSpam ? '⚠ SPAM' : '✓ CLEAN'}
          </span>
        </div>
      </div>
    </div>
  )
}