'use client'

import { User } from '../../types'

type HeaderProps = {
  user: User
  isConnected: boolean
  onSignOut: () => void
}

export function Header({ user, isConnected, onSignOut }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3 shadow-sm">
      <div className="flex items-center justify-between max-w-6xl mx-auto">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-bold">AI</span>
          </div>
          <h1 className="text-lg font-semibold text-gray-900">AI Software House</h1>
        </div>

        {/* Status bar with separators */}
        <div className="flex items-center">
          {/* Connection status */}
          <div className="flex items-center gap-2 px-3">
            <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></span>
            <span className={`text-sm font-medium ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>

          {/* Separator */}
          <div className="w-px h-5 bg-gray-300"></div>

          {/* User email */}
          <div className="px-3">
            <span className="text-sm text-gray-600">{user.email}</span>
          </div>

          {/* Separator */}
          <div className="w-px h-5 bg-gray-300"></div>

          {/* Logout */}
          <button
            onClick={onSignOut}
            className="px-3 text-sm text-gray-500 hover:text-red-600 transition-colors font-medium"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  )
}
