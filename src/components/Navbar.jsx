import React, { useState } from 'react'
import { Search, Bell, Settings, Crown, User } from 'lucide-react'

const Navbar = ({ user, setUser }) => {
  const [showUpgrade, setShowUpgrade] = useState(false)

  const handleUpgrade = (tier) => {
    setUser(prev => ({ ...prev, subscriptionTier: tier }))
    setShowUpgrade(false)
  }

  return (
    <nav className="bg-gray-800 border-b border-gray-700 px-4 sm:px-6 h-16 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">VS</span>
          </div>
          <h1 className="text-xl font-bold text-white hidden sm:block">VidSynth AI</h1>
        </div>
      </div>

      <div className="flex-1 max-w-md mx-4 hidden md:block">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search templates, projects..."
            className="w-full bg-gray-700 text-white pl-10 pr-4 py-2 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
          />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {user.subscriptionTier === 'free' && (
          <button
            onClick={() => setShowUpgrade(true)}
            className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity flex items-center space-x-1"
          >
            <Crown className="w-4 h-4" />
            <span className="hidden sm:inline">Upgrade</span>
          </button>
        )}
        
        <button className="text-gray-400 hover:text-white transition-colors">
          <Bell className="w-5 h-5" />
        </button>
        
        <button className="text-gray-400 hover:text-white transition-colors">
          <Settings className="w-5 h-5" />
        </button>
        
        <div className="flex items-center space-x-2 bg-gray-700 rounded-lg px-3 py-2">
          <User className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-white hidden sm:inline">{user.name}</span>
          <span className={`text-xs px-2 py-1 rounded ${
            user.subscriptionTier === 'free' ? 'bg-gray-600 text-gray-300' :
            user.subscriptionTier === 'creator' ? 'bg-blue-600 text-blue-100' :
            'bg-purple-600 text-purple-100'
          }`}>
            {user.subscriptionTier.toUpperCase()}
          </span>
        </div>
      </div>

      {showUpgrade && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Upgrade Your Plan</h3>
            <div className="space-y-4">
              <div className="border border-gray-600 rounded-lg p-4 hover:border-blue-500 cursor-pointer" onClick={() => handleUpgrade('creator')}>
                <h4 className="font-semibold text-blue-400">Creator - $19/month</h4>
                <p className="text-sm text-gray-400">Full features, custom branding</p>
              </div>
              <div className="border border-gray-600 rounded-lg p-4 hover:border-purple-500 cursor-pointer" onClick={() => handleUpgrade('pro')}>
                <h4 className="font-semibold text-purple-400">Pro - $49/month</h4>
                <p className="text-sm text-gray-400">Higher quality, advanced analytics</p>
              </div>
            </div>
            <button
              onClick={() => setShowUpgrade(false)}
              className="mt-4 w-full bg-gray-700 text-white py-2 rounded-lg hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar