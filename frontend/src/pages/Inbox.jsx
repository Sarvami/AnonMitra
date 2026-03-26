import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import MessageCard from '../components/MessageCard'
import PageWrapper from '../components/PageWrapper'
import { getIdentities } from '../api/identities'
import { getMessages } from '../api/messages'
import { useTheme } from '../ThemeContext'

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
    } catch {
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
    } catch {
      setError('Failed to load messages')
    } finally {
      setLoadingMessages(false)
    }
  }

  const spamCount  = messages.filter(m => m.is_spam).length
  const cleanCount = messages.filter(m => !m.is_spam).length
  const selectedIdentity = identities.find(i => i.id === selectedId)

  return (
    <PageWrapper>
      <div style={{ minHeight: '100vh', background: theme.bg, display: 'flex', flexDirection: 'column', position: 'relative' }}>
        <div className="grid-bg" style={{ position: 'fixed', inset: 0, opacity: 0.4, pointerEvents: 'none' }} />
        <Navbar />

        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 24px', width: '100%', boxSizing: 'border-box', position: 'relative' }}>

          {/* Page header */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: '10px', letterSpacing: '3px', color: theme.faint,
              textTransform: 'uppercase', marginBottom: '6px',
            }}>
              <span style={{ color: 'rgba(45,212,191,0.4)' }}>[ </span>
              message centre
              <span style={{ color: 'rgba(45,212,191,0.4)' }}> ]</span>
            </div>
            <h2 style={{ color: theme.text, fontSize: '1.5rem', fontWeight: '700', margin: 0, fontFamily: "'Inter', sans-serif" }}>
              Inbox
            </h2>
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

          <div className="sidebar-layout" style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '16px', alignItems: 'start' }}>

            {/* Sidebar */}
            <div style={{
              background: theme.card, border: `1px solid ${theme.border}`,
              borderRadius: '10px', padding: '16px',
              boxShadow: `0 0 16px ${theme.glow}`,
            }}>
              <div style={{
                fontFamily: "'Share Tech Mono', monospace",
                fontSize: '9px', letterSpacing: '2.5px',
                textTransform: 'uppercase', color: theme.faint,
                marginBottom: '14px', paddingBottom: '10px',
                borderBottom: `1px solid ${theme.border}`,
              }}>
                // identities
              </div>

              {loadingIdentities ? (
                <div style={{ fontFamily: "'Share Tech Mono', monospace", color: theme.faint, fontSize: '11px', letterSpacing: '1px' }}>
                  loading...
                </div>
              ) : identities.length === 0 ? (
                <div style={{ fontFamily: "'Share Tech Mono', monospace", color: theme.faint, fontSize: '11px' }}>
                  no identities found
                </div>
              ) : (
                identities.map((identity) => (
                  <div
                    key={identity.id}
                    onClick={() => setSelectedId(identity.id)}
                    style={{
                      padding: '10px 12px', borderRadius: '6px', marginBottom: '6px', cursor: 'pointer',
                      border: `1px solid ${selectedId === identity.id ? 'rgba(139,92,246,0.45)' : 'transparent'}`,
                      background: selectedId === identity.id ? 'rgba(139,92,246,0.08)' : 'transparent',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div style={{
                      fontFamily: "'Share Tech Mono', monospace",
                      color: selectedId === identity.id ? theme.text : theme.muted,
                      fontSize: '12px', letterSpacing: '0.5px',
                    }}>
                      {identity.username}
                    </div>
                    <div style={{
                      fontFamily: "'Share Tech Mono', monospace",
                      color: theme.teal, fontSize: '10px', marginTop: '3px',
                      opacity: 0.8, letterSpacing: '0.3px',
                    }}>
                      {identity.alias_email}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Main panel */}
            <div style={{
              background: theme.card, border: `1px solid ${theme.border}`,
              borderRadius: '10px', padding: '20px', minHeight: '420px',
              boxShadow: `0 0 16px ${theme.glow}`,
            }}>
              {/* Panel header */}
              {selectedIdentity && (
                <div style={{
                  display: 'flex', justifyContent: 'space-between',
                  alignItems: 'center', paddingBottom: '16px',
                  borderBottom: `1px solid ${theme.border}`, marginBottom: '20px',
                }}>
                  <div>
                    <span style={{
                      fontFamily: "'Share Tech Mono', monospace",
                      color: theme.text, fontSize: '13px', letterSpacing: '0.5px',
                    }}>
                      {selectedIdentity.username}
                    </span>
                    <span style={{
                      fontFamily: "'Share Tech Mono', monospace",
                      color: theme.faint, fontSize: '11px', marginLeft: '10px',
                    }}>
                      {selectedIdentity.alias_email}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <span style={{
                      fontFamily: "'Share Tech Mono', monospace",
                      color: theme.teal, fontSize: '11px', letterSpacing: '1px',
                    }}>
                      ✓ {cleanCount} clean
                    </span>
                    <span style={{
                      fontFamily: "'Share Tech Mono', monospace",
                      color: theme.red, fontSize: '11px', letterSpacing: '1px',
                    }}>
                      ⚠ {spamCount} spam
                    </span>
                  </div>
                </div>
              )}

              {loadingMessages ? (
                <div style={{
                  fontFamily: "'Share Tech Mono', monospace",
                  color: theme.faint, fontSize: '11px',
                  letterSpacing: '2px', paddingTop: '20px',
                }}>
                  LOADING MESSAGES...
                </div>
              ) : messages.length === 0 ? (
                <div style={{ textAlign: 'center', marginTop: '60px' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '16px', opacity: 0.4 }}>📭</div>
                  <div style={{
                    fontFamily: "'Share Tech Mono', monospace",
                    color: theme.faint, fontSize: '12px', letterSpacing: '2px',
                  }}>
                    // no messages for this identity
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {messages.map((message) => (
                    <MessageCard key={message.id} message={message} />
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </PageWrapper>
  )
}