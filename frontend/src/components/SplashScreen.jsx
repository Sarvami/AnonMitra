import { useEffect, useState } from 'react'
import { useTheme } from '../ThemeContext'

export default function SplashScreen({ onDone }) {
  const { theme } = useTheme()
  const [fading, setFading] = useState(false)

  useEffect(() => {
    const t1 = setTimeout(() => setFading(true), 3800)
    const t2 = setTimeout(() => onDone(), 4400)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: '#0d0a1a',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      zIndex: 99999,
      opacity: fading ? 0 : 1,
      transition: 'opacity 0.6s ease',
      overflow: 'hidden',
    }}>
      {/* Grid background */}
      <div className="grid-bg" style={{ position: 'absolute', inset: 0, opacity: 0.8 }} />

      {/* Scanlines */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(139,92,246,0.018) 2px, rgba(139,92,246,0.018) 4px)',
        pointerEvents: 'none',
      }} />

      {/* Glow orb */}
      <div style={{
        position: 'absolute',
        width: '400px', height: '400px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(139,92,246,0.14) 0%, rgba(45,212,191,0.07) 50%, transparent 70%)',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        animation: 'orbPulse 3s ease-in-out infinite',
      }} />

      {/* Shield icon */}
      <div style={{
        fontSize: '72px',
        marginBottom: '28px',
        animation: 'fadeIn 0.8s cubic-bezier(0.34,1.56,0.64,1) 0.2s both',
        filter: 'drop-shadow(0 0 20px rgba(139,92,246,0.6))',
      }}>
        🛡️
      </div>

      {/* Wordmark */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '2px' }}>
        <span style={{
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: '52px',
          color: '#ede9fe',
          letterSpacing: '-1px',
          animation: 'fadeIn 0.6s ease 0.6s both',
        }}>
          Anon
        </span>
        <span style={{
          fontFamily: "'Noto Sans Devanagari', sans-serif",
          fontSize: '48px',
          fontWeight: '800',
          color: '#2dd4bf',
          letterSpacing: '-1px',
          animation: 'fadeIn 0.5s ease 1s both',
        }}>
          मित्र
        </span>
      </div>

      {/* Tagline */}
      <div style={{
        marginTop: '14px',
        fontFamily: "'Share Tech Mono', monospace",
        fontSize: '11px',
        color: 'rgba(139,92,246,0.5)',
        letterSpacing: '3px',
        textTransform: 'uppercase',
        animation: 'fadeIn 0.6s ease 1.4s both',
      }}>
        <span style={{ color: 'rgba(45,212,191,0.35)' }}>[ </span>
        identity &amp; integrity protection
        <span style={{ color: 'rgba(45,212,191,0.35)' }}> ]</span>
      </div>

      {/* Progress bar */}
      <div style={{
        marginTop: '40px',
        width: '160px', height: '1px',
        background: 'rgba(139,92,246,0.15)',
        borderRadius: '2px', overflow: 'hidden',
        animation: 'fadeIn 0.3s ease 1.8s both',
      }}>
        <div style={{
          height: '100%',
          background: 'linear-gradient(90deg, #8b5cf6, #2dd4bf)',
          animation: 'fillBar 1.5s ease 1.9s forwards',
          width: '0%',
        }} />
      </div>

      <style>{`
        @keyframes orbPulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.7; }
          50% { transform: translate(-50%, -50%) scale(1.12); opacity: 1; }
        }
        @keyframes fillBar {
          0% { width: 0%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  )
}