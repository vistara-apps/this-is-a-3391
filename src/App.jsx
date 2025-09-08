import React, { useState } from 'react'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import VideoEditor from './components/VideoEditor'
import TemplateLibrary from './components/TemplateLibrary'
import AnalyticsDashboard from './components/AnalyticsDashboard'
import ProjectsList from './components/ProjectsList'

function App() {
  const [activeView, setActiveView] = useState('editor')
  const [user, setUser] = useState({
    email: 'demo@vidsynth.ai',
    subscriptionTier: 'free',
    name: 'Demo User'
  })

  const renderActiveView = () => {
    switch (activeView) {
      case 'editor':
        return <VideoEditor user={user} />
      case 'templates':
        return <TemplateLibrary user={user} />
      case 'analytics':
        return <AnalyticsDashboard user={user} />
      case 'projects':
        return <ProjectsList user={user} />
      default:
        return <VideoEditor user={user} />
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar user={user} setUser={setUser} />
      <div className="flex">
        <Sidebar activeView={activeView} setActiveView={setActiveView} />
        <main className="flex-1 overflow-hidden">
          {renderActiveView()}
        </main>
      </div>
    </div>
  )
}

export default App