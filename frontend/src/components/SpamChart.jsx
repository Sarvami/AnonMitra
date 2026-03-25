import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from 'recharts'

export default function SpamChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div style={emptyStyle}>
        <p style={{ fontSize: '1.5rem' }}>📭</p>
        <p style={{ color: '#6c7086', fontSize: '0.85rem' }}>No spam data yet</p>
      </div>
    )
  }

  const chartData = data.map(d => ({
    name: d.username,
    spam: d.spam_count,
  }))

  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={chartData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#313244" />
        <XAxis
          dataKey="name"
          tick={{ fill: '#a6adc8', fontSize: 11 }}
          axisLine={{ stroke: '#45475a' }}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: '#a6adc8', fontSize: 11 }}
          axisLine={{ stroke: '#45475a' }}
          tickLine={false}
          allowDecimals={false}
        />
        <Tooltip
          contentStyle={{
            background: '#1e1e2e',
            border: '1px solid #313244',
            borderRadius: '8px',
            color: '#cdd6f4',
            fontSize: '0.85rem',
          }}
          cursor={{ fill: '#31324440' }}
        />
        <Bar
          dataKey="spam"
          fill="#f38ba8"
          radius={[4, 4, 0, 0]}
          name="Spam Messages"
        />
      </BarChart>
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