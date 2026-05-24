export default function Spinner({ size = 32 }) {
  return (
    <div style={{
      width: size,
      height: size,
      borderRadius: '50%',
      border: `2px solid rgba(139,92,246,0.12)`,
      borderTop: `2px solid #8b5cf6`,
      borderRight: `2px solid rgba(45,212,191,0.5)`,
      animation: 'spin 0.75s linear infinite',
      margin: '0 auto',
      boxShadow: '0 0 10px rgba(139,92,246,0.25)',
      flexShrink: 0,
    }} />
  )
}
