import React, { useState } from 'react'
import { AppProvider, useApp } from './context/AppContext'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import VideoEditor from './components/VideoEditor'
import TemplateLibrary from './components/TemplateLibrary'
import AnalyticsDashboard from './components/AnalyticsDashboard'
import ProjectsList from './components/ProjectsList'
import SubscriptionModal from './components/SubscriptionModal'

// Main App Component (wrapped with context)
function AppContent() {
  const { state, actions } = useApp()
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false)

  const renderActiveView = () => {
    switch (state.activeView) {
      case 'editor':
        return <VideoEditor />
      case 'templates':
        return <TemplateLibrary />
      case 'analytics':
        return <AnalyticsDashboard />
      case 'projects':
        return <ProjectsList />
      default:
        return <VideoEditor />
    }
  }

  // Loading state
  if (state.loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading VidSynth AI...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (state.error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl">!</span>
          </div>
          <h2 className="text-white text-xl font-semibold mb-2">Something went wrong</h2>
          <p className="text-gray-400 mb-4">{state.error}</p>
          <button
            onClick={() => actions.setError(null)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar onUpgradeClick={() => setShowSubscriptionModal(true)} />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 overflow-hidden">
          {renderActiveView()}
        </main>
      </div>
      
      {/* Subscription Modal */}
      <SubscriptionModal
        isOpen={showSubscriptionModal}
        onClose={() => setShowSubscriptionModal(false)}
      />
    </div>
  )
}

// Root App Component with Provider
function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  )
}

export default App
