export default function RiskBadge({ level }) {
  const config = {
    safe:     { label: 'SAFE',     color: '#2dd4bf', bg: 'rgba(45,212,191,0.10)',  border: 'rgba(45,212,191,0.30)' },
    moderate: { label: 'MODERATE', color: '#f59e0b', bg: 'rgba(245,158,11,0.10)', border: 'rgba(245,158,11,0.30)' },
    high:     { label: 'HIGH',     color: '#f43f5e', bg: 'rgba(244,63,94,0.10)',  border: 'rgba(244,63,94,0.30)'  },
  }

  const badge = config[level?.toLowerCase()] || config.safe

  return (
    <span style={{
      color: badge.color,
      background: badge.bg,
      border: `1px solid ${badge.border}`,
      borderRadius: '4px',
      padding: '2px 9px',
      fontSize: '9px',
      letterSpacing: '1.5px',
      fontFamily: "'Share Tech Mono', monospace",
      display: 'inline-flex',
      alignItems: 'center',
      gap: '5px',
    }}>
      <span style={{
        width: '5px', height: '5px', borderRadius: '50%',
        background: badge.color, flexShrink: 0,
        boxShadow: `0 0 6px ${badge.color}`,
      }} />
      {badge.label}
    </span>
  )
}