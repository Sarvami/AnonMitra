import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

export default function useInactivityLock(timeoutMinutes = 10) {
  const navigate = useNavigate()
  const timer = useRef(null)

  const resetTimer = () => {
    clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      localStorage.removeItem('token')
      navigate('/login')
      alert('Session locked due to inactivity.')
    }, timeoutMinutes * 60 * 1000)
  }

  useEffect(() => {
    const events = ['mousemove', 'keydown', 'click', 'scroll']
    events.forEach(e => window.addEventListener(e, resetTimer))
    resetTimer()
    return () => {
      events.forEach(e => window.removeEventListener(e, resetTimer))
      clearTimeout(timer.current)
    }
  }, [])
}