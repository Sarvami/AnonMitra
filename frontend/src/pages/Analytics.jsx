import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import SpamChart from '../components/SpamChart'
import RiskChart from '../components/RiskChart'
import PageWrapper from '../components/PageWrapper'
import { getSummary, getSpamByIdentity } from '../api/analytics'
import { useTheme } from '../ThemeContext'

export default function Analytics() {
  const { theme } = useTheme()
  const [summary, setSummary] = useState(null)
  const [spamData, setSpamData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => { fetchAll() }, [])

  const fetchAll = async () => {
    try {
      const [summaryRes, spamRes] = await Promise.all([getSummary(), getSpamByIdentity()])
      setSummary(summaryRes.data)
      const spamResult = spamRes.data
      setSpamData(Array.isArray(spamResult) ? spamResult : [])
    } catch {
      setError('Failed to load analytics data')
      setSpamData([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageWrapper>
      <div style={{ minHeight: '100vh', background: theme.bg, display: 'flex', flexDirection: 'column', position: 'relative' }}>
        <div className="grid-bg" style={{ position: 'fixed', inset: 0, opacity: 0.4, pointerEvents: 'none' }} />
        <Navbar />

        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 24px', width: '100%', boxSizing: 'border-box', position: 'relative' }}>

          {/* Page header */}
          <div style={{ marginBottom: '28px' }}>
            <div style={{
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: '10px', letterSpacing: '3px', color: theme.faint,
              textTransform: 'uppercase', marginBottom: '6px',
            }}>
              <span style={{ color: 'rgba(45,212,191,0.4)' }}>[ </span>
              threat intelligence
              <span style={{ color: 'rgba(45,212,191,0.4)' }}> ]</span>
            </div>
            <h2 style={{ color: theme.text, fontSize: '1.5rem', fontWeight: '700', margin: 0, fontFamily: "'Inter', sans-serif" }}>
              Analytics
            </h2>
            <div style={{
              fontFamily: "'Share Tech Mono', monospace",
              color: theme.faint, fontSize: '11px', marginTop: '4px', letterSpacing: '1px',
            }}>
              // insights across all your virtual identities
            </div>
          </div>

          {error && (
            <div style={{
              background: theme.red + '15', border: `1px solid ${theme.red}`,
              color: theme.red, borderRadius: '6px', padding: '10px 14px',
              marginBottom: '20px', fontSize: '12px',
              fontFamily: "'Share Tech Mono', monospace", letterSpacing: '0.5px',
            }}>
              ⚠ {error}
            </div>
          )}

          {loading ? (
            <div style={{
              fontFamily: "'Share Tech Mono', monospace",
              color: theme.faint, textAlign: 'center',
              marginTop: '60px', fontSize: '12px', letterSpacing: '2px',
            }}>
              LOADING ANALYTICS...
            </div>
          ) : (
            <>
              {/* Summary Cards */}
              {summary && (
                <div className="grid-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '24px' }}>
                  <SummaryCard icon="📬" label="Total Messages"  value={summary.total_messages}        color={theme.blue}   theme={theme} />
                  <SummaryCard icon="⚠"  label="Spam Detected"  value={summary.spam_detected}         color={theme.red}    theme={theme} />
                  <SummaryCard icon="✓"  label="Safe Messages"  value={summary.safe_messages}         color={theme.teal}   theme={theme} />
                  <SummaryCard icon="%"  label="Spam Rate"       value={`${summary.spam_percentage}%`} color={theme.yellow} theme={theme} />
                </div>
              )}

              {/* Charts */}
              <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                <ChartCard title="Spam by Identity" subtitle="// which identities receive most spam" theme={theme}>
                  <SpamChart data={spamData} />
                </ChartCard>
                <ChartCard title="Risk Distribution" subtitle="// breakdown of identity risk levels" theme={theme}>
                  <RiskChart data={spamData} />
                </ChartCard>
              </div>

              {/* Risk table */}
              <div style={{
                background: theme.card, border: `1px solid ${theme.border}`,
                borderRadius: '10px', padding: '24px', overflowX: 'auto',
                boxShadow: `0 0 16px ${theme.glow}`,
              }}>
                <div style={{
                  fontFamily: "'Share Tech Mono', monospace",
                  fontSize: '11px', letterSpacing: '2px',
                  textTransform: 'uppercase', color: theme.muted,
                  marginBottom: '16px',
                }}>
                  Identity Risk Overview
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      {['Identity', 'Email', 'Spam Count', 'Risk Level'].map(col => (
                        <th key={col} style={{
                          fontFamily: "'Share Tech Mono', monospace",
                          color: theme.faint, fontSize: '9px', fontWeight: '400',
                          textTransform: 'uppercase', letterSpacing: '2px',
                          padding: '8px 14px', textAlign: 'left',
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
                        <td colSpan={4} style={{
                          fontFamily: "'Share Tech Mono', monospace",
                          color: theme.faint, fontSize: '11px',
                          padding: '20px 14px', textAlign: 'center', letterSpacing: '1px',
                        }}>
                          // no data available
                        </td>
                      </tr>
                    ) : (
                      spamData.map((row, i) => (
                        <tr key={i} style={{
                          background: i % 2 === 0 ? 'transparent' : 'rgba(139,92,246,0.03)',
                        }}>
                          <td style={{ padding: '11px 14px', borderBottom: `1px solid ${theme.border}30` }}>
                            <span style={{ fontFamily: "'Share Tech Mono', monospace", color: theme.text, fontSize: '12px' }}>
                              {row.username}
                            </span>
                          </td>
                          <td style={{ padding: '11px 14px', borderBottom: `1px solid ${theme.border}30` }}>
                            <span style={{ fontFamily: "'Share Tech Mono', monospace", color: theme.teal, fontSize: '12px' }}>
                              {row.email}
                            </span>
                          </td>
                          <td style={{ padding: '11px 14px', borderBottom: `1px solid ${theme.border}30` }}>
                            <span style={{ fontFamily: "'Share Tech Mono', monospace", color: theme.text, fontSize: '12px' }}>
                              {row.spam_count}
                            </span>
                          </td>
                          <td style={{ padding: '11px 14px', borderBottom: `1px solid ${theme.border}30` }}>
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
    </PageWrapper>
  )
}

function ChartCard({ title, subtitle, theme, children }) {
  return (
    <div style={{
      background: theme.card, border: `1px solid ${theme.border}`,
      borderRadius: '10px', padding: '24px',
      boxShadow: `0 0 16px ${theme.glow}`,
    }}>
      <div style={{ fontFamily: "'Inter', sans-serif", color: theme.text, fontWeight: '700', fontSize: '0.95rem', margin: '0 0 2px' }}>
        {title}
      </div>
      <div style={{ fontFamily: "'Share Tech Mono', monospace", color: theme.faint, fontSize: '10px', marginBottom: '20px', letterSpacing: '0.5px' }}>
        {subtitle}
      </div>
      {children}
    </div>
  )
}

function SummaryCard({ icon, label, value, color, theme }) {
  return (
    <div style={{
      background: theme.card, border: `1px solid ${theme.border}`,
      borderRadius: '10px', padding: '20px',
      boxShadow: `0 0 12px ${theme.glow}`,
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
        background: color, opacity: 0.7,
      }} />
      <div style={{
        fontFamily: "'Share Tech Mono', monospace",
        fontSize: '10px', color: theme.faint, letterSpacing: '1px', marginBottom: '10px',
      }}>
        {icon}
      </div>
      <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '1.7rem', fontWeight: '700', color }}>
        {value}
      </div>
      <div style={{
        fontFamily: "'Share Tech Mono', monospace",
        color: theme.faint, fontSize: '10px',
        marginTop: '4px', letterSpacing: '1.5px', textTransform: 'uppercase',
      }}>
        {label}
      </div>
    </div>
  )
}

function RiskPill({ level, theme }) {
  const config = {
    safe:     { color: theme.teal,   bg: 'rgba(45,212,191,0.12)',  label: 'SAFE' },
    moderate: { color: theme.yellow, bg: 'rgba(245,158,11,0.12)',  label: 'MODERATE' },
    high:     { color: theme.red,    bg: 'rgba(244,63,94,0.12)',   label: 'HIGH' },
  }
  const c = config[level?.toLowerCase()] || config.safe
  return (
    <span style={{
      background: c.bg, color: c.color,
      borderRadius: '4px', padding: '3px 10px',
      fontSize: '9px', letterSpacing: '1.5px',
      fontFamily: "'Share Tech Mono', monospace",
      border: `1px solid ${c.color}40`,
    }}>
      {c.label}
    </span>
  )
}