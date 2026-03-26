import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import IdentityCard from '../components/IdentityCard'
import Spinner from '../components/Spinner'
import PageWrapper from '../components/PageWrapper'
import { ToastContainer, useToast } from '../components/Toast'
import { getIdentities, generateIdentity } from '../api/identities'
import { useTheme } from '../ThemeContext'

export default function Dashboard() {
  const { theme } = useTheme()
  const { toasts, addToast } = useToast()
  const [identities, setIdentities] = useState([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => { fetchIdentities() }, [])

  const fetchIdentities = async () => {
    try {
      const res = await getIdentities()
      setIdentities(res.data)
    } catch {
      setError('Failed to load identities')
      addToast('Failed to load identities', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleGenerate = async () => {
    setGenerating(true)
    try {
      const res = await generateIdentity()
      setIdentities((prev) => [res.data, ...prev])
      addToast('Identity generated successfully!', 'success')
    } catch {
      addToast('Failed to generate identity', 'error')
    } finally {
      setGenerating(false)
    }
  }

  const handleDelete = (id) => {
    setIdentities((prev) => prev.filter((i) => i.id !== id))
    addToast('Identity deleted', 'info')
  }

  const safeCount     = identities.filter(i => i.risk_badge === 'safe').length
  const moderateCount = identities.filter(i => i.risk_badge === 'moderate').length
  const highCount     = identities.filter(i => i.risk_badge === 'high').length

  return (
    <PageWrapper>
      <div style={{ minHeight: '100vh', background: theme.bg, display: 'flex', flexDirection: 'column', position: 'relative' }}>
        <div className="grid-bg" style={{ position: 'fixed', inset: 0, opacity: 0.4, pointerEvents: 'none' }} />
        <Navbar />
        <ToastContainer toasts={toasts} />

        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 24px', width: '100%', boxSizing: 'border-box', position: 'relative' }}>

          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
            <div>
              <div style={{
                fontFamily: "'Share Tech Mono', monospace",
                fontSize: '10px', letterSpacing: '3px', color: theme.faint,
                textTransform: 'uppercase', marginBottom: '6px',
              }}>
                <span style={{ color: 'rgba(45,212,191,0.4)' }}>[ </span>
                identity control panel
                <span style={{ color: 'rgba(45,212,191,0.4)' }}> ]</span>
              </div>
              <h2 style={{ color: theme.text, fontSize: '1.5rem', fontWeight: '700', margin: 0, fontFamily: "'Inter', sans-serif" }}>
                Your Identities
              </h2>
              <div style={{
                fontFamily: "'Share Tech Mono', monospace",
                color: theme.faint, fontSize: '11px', marginTop: '4px', letterSpacing: '1px',
              }}>
                // {identities.length} virtual identities active
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={generating}
              style={{
                background: 'linear-gradient(135deg, #7c3aed, #0d9488)',
                color: '#fff', border: 'none', borderRadius: '6px',
                padding: '10px 20px', fontSize: '12px', letterSpacing: '2px',
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
                fontFamily: "'Share Tech Mono', monospace",
                boxShadow: '0 0 16px rgba(139,92,246,0.25)',
                flexShrink: 0,
              }}
            >
              {generating ? (
                <><Spinner size={14} /> GENERATING...</>
              ) : '+ NEW_ID'}
            </button>
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

          {/* Stats row */}
          <div className="grid-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '28px' }}>
            <StatCard label="Total" value={identities.length} color={theme.blue}   theme={theme} accent="rgba(139,92,246,0.12)" />
            <StatCard label="Safe"  value={safeCount}         color={theme.teal}   theme={theme} accent="rgba(45,212,191,0.12)" />
            <StatCard label="Moderate" value={moderateCount}  color={theme.yellow} theme={theme} accent="rgba(245,158,11,0.12)" />
            <StatCard label="High Risk" value={highCount}     color={theme.red}    theme={theme} accent="rgba(244,63,94,0.12)" />
          </div>

          {/* Grid */}
          {loading ? (
            <div style={{ textAlign: 'center', marginTop: '80px' }}>
              <Spinner size={40} />
              <div style={{
                fontFamily: "'Share Tech Mono', monospace",
                color: theme.faint, marginTop: '16px', fontSize: '11px',
                letterSpacing: '2px',
              }}>
                LOADING IDENTITIES...
              </div>
            </div>
          ) : identities.length === 0 ? (
            <div style={{ textAlign: 'center', marginTop: '80px' }}>
              <div style={{ fontSize: '3rem', opacity: 0.3, marginBottom: '16px' }}>🕵️</div>
              <div style={{ color: theme.text, fontWeight: '600', fontSize: '1rem', fontFamily: "'Inter', sans-serif" }}>
                No identities yet
              </div>
              <div style={{
                fontFamily: "'Share Tech Mono', monospace",
                color: theme.faint, fontSize: '11px', marginTop: '8px', letterSpacing: '1px',
              }}>
                // click + NEW_ID to create your first one
              </div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '14px' }}>
              {identities.map((identity) => (
                <IdentityCard key={identity.id} identity={identity} onDelete={handleDelete} />
              ))}
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  )
}

function StatCard({ label, value, color, accent, theme }) {
  return (
    <div style={{
      background: theme.card, border: `1px solid ${theme.border}`,
      borderRadius: '10px', padding: '18px 20px',
      boxShadow: `0 0 12px ${theme.glow}`,
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Accent strip */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
        background: color, opacity: 0.7,
      }} />
      <div style={{
        fontSize: '1.8rem', fontWeight: '700', color,
        fontFamily: "'Share Tech Mono', monospace",
      }}>
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