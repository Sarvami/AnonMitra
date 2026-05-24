import { useState } from 'react'
import Navbar from '../components/Navbar'
import Spinner from '../components/Spinner'
import { detectText, detectImage } from '../api/detector'
import { useTheme } from '../ThemeContext'
import PageWrapper from '../components/PageWrapper'

export default function Detector() {
  const { theme } = useTheme()
  const [activeTab, setActiveTab] = useState('text')
  const [text, setText] = useState('')
  const [textResult, setTextResult] = useState(null)
  const [textLoading, setTextLoading] = useState(false)
  const [textError, setTextError] = useState('')
  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [imageResult, setImageResult] = useState(null)
  const [imageLoading, setImageLoading] = useState(false)
  const [imageError, setImageError] = useState('')

  const handleTextDetect = async () => {
    if (!text.trim()) return
    setTextLoading(true); setTextError(''); setTextResult(null)
    try {
      const res = await detectText(text)
      setTextResult(res.data)
    } catch (err) {
      setTextError(err.response?.data?.detail || 'Detection failed')
    } finally {
      setTextLoading(false)
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setImage(file)
    setImagePreview(URL.createObjectURL(file))
    setImageResult(null); setImageError('')
  }

  const handleImageDetect = async () => {
    if (!image) return
    setImageLoading(true); setImageError(''); setImageResult(null)
    try {
      const formData = new FormData()
      formData.append('file', image)
      const res = await detectImage(formData)
      setImageResult(res.data)
    } catch (err) {
      setImageError(err.response?.data?.detail || 'Detection failed')
    } finally {
      setImageLoading(false)
    }
  }

  const tabs = [
    { id: 'text',  label: 'TEXT_SCAN',  icon: '📄' },
    { id: 'image', label: 'IMG_SCAN',   icon: '🖼️' },
  ]

  return (
    <PageWrapper>
      <div style={{ minHeight: '100vh', background: theme.bg, display: 'flex', flexDirection: 'column', position: 'relative' }}>
        <div className="grid-bg" style={{ position: 'fixed', inset: 0, opacity: 0.4, pointerEvents: 'none' }} />
        <Navbar />

        <div style={{ maxWidth: '820px', margin: '0 auto', padding: '32px 24px', width: '100%', position: 'relative' }}>

          {/* Page header */}
          <div style={{ marginBottom: '28px' }}>
            <div style={{
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: '10px', letterSpacing: '3px', color: theme.faint,
              textTransform: 'uppercase', marginBottom: '6px',
            }}>
              <span style={{ color: 'rgba(45,212,191,0.4)' }}>[ </span>
              ai content analysis
              <span style={{ color: 'rgba(45,212,191,0.4)' }}> ]</span>
            </div>
            <h2 style={{ color: theme.text, fontSize: '1.5rem', fontWeight: '700', margin: 0, fontFamily: "'Inter', sans-serif" }}>
              AI Content Detector
            </h2>
            <div style={{
              fontFamily: "'Share Tech Mono', monospace",
              color: theme.faint, fontSize: '11px', marginTop: '4px', letterSpacing: '1px',
            }}>
              // detect whether content is AI-generated or human-made
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  background: activeTab === tab.id ? 'rgba(139,92,246,0.15)' : theme.card,
                  border: `1px solid ${activeTab === tab.id ? 'rgba(139,92,246,0.5)' : theme.border}`,
                  borderRadius: '6px', padding: '8px 20px',
                  color: activeTab === tab.id ? '#8b5cf6' : theme.muted,
                  cursor: 'pointer', fontSize: '11px', letterSpacing: '2px',
                  fontFamily: "'Share Tech Mono', monospace",
                  transition: 'all 0.15s ease',
                  display: 'flex', alignItems: 'center', gap: '7px',
                }}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Panel */}
          <div style={{
            background: theme.card, border: `1px solid ${theme.border}`,
            borderRadius: '12px', padding: '28px',
            boxShadow: `0 0 24px ${theme.glow}`,
            position: 'relative', overflow: 'hidden',
          }}>
            {/* Top accent */}
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
              background: 'linear-gradient(90deg, #7c3aed, #0d9488)',
            }} />

            {/* ── Text Tab ── */}
            {activeTab === 'text' && (
              <>
                <div style={{
                  fontFamily: "'Share Tech Mono', monospace",
                  color: theme.faint, fontSize: '11px', marginBottom: '14px', letterSpacing: '0.5px',
                }}>
                  // paste any text or article below to analyze it
                </div>
                <textarea
                  style={{
                    width: '100%', background: theme.input,
                    border: `1px solid ${theme.border}`,
                    borderRadius: '8px', padding: '14px',
                    color: theme.text, fontSize: '13px',
                    resize: 'vertical', outline: 'none',
                    fontFamily: "'Inter', sans-serif",
                    lineHeight: '1.7', boxSizing: 'border-box',
                    transition: 'border-color 0.2s',
                  }}
                  rows={10}
                  placeholder="Paste a news article, essay, or any text here..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onFocus={e => e.target.style.borderColor = 'rgba(139,92,246,0.55)'}
                  onBlur={e  => e.target.style.borderColor = theme.border}
                />
                <button
                  onClick={handleTextDetect}
                  disabled={textLoading || !text.trim()}
                  className="btn-glow"
                  style={{
                    background: textLoading || !text.trim()
                      ? 'rgba(139,92,246,0.2)'
                      : 'linear-gradient(135deg, #7c3aed, #0d9488)',
                    color: '#fff', border: 'none', borderRadius: '6px',
                    padding: '10px 24px', fontSize: '11px', letterSpacing: '2px',
                    cursor: textLoading || !text.trim() ? 'not-allowed' : 'pointer',
                    marginTop: '14px',
                    fontFamily: "'Share Tech Mono', monospace",
                    display: 'flex', alignItems: 'center', gap: '8px',
                    opacity: !text.trim() ? 0.5 : 1,
                  }}
                >
                  {textLoading && <Spinner size={14} />}
                  {textLoading ? 'SCANNING...' : 'RUN_SCAN →'}
                </button>
                {textError && <ErrorBanner msg={textError} />}
                {textResult && (
                  <ResultCard
                    verdict={textResult.result}
                    confidence={textResult.confidence}
                    explanation={textResult.explanation}
                    type="text"
                    theme={theme}
                  />
                )}
              </>
            )}

            {/* ── Image Tab ── */}
            {activeTab === 'image' && (
              <>
                <div style={{
                  fontFamily: "'Share Tech Mono', monospace",
                  color: theme.faint, fontSize: '11px', marginBottom: '14px', letterSpacing: '0.5px',
                }}>
                  // upload an image to check if it was AI-generated
                </div>
                <label style={{ display: 'block', cursor: 'pointer', borderRadius: '8px', overflow: 'hidden' }}>
                  <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
                  {imagePreview ? (
                    <img
                      src={imagePreview} alt="preview"
                      style={{
                        width: '100%', maxHeight: '300px',
                        objectFit: 'contain', borderRadius: '8px',
                        border: `1px solid ${theme.border}`,
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        background: theme.input,
                        border: `2px dashed rgba(139,92,246,0.25)`,
                        borderRadius: '8px', padding: '52px',
                        textAlign: 'center', transition: 'border-color 0.2s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(139,92,246,0.55)'}
                      onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(139,92,246,0.25)'}
                    >
                      <div style={{ fontSize: '2.5rem', marginBottom: '12px', opacity: 0.45 }}>📁</div>
                      <div style={{
                        fontFamily: "'Share Tech Mono', monospace",
                        color: '#8b5cf6', fontSize: '12px', letterSpacing: '2px',
                      }}>
                        CLICK_TO_UPLOAD
                      </div>
                      <div style={{
                        fontFamily: "'Share Tech Mono', monospace",
                        color: theme.faint, fontSize: '10px', marginTop: '6px', letterSpacing: '1px',
                      }}>
                        // PNG, JPG, WEBP supported
                      </div>
                    </div>
                  )}
                </label>
                {image && (
                  <button
                    onClick={handleImageDetect}
                    disabled={imageLoading}
                    className="btn-glow"
                    style={{
                      background: imageLoading
                        ? 'rgba(139,92,246,0.2)'
                        : 'linear-gradient(135deg, #7c3aed, #0d9488)',
                      color: '#fff', border: 'none', borderRadius: '6px',
                      padding: '10px 24px', fontSize: '11px', letterSpacing: '2px',
                      cursor: imageLoading ? 'not-allowed' : 'pointer',
                      marginTop: '14px',
                      fontFamily: "'Share Tech Mono', monospace",
                      display: 'flex', alignItems: 'center', gap: '8px',
                    }}
                  >
                    {imageLoading && <Spinner size={14} />}
                    {imageLoading ? 'SCANNING...' : 'RUN_SCAN →'}
                  </button>
                )}
                {imageError && <ErrorBanner msg={imageError} />}
                {imageResult && (
                  <ResultCard
                    verdict={imageResult.result}
                    confidence={imageResult.confidence}
                    explanation={imageResult.explanation}
                    type="image"
                    theme={theme}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}

function ErrorBanner({ msg }) {
  return (
    <div style={{
      background: 'rgba(244,63,94,0.1)', border: `1px solid rgba(244,63,94,0.4)`,
      color: '#f43f5e', borderRadius: '6px', padding: '10px 14px',
      marginTop: '14px', fontSize: '11px',
      fontFamily: "'Share Tech Mono', monospace", letterSpacing: '0.5px',
    }}>
      ⚠ {msg}
    </div>
  )
}

function ResultCard({ verdict, confidence, explanation, type, theme }) {
  const isAI = (verdict || '').toLowerCase().includes('ai')
  const accentColor = isAI ? '#f43f5e' : '#2dd4bf'

  const confidencePct = type === 'text'
    ? Math.round(confidence || 0)
    : Math.round((confidence || 0) * 100)

  const verdictLabel = isAI
    ? 'AI_GENERATED'
    : type === 'image' ? 'HUMAN_GENERATED' : 'HUMAN_WRITTEN'

  const icon = isAI ? '🤖' : type === 'image' ? '🖼️' : '👤'

  return (
    <div style={{
      border: `1px solid ${accentColor}40`,
      background: accentColor + '0d',
      borderRadius: '10px', padding: '20px', marginTop: '20px',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Left accent bar */}
      <div style={{
        position: 'absolute', top: 0, left: 0, bottom: 0, width: '3px',
        background: accentColor,
        opacity: 0.7,
      }} />

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
        <div style={{
          width: '46px', height: '46px', borderRadius: '8px',
          background: accentColor + '20',
          border: `1px solid ${accentColor}50`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.4rem', flexShrink: 0,
          boxShadow: `0 0 12px ${accentColor}20`,
        }}>
          {icon}
        </div>
        <div>
          <div style={{
            fontFamily: "'Share Tech Mono', monospace",
            fontWeight: '700', fontSize: '14px',
            color: accentColor, letterSpacing: '2px',
          }}>
            {verdictLabel}
          </div>
          <div style={{
            fontFamily: "'Share Tech Mono', monospace",
            color: theme.muted, fontSize: '11px',
            marginTop: '3px', letterSpacing: '1px',
          }}>
            // confidence: {confidencePct}%
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{
        background: 'rgba(139,92,246,0.1)', borderRadius: '2px',
        height: '4px', overflow: 'hidden', marginBottom: '14px',
      }}>
        <div style={{
          height: '100%', borderRadius: '2px',
          width: `${confidencePct}%`,
          background: `linear-gradient(90deg, ${accentColor}80, ${accentColor})`,
          transition: 'width 0.6s ease',
        }} />
      </div>

      {explanation && (
        <div style={{
          fontFamily: "'Inter', sans-serif",
          color: theme.muted, fontSize: '13px', lineHeight: '1.7',
          borderTop: `1px solid ${theme.border}`, paddingTop: '12px',
        }}>
          {explanation}
        </div>
      )}
    </div>
  )
}
