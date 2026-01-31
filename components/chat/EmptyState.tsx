'use client'

export function EmptyState() {
  return (
    <div className="text-center text-gray-400 mt-32">
      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <span className="text-white text-2xl">AI</span>
      </div>
      <p className="text-lg font-medium text-gray-600 mb-2">Welcome to AI Software House</p>
      <p className="text-gray-400">Send a message to start chatting</p>
    </div>
  )
}
