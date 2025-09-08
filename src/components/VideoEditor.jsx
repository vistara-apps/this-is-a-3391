import React, { useState } from 'react'
import { Play, Pause, SkipBack, SkipForward, Download, Wand2, Scissors, Layers, Upload } from 'lucide-react'
import { useApp } from '../context/AppContext'
import FileUpload from './FileUpload'
import useVideoProcessing from '../hooks/useVideoProcessing'

const VideoEditor = () => {
  const { state, actions } = useApp()
  const { user, currentVideo } = state
  const { smartTrim, addAITransitions, autoEnhance, formatForPlatform } = useVideoProcessing()
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration] = useState(120) // 2 minutes
  const [selectedTool, setSelectedTool] = useState('trim')
  const [isProcessing, setIsProcessing] = useState(false)

  const tools = [
    { id: 'trim', label: 'Smart Trim', icon: Scissors },
    { id: 'transitions', label: 'AI Transitions', icon: Layers },
    { id: 'enhance', label: 'Auto Enhance', icon: Wand2 },
  ]

  const handleAIProcess = async (tool) => {
    if (!currentVideo) {
      actions.setError('Please upload a video first')
      return
    }

    setIsProcessing(true)
    setSelectedTool(tool)
    
    try {
      let result
      switch (tool) {
        case 'trim':
          result = await smartTrim(currentVideo.videoId, { originalDuration: duration })
          break
        case 'transitions':
          result = await addAITransitions(currentVideo.videoId, { style: 'smooth' })
          break
        case 'enhance':
          result = await autoEnhance(currentVideo.videoId)
          break
        default:
          throw new Error('Unknown processing tool')
      }
      
      // Update video with processing results
      actions.updateVideo({
        ...currentVideo,
        analysisData: {
          ...currentVideo.analysisData,
          [tool]: result,
        },
        updatedAt: new Date().toISOString(),
      })
      
    } catch (error) {
      actions.setError(`AI processing failed: ${error.message}`)
    } finally {
      setIsProcessing(false)
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="flex flex-col h-screen bg-gray-900">
      {/* Main Editor Area */}
      <div className="flex-1 flex">
        {/* Video Preview */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 bg-black relative flex items-center justify-center p-6">
            {currentVideo ? (
              <div className="w-full max-w-4xl aspect-video bg-gray-800 rounded-lg flex items-center justify-center relative">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-500 opacity-20 rounded-lg"></div>
                <div className="text-center z-10">
                  <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-4 mx-auto">
                    {isPlaying ? <Pause className="w-8 h-8 text-white" /> : <Play className="w-8 h-8 text-white ml-1" />}
                  </div>
                  <p className="text-white text-lg">{currentVideo.originalFilename}</p>
                  <p className="text-gray-300 text-sm mt-2">Ready for editing</p>
                </div>
              </div>
            ) : (
              <div className="w-full max-w-4xl">
                <FileUpload
                  onUploadComplete={(video) => {
                    actions.setCurrentVideo(video)
                  }}
                  acceptedTypes={['video/*']}
                  maxSize={500 * 1024 * 1024} // 500MB
                />
              </div>
            )}
          </div>

          {/* Video Controls */}
          <div className="bg-gray-800 p-4">
            <div className="flex items-center space-x-4 mb-4">
              <button 
                onClick={() => setCurrentTime(Math.max(0, currentTime - 10))}
                className="text-gray-400 hover:text-white"
              >
                <SkipBack className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
              </button>
              <button 
                onClick={() => setCurrentTime(Math.min(duration, currentTime + 10))}
                className="text-gray-400 hover:text-white"
              >
                <SkipForward className="w-5 h-5" />
              </button>
              <span className="text-white text-sm">{formatTime(currentTime)} / {formatTime(duration)}</span>
            </div>

            {/* Timeline */}
            <div className="relative">
              <div className="w-full bg-gray-700 h-2 rounded-full">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(currentTime / duration) * 100}%` }}
                ></div>
              </div>
              <input
                type="range"
                min="0"
                max={duration}
                value={currentTime}
                onChange={(e) => setCurrentTime(Number(e.target.value))}
                className="absolute inset-0 w-full h-2 opacity-0 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Right Panel - Tools */}
        <div className="w-80 bg-gray-800 border-l border-gray-700 p-4">
          <h3 className="text-lg font-semibold text-white mb-4">AI Tools</h3>
          
          <div className="space-y-3 mb-6">
            {tools.map((tool) => {
              const Icon = tool.icon
              return (
                <button
                  key={tool.id}
                  onClick={() => handleAIProcess(tool.id)}
                  disabled={isProcessing}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg border transition-all ${
                    selectedTool === tool.id
                      ? 'border-blue-500 bg-blue-500 bg-opacity-10'
                      : 'border-gray-600 hover:border-gray-500'
                  } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <Icon className="w-5 h-5 text-blue-400" />
                  <span className="text-white">{tool.label}</span>
                  {isProcessing && selectedTool === tool.id && (
                    <div className="ml-auto">
                      <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                </button>
              )
            })}
          </div>

          {/* Platform Format Options */}
          <h4 className="text-md font-semibold text-white mb-3">Export Format</h4>
          <div className="grid grid-cols-2 gap-2 mb-6">
            {[
              { name: 'TikTok', ratio: '9:16' },
              { name: 'Instagram', ratio: '1:1' },
              { name: 'YouTube', ratio: '16:9' },
              { name: 'Twitter', ratio: '16:9' },
            ].map((platform) => (
              <button
                key={platform.name}
                className="p-3 border border-gray-600 rounded-lg hover:border-gray-500 transition-colors"
              >
                <div className="text-white text-sm font-medium">{platform.name}</div>
                <div className="text-gray-400 text-xs">{platform.ratio}</div>
              </button>
            ))}
          </div>

          {/* Export Button */}
          <button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center justify-center space-x-2">
            <Download className="w-5 h-5" />
            <span>Export Video</span>
          </button>

          {user.subscriptionTier === 'free' && (
            <p className="text-xs text-gray-400 mt-2 text-center">
              Free exports include watermark
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default VideoEditor
