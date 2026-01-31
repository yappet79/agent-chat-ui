'use client'

import { useRef, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useWebSocket } from '../hooks/useWebSocket'
import { Header } from '../components/layout/Header'
import { LoginScreen } from '../components/auth/LoginScreen'
import { MessageBubble } from '../components/chat/MessageBubble'
import { ChatInput } from '../components/chat/ChatInput'
import { EmptyState } from '../components/chat/EmptyState'

export default function Home() {
  const { user, loading, signInWithGoogle, signOut } = useAuth()
  const { messages, isConnected, sendMessage } = useWebSocket(user)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

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
    return <LoginScreen onSignIn={signInWithGoogle} />
  }

  // Chat screen
  return (
    <div className="h-screen flex flex-col bg-[#fafafa]">
      <Header user={user} isConnected={isConnected} onSignOut={signOut} />

      {/* Chat area */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto p-6 space-y-4">
          {messages.length === 0 && <EmptyState />}

          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </main>

      <ChatInput onSend={sendMessage} />
    </div>
  )
}
