import { useState } from 'react'
import Navbar from '../components/Navbar'
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
    { id: 'text',  label: 'TEXT_SCAN' },
    { id: 'image', label: 'IMG_SCAN'  },
  ]

  return (
    <PageWrapper>
      <div style={{ minHeight: '100vh', background: theme.bg, display: 'flex', flexDirection: 'column', position: 'relative' }}>
        <div className="grid-bg" style={{ position: 'fixed', inset: 0, opacity: 0.4, pointerEvents: 'none' }} />
        <Navbar />

        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '32px 24px', width: '100%', position: 'relative' }}>

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
            <p style={{
              fontFamily: "'Inter', sans-serif",
              color: theme.muted, fontSize: '13px', marginTop: '6px',
            }}>
              Detect whether content is AI-generated or human-made
            </p>
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
                  color: activeTab === tab.id ? theme.blue : theme.muted,
                  cursor: 'pointer', fontSize: '11px', letterSpacing: '2px',
                  fontFamily: "'Share Tech Mono', monospace",
                  transition: 'all 0.15s ease',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Panel */}
          <div style={{
            background: theme.card, border: `1px solid ${theme.border}`,
            borderRadius: '12px', padding: '28px',
            boxShadow: `0 0 24px ${theme.glow}`,
          }}>

            {/* ── Text Tab ── */}
            {activeTab === 'text' && (
              <>
                <p style={{
                  fontFamily: "'Inter', sans-serif",
                  color: theme.muted, fontSize: '13px', marginBottom: '12px',
                }}>
                  Paste any text or article below to analyze it
                </p>

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
                  style={{
                    background: 'linear-gradient(135deg, #7c3aed, #0d9488)',
                    color: '#fff', border: 'none', borderRadius: '6px',
                    padding: '10px 24px', fontSize: '12px', letterSpacing: '2px',
                    cursor: 'pointer', marginTop: '14px',
                    fontFamily: "'Share Tech Mono', monospace",
                    display: 'block',
                  }}
                >
                  {textLoading ? 'SCANNING...' : 'RUN_SCAN →'}
                </button>

                {textError && <ErrorBanner msg={textError} theme={theme} />}
                {textResult && (
                  <ResultCard
                    verdict={textResult.result}
                    confidence={textResult.confidence}
                    explanation={textResult.explanation}
                    theme={theme}
                  />
                )}
              </>
            )}

            {/* ── Image Tab ── */}
            {activeTab === 'image' && (
              <>
                <p style={{
                  fontFamily: "'Inter', sans-serif",
                  color: theme.muted, fontSize: '13px', marginBottom: '12px',
                }}>
                  Upload an image to check if it was AI-generated
                </p>

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
                        borderRadius: '8px', padding: '48px',
                        textAlign: 'center', transition: 'border-color 0.2s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(139,92,246,0.5)'}
                      onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(139,92,246,0.25)'}
                    >
                      <div style={{ fontSize: '2.5rem', marginBottom: '12px', opacity: 0.5 }}>📁</div>
                      <div style={{
                        fontFamily: "'Share Tech Mono', monospace",
                        color: theme.blue, fontSize: '12px', letterSpacing: '1.5px',
                      }}>
                        CLICK TO UPLOAD
                      </div>
                      <div style={{
                        fontFamily: "'Inter', sans-serif",
                        color: theme.muted, fontSize: '12px', marginTop: '6px',
                      }}>
                        PNG, JPG, WEBP supported
                      </div>
                    </div>
                  )}
                </label>

                {image && (
                  <button
                    onClick={handleImageDetect}
                    disabled={imageLoading}
                    style={{
                      background: 'linear-gradient(135deg, #7c3aed, #0d9488)',
                      color: '#fff', border: 'none', borderRadius: '6px',
                      padding: '10px 24px', fontSize: '12px', letterSpacing: '2px',
                      cursor: 'pointer', marginTop: '14px',
                      fontFamily: "'Share Tech Mono', monospace",
                      display: 'block',
                    }}
                  >
                    {imageLoading ? 'SCANNING...' : 'RUN_SCAN →'}
                  </button>
                )}

                {imageError && <ErrorBanner msg={imageError} theme={theme} />}
                {imageResult && (
                  <ResultCard
                    verdict={imageResult.result}
                    confidence={imageResult.confidence}
                    explanation={imageResult.explanation}
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

function ErrorBanner({ msg, theme }) {
  return (
    <div style={{
      background: theme.red + '15', border: `1px solid ${theme.red}`,
      color: theme.red, borderRadius: '6px', padding: '10px 14px',
      marginTop: '14px', fontSize: '12px',
      fontFamily: "'Share Tech Mono', monospace", letterSpacing: '0.5px',
    }}>
      ⚠ {msg}
    </div>
  )
}

function ResultCard({ verdict, confidence, explanation, theme }) {
  const isAI = verdict?.toLowerCase().includes('ai')
  const confidencePct = Math.round((confidence || 0) * 100)
  const accentColor = isAI ? theme.red : theme.teal

  return (
    <div style={{
      border: `1px solid ${accentColor}40`,
      background: accentColor + '0d',
      borderRadius: '10px', padding: '20px', marginTop: '20px',
    }}>

      {/* Verdict row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
        <div style={{
          width: '44px', height: '44px', borderRadius: '8px',
          background: accentColor + '20',
          border: `1px solid ${accentColor}50`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.4rem', flexShrink: 0,
        }}>
          {isAI ? '🤖' : '👤'}
        </div>
        <div>
          <div style={{
            fontFamily: "'Share Tech Mono', monospace",
            fontWeight: '700', fontSize: '14px',
            color: accentColor, letterSpacing: '1.5px',
          }}>
            {isAI ? 'AI_GENERATED' : 'HUMAN_WRITTEN'}
          </div>
          <div style={{
            fontFamily: "'Share Tech Mono', monospace",
            color: theme.muted, fontSize: '11px',
            marginTop: '3px', letterSpacing: '1px',
          }}>
            confidence: {confidencePct}%
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

      {/* Explanation — plain Inter text, no // prefix, theme-aware color */}
      {explanation && (
        <div style={{
          fontFamily: "'Inter', sans-serif",
          color: theme.muted,
          fontSize: '13px', lineHeight: '1.7',
          borderTop: `1px solid ${theme.border}`,
          paddingTop: '12px',
        }}>
          {explanation}
        </div>
      )}
    </div>
  )
}