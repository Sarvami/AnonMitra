import RiskBadge from './RiskBadge'

export default function MessageCard({ message }) {
  return (
    <div style={{
      background: '#1e1e2e',
      border: '1px solid #313244',
      borderRadius: '10px',
      padding: '16px 20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: '#cdd6f4', fontWeight: '600' }}>{message.subject || '(No Subject)'}</span>
        <RiskBadge level={message.risk_score >= 0.7 ? 'high' : message.risk_score >= 0.4 ? 'moderate' : 'safe'} />
      </div>
      <div style={{ color: '#a6adc8', fontSize: '0.85rem' }}>From: {message.sender}</div>
      <div style={{ color: '#cdd6f4', fontSize: '0.9rem', lineHeight: '1.5' }}>{message.body}</div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
        <span style={{ color: '#6c7086', fontSize: '0.75rem' }}>
          {new Date(message.received_at).toLocaleString()}
        </span>
        <span style={{
          fontSize: '0.78rem',
          color: message.is_spam ? '#f38ba8' : '#a6e3a1',
          fontWeight: '600'
        }}>
          {message.is_spam ? '🚨 Spam' : '✅ Clean'}
        </span>
      </div>
    </div>
  )
}