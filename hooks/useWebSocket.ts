'use client'

import { useState, useRef, useEffect } from 'react'
import { Message, User } from '../types'

const WS_URL = 'wss://agent-dev-chat.onrender.com/ws/chat/default'

export function useWebSocket(user: User | null) {
  const [messages, setMessages] = useState<Message[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const wsRef = useRef<WebSocket | null>(null)

  useEffect(() => {
    if (!user) return

    const ws = new WebSocket(WS_URL)

    ws.onopen = () => setIsConnected(true)
    ws.onclose = () => setIsConnected(false)

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      if (data.type === 'message') {
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          role: data.role,
          content: data.content
        }])
      }
    }

    wsRef.current = ws
    return () => ws.close()
  }, [user])

  const sendMessage = (content: string) => {
    if (!content.trim() || !wsRef.current) return

    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      role: 'user',
      content
    }])

    wsRef.current.send(JSON.stringify({ message: content }))
  }

  return { messages, isConnected, sendMessage }
}
