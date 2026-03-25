import { useState } from 'react'
import Navbar from '../components/Navbar'
import { detectText, detectImage } from '../api/detector'
import { useTheme } from '../ThemeContext'

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
    setTextLoading(true)
    setTextError('')
    setTextResult(null)
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
    setImageResult(null)
    setImageError('')
  }

  const handleImageDetect = async () => {
    if (!image) return
    setImageLoading(true)
    setImageError('')
    setImageResult(null)
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

  return (
    <div style={{ minHeight: '100vh', background: theme.bg, display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '32px 24px', width: '100%' }}>

        <h2 style={{ color: theme.text, fontSize: '1.6rem', fontWeight: '700', margin: 0 }}>
          🤖 AI Content Detector
        </h2>
        <p style={{ color: theme.muted, fontSize: '0.9rem', marginTop: '4px', marginBottom: '28px' }}>
          Detect whether content is AI-generated or human-made
        </p>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
          {['text', 'image'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                background: activeTab === tab ? theme.input : theme.card,
                border: `1px solid ${activeTab === tab ? theme.blue : theme.border}`,
                borderRadius: '8px',
                padding: '10px 22px',
                color: activeTab === tab ? theme.blue : theme.muted,
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '0.9rem',
              }}
            >
              {tab === 'text' ? '📝 Text Detection' : '🖼️ Image Detection'}
            </button>
          ))}
        </div>

        {/* Panel */}
        <div style={{
          background: theme.card,
          border: `1px solid ${theme.border}`,
          borderRadius: '12px',
          padding: '28px',
        }}>

          {/* Text Tab */}
          {activeTab === 'text' && (
            <>
              <p style={{ color: theme.muted, fontSize: '0.9rem', marginBottom: '12px' }}>
                Paste any text or article below
              </p>
              <textarea
                style={{
                  width: '100%',
                  background: theme.input,
                  border: `1px solid ${theme.border}`,
                  borderRadius: '8px',
                  padding: '14px',
                  color: theme.text,
                  fontSize: '0.92rem',
                  resize: 'vertical',
                  outline: 'none',
                  fontFamily: 'inherit',
                  lineHeight: '1.6',
                  boxSizing: 'border-box',
                }}
                rows={10}
                placeholder="Paste a news article, blog post, or any text here..."
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
              <button
                onClick={handleTextDetect}
                disabled={textLoading || !text.trim()}
                style={{
                  background: theme.blue,
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 28px',
                  fontWeight: '700',
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  marginTop: '16px',
                  display: 'block',
                }}
              >
                {textLoading ? '🔍 Analyzing...' : '🔍 Detect'}
              </button>

              {textError && (
                <div style={{
                  background: theme.red + '20',
                  border: `1px solid ${theme.red}`,
                  color: theme.red,
                  borderRadius: '8px',
                  padding: '10px 16px',
                  marginTop: '16px',
                  fontSize: '0.85rem',
                }}>
                  {textError}
                </div>
              )}

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

          {/* Image Tab */}
          {activeTab === 'image' && (
            <>
              <p style={{ color: theme.muted, fontSize: '0.9rem', marginBottom: '12px' }}>
                Upload an image to check if it's AI-generated
              </p>

              <label style={{ display: 'block', cursor: 'pointer', borderRadius: '10px', overflow: 'hidden' }}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                />
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="preview"
                    style={{
                      width: '100%',
                      maxHeight: '320px',
                      objectFit: 'contain',
                      borderRadius: '10px',
                      border: `1px solid ${theme.border}`,
                    }}
                  />
                ) : (
                  <div style={{
                    background: theme.input,
                    border: `2px dashed ${theme.border}`,
                    borderRadius: '10px',
                    padding: '48px',
                    textAlign: 'center',
                  }}>
                    <p style={{ fontSize: '2.5rem' }}>📁</p>
                    <p style={{ color: theme.blue }}>Click to upload an image</p>
                    <p style={{ color: theme.faint, fontSize: '0.8rem' }}>PNG, JPG, WEBP supported</p>
                  </div>
                )}
              </label>

              {image && (
                <button
                  onClick={handleImageDetect}
                  disabled={imageLoading}
                  style={{
                    background: theme.blue,
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '12px 28px',
                    fontWeight: '700',
                    fontSize: '0.95rem',
                    cursor: 'pointer',
                    marginTop: '16px',
                    display: 'block',
                  }}
                >
                  {imageLoading ? '🔍 Analyzing...' : '🔍 Detect'}
                </button>
              )}

              {imageError && (
                <div style={{
                  background: theme.red + '20',
                  border: `1px solid ${theme.red}`,
                  color: theme.red,
                  borderRadius: '8px',
                  padding: '10px 16px',
                  marginTop: '16px',
                  fontSize: '0.85rem',
                }}>
                  {imageError}
                </div>
              )}

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
  )
}

function ResultCard({ verdict, confidence, explanation, theme }) {
  const isAI = verdict?.toLowerCase().includes('ai')
  const confidencePct = Math.round((confidence || 0) * 100)

  return (
    <div style={{
      border: `1px solid ${isAI ? theme.red : theme.green}`,
      background: isAI ? theme.red + '10' : theme.green + '10',
      borderRadius: '10px',
      padding: '20px',
      marginTop: '20px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '12px' }}>
        <span style={{ fontSize: '2rem' }}>{isAI ? '🤖' : '👤'}</span>
        <div>
          <div style={{ fontWeight: '700', fontSize: '1.1rem', color: isAI ? theme.red : theme.green }}>
            {isAI ? 'AI Generated' : 'Human Written'}
          </div>
          <div style={{ color: theme.muted, fontSize: '0.85rem' }}>
            Confidence: {confidencePct}%
          </div>
        </div>
      </div>
      <div style={{ background: theme.input, borderRadius: '99px', height: '8px', overflow: 'hidden' }}>
        <div style={{
          height: '100%',
          borderRadius: '99px',
          width: `${confidencePct}%`,
          background: isAI ? theme.red : theme.green,
          transition: 'width 0.5s ease',
        }} />
      </div>
      {explanation && (
        <p style={{ color: theme.muted, fontSize: '0.88rem', marginTop: '12px', lineHeight: '1.6' }}>
          {explanation}
        </p>
      )}
    </div>
  )
}
import PageWrapper from '../components/PageWrapper'

return (
  <PageWrapper>
    <div style={{ minHeight: '100vh', background: theme.bg, display: 'flex', flexDirection: 'column' }}>
      {/* rest stays same */}
    </div>
  </PageWrapper>
)