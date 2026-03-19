import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import MessageCard from '../components/MessageCard'
import { getIdentities } from '../api/identities'
import { getMessages } from '../api/messages'

export default function Inbox() {
  const [identities, setIdentities] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [messages, setMessages] = useState([])
  const [loadingIdentities, setLoadingIdentities] = useState(true)
  const [loadingMessages, setLoadingMessages] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchIdentities()
  }, [])

  useEffect(() => {
    if (selectedId) fetchMessages(selectedId)
  }, [selectedId])

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
    <div style={{ minHeight: '100vh', background: '#181825' }}>
      <Navbar />

      <div style={containerStyle}>
        <h2 style={headingStyle}>📬 Inbox</h2>
        <p style={subStyle}>Select an identity to view its messages</p>

        {error && <div style={errorStyle}>{error}</div>}

        <div style={layoutStyle}>

          {/* Sidebar — Identity List */}
          <div style={sidebarStyle}>
            <p style={sidebarTitleStyle}>Your Identities</p>
            {loadingIdentities ? (
              <p style={mutedStyle}>Loading...</p>
            ) : identities.length === 0 ? (
              <p style={mutedStyle}>No identities found</p>
            ) : (
              identities.map((identity) => (
                <div
                  key={identity.id}
                  onClick={() => setSelectedId(identity.id)}
                  style={{
                    ...identityItemStyle,
                    background: selectedId === identity.id ? '#313244' : 'transparent',
                    borderColor: selectedId === identity.id ? '#89b4fa' : 'transparent',
                  }}
                >
                  <div style={{ color: '#cdd6f4', fontWeight: '600', fontSize: '0.9rem' }}>
                    {identity.username}
                  </div>
                  <div style={{ color: '#89b4fa', fontSize: '0.78rem', marginTop: '2px' }}>
                    {identity.email}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Main — Messages */}
          <div style={mainStyle}>
            {selectedIdentity && (
              <div style={inboxHeaderStyle}>
                <div>
                  <span style={{ color: '#cdd6f4', fontWeight: '700' }}>
                    {selectedIdentity.username}
                  </span>
                  <span style={{ color: '#a6adc8', fontSize: '0.85rem', marginLeft: '10px' }}>
                    {selectedIdentity.email}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '16px', fontSize: '0.85rem' }}>
                  <span style={{ color: '#a6e3a1' }}>✅ {cleanCount} Clean</span>
                  <span style={{ color: '#f38ba8' }}>🚨 {spamCount} Spam</span>
                </div>
              </div>
            )}

            {loadingMessages ? (
              <p style={mutedStyle}>Loading messages...</p>
            ) : messages.length === 0 ? (
              <div style={emptyStyle}>
                <p style={{ fontSize: '2rem' }}>📭</p>
                <p style={{ color: '#a6adc8' }}>No messages for this identity yet</p>
              </div>
            ) : (
              <div style={messagesListStyle}>
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
  marginBottom: '24px',
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

const layoutStyle = {
  display: 'grid',
  gridTemplateColumns: '260px 1fr',
  gap: '20px',
  alignItems: 'start',
}

const sidebarStyle = {
  background: '#1e1e2e',
  border: '1px solid #313244',
  borderRadius: '10px',
  padding: '16px',
}

const sidebarTitleStyle = {
  color: '#6c7086',
  fontSize: '0.75rem',
  fontWeight: '700',
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  marginBottom: '12px',
}

const identityItemStyle = {
  padding: '10px 12px',
  borderRadius: '8px',
  border: '1px solid transparent',
  cursor: 'pointer',
  marginBottom: '6px',
  transition: 'background 0.2s',
}

const mainStyle = {
  background: '#1e1e2e',
  border: '1px solid #313244',
  borderRadius: '10px',
  padding: '20px',
  minHeight: '400px',
}

const inboxHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingBottom: '16px',
  borderBottom: '1px solid #313244',
  marginBottom: '20px',
}

const messagesListStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
}

const mutedStyle = {
  color: '#6c7086',
  fontSize: '0.9rem',
  padding: '12px 0',
}

const emptyStyle = {
  textAlign: 'center',
  marginTop: '60px',
}