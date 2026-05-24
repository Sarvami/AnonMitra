import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import MessageCard from '../components/MessageCard'
import PageWrapper from '../components/PageWrapper'
import Spinner from '../components/Spinner'
import { getIdentities } from '../api/identities'
import { getMessages, simulateCustom } from '../api/messages'
import { useTheme } from '../ThemeContext'

export default function Inbox() {
  const { theme } = useTheme()
  const [identities, setIdentities] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [messages, setMessages] = useState([])
  const [loadingIdentities, setLoadingIdentities] = useState(true)
  const [loadingMessages, setLoadingMessages] = useState(false)
  const [error, setError] = useState('')

  const [simOpen, setSimOpen] = useState(false)
  const [simForm, setSimForm] = useState({ sender: '', subject: '', body: '' })
  const [simLoading, setSimLoading] = useState(false)
  const [simResult, setSimResult] = useState(null)
  const [simError, setSimError] = useState('')

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

  const handleToggleSpam = (updatedMessage) => {
    setMessages(prev => prev.map(m => m.id === updatedMessage.id ? { ...m, ...updatedMessage } : m))
  }

  const handleSimulate = async (e) => {
    e.preventDefault()
    if (!selectedId) return
    setSimLoading(true)
    setSimResult(null)
    setSimError('')
    try {
      const res = await simulateCustom({
        identity_id: selectedId,
        sender:  simForm.sender,
        subject: simForm.subject,
        body:    simForm.body,
      })
      setSimResult(res.data)
      setMessages(prev => [res.data, ...prev])
      setSimForm({ sender: '', subject: '', body: '' })
    } catch (err) {
      setSimError(err?.response?.data?.detail || 'Simulation failed')
    } finally {
      setSimLoading(false)
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

        <div style={{
          maxWidth: '1100px', margin: '0 auto',
          padding: '32px 24px', width: '100%',
          boxSizing: 'border-box', position: 'relative',
        }}>

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
            <h2 style={{
              color: theme.text, fontSize: '1.5rem', fontWeight: '700',
              margin: 0, fontFamily: "'Inter', sans-serif",
            }}>
              Inbox
            </h2>
          </div>

          {error && (
            <div style={{
              background: 'rgba(244,63,94,0.1)', border: `1px solid rgba(244,63,94,0.4)`,
              color: '#f43f5e', borderRadius: '6px', padding: '10px 14px',
              marginBottom: '20px', fontSize: '11px',
              fontFamily: "'Share Tech Mono', monospace", letterSpacing: '0.5px',
            }}>
              ⚠ {error}
            </div>
          )}

          {/* ── Simulate Message Panel ── */}
          <div style={{
            background: theme.card, border: `1px solid ${theme.border}`,
            borderRadius: '10px', marginBottom: '16px',
            boxShadow: `0 0 16px ${theme.glow}`, overflow: 'hidden',
            position: 'relative',
          }}>
            {/* Top accent */}
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
              background: 'linear-gradient(90deg, #7c3aed, #0d9488)',
            }} />

            <button
              onClick={() => { setSimOpen(o => !o); setSimResult(null); setSimError('') }}
              style={{
                width: '100%', background: 'transparent', border: 'none',
                padding: '14px 20px', cursor: 'pointer',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '14px' }}>⚡</span>
                <span style={{
                  fontFamily: "'Share Tech Mono', monospace",
                  color: theme.text, fontSize: '12px', letterSpacing: '1.5px',
                }}>
                  SIMULATE_MESSAGE
                </span>
                <span style={{
                  fontFamily: "'Share Tech Mono', monospace",
                  color: theme.faint, fontSize: '10px', letterSpacing: '0.5px',
                }}>
                  // test how a custom message gets classified
                </span>
              </div>
              <span style={{
                fontFamily: "'Share Tech Mono', monospace",
                color: theme.faint, fontSize: '14px',
                transform: simOpen ? 'rotate(180deg)' : 'none',
                transition: 'transform 0.2s ease',
                display: 'inline-block',
              }}>▾</span>
            </button>

            {simOpen && (
              <div style={{ padding: '0 20px 20px', borderTop: `1px solid ${theme.border}` }}>
                {!selectedId ? (
                  <div style={{
                    fontFamily: "'Share Tech Mono', monospace",
                    color: theme.faint, fontSize: '11px', letterSpacing: '1px',
                    paddingTop: '16px',
                  }}>
                    // select an identity first
                  </div>
                ) : (
                  <form onSubmit={handleSimulate} style={{ paddingTop: '16px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                      <SimField label="SENDER"  placeholder="attacker@phish.io"
                        value={simForm.sender}  onChange={v => setSimForm(f => ({ ...f, sender: v }))}  theme={theme} />
                      <SimField label="SUBJECT" placeholder="You've won a prize!"
                        value={simForm.subject} onChange={v => setSimForm(f => ({ ...f, subject: v }))} theme={theme} />
                    </div>
                    <SimField
                      label="BODY"
                      placeholder="Click here to claim your free reward before it expires..."
                      value={simForm.body}
                      onChange={v => setSimForm(f => ({ ...f, body: v }))}
                      theme={theme}
                      multiline
                    />

                    {simError && (
                      <div style={{
                        fontFamily: "'Share Tech Mono', monospace",
                        color: '#f43f5e', fontSize: '11px', letterSpacing: '0.5px',
                        marginTop: '10px',
                      }}>
                        ⚠ {simError}
                      </div>
                    )}

                    {simResult && <SimResultPanel result={simResult} theme={theme} />}

                    <button
                      type="submit"
                      disabled={simLoading || !simForm.sender.trim() || !simForm.body.trim()}
                      style={{
                        marginTop: '14px',
                        background: 'transparent',
                        border: `1px solid rgba(139,92,246,0.5)`,
                        color: theme.text,
                        borderRadius: '6px',
                        padding: '8px 20px',
                        cursor: simLoading ? 'not-allowed' : 'pointer',
                        fontSize: '11px',
                        fontFamily: "'Share Tech Mono', monospace",
                        letterSpacing: '1.5px',
                        opacity: (!simForm.sender.trim() || !simForm.body.trim()) ? 0.4 : 1,
                        transition: 'all 0.15s ease',
                        display: 'flex', alignItems: 'center', gap: '8px',
                      }}
                    >
                      {simLoading && <Spinner size={14} />}
                      {simLoading ? 'CLASSIFYING...' : 'RUN_SIMULATION →'}
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>

          {/* ── Main layout ── */}
          <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '16px', alignItems: 'start' }}>

            {/* Sidebar */}
            <div style={{
              background: theme.card, border: `1px solid ${theme.border}`,
              borderRadius: '10px', padding: '16px',
              boxShadow: `0 0 16px ${theme.glow}`,
              position: 'relative', overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
                background: 'linear-gradient(90deg, #7c3aed, #0d9488)',
              }} />
              <div style={{
                fontFamily: "'Share Tech Mono', monospace",
                fontSize: '9px', letterSpacing: '2.5px',
                textTransform: 'uppercase', color: theme.faint,
                marginBottom: '14px', paddingBottom: '10px',
                borderBottom: `1px solid ${theme.border}`,
                marginTop: '4px',
              }}>
                // identities
              </div>

              {loadingIdentities ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '20px 0' }}>
                  <Spinner size={24} />
                </div>
              ) : identities.length === 0 ? (
                <div style={{ fontFamily: "'Share Tech Mono', monospace", color: theme.faint, fontSize: '11px' }}>
                  // no identities found
                </div>
              ) : (
                identities.map((identity) => (
                  <div
                    key={identity.id}
                    onClick={() => setSelectedId(identity.id)}
                    className="card-hover"
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
              position: 'relative', overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
                background: 'linear-gradient(90deg, #7c3aed, #0d9488)',
              }} />

              {selectedIdentity && (
                <div style={{
                  display: 'flex', justifyContent: 'space-between',
                  alignItems: 'center', paddingBottom: '16px',
                  borderBottom: `1px solid ${theme.border}`, marginBottom: '20px',
                  marginTop: '4px',
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
                      color: '#f43f5e', fontSize: '11px', letterSpacing: '1px',
                    }}>
                      ⚠ {spamCount} spam
                    </span>
                  </div>
                </div>
              )}

              {loadingMessages ? (
                <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '40px' }}>
                  <Spinner size={28} />
                </div>
              ) : messages.length === 0 ? (
                <div style={{ textAlign: 'center', marginTop: '60px' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '16px', opacity: 0.35 }}>📭</div>
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
                    <MessageCard key={message.id} message={message} onToggleSpam={handleToggleSpam} />
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

function SimField({ label, placeholder, value, onChange, theme, multiline = false }) {
  const base = {
    width: '100%',
    background: 'rgba(139,92,246,0.05)',
    border: `1px solid ${theme.border}`,
    borderRadius: '6px',
    padding: '8px 12px',
    color: theme.text,
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: '12px',
    letterSpacing: '0.3px',
    outline: 'none',
    boxSizing: 'border-box',
    resize: multiline ? 'vertical' : undefined,
    transition: 'border-color 0.2s',
  }
  return (
    <div>
      <div style={{
        fontFamily: "'Share Tech Mono', monospace",
        color: theme.faint, fontSize: '9px',
        letterSpacing: '2px', marginBottom: '5px',
        textTransform: 'uppercase',
      }}>
        {label}
      </div>
      {multiline ? (
        <textarea
          rows={3} placeholder={placeholder} value={value}
          onChange={e => onChange(e.target.value)}
          onFocus={e => e.target.style.borderColor = 'rgba(139,92,246,0.55)'}
          onBlur={e  => e.target.style.borderColor = theme.border}
          style={base}
        />
      ) : (
        <input
          type="text" placeholder={placeholder} value={value}
          onChange={e => onChange(e.target.value)}
          onFocus={e => e.target.style.borderColor = 'rgba(139,92,246,0.55)'}
          onBlur={e  => e.target.style.borderColor = theme.border}
          style={base}
        />
      )}
    </div>
  )
}

function SimResultPanel({ result, theme }) {
  const c = result.classification
  const isSpam = c.final_is_spam
  const accentColor = isSpam ? '#f43f5e' : '#2dd4bf'

  const badgeColor = {
    high:     '#f43f5e',
    moderate: '#f59e0b',
    safe:     '#2dd4bf',
  }

  return (
    <div style={{
      marginTop: '14px',
      background: isSpam ? 'rgba(244,63,94,0.05)' : 'rgba(45,212,191,0.05)',
      border: `1px solid ${accentColor}40`,
      borderRadius: '8px',
      padding: '14px 16px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
        <span style={{ fontSize: '16px' }}>{isSpam ? '⚠' : '✓'}</span>
        <span style={{
          fontFamily: "'Share Tech Mono', monospace",
          color: accentColor, fontSize: '13px', fontWeight: '700', letterSpacing: '1px',
        }}>
          {isSpam ? 'SPAM_DETECTED' : 'CLEAN_MESSAGE'}
        </span>
        <span style={{ fontFamily: "'Share Tech Mono', monospace", color: theme.faint, fontSize: '10px' }}>
          // risk: <span style={{ color: accentColor }}>{(c.final_risk_score * 100).toFixed(1)}%</span>
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        {/* Rules layer */}
        <div style={{
          background: theme.bg, borderRadius: '6px', padding: '10px 12px',
          border: `1px solid ${theme.border}`,
        }}>
          <div style={{
            fontFamily: "'Share Tech Mono', monospace",
            color: theme.faint, fontSize: '9px', letterSpacing: '2px',
            marginBottom: '6px', textTransform: 'uppercase',
          }}>
            rule-based
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span style={{
              fontFamily: "'Share Tech Mono', monospace",
              color: badgeColor[c.rules.risk_badge] || '#2dd4bf',
              fontSize: '11px', letterSpacing: '1px',
            }}>
              {c.rules.risk_badge?.toUpperCase()}
            </span>
            <span style={{ fontFamily: "'Share Tech Mono', monospace", color: theme.faint, fontSize: '10px' }}>
              {(c.rules.risk_score * 100).toFixed(0)}%
            </span>
          </div>
          {c.rules.matched_keywords.length > 0 ? (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
              {c.rules.matched_keywords.map(kw => (
                <span key={kw} style={{
                  fontFamily: "'Share Tech Mono', monospace",
                  fontSize: '9px', color: '#f43f5e',
                  background: 'rgba(244,63,94,0.1)',
                  border: '1px solid rgba(244,63,94,0.25)',
                  borderRadius: '3px', padding: '1px 6px',
                }}>
                  {kw}
                </span>
              ))}
            </div>
          ) : (
            <span style={{ fontFamily: "'Share Tech Mono', monospace", color: theme.faint, fontSize: '10px' }}>
              // no keywords matched
            </span>
          )}
        </div>

        {/* ML layer */}
        <div style={{
          background: theme.bg, borderRadius: '6px', padding: '10px 12px',
          border: `1px solid ${theme.border}`,
        }}>
          <div style={{
            fontFamily: "'Share Tech Mono', monospace",
            color: theme.faint, fontSize: '9px', letterSpacing: '2px',
            marginBottom: '6px', textTransform: 'uppercase',
          }}>
            naive bayes ml
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span style={{
              fontFamily: "'Share Tech Mono', monospace",
              color: badgeColor[c.ml.risk_badge] || '#2dd4bf',
              fontSize: '11px', letterSpacing: '1px',
            }}>
              {c.ml.risk_badge?.toUpperCase()}
            </span>
            <span style={{ fontFamily: "'Share Tech Mono', monospace", color: theme.faint, fontSize: '10px' }}>
              {(c.ml.confidence * 100).toFixed(0)}% confidence
            </span>
          </div>
          <span style={{
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: '10px',
            color: c.ml.is_spam ? '#f43f5e' : '#2dd4bf',
          }}>
            {c.ml.is_spam ? '⚠ classified as spam' : '✓ classified as clean'}
          </span>
        </div>
      </div>
    </div>
  )
}
