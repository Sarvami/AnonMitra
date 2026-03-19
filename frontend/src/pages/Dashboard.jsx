import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import IdentityCard from '../components/IdentityCard'
import { getIdentities, generateIdentity } from '../api/identities'

export default function Dashboard() {
  const [identities, setIdentities] = useState([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchIdentities()
  }, [])

  const fetchIdentities = async () => {
    try {
      const res = await getIdentities()
      setIdentities(res.data)
    } catch (err) {
      setError('Failed to load identities')
    } finally {
      setLoading(false)
    }
  }

  const handleGenerate = async () => {
    setGenerating(true)
    try {
      const res = await generateIdentity()
      setIdentities((prev) => [res.data, ...prev])
    } catch (err) {
      setError('Failed to generate identity')
    } finally {
      setGenerating(false)
    }
  }

  const handleDelete = (id) => {
    setIdentities((prev) => prev.filter((i) => i.id !== id))
  }

  const safeCount     = identities.filter(i => i.risk_badge === 'safe').length
const moderateCount = identities.filter(i => i.risk_badge === 'moderate').length
const highCount     = identities.filter(i => i.risk_badge === 'high').length
  return (
    <div style={{ minHeight: '100vh', background: '#181825', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <div style={containerStyle}>
        {/* Header */}
        <div style={headerStyle}>
          <div>
            <h2 style={headingStyle}>Your Identities</h2>
            <p style={subStyle}>{identities.length} virtual identities generated</p>
          </div>
          <button onClick={handleGenerate} disabled={generating} style={genBtnStyle}>
            {generating ? '⏳ Generating...' : '+ Generate Identity'}
          </button>
        </div>

        {error && <div style={errorStyle}>{error}</div>}

        {/* Summary Stats */}
        <div style={statsRow}>
          <StatCard label="Total Identities" value={identities.length} color="#89b4fa" />
          <StatCard label="🟢 Safe"           value={safeCount}         color="#a6e3a1" />
          <StatCard label="🟡 Moderate"       value={moderateCount}     color="#f9e2af" />
          <StatCard label="🔴 High Risk"      value={highCount}         color="#f38ba8" />
        </div>

        {/* Identity Grid */}
        {loading ? (
          <p style={loadingStyle}>Loading identities...</p>
        ) : identities.length === 0 ? (
          <div style={emptyStyle}>
            <p style={{ fontSize: '2rem' }}>🕵️</p>
            <p style={{ color: '#a6adc8' }}>No identities yet. Generate your first one!</p>
          </div>
        ) : (
          <div style={gridStyle}>
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

function StatCard({ label, value, color }) {
  return (
    <div style={statCardStyle}>
      <div style={{ fontSize: '1.8rem', fontWeight: '700', color }}>{value}</div>
      <div style={{ color: '#a6adc8', fontSize: '0.85rem', marginTop: '4px' }}>{label}</div>
    </div>
  )
}

const containerStyle = {
  maxWidth: '1100px',
  margin: '0 auto',
  padding: '32px 24px',
}

const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '24px',
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
}

const genBtnStyle = {
  background: '#89b4fa',
  color: '#1e1e2e',
  border: 'none',
  borderRadius: '8px',
  padding: '10px 22px',
  fontWeight: '700',
  fontSize: '0.95rem',
  cursor: 'pointer',
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

const statsRow = {
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 1fr)',
  gap: '16px',
  marginBottom: '32px',
}

const statCardStyle = {
  background: '#1e1e2e',
  border: '1px solid #313244',
  borderRadius: '10px',
  padding: '20px',
  textAlign: 'center',
}

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
  gap: '16px',
}

const loadingStyle = {
  color: '#a6adc8',
  textAlign: 'center',
  marginTop: '60px',
}

const emptyStyle = {
  textAlign: 'center',
  marginTop: '80px',
}