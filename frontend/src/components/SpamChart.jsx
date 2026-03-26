import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell
} from 'recharts'

export default function SpamChart({ data }) {
  if (!data || data.length === 0) {
    return <EmptyState />
  }

  const chartData = data.map(d => ({
    name: d.username,
    spam: d.spam_count,
  }))

  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={chartData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="rgba(139,92,246,0.08)"
          vertical={false}
        />
        <XAxis
          dataKey="name"
          tick={{
            fill: 'rgba(139,92,246,0.45)',
            fontSize: 10,
            fontFamily: "'Share Tech Mono', monospace",
          }}
          axisLine={{ stroke: 'rgba(139,92,246,0.15)' }}
          tickLine={false}
        />
        <YAxis
          tick={{
            fill: 'rgba(139,92,246,0.45)',
            fontSize: 10,
            fontFamily: "'Share Tech Mono', monospace",
          }}
          axisLine={{ stroke: 'rgba(139,92,246,0.15)' }}
          tickLine={false}
          allowDecimals={false}
        />
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
          cursor={{ fill: 'rgba(139,92,246,0.05)' }}
          formatter={(value) => [value, 'SPAM']}
        />
        <Bar
          dataKey="spam"
          radius={[3, 3, 0, 0]}
          name="Spam Messages"
          fill="#f43f5e"
        >
          {chartData.map((_, index) => (
            <Cell
              key={index}
              fill={`rgba(244,63,94,${0.5 + (index % 3) * 0.15})`}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

function EmptyState() {
  return (
    <div style={{
      height: '240px', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: '10px',
    }}>
      <div style={{ fontSize: '1.8rem', opacity: 0.3 }}>📭</div>
      <div style={{
        fontFamily: "'Share Tech Mono', monospace",
        color: 'rgba(139,92,246,0.35)',
        fontSize: '10px', letterSpacing: '2px',
      }}>
        // no spam data yet
      </div>
    </div>
  )
}