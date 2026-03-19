import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import SpamChart from '../components/SpamChart'
import RiskChart from '../components/RiskChart'
import { getSummary, getSpamByIdentity } from '../api/analytics'

export default function Analytics() {
  const [summary, setSummary] = useState(null)
  const [spamData, setSpamData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchAll()
  }, [])

  const fetchAll = async () => {
    try {
      const [summaryRes, spamRes] = await Promise.all([
        getSummary(),
        getSpamByIdentity(),
      ])
      setSummary(summaryRes.data)
      setSpamData(spamRes.data)
    } catch (err) {
      setError('Failed to load analytics data')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#181825' }}>
      <Navbar />

      <div style={containerStyle}>
        <h2 style={headingStyle}>📊 Analytics</h2>
        <p style={subStyle}>Insights across all your virtual identities</p>

        {error && <div style={errorStyle}>{error}</div>}

        {loading ? (
          <p style={mutedStyle}>Loading analytics...</p>
        ) : (
          <>
            {/* Summary Cards */}
            {summary && (
              <div style={statsRowStyle}>
                <SummaryCard
                  icon="🧩"
                  label="Total Identities"
                  value={summary.total_identities}
                  color="#89b4fa"
                />
                <SummaryCard
                  icon="🚨"
                  label="Total Spam Received"
                  value={summary.total_spam}
                  color="#f38ba8"
                />
                <SummaryCard
                  icon="⚠️"
                  label="Riskiest Platform"
                  value={summary.riskiest_platform || 'N/A'}
                  color="#f9e2af"
                />
                <SummaryCard
                  icon="📬"
                  label="Total Messages"
                  value={summary.total_messages}
                  color="#a6e3a1"
                />
              </div>
            )}

            {/* Charts Row */}
            <div style={chartsRowStyle}>
              <div style={chartCardStyle}>
                <h3 style={chartTitleStyle}>Spam by Identity</h3>
                <p style={chartSubStyle}>Which identities receive the most spam</p>
                <SpamChart data={spamData} />
              </div>

              <div style={chartCardStyle}>
                <h3 style={chartTitleStyle}>Risk Distribution</h3>
                <p style={chartSubStyle}>Breakdown of identity risk levels</p>
                <RiskChart data={spamData} />
              </div>
            </div>

            {/* Identity Risk Table */}
            <div style={tableCardStyle}>
              <h3 style={chartTitleStyle}>Identity Risk Overview</h3>
              <table style={tableStyle}>
                <thead>
                  <tr>
                    {['Identity', 'Email', 'Spam Count', 'Risk Level'].map(col => (
                      <th key={col} style={thStyle}>{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {spamData.length === 0 ? (
                    <tr>
                      <td colSpan={4} style={{ ...tdStyle, textAlign: 'center', color: '#6c7086' }}>
                        No data available
                      </td>
                    </tr>
                  ) : (
                    spamData.map((row, i) => (
                      <tr key={i} style={i % 2 === 0 ? {} : { background: '#1e1e2e' }}>
                        <td style={tdStyle}>{row.username}</td>
                        <td style={{ ...tdStyle, color: '#89b4fa' }}>{row.email}</td>
                        <td style={tdStyle}>{row.spam_count}</td>
                        <td style={tdStyle}>
                          <RiskPill level={row.risk_status} />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function SummaryCard({ icon, label, value, color }) {
  return (
    <div style={summaryCardStyle}>
      <div style={{ fontSize: '1.6rem' }}>{icon}</div>
      <div style={{ fontSize: '1.8rem', fontWeight: '700', color, margin: '8px 0 4px' }}>
        {value}
      </div>
      <div style={{ color: '#a6adc8', fontSize: '0.85rem' }}>{label}</div>
    </div>
  )
}

function RiskPill({ level }) {
  const config = {
    safe:     { color: '#a6e3a1', bg: '#a6e3a120', label: '🟢 Safe' },
    moderate: { color: '#f9e2af', bg: '#f9e2af20', label: '🟡 Moderate' },
    high:     { color: '#f38ba8', bg: '#f38ba820', label: '🔴 High Risk' },
  }
  const c = config[level?.toLowerCase()] || config.safe
  return (
    <span style={{
      background: c.bg,
      color: c.color,
      borderRadius: '99px',
      padding: '3px 12px',
      fontSize: '0.78rem',
      fontWeight: '600',
    }}>
      {c.label}
    </span>
  )
}

const containerStyle = {
  maxWidth: '1100px',
  margin: '0 auto',
  padding: '32px 24px',
}

const headingStyle = {
  color: '#cdd6f4',
  fontSize: '1.6rem',
  fontWeight: '700',
  margin: 0,
}

const subStyle = {
  color: '#a6adc8',
  fontSize: '0.9rem',
  marginTop: '4px',
  marginBottom: '28px',
}

const errorStyle = {
  background: '#f38ba820',
  border: '1px solid #f38ba8',
  color: '#f38ba8',
  borderRadius: '8px',
  padding: '10px 16px',
  marginBottom: '20px',
  fontSize: '0.85rem',
}

const mutedStyle = {
  color: '#a6adc8',
  textAlign: 'center',
  marginTop: '60px',
}

const statsRowStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 1fr)',
  gap: '16px',
  marginBottom: '28px',
}

const summaryCardStyle = {
  background: '#1e1e2e',
  border: '1px solid #313244',
  borderRadius: '10px',
  padding: '20px',
  textAlign: 'center',
}

const chartsRowStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '20px',
  marginBottom: '28px',
}

const chartCardStyle = {
  background: '#1e1e2e',
  border: '1px solid #313244',
  borderRadius: '10px',
  padding: '24px',
}

const chartTitleStyle = {
  color: '#cdd6f4',
  fontWeight: '700',
  fontSize: '1rem',
  margin: '0 0 4px',
}

const chartSubStyle = {
  color: '#6c7086',
  fontSize: '0.8rem',
  marginBottom: '20px',
}

const tableCardStyle = {
  background: '#1e1e2e',
  border: '1px solid #313244',
  borderRadius: '10px',
  padding: '24px',
  overflowX: 'auto',
}

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
}

const thStyle = {
  color: '#6c7086',
  fontSize: '0.78rem',
  fontWeight: '700',
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  padding: '10px 16px',
  textAlign: 'left',
  borderBottom: '1px solid #313244',
}

const tdStyle = {
  color: '#cdd6f4',
  fontSize: '0.88rem',
  padding: '12px 16px',
  borderBottom: '1px solid #31324450',
}