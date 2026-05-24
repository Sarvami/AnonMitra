import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import PageWrapper from '../components/PageWrapper'
import Spinner from '../components/Spinner'
import { ToastContainer, useToast } from '../components/Toast'
import { useTheme } from '../ThemeContext'

const optionStyle = `
  select option {
    background: #1a1528 !important;
    color: #ede9fe !important;
  }
`

export default function Profile() {
  const { theme, isDark } = useTheme()
  const { toasts, addToast } = useToast()
  const [profile, setProfile] = useState({ fullName: '', phone: '', dob: '', country: '', email: '' })
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await fetch('/api/auth/me', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        })
        if (!response.ok) throw new Error('Failed to fetch user data')
        const userData = await response.json()
        const profileData = {
          fullName: userData.fullName || userData.name || '',
          phone:    userData.phone || '',
          dob:      userData.dob || userData.dateOfBirth || '',
          country:  userData.country || '',
          email:    userData.email || '',
        }
        setProfile(profileData)
        setForm(profileData)
        localStorage.setItem('userProfile', JSON.stringify(profileData))
      } catch {
        const stored = localStorage.getItem('userProfile')
        if (stored) {
          const parsed = JSON.parse(stored)
          setProfile(parsed)
          setForm(parsed)
        } else {
          setForm({ fullName: '', phone: '', dob: '', country: '', email: '' })
        }
      } finally {
        setLoading(false)
      }
    }
    fetchUserData()
  }, [])

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  const handleSave = async () => {
    setSaving(true)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/auth/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(form),
      })
      if (!response.ok) throw new Error()
      setProfile(form)
      localStorage.setItem('userProfile', JSON.stringify(form))
      setEditing(false)
      addToast('Profile updated successfully', 'success')
    } catch {
      addToast('Failed to update profile. Please try again.', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => { setForm(profile); setEditing(false) }

  const countryMap = {
    IN: '🇮🇳 India', US: '🇺🇸 United States', GB: '🇬🇧 United Kingdom',
    CA: '🇨🇦 Canada', AU: '🇦🇺 Australia', DE: '🇩🇪 Germany',
    FR: '🇫🇷 France', JP: '🇯🇵 Japan', SG: '🇸🇬 Singapore',
    AE: '🇦🇪 UAE', OTHER: '🌍 Other',
  }

  const inputStyle = {
    width: '100%', background: theme.input,
    border: `1px solid ${theme.border}`,
    borderRadius: '6px', padding: '10px 12px',
    color: theme.text, fontSize: '13px', outline: 'none',
    boxSizing: 'border-box',
    fontFamily: "'Share Tech Mono', monospace",
    transition: 'border-color 0.2s',
  }

  const labelStyle = {
    display: 'block', marginBottom: '6px',
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: '10px', letterSpacing: '2px',
    textTransform: 'uppercase', color: theme.muted,
  }

  const onFocus = (e) => { e.target.style.borderColor = 'rgba(139,92,246,0.55)' }
  const onBlur  = (e) => { e.target.style.borderColor = theme.border }

  const Field = ({ label, value, children }) => (
    <div>
      <label style={labelStyle}>{label}</label>
      {editing ? children : (
        <div style={{
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: '13px', color: value ? theme.text : theme.faint,
          padding: '10px 0', letterSpacing: '0.5px',
        }}>
          {value || '// not set'}
        </div>
      )}
    </div>
  )

  if (loading) return (
    <PageWrapper>
      <div style={{ minHeight: '100vh', background: theme.bg, display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '60vh', gap: '16px' }}>
          <Spinner size={32} />
          <div style={{
            fontFamily: "'Share Tech Mono', monospace",
            color: theme.faint, fontSize: '11px', letterSpacing: '3px',
          }}>
            LOADING PROFILE...
          </div>
        </div>
      </div>
    </PageWrapper>
  )

  return (
    <PageWrapper>
      <style>{optionStyle}</style>
      <div style={{ minHeight: '100vh', background: theme.bg, display: 'flex', flexDirection: 'column', position: 'relative' }}>
        <div className="grid-bg" style={{ position: 'fixed', inset: 0, opacity: 0.4, pointerEvents: 'none' }} />
        <Navbar />
        <ToastContainer toasts={toasts} />

        <div style={{ maxWidth: '700px', margin: '0 auto', padding: '32px 24px', width: '100%', position: 'relative' }}>

          {/* Page header */}
          <div style={{ marginBottom: '28px' }}>
            <div style={{
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: '10px', letterSpacing: '3px', color: theme.faint,
              textTransform: 'uppercase', marginBottom: '6px',
            }}>
              <span style={{ color: 'rgba(45,212,191,0.4)' }}>[ </span>
              user profile
              <span style={{ color: 'rgba(45,212,191,0.4)' }}> ]</span>
            </div>
            <h2 style={{ color: theme.text, fontSize: '1.5rem', fontWeight: '700', margin: 0, fontFamily: "'Inter', sans-serif" }}>
              Your Identity
            </h2>
          </div>

          {/* Avatar card */}
          <div style={{
            background: theme.card, border: `1px solid ${theme.border}`,
            borderRadius: '12px', padding: '24px', marginBottom: '16px',
            display: 'flex', alignItems: 'center', gap: '20px',
            boxShadow: `0 0 20px ${theme.glow}`,
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
              background: 'linear-gradient(90deg, #7c3aed, #0d9488)',
            }} />
            <div style={{
              width: '70px', height: '70px', borderRadius: '50%',
              background: 'rgba(139,92,246,0.12)',
              border: `2px solid rgba(139,92,246,0.4)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0, boxShadow: '0 0 20px rgba(139,92,246,0.25)',
            }}>
              <span style={{
                fontFamily: "'Share Tech Mono', monospace",
                fontSize: '28px', color: '#8b5cf6', fontWeight: '700',
              }}>
                {profile.fullName ? profile.fullName[0].toUpperCase() : '?'}
              </span>
            </div>
            <div>
              <div style={{ color: theme.text, fontWeight: '700', fontSize: '1.1rem', fontFamily: "'Inter', sans-serif" }}>
                {profile.fullName || 'Anonymous User'}
              </div>
              <div style={{
                fontFamily: "'Share Tech Mono', monospace",
                color: '#2dd4bf', fontSize: '12px', marginTop: '4px', letterSpacing: '0.5px',
              }}>
                {profile.email || '// no email set'}
              </div>
              {profile.country && (
                <div style={{
                  fontFamily: "'Share Tech Mono', monospace",
                  color: theme.faint, fontSize: '11px', marginTop: '4px',
                }}>
                  {countryMap[profile.country] || profile.country}
                </div>
              )}
            </div>
          </div>

          {/* Details card */}
          <div style={{
            background: theme.card, border: `1px solid ${theme.border}`,
            borderRadius: '12px', padding: '28px',
            boxShadow: `0 0 20px ${theme.glow}`,
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
              background: 'linear-gradient(90deg, #7c3aed, #0d9488)',
            }} />

            {/* Card header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', marginTop: '4px' }}>
              <div style={{
                fontFamily: "'Share Tech Mono', monospace",
                fontSize: '11px', letterSpacing: '2px',
                textTransform: 'uppercase', color: theme.muted,
              }}>
                Personal Details
              </div>
              {!editing ? (
                <button
                  onClick={() => setEditing(true)}
                  style={{
                    background: 'rgba(139,92,246,0.1)',
                    border: `1px solid rgba(139,92,246,0.35)`,
                    borderRadius: '6px', padding: '6px 16px',
                    color: '#8b5cf6', fontSize: '11px', letterSpacing: '1.5px',
                    cursor: 'pointer', fontFamily: "'Share Tech Mono', monospace",
                    transition: 'background 0.15s ease, border-color 0.15s ease',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'rgba(139,92,246,0.2)'
                    e.currentTarget.style.borderColor = 'rgba(139,92,246,0.6)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'rgba(139,92,246,0.1)'
                    e.currentTarget.style.borderColor = 'rgba(139,92,246,0.35)'
                  }}
                >
                  EDIT →
                </button>
              ) : (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={handleCancel}
                    style={{
                      background: 'transparent', border: `1px solid ${theme.border}`,
                      borderRadius: '6px', padding: '6px 14px',
                      color: theme.muted, fontSize: '11px', letterSpacing: '1px',
                      cursor: 'pointer', fontFamily: "'Share Tech Mono', monospace",
                      transition: 'border-color 0.15s ease',
                    }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(139,92,246,0.4)'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = theme.border}
                  >
                    CANCEL
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="btn-glow"
                    style={{
                      background: saving ? 'rgba(139,92,246,0.3)' : 'linear-gradient(135deg, #7c3aed, #0d9488)',
                      border: 'none', borderRadius: '6px', padding: '6px 16px',
                      color: '#fff', fontSize: '11px', letterSpacing: '1.5px',
                      cursor: saving ? 'not-allowed' : 'pointer',
                      fontFamily: "'Share Tech Mono', monospace",
                      display: 'flex', alignItems: 'center', gap: '6px',
                    }}
                  >
                    {saving && <Spinner size={12} />}
                    {saving ? 'SAVING...' : 'SAVE ✓'}
                  </button>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>

              <Field label="Full Name" value={profile.fullName}>
                <input style={inputStyle} type="text" value={form.fullName}
                  onChange={update('fullName')} placeholder="your full name"
                  onFocus={onFocus} onBlur={onBlur} />
              </Field>

              <Field label="Email" value={profile.email}>
                <div style={{
                  ...inputStyle, opacity: 0.55, cursor: 'not-allowed',
                  display: 'flex', alignItems: 'center',
                }}>
                  {profile.email}
                  <span style={{
                    marginLeft: 'auto', fontFamily: "'Share Tech Mono', monospace",
                    fontSize: '9px', color: theme.faint, letterSpacing: '1px',
                  }}>
                    // locked
                  </span>
                </div>
              </Field>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <Field label="Phone Number" value={profile.phone}>
                  <input style={inputStyle} type="tel" value={form.phone}
                    onChange={update('phone')} placeholder="+91 98765 43210"
                    onFocus={onFocus} onBlur={onBlur} />
                </Field>
                <Field label="Date of Birth" value={profile.dob}>
                  <input
                    style={{ ...inputStyle, colorScheme: isDark ? 'dark' : 'light' }}
                    type="date" value={form.dob} onChange={update('dob')}
                    onFocus={onFocus} onBlur={onBlur} />
                </Field>
              </div>

              <Field label="Country" value={countryMap[profile.country] || profile.country}>
                <select
                  style={{ ...inputStyle, cursor: 'pointer', background: '#1a1528', color: '#ede9fe', colorScheme: 'dark' }}
                  value={form.country} onChange={update('country')}
                  onFocus={onFocus} onBlur={onBlur}
                >
                  <option value="">-- select --</option>
                  <option value="IN">🇮🇳 India</option>
                  <option value="US">🇺🇸 United States</option>
                  <option value="GB">🇬🇧 United Kingdom</option>
                  <option value="CA">🇨🇦 Canada</option>
                  <option value="AU">🇦🇺 Australia</option>
                  <option value="DE">🇩🇪 Germany</option>
                  <option value="FR">🇫🇷 France</option>
                  <option value="JP">🇯🇵 Japan</option>
                  <option value="SG">🇸🇬 Singapore</option>
                  <option value="AE">🇦🇪 UAE</option>
                  <option value="OTHER">🌍 Other</option>
                </select>
              </Field>

            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}
