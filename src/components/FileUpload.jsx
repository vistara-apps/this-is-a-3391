import React, { useState, useCallback } from 'react'
import { Upload, X, File, CheckCircle, AlertCircle } from 'lucide-react'
import { useApp } from '../context/AppContext'
import apiService from '../services/api'

const FileUpload = ({ onUploadComplete, acceptedTypes = ['video/*'], maxSize = 100 * 1024 * 1024 }) => {
  const { state, actions } = useApp()
  const [dragActive, setDragActive] = useState(false)
  const [uploadProgress, setUploadProgress] = useState({})
  const [uploadedFiles, setUploadedFiles] = useState([])

  // Handle drag events
  const handleDrag = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  // Handle drop event
  const handleDrop = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(Array.from(e.dataTransfer.files))
    }
  }, [])

  // Handle file input change
  const handleChange = useCallback((e) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      handleFiles(Array.from(e.target.files))
    }
  }, [])

  // Validate file
  const validateFile = (file) => {
    const errors = []

    // Check file type
    const isValidType = acceptedTypes.some(type => {
      if (type.endsWith('/*')) {
        return file.type.startsWith(type.slice(0, -1))
      }
      return file.type === type
    })

    if (!isValidType) {
      errors.push(`File type ${file.type} is not supported`)
    }

    // Check file size
    if (file.size > maxSize) {
      errors.push(`File size ${formatFileSize(file.size)} exceeds maximum ${formatFileSize(maxSize)}`)
    }

    return errors
  }

  // Handle files
  const handleFiles = async (files) => {
    for (const file of files) {
      const fileId = `${file.name}-${Date.now()}`
      const errors = validateFile(file)

      if (errors.length > 0) {
        setUploadedFiles(prev => [...prev, {
          id: fileId,
          file,
          status: 'error',
          errors,
        }])
        continue
      }

      // Add file to upload queue
      setUploadedFiles(prev => [...prev, {
        id: fileId,
        file,
        status: 'uploading',
        progress: 0,
      }])

      try {
        await uploadFile(file, fileId)
      } catch (error) {
        setUploadedFiles(prev => prev.map(f => 
          f.id === fileId 
            ? { ...f, status: 'error', errors: [error.message] }
            : f
        ))
      }
    }
  }

  // Upload file
  const uploadFile = async (file, fileId) => {
    try {
      // Simulate upload progress (in production, this would be handled by the API)
      const simulateProgress = () => {
        let progress = 0
        const interval = setInterval(() => {
          progress += Math.random() * 15
          if (progress >= 100) {
            progress = 100
            clearInterval(interval)
          }
          
          setUploadProgress(prev => ({
            ...prev,
            [fileId]: progress
          }))

          setUploadedFiles(prev => prev.map(f => 
            f.id === fileId 
              ? { ...f, progress }
              : f
          ))
        }, 200)
      }

      simulateProgress()

      // In production, this would be the actual API call
      // const result = await apiService.uploadVideo(file, {
      //   userId: state.user.userId,
      //   originalFilename: file.name,
      // })

      // Simulate API response
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const mockResult = {
        videoId: `video-${Date.now()}`,
        userId: state.user.userId,
        originalFilename: file.name,
        processedFilename: null,
        templateUsed: null,
        exportSettings: {},
        analysisData: {},
        status: 'uploaded',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      // Add video to state
      actions.addVideo(mockResult)

      // Update file status
      setUploadedFiles(prev => prev.map(f => 
        f.id === fileId 
          ? { ...f, status: 'completed', videoData: mockResult }
          : f
      ))

      // Call completion callback
      if (onUploadComplete) {
        onUploadComplete(mockResult)
      }

    } catch (error) {
      console.error('Upload failed:', error)
      throw error
    }
  }

  // Remove file from list
  const removeFile = (fileId) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId))
    setUploadProgress(prev => {
      const { [fileId]: removed, ...rest } = prev
      return rest
    })
  }

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="w-full">
      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
          dragActive
            ? 'border-blue-500 bg-blue-50 bg-opacity-10'
            : 'border-gray-600 hover:border-gray-500'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          multiple
          accept={acceptedTypes.join(',')}
          onChange={handleChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center">
            <Upload className="w-8 h-8 text-gray-400" />
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Drop your videos here, or click to browse
            </h3>
            <p className="text-gray-400 text-sm">
              Supports MP4, MOV, AVI up to {formatFileSize(maxSize)}
            </p>
          </div>
          
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
            Choose Files
          </button>
        </div>
      </div>

      {/* Upload Progress */}
      {uploadedFiles.length > 0 && (
        <div className="mt-6 space-y-3">
          <h4 className="text-lg font-semibold text-white">Upload Progress</h4>
          
          {uploadedFiles.map((fileItem) => (
            <div key={fileItem.id} className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <File className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-white font-medium">{fileItem.file.name}</p>
                    <p className="text-gray-400 text-sm">{formatFileSize(fileItem.file.size)}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {fileItem.status === 'completed' && (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  )}
                  {fileItem.status === 'error' && (
                    <AlertCircle className="w-5 h-5 text-red-400" />
                  )}
                  <button
                    onClick={() => removeFile(fileItem.id)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Progress Bar */}
              {fileItem.status === 'uploading' && (
                <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${fileItem.progress || 0}%` }}
                  />
                </div>
              )}

              {/* Status */}
              <div className="flex items-center justify-between text-sm">
                <span className={`font-medium ${
                  fileItem.status === 'completed' ? 'text-green-400' :
                  fileItem.status === 'error' ? 'text-red-400' :
                  'text-blue-400'
                }`}>
                  {fileItem.status === 'uploading' && `Uploading... ${Math.round(fileItem.progress || 0)}%`}
                  {fileItem.status === 'completed' && 'Upload completed'}
                  {fileItem.status === 'error' && 'Upload failed'}
                </span>
              </div>

              {/* Errors */}
              {fileItem.errors && fileItem.errors.length > 0 && (
                <div className="mt-2 space-y-1">
                  {fileItem.errors.map((error, index) => (
                    <p key={index} className="text-red-400 text-sm">{error}</p>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default FileUpload
