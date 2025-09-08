import React, { useState } from 'react'
import { TrendingUp, Eye, Heart, Share, Clock, Target } from 'lucide-react'
import { useApp } from '../context/AppContext'

const AnalyticsDashboard = () => {
  const { state, actions } = useApp()
  const { user, analytics } = state
  const [timeRange, setTimeRange] = useState('7d')

  const metrics = [
    { 
      label: 'Total Views', 
      value: analytics.metrics.totalViews ? `${(analytics.metrics.totalViews / 1000).toFixed(1)}K` : '0', 
      change: '+15%', 
      icon: Eye, 
      color: 'text-blue-400' 
    },
    { 
      label: 'Engagement Rate', 
      value: analytics.metrics.engagementRate ? `${analytics.metrics.engagementRate}%` : '0%', 
      change: '+2.1%', 
      icon: Heart, 
      color: 'text-red-400' 
    },
    { 
      label: 'Shares', 
      value: analytics.metrics.shares ? analytics.metrics.shares.toString() : '0', 
      change: '+23%', 
      icon: Share, 
      color: 'text-green-400' 
    },
    { 
      label: 'Avg. Watch Time', 
      value: analytics.metrics.avgWatchTime ? `${Math.floor(analytics.metrics.avgWatchTime / 60)}:${(analytics.metrics.avgWatchTime % 60).toString().padStart(2, '0')}` : '0:00', 
      change: '+12s', 
      icon: Clock, 
      color: 'text-purple-400' 
    },
  ]

  const videoPerformance = [
    {
      id: 1,
      title: 'Product Launch Video',
      platform: 'Instagram',
      views: 2800,
      engagement: 9.2,
      thumbnail: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop'
    },
    {
      id: 2,
      title: 'Tutorial: How to Use App',
      platform: 'TikTok',
      views: 5600,
      engagement: 12.5,
      thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=100&h=100&fit=crop'
    },
    {
      id: 3,
      title: 'Behind the Scenes',
      platform: 'YouTube',
      views: 1200,
      engagement: 6.8,
      thumbnail: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=100&h=100&fit=crop'
    },
  ]

  const suggestions = [
    {
      type: 'content',
      title: 'Optimal Post Time',
      description: 'Your audience is most active between 2-4 PM on weekdays',
      icon: Target
    },
    {
      type: 'format',
      title: 'Vertical Videos Perform Better',
      description: 'Your 9:16 videos get 40% more engagement than 16:9',
      icon: TrendingUp
    },
    {
      type: 'duration',
      title: 'Sweet Spot Duration',
      description: 'Videos between 15-30 seconds have the highest completion rate',
      icon: Clock
    },
  ]

  if (user.subscriptionTier === 'free') {
    return (
      <div className="p-6 bg-gray-900 min-h-screen">
        <div className="max-w-4xl mx-auto text-center py-20">
          <div className="mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Analytics Dashboard</h2>
            <p className="text-gray-400">Get detailed insights into your video performance</p>
          </div>
          
          <div className="bg-gray-800 rounded-xl p-8 max-w-md mx-auto">
            <h3 className="text-lg font-semibold text-white mb-4">Unlock Detailed Analytics</h3>
            <p className="text-gray-400 mb-6">
              Track views, engagement, and get AI-powered suggestions to improve your content
            </p>
            <button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity">
              Upgrade to Creator Plan
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Analytics Dashboard</h1>
            <p className="text-gray-400">Track your video performance and get insights</p>
          </div>
          
          <select 
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2 focus:border-blue-500 focus:outline-none"
          >
            <option value="24h">Last 24 hours</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric) => {
            const Icon = metric.icon
            return (
              <div key={metric.label} className="bg-gray-800 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <Icon className={`w-8 h-8 ${metric.color}`} />
                  <span className="text-green-400 text-sm font-medium">{metric.change}</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-1">{metric.value}</h3>
                <p className="text-gray-400 text-sm">{metric.label}</p>
              </div>
            )
          })}
        </div>

        {/* Performance Chart */}
        <div className="bg-gray-800 rounded-xl p-6 mb-8">
          <h3 className="text-lg font-semibold text-white mb-4">Performance Over Time</h3>
          <div className="h-64 bg-gray-700 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <TrendingUp className="w-12 h-12 text-gray-500 mx-auto mb-2" />
              <p className="text-gray-400">Chart visualization would go here</p>
              <p className="text-gray-500 text-sm">Interactive charts showing views, engagement, and other metrics</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Performing Videos */}
          <div className="bg-gray-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Top Performing Videos</h3>
            <div className="space-y-4">
              {videoPerformance.map((video) => (
                <div key={video.id} className="flex items-center space-x-4 p-3 bg-gray-700 rounded-lg">
                  <img 
                    src={video.thumbnail} 
                    alt={video.title}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="text-white font-medium">{video.title}</h4>
                    <p className="text-gray-400 text-sm">{video.platform}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-semibold">{video.views.toLocaleString()}</p>
                    <p className="text-gray-400 text-sm">{video.engagement}% engagement</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Suggestions */}
          <div className="bg-gray-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">AI Insights & Suggestions</h3>
            <div className="space-y-4">
              {suggestions.map((suggestion, index) => {
                const Icon = suggestion.icon
                return (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-gray-700 rounded-lg">
                    <div className="bg-blue-600 bg-opacity-20 p-2 rounded-lg">
                      <Icon className="w-5 h-5 text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white font-medium mb-1">{suggestion.title}</h4>
                      <p className="text-gray-400 text-sm">{suggestion.description}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AnalyticsDashboard
