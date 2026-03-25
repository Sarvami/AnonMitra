export default function RiskBadge({ level }) {
  const config = {
    safe:     { emoji: '🟢', label: 'Safe',      color: '#22c55e' },
    moderate: { emoji: '🟡', label: 'Moderate',  color: '#eab308' },
    high:     { emoji: '🔴', label: 'High Risk', color: '#ef4444' },
  }

  const badge = config[level?.toLowerCase()] || config.safe

  return (
    <span style={{
      color: badge.color,
      fontWeight: '600',
      fontSize: '0.85rem',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px'
    }}>
      {badge.emoji} {badge.label}
    </span>
  )
}