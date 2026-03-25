import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import IdentityCard from '../components/IdentityCard'
import Spinner from '../components/Spinner'
import { ToastContainer, useToast } from '../components/Toast'
import { getIdentities, generateIdentity } from '../api/identities'
import { useTheme } from '../ThemeContext'
import PageWrapper from '../components/PageWrapper'

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
    } catch (err) {
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
      addToast('Identity generated successfully! 🎉', 'success')
    } catch (err) {
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
    <div style={{ minHeight: '100vh', background: theme.bg, display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <ToastContainer toasts={toasts} />

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 24px', width: '100%' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h2 style={{ color: theme.text, fontSize: '1.6rem', fontWeight: '700', margin: 0 }}>Your Identities</h2>
            <p style={{ color: theme.muted, fontSize: '0.9rem', marginTop: '4px' }}>{identities.length} virtual identities generated</p>
          </div>
          <button onClick={handleGenerate} disabled={generating} style={{
            background: theme.blue, color: '#fff',
            border: 'none', borderRadius: '8px',
            padding: '10px 22px', fontWeight: '700',
            fontSize: '0.95rem', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '8px',
          }}>
            {generating ? (
              <>
                <Spinner size={16} />
                Generating...
              </>
            ) : '+ Generate Identity'}
          </button>
        </div>

        {error && (
          <div style={{
            background: theme.red + '20', border: `1px solid ${theme.red}`,
            color: theme.red, borderRadius: '8px',
            padding: '10px 16px', marginBottom: '20px', fontSize: '0.85rem',
          }}>
            {error}
          </div>
        )}

        {/* Summary Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
          <StatCard label="Total Identities" value={identities.length} color={theme.blue}   theme={theme} />
          <StatCard label="🟢 Safe"           value={safeCount}         color={theme.green}  theme={theme} />
          <StatCard label="🟡 Moderate"       value={moderateCount}     color={theme.yellow} theme={theme} />
          <StatCard label="🔴 High Risk"      value={highCount}         color={theme.red}    theme={theme} />
        </div>
        <div className="grid-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}></div>
        {/* Identity Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', marginTop: '80px' }}>
            <Spinner size={48} />
            <p style={{ color: theme.muted, marginTop: '16px' }}>Loading identities...</p>
          </div>
        ) : identities.length === 0 ? (
          <div style={{ textAlign: 'center', marginTop: '80px' }}>
            <p style={{ fontSize: '3rem' }}>🕵️</p>
            <p style={{ color: theme.text, fontWeight: '600', fontSize: '1.1rem', marginTop: '12px' }}>No identities yet</p>
            <p style={{ color: theme.muted, fontSize: '0.9rem', marginTop: '4px' }}>Click Generate Identity to create your first one!</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
            {identities.map((identity) => (
              <IdentityCard
                key={identity.id}
                identity={identity}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function StatCard({ label, value, color, theme }) {
  return (
    <div style={{
      background: theme.card,
      border: `1px solid ${theme.border}`,
      borderRadius: '10px',
      padding: '20px',
      textAlign: 'center',
    }}>
      <div style={{ fontSize: '1.8rem', fontWeight: '700', color }}>{value}</div>
      <div style={{ color: theme.muted, fontSize: '0.85rem', marginTop: '4px' }}>{label}</div>
    </div>
  )
}
return (
  <PageWrapper>
    <div style={{ minHeight: '100vh', background: theme.bg, display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <ToastContainer toasts={toasts} />
      {/* rest stays same */}
    </div>
  </PageWrapper>
)