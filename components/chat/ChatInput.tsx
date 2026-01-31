'use client'

import { useState } from 'react'

type ChatInputProps = {
  onSend: (message: string) => void
}

export function ChatInput({ onSend }: ChatInputProps) {
  const [input, setInput] = useState('')

  const handleSend = () => {
    if (!input.trim()) return
    onSend(input)
    setInput('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <footer className="bg-white border-t border-gray-200 p-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex gap-3 items-center bg-gray-50 border border-gray-200 rounded-xl p-2 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="flex-1 px-3 py-2 bg-transparent focus:outline-none text-gray-800 placeholder-gray-400"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="px-5 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
          >
            Send
          </button>
        </div>
      </div>
    </footer>
  )
}
