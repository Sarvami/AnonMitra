import { useState } from 'react'
import Navbar from '../components/Navbar'
import { detectText, detectImage } from '../api/detector'

export default function Detector() {
  const [activeTab, setActiveTab] = useState('text')

  // Text detection state
  const [text, setText] = useState('')
  const [textResult, setTextResult] = useState(null)
  const [textLoading, setTextLoading] = useState(false)
  const [textError, setTextError] = useState('')

  // Image detection state
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
    <div style={{ minHeight: '100vh', background: '#181825' }}>
      <Navbar />

      <div style={containerStyle}>
        <h2 style={headingStyle}>🤖 AI Content Detector</h2>
        <p style={subStyle}>Detect whether content is AI-generated or human-made</p>

        {/* Tabs */}
        <div style={tabRowStyle}>
          <button
            onClick={() => setActiveTab('text')}
            style={{ ...tabStyle, ...(activeTab === 'text' ? activeTabStyle : {}) }}
          >
            📝 Text Detection
          </button>
          <button
            onClick={() => setActiveTab('image')}
            style={{ ...tabStyle, ...(activeTab === 'image' ? activeTabStyle : {}) }}
          >
            🖼️ Image Detection
          </button>
        </div>

        {/* Text Tab */}
        {activeTab === 'text' && (
          <div style={panelStyle}>
            <p style={labelStyle}>Paste any text or article below</p>
            <textarea
              style={textareaStyle}
              rows={10}
              placeholder="Paste a news article, blog post, or any text here..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <button
              onClick={handleTextDetect}
              disabled={textLoading || !text.trim()}
              style={detectBtnStyle}
            >
              {textLoading ? '🔍 Analyzing...' : '🔍 Detect'}
            </button>

            {textError && <div style={errorStyle}>{textError}</div>}

            {textResult && (
              <ResultCard
                verdict={textResult.result}
                confidence={textResult.confidence}
                explanation={textResult.explanation}
              />
            )}
          </div>
        )}

        {/* Image Tab */}
        {activeTab === 'image' && (
          <div style={panelStyle}>
            <p style={labelStyle}>Upload an image to check if it's AI-generated</p>

            <label style={uploadLabelStyle}>
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
                  style={previewStyle}
                />
              ) : (
                <div style={uploadPlaceholderStyle}>
                  <p style={{ fontSize: '2.5rem' }}>📁</p>
                  <p style={{ color: '#89b4fa' }}>Click to upload an image</p>
                  <p style={{ color: '#6c7086', fontSize: '0.8rem' }}>
                    PNG, JPG, WEBP supported
                  </p>
                </div>
              )}
            </label>

            {image && (
              <button
                onClick={handleImageDetect}
                disabled={imageLoading}
                style={detectBtnStyle}
              >
                {imageLoading ? '🔍 Analyzing...' : '🔍 Detect'}
              </button>
            )}

            {imageError && <div style={errorStyle}>{imageError}</div>}

            {imageResult && (
              <ResultCard
                verdict={imageResult.result}
                confidence={imageResult.confidence}
                explanation={imageResult.explanation}
              />
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function ResultCard({ verdict, confidence, explanation }) {
  const isAI = verdict?.toLowerCase().includes('ai')
  const confidencePct = Math.round((confidence || 0) * 100)

  return (
    <div style={{
      ...resultCardStyle,
      borderColor: isAI ? '#f38ba8' : '#a6e3a1',
      background: isAI ? '#f38ba810' : '#a6e3a110',
    }}>
      <div style={resultHeaderStyle}>
        <span style={{ fontSize: '2rem' }}>{isAI ? '🤖' : '👤'}</span>
        <div>
          <div style={{
            fontWeight: '700',
            fontSize: '1.1rem',
            color: isAI ? '#f38ba8' : '#a6e3a1',
          }}>
            {isAI ? 'AI Generated' : 'Human Written'}
          </div>
          <div style={{ color: '#a6adc8', fontSize: '0.85rem' }}>
            Confidence: {confidencePct}%
          </div>
        </div>
      </div>

      {/* Confidence Bar */}
      <div style={barBgStyle}>
        <div style={{
          ...barFillStyle,
          width: `${confidencePct}%`,
          background: isAI ? '#f38ba8' : '#a6e3a1',
        }} />
      </div>

      {explanation && (
        <p style={{ color: '#a6adc8', fontSize: '0.88rem', marginTop: '12px', lineHeight: '1.6' }}>
          {explanation}
        </p>
      )}
    </div>
  )
}

const containerStyle = {
  maxWidth: '800px',
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
  marginBottom: '28px',
}

const tabRowStyle = {
  display: 'flex',
  gap: '12px',
  marginBottom: '24px',
}

const tabStyle = {
  background: '#1e1e2e',
  border: '1px solid #313244',
  borderRadius: '8px',
  padding: '10px 22px',
  color: '#a6adc8',
  cursor: 'pointer',
  fontWeight: '600',
  fontSize: '0.9rem',
}

const activeTabStyle = {
  background: '#313244',
  borderColor: '#89b4fa',
  color: '#89b4fa',
}

const panelStyle = {
  background: '#1e1e2e',
  border: '1px solid #313244',
  borderRadius: '12px',
  padding: '28px',
}

const labelStyle = {
  color: '#a6adc8',
  fontSize: '0.9rem',
  marginBottom: '12px',
}

const textareaStyle = {
  width: '100%',
  background: '#313244',
  border: '1px solid #45475a',
  borderRadius: '8px',
  padding: '14px',
  color: '#cdd6f4',
  fontSize: '0.92rem',
  resize: 'vertical',
  outline: 'none',
  fontFamily: 'inherit',
  lineHeight: '1.6',
  boxSizing: 'border-box',
}

const detectBtnStyle = {
  background: '#89b4fa',
  color: '#1e1e2e',
  border: 'none',
  borderRadius: '8px',
  padding: '12px 28px',
  fontWeight: '700',
  fontSize: '0.95rem',
  cursor: 'pointer',
  marginTop: '16px',
  display: 'block',
}

const errorStyle = {
  background: '#f38ba820',
  border: '1px solid #f38ba8',
  color: '#f38ba8',
  borderRadius: '8px',
  padding: '10px 16px',
  marginTop: '16px',
  fontSize: '0.85rem',
}

const uploadLabelStyle = {
  display: 'block',
  cursor: 'pointer',
  borderRadius: '10px',
  overflow: 'hidden',
}

const uploadPlaceholderStyle = {
  background: '#313244',
  border: '2px dashed #45475a',
  borderRadius: '10px',
  padding: '48px',
  textAlign: 'center',
}

const previewStyle = {
  width: '100%',
  maxHeight: '320px',
  objectFit: 'contain',
  borderRadius: '10px',
  border: '1px solid #313244',
}

const resultCardStyle = {
  border: '1px solid',
  borderRadius: '10px',
  padding: '20px',
  marginTop: '20px',
}

const resultHeaderStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '14px',
  marginBottom: '12px',
}

const barBgStyle = {
  background: '#313244',
  borderRadius: '99px',
  height: '8px',
  overflow: 'hidden',
}

const barFillStyle = {
  height: '100%',
  borderRadius: '99px',
  transition: 'width 0.5s ease',
}