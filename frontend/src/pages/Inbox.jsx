import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import MessageCard from '../components/MessageCard'
import { getIdentities } from '../api/identities'
import { getMessages } from '../api/messages'
import { useTheme } from '../ThemeContext'
import PageWrapper from '../components/PageWrapper'
export default function Inbox() {
  const { theme } = useTheme()
  const [identities, setIdentities] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [messages, setMessages] = useState([])
  const [loadingIdentities, setLoadingIdentities] = useState(true)
  const [loadingMessages, setLoadingMessages] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => { fetchIdentities() }, [])
  useEffect(() => { if (selectedId) fetchMessages(selectedId) }, [selectedId])

  const fetchIdentities = async () => {
    try {
      const res = await getIdentities()
      setIdentities(res.data)
      if (res.data.length > 0) setSelectedId(res.data[0].id)
    } catch (err) {
      setError('Failed to load identities')
    } finally {
      setLoadingIdentities(false)
    }
  }

  const fetchMessages = async (id) => {
    setLoadingMessages(true)
    setError('')
    try {
      const res = await getMessages(id)
      setMessages(res.data)
    } catch (err) {
      setError('Failed to load messages')
    } finally {
      setLoadingMessages(false)
    }
  }

  const spamCount  = messages.filter(m => m.is_spam).length
  const cleanCount = messages.filter(m => !m.is_spam).length
  const selectedIdentity = identities.find(i => i.id === selectedId)

  return (
    <div style={{ minHeight: '100vh', background: theme.bg, display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 24px', width: '100%' }}>

        <h2 style={{ color: theme.text, fontSize: '1.6rem', fontWeight: '700', margin: 0 }}>📬 Inbox</h2>
        <p style={{ color: theme.muted, fontSize: '0.9rem', marginTop: '4px', marginBottom: '24px' }}>
          Select an identity to view its messages
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

        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '20px', alignItems: 'start' }}>

          {/* Sidebar */}
          <div className="sidebar-layout" style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '20px', alignItems: 'start' }}></div>
          <div style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: '10px', padding: '16px' }}>
            <p style={{ color: theme.faint, fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px' }}>
              Your Identities
            </p>
            {loadingIdentities ? (
              <p style={{ color: theme.faint, fontSize: '0.9rem' }}>Loading...</p>
            ) : identities.length === 0 ? (
              <p style={{ color: theme.faint, fontSize: '0.9rem' }}>No identities found</p>
            ) : (
              identities.map((identity) => (
                <div
                  key={identity.id}
                  onClick={() => setSelectedId(identity.id)}
                  style={{
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: `1px solid ${selectedId === identity.id ? theme.blue : 'transparent'}`,
                    background: selectedId === identity.id ? theme.input : 'transparent',
                    cursor: 'pointer',
                    marginBottom: '6px',
                  }}
                >
                  <div style={{ color: theme.text, fontWeight: '600', fontSize: '0.9rem' }}>
                    {identity.username}
                  </div>
                  <div style={{ color: theme.blue, fontSize: '0.78rem', marginTop: '2px' }}>
                    {identity.alias_email}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Main */}
          <div style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: '10px', padding: '20px', minHeight: '400px' }}>
            {selectedIdentity && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '16px', borderBottom: `1px solid ${theme.border}`, marginBottom: '20px' }}>
                <div>
                  <span style={{ color: theme.text, fontWeight: '700' }}>{selectedIdentity.username}</span>
                  <span style={{ color: theme.muted, fontSize: '0.85rem', marginLeft: '10px' }}>{selectedIdentity.alias_email}</span>
                </div>
                <div style={{ display: 'flex', gap: '16px', fontSize: '0.85rem' }}>
                  <span style={{ color: theme.green }}>✅ {cleanCount} Clean</span>
                  <span style={{ color: theme.red }}>🚨 {spamCount} Spam</span>
                </div>
              </div>
            )}

            {loadingMessages ? (
              <p style={{ color: theme.faint, fontSize: '0.9rem' }}>Loading messages...</p>
            ) : messages.length === 0 ? (
              <div style={{ textAlign: 'center', marginTop: '60px' }}>
                <p style={{ fontSize: '2rem' }}>📭</p>
                <p style={{ color: theme.muted }}>No messages for this identity yet</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {messages.map((message) => (
                  <MessageCard key={message.id} message={message} />
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  )
  
return (
  <PageWrapper>
    <div style={{ minHeight: '100vh', background: theme.bg, display: 'flex', flexDirection: 'column' }}>
      {/* rest stays same */}
    </div>
  </PageWrapper>
)
}

