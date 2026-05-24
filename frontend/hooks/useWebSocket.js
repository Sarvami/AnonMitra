import { useEffect, useRef } from 'react'

export default function useWebSocket(onMessage) {
  const ws = useRef(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) return

    ws.current = new WebSocket(`ws://localhost:8000/ws?token=${token}`)

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data)
      onMessage(data)
    }

    ws.current.onerror = () => console.log('WebSocket error')
    ws.current.onclose = () => console.log('WebSocket closed')

    return () => ws.current?.close()
  }, [])
}