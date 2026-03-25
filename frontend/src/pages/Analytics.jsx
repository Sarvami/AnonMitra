import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import SpamChart from '../components/SpamChart'
import RiskChart from '../components/RiskChart'
import { getSummary, getSpamByIdentity } from '../api/analytics'
import { useTheme } from '../ThemeContext'
import PageWrapper from '../components/PageWrapper'
export default function Analytics() {
  const { theme } = useTheme()
  const [summary, setSummary] = useState(null)
  const [spamData, setSpamData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => { fetchAll() }, [])

  const fetchAll = async () => {
    try {
      const [summaryRes, spamRes] = await Promise.all([
        getSummary(),
        getSpamByIdentity(),
      ])
      setSummary(summaryRes.data)
      const spamResult = spamRes.data
      setSpamData(Array.isArray(spamResult) ? spamResult : [])
    } catch (err) {
      setError('Failed to load analytics data')
      setSpamData([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: theme.bg, display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 24px', width: '100%' }}>

        <h2 style={{ color: theme.text, fontSize: '1.6rem', fontWeight: '700', margin: 0 }}>📊 Analytics</h2>
        <p style={{ color: theme.muted, fontSize: '0.9rem', marginTop: '4px', marginBottom: '28px' }}>
          Insights across all your virtual identities
        </p>

        {error && (
          <div style={{
            background: theme.red + '20', border: `1px solid ${theme.red}`,
            color: theme.red, borderRadius: '8px',
            padding: '10px 16px', marginBottom: '20px', fontSize: '0.85rem',
          }}>
            {error}
          </div>
        )}

        {loading ? (
          <p style={{ color: theme.muted, textAlign: 'center', marginTop: '60px' }}>Loading analytics...</p>
        ) : (
          <>
            {/* Summary Cards */}
            {summary && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '28px' }}>
                <SummaryCard icon="🧩" label="Total Identities"    value={summary.total_identities}          color={theme.blue}   theme={theme} />
                <SummaryCard icon="🚨" label="Total Spam Received" value={summary.total_spam}                color={theme.red}    theme={theme} />
                <SummaryCard icon="⚠️" label="Riskiest Platform"   value={summary.riskiest_platform || 'N/A'} color={theme.yellow} theme={theme} />
                <SummaryCard icon="📬" label="Total Messages"      value={summary.total_messages}            color={theme.green}  theme={theme} />
              </div>
            )}
              <div className="grid-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '28px' }}></div>

            {/* Charts Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '28px' }}>
              <div style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: '10px', padding: '24px' }}>
                <h3 style={{ color: theme.text, fontWeight: '700', fontSize: '1rem', margin: '0 0 4px' }}>Spam by Identity</h3>
                <p style={{ color: theme.faint, fontSize: '0.8rem', marginBottom: '20px' }}>Which identities receive the most spam</p>
                <SpamChart data={spamData} />
              </div>
              <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '28px' }}></div>
              <div style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: '10px', padding: '24px' }}>
                <h3 style={{ color: theme.text, fontWeight: '700', fontSize: '1rem', margin: '0 0 4px' }}>Risk Distribution</h3>
                <p style={{ color: theme.faint, fontSize: '0.8rem', marginBottom: '20px' }}>Breakdown of identity risk levels</p>
                <RiskChart data={spamData} />
              </div>
            </div>

            {/* Identity Risk Table */}
            <div style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: '10px', padding: '24px', overflowX: 'auto' }}>
              <h3 style={{ color: theme.text, fontWeight: '700', fontSize: '1rem', margin: '0 0 16px' }}>Identity Risk Overview</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    {['Identity', 'Email', 'Spam Count', 'Risk Level'].map(col => (
                      <th key={col} style={{
                        color: theme.faint, fontSize: '0.78rem', fontWeight: '700',
                        textTransform: 'uppercase', letterSpacing: '0.06em',
                        padding: '10px 16px', textAlign: 'left',
                        borderBottom: `1px solid ${theme.border}`,
                      }}>
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {spamData.length === 0 ? (
                    <tr>
                      <td colSpan={4} style={{ color: theme.faint, fontSize: '0.88rem', padding: '12px 16px', textAlign: 'center' }}>
                        No data available
                      </td>
                    </tr>
                  ) : (
                    spamData.map((row, i) => (
                      <tr key={i} style={{ background: i % 2 === 0 ? 'transparent' : theme.input + '50' }}>
                        <td style={{ color: theme.text,  fontSize: '0.88rem', padding: '12px 16px', borderBottom: `1px solid ${theme.border}50` }}>{row.username}</td>
                        <td style={{ color: theme.blue,  fontSize: '0.88rem', padding: '12px 16px', borderBottom: `1px solid ${theme.border}50` }}>{row.email}</td>
                        <td style={{ color: theme.text,  fontSize: '0.88rem', padding: '12px 16px', borderBottom: `1px solid ${theme.border}50` }}>{row.spam_count}</td>
                        <td style={{ padding: '12px 16px', borderBottom: `1px solid ${theme.border}50` }}>
                          <RiskPill level={row.risk_status} theme={theme} />
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

function SummaryCard({ icon, label, value, color, theme }) {
  return (
    <div style={{
      background: theme.card,
      border: `1px solid ${theme.border}`,
      borderRadius: '10px',
      padding: '20px',
      textAlign: 'center',
    }}>
      <div style={{ fontSize: '1.6rem' }}>{icon}</div>
      <div style={{ fontSize: '1.8rem', fontWeight: '700', color, margin: '8px 0 4px' }}>{value}</div>
      <div style={{ color: theme.muted, fontSize: '0.85rem' }}>{label}</div>
    </div>
  )
}

function RiskPill({ level, theme }) {
  const config = {
    safe:     { color: theme.green,  bg: theme.green  + '20', label: '🟢 Safe' },
    moderate: { color: theme.yellow, bg: theme.yellow + '20', label: '🟡 Moderate' },
    high:     { color: theme.red,    bg: theme.red    + '20', label: '🔴 High Risk' },
  }
  const c = config[level?.toLowerCase()] || config.safe
  return (
    <span style={{
      background: c.bg, color: c.color,
      borderRadius: '99px', padding: '3px 12px',
      fontSize: '0.78rem', fontWeight: '600',
    }}>
      {c.label}
    </span>
  )
  
return (
  <PageWrapper>
    <div style={{ minHeight: '100vh', background: theme.bg, display: 'flex', flexDirection: 'column' }}>
      {/* rest stays same */}
    </div>
  </PageWrapper>
)

}

