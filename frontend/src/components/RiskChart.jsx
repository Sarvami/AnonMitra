import {
  PieChart, Pie, Cell, Tooltip,
  Legend, ResponsiveContainer
} from 'recharts'

const COLORS = {
  safe:     '#a6e3a1',
  moderate: '#f9e2af',
  high:     '#f38ba8',
}

export default function RiskChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div style={emptyStyle}>
        <p style={{ fontSize: '1.5rem' }}>📊</p>
        <p style={{ color: '#6c7086', fontSize: '0.85rem' }}>No risk data yet</p>
      </div>
    )
  }

  // Count identities by risk level
  const counts = { safe: 0, moderate: 0, high: 0 }
  data.forEach(d => {
    const level = d.risk_status?.toLowerCase()
    if (counts[level] !== undefined) counts[level]++
  })

  const chartData = [
    { name: '🟢 Safe',      value: counts.safe,     key: 'safe'     },
    { name: '🟡 Moderate',  value: counts.moderate, key: 'moderate' },
    { name: '🔴 High Risk', value: counts.high,     key: 'high'     },
  ].filter(d => d.value > 0)

  return (
    <ResponsiveContainer width="100%" height={240}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={90}
          paddingAngle={4}
          dataKey="value"
        >
          {chartData.map((entry) => (
            <Cell
              key={entry.key}
              fill={COLORS[entry.key]}
              stroke="transparent"
            />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            background: '#1e1e2e',
            border: '1px solid #313244',
            borderRadius: '8px',
            color: '#cdd6f4',
            fontSize: '0.85rem',
          }}
        />
        <Legend
          iconType="circle"
          iconSize={10}
          formatter={(value) => (
            <span style={{ color: '#a6adc8', fontSize: '0.82rem' }}>{value}</span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}

const emptyStyle = {
  height: '240px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
}