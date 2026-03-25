import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import PageWrapper from '../components/PageWrapper'
import { ToastContainer, useToast } from '../components/Toast'
import { useTheme } from '../ThemeContext'

export default function Profile() {
  const { theme } = useTheme()
  const { toasts, addToast } = useToast()
  const [profile, setProfile] = useState({
    fullName: '',
    phone: '',
    dob: '',
    country: '',
    email: '',
  })
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({})
useEffect(() => {
  const stored = localStorage.getItem('userProfile')
  if (stored) {
    const parsed = JSON.parse(stored)
    setProfile(parsed)
    setForm(parsed)
  } else {
    // Set empty defaults to avoid uncontrolled input warning
    setForm({
      fullName: '',
      phone: '',
      dob: '',
      country: '',
      email: '',
    })
  }
}, [])

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  const handleSave = () => {
    localStorage.setItem('userProfile', JSON.stringify(form))
    setProfile(form)
    setEditing(false)
    addToast('Profile updated successfully!', 'success')
  }

  const handleCancel = () => {
    setForm(profile)
    setEditing(false)
  }

  const countryMap = {
    IN: '🇮🇳 India', US: '🇺🇸 United States', GB: '🇬🇧 United Kingdom',
    CA: '🇨🇦 Canada', AU: '🇦🇺 Australia', DE: '🇩🇪 Germany',
    FR: '🇫🇷 France', JP: '🇯🇵 Japan', SG: '🇸🇬 Singapore',
    AE: '🇦🇪 UAE', OTHER: '🌍 Other',
  }

  const inputStyle = {
    background: theme.input,
    border: `1px solid ${theme.border}`,
    borderRadius: '8px',
    padding: '12px 16px',
    color: theme.text,
    fontSize: '0.95rem',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
    fontFamily: 'Inter, sans-serif',
  }

  const labelStyle = {
    color: theme.muted,
    fontSize: '0.8rem',
    fontWeight: '600',
    display: 'block',
    marginBottom: '6px',
  }

  return (
    <PageWrapper>
      <div style={{ minHeight: '100vh', background: theme.bg, display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <ToastContainer toasts={toasts} />

        <div style={{ maxWidth: '700px', margin: '0 auto', padding: '32px 24px', width: '100%' }}>
          <h2 style={{ color: theme.text, fontSize: '1.6rem', fontWeight: '700', margin: 0 }}>👤 Profile</h2>
          <p style={{ color: theme.muted, fontSize: '0.9rem', marginTop: '4px', marginBottom: '28px' }}>
            Your personal information
          </p>

          {/* Avatar + Name */}
          <div style={{
            background: theme.card,
            border: `1px solid ${theme.border}`,
            borderRadius: '14px',
            padding: '28px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
          }}>
            <div style={{
              width: '72px', height: '72px',
              borderRadius: '50%',
              background: theme.blue + '30',
              border: `2px solid ${theme.blue}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              flexShrink: 0,
            }}>
              {profile.fullName ? profile.fullName[0].toUpperCase() : '?'}
            </div>
            <div>
              <div style={{ color: theme.text, fontWeight: '700', fontSize: '1.2rem' }}>
                {profile.fullName || 'Anonymous User'}
              </div>
              <div style={{ color: theme.blue, fontSize: '0.9rem', marginTop: '4px' }}>
                {profile.email || 'No email set'}
              </div>
              {profile.country && (
                <div style={{ color: theme.muted, fontSize: '0.85rem', marginTop: '4px' }}>
                  {countryMap[profile.country] || profile.country}
                </div>
              )}
            </div>
          </div>

          {/* Info Cards */}
          <div style={{
            background: theme.card,
            border: `1px solid ${theme.border}`,
            borderRadius: '14px',
            padding: '28px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ color: theme.text, fontWeight: '700', fontSize: '1rem', margin: 0 }}>
                Personal Details
              </h3>
              {!editing ? (
                <button
                  onClick={() => setEditing(true)}
                  style={{
                    background: theme.blue + '20',
                    border: `1px solid ${theme.blue}`,
                    borderRadius: '8px',
                    padding: '8px 18px',
                    color: theme.blue,
                    fontWeight: '600',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                  }}
                >
                  ✏️ Edit
                </button>
              ) : (
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={handleCancel}
                    style={{
                      background: 'transparent',
                      border: `1px solid ${theme.border}`,
                      borderRadius: '8px',
                      padding: '8px 18px',
                      color: theme.muted,
                      fontWeight: '600',
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    style={{
                      background: theme.green,
                      border: 'none',
                      borderRadius: '8px',
                      padding: '8px 18px',
                      color: '#1e1e2e',
                      fontWeight: '700',
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                    }}
                  >
                    Save
                  </button>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

              {/* Full Name */}
              <div>
                <label style={labelStyle}>Full Name</label>
                {editing ? (
                  <input style={inputStyle} type="text" value={form.fullName} onChange={update('fullName')} placeholder="Your full name" />
                ) : (
                  <div style={{ color: theme.text, fontSize: '0.95rem', padding: '12px 0' }}>
                    {profile.fullName || <span style={{ color: theme.faint }}>Not set</span>}
                  </div>
                )}
              </div>

              {/* Email */}
              <div>
                <label style={labelStyle}>Email</label>
                <div style={{ color: theme.text, fontSize: '0.95rem', padding: '12px 0' }}>
                  {profile.email || <span style={{ color: theme.faint }}>Not set</span>}
                </div>
              </div>

              {/* Phone + DOB */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={labelStyle}>Phone Number</label>
                  {editing ? (
                    <input style={inputStyle} type="tel" value={form.phone} onChange={update('phone')} placeholder="+91 98765 43210" />
                  ) : (
                    <div style={{ color: theme.text, fontSize: '0.95rem', padding: '12px 0' }}>
                      {profile.phone || <span style={{ color: theme.faint }}>Not set</span>}
                    </div>
                  )}
                </div>
                <div>
                  <label style={labelStyle}>Date of Birth</label>
                  {editing ? (
                    <input style={inputStyle} type="date" value={form.dob} onChange={update('dob')} />
                  ) : (
                    <div style={{ color: theme.text, fontSize: '0.95rem', padding: '12px 0' }}>
                      {profile.dob || <span style={{ color: theme.faint }}>Not set</span>}
                    </div>
                  )}
                </div>
              </div>

              {/* Country */}
              <div>
                <label style={labelStyle}>Country</label>
                {editing ? (
                  <select style={{ ...inputStyle, cursor: 'pointer' }} value={form.country} onChange={update('country')}>
                    <option value="">Select your country</option>
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
                ) : (
                  <div style={{ color: theme.text, fontSize: '0.95rem', padding: '12px 0' }}>
                    {countryMap[profile.country] || <span style={{ color: theme.faint }}>Not set</span>}
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}