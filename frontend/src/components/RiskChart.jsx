import {
  PieChart, Pie, Cell, Tooltip,
  Legend, ResponsiveContainer
} from 'recharts'

const COLORS = {
  safe:     '#2dd4bf',
  moderate: '#f59e0b',
  high:     '#f43f5e',
}

export default function RiskChart({ data }) {
  if (!data || data.length === 0) {
    return <EmptyState />
  }

  const counts = { safe: 0, moderate: 0, high: 0 }
  data.forEach(d => {
    const level = d.risk_status?.toLowerCase()
    if (counts[level] !== undefined) counts[level]++
  })

  const chartData = [
    { name: 'Safe',     value: counts.safe,     key: 'safe'     },
    { name: 'Moderate', value: counts.moderate, key: 'moderate' },
    { name: 'High',     value: counts.high,     key: 'high'     },
  ].filter(d => d.value > 0)

  if (chartData.length === 0) return <EmptyState />

  return (
    <ResponsiveContainer width="100%" height={240}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={58}
          outerRadius={88}
          paddingAngle={3}
          dataKey="value"
        >
          {chartData.map((entry) => (
            <Cell
              key={entry.key}
              fill={COLORS[entry.key]}
              stroke="rgba(13,10,26,0.8)"
              strokeWidth={2}
            />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            background: '#13102a',
            border: '1px solid rgba(139,92,246,0.25)',
            borderRadius: '6px',
            color: '#ede9fe',
            fontSize: '11px',
            fontFamily: "'Share Tech Mono', monospace",
            letterSpacing: '0.5px',
          }}
          formatter={(value, name) => [value, name.toUpperCase()]}
        />
        <Legend
          iconType="circle"
          iconSize={7}
          formatter={(value) => (
            <span style={{
              color: 'rgba(139,92,246,0.55)',
              fontSize: '10px',
              fontFamily: "'Share Tech Mono', monospace",
              letterSpacing: '1px',
              textTransform: 'uppercase',
            }}>
              {value}
            </span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}

function EmptyState() {
  return (
    <div style={{
      height: '240px', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: '10px',
    }}>
      <div style={{ fontSize: '1.8rem', opacity: 0.3 }}>📊</div>
      <div style={{
        fontFamily: "'Share Tech Mono', monospace",
        color: 'rgba(139,92,246,0.35)',
        fontSize: '10px', letterSpacing: '2px',
      }}>
        // no risk data yet
      </div>
    </div>
  )
}