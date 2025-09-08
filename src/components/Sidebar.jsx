import React from 'react'
import { Video, Layout, BarChart3, FolderOpen, Sparkles, Zap } from 'lucide-react'
import { useApp } from '../context/AppContext'

const Sidebar = () => {
  const { state, actions } = useApp()
  const { activeView } = state
  const menuItems = [
    { id: 'editor', label: 'Video Editor', icon: Video },
    { id: 'templates', label: 'Templates', icon: Layout },
    { id: 'projects', label: 'Projects', icon: FolderOpen },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ]

  const aiFeatures = [
    { label: 'Smart Cuts', icon: Sparkles },
    { label: 'Auto Resize', icon: Zap },
  ]

  return (
    <div className="w-64 bg-gray-800 border-r border-gray-700 h-screen overflow-y-auto">
      <div className="p-4">
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-4">Main</h2>
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                onClick={() => actions.setActiveView(item.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  activeView === item.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            )
          })}
        </nav>

        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-4 mt-8">AI Tools</h2>
        <div className="space-y-2">
          {aiFeatures.map((feature) => {
            const Icon = feature.icon
            return (
              <button
                key={feature.label}
                className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
              >
                <Icon className="w-5 h-5" />
                <span>{feature.label}</span>
              </button>
            )
          })}
        </div>

        <div className="mt-8 p-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Sparkles className="w-5 h-5 text-white" />
            <span className="text-white font-semibold">AI Credits</span>
          </div>
          <div className="w-full bg-white bg-opacity-20 rounded-full h-2 mb-2">
            <div className="bg-white h-2 rounded-full" style={{ width: '65%' }}></div>
          </div>
          <p className="text-white text-xs">65 credits remaining</p>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
