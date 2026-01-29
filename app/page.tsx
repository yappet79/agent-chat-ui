'use client'

import { useState, useRef, useEffect } from 'react'
import { supabase } from '../lib/supabase'

type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
}

type User = {
  email: string
  id: string
}

export default function Home() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isConnected, setIsConnected] = useState(false)
  const wsRef = useRef<WebSocket | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Check auth state
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({ email: session.user.email!, id: session.user.id })
      }
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({ email: session.user.email!, id: session.user.id })
      } else {
        setUser(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  // WebSocket connection
  useEffect(() => {
    if (!user) return

    const ws = new WebSocket('wss://agent-dev-chat.onrender.com/ws/chat/default')
    
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

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    })
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  const sendMessage = () => {
    if (!input.trim() || !wsRef.current) return
    
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      role: 'user',
      content: input
    }])
    
    wsRef.current.send(JSON.stringify({ message: input }))
    setInput('')
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f0f23] via-[#1a1a3e] to-[#2d1b4e]">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  // Login screen
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f0f23] via-[#1a1a3e] to-[#2d1b4e]">
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-2">🏠 AI Software House</h1>
            <p className="text-gray-400 mb-8">Your AI Dev Team</p>
            
            <button
              onClick={signInWithGoogle}
              className="w-full flex items-center justify-center gap-3 bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Sign in with Google
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Chat screen
  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <header className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">🏠 AI Software House</h1>
          <div className="flex items-center gap-4">
            <span className={`px-2 py-1 rounded text-sm ${isConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {isConnected ? '● Connected' : '○ Disconnected'}
            </span>
            <span className="text-sm text-gray-500">{user.email}</span>
            <button onClick={signOut} className="text-sm text-red-500 hover:text-red-700">
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-3xl mx-auto space-y-4">
          {messages.length === 0 && (
            <div className="text-center text-gray-400 mt-20">
              <p className="text-4xl mb-4">👋</p>
              <p>Напиши сообщение чтобы начать</p>
            </div>
          )}
          
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-2xl px-4 py-2 ${msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-white border shadow-sm'}`}>
                {msg.content}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </main>

      <footer className="bg-white border-t p-4">
        <div className="max-w-3xl mx-auto flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Напиши сообщение..."
            className="flex-1 px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button onClick={sendMessage} className="px-6 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600">
            Send
          </button>
        </div>
      </footer>
    </div>
  )
}
