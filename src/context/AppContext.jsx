import React, { createContext, useContext, useReducer, useEffect } from 'react'
import apiService, { mockData } from '../services/api'

// Initial state following the PRD data model
const initialState = {
  // User state
  user: {
    userId: null,
    email: '',
    subscriptionTier: 'free',
    name: '',
    createdAt: null,
    updatedAt: null,
  },
  
  // Videos state
  videos: [],
  currentVideo: null,
  
  // Templates state
  templates: [],
  selectedTemplate: null,
  
  // UI state
  loading: false,
  error: null,
  activeView: 'editor',
  
  // Processing state
  processingJobs: {},
  
  // Analytics state
  analytics: {
    metrics: {},
    videoPerformance: [],
    suggestions: [],
  },
  
  // Subscription state
  subscriptionPlans: [],
  
  // Export state
  exports: {},
}

// Action types
const ActionTypes = {
  // User actions
  SET_USER: 'SET_USER',
  UPDATE_USER: 'UPDATE_USER',
  
  // Video actions
  SET_VIDEOS: 'SET_VIDEOS',
  ADD_VIDEO: 'ADD_VIDEO',
  UPDATE_VIDEO: 'UPDATE_VIDEO',
  DELETE_VIDEO: 'DELETE_VIDEO',
  SET_CURRENT_VIDEO: 'SET_CURRENT_VIDEO',
  
  // Template actions
  SET_TEMPLATES: 'SET_TEMPLATES',
  SET_SELECTED_TEMPLATE: 'SET_SELECTED_TEMPLATE',
  
  // UI actions
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_ACTIVE_VIEW: 'SET_ACTIVE_VIEW',
  
  // Processing actions
  ADD_PROCESSING_JOB: 'ADD_PROCESSING_JOB',
  UPDATE_PROCESSING_JOB: 'UPDATE_PROCESSING_JOB',
  REMOVE_PROCESSING_JOB: 'REMOVE_PROCESSING_JOB',
  
  // Analytics actions
  SET_ANALYTICS: 'SET_ANALYTICS',
  
  // Subscription actions
  SET_SUBSCRIPTION_PLANS: 'SET_SUBSCRIPTION_PLANS',
  
  // Export actions
  ADD_EXPORT_JOB: 'ADD_EXPORT_JOB',
  UPDATE_EXPORT_JOB: 'UPDATE_EXPORT_JOB',
}

// Reducer function
function appReducer(state, action) {
  switch (action.type) {
    case ActionTypes.SET_USER:
      return {
        ...state,
        user: action.payload,
      }
    
    case ActionTypes.UPDATE_USER:
      return {
        ...state,
        user: {
          ...state.user,
          ...action.payload,
        },
      }
    
    case ActionTypes.SET_VIDEOS:
      return {
        ...state,
        videos: action.payload,
      }
    
    case ActionTypes.ADD_VIDEO:
      return {
        ...state,
        videos: [...state.videos, action.payload],
      }
    
    case ActionTypes.UPDATE_VIDEO:
      return {
        ...state,
        videos: state.videos.map(video =>
          video.videoId === action.payload.videoId
            ? { ...video, ...action.payload }
            : video
        ),
      }
    
    case ActionTypes.DELETE_VIDEO:
      return {
        ...state,
        videos: state.videos.filter(video => video.videoId !== action.payload),
      }
    
    case ActionTypes.SET_CURRENT_VIDEO:
      return {
        ...state,
        currentVideo: action.payload,
      }
    
    case ActionTypes.SET_TEMPLATES:
      return {
        ...state,
        templates: action.payload,
      }
    
    case ActionTypes.SET_SELECTED_TEMPLATE:
      return {
        ...state,
        selectedTemplate: action.payload,
      }
    
    case ActionTypes.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      }
    
    case ActionTypes.SET_ERROR:
      return {
        ...state,
        error: action.payload,
      }
    
    case ActionTypes.SET_ACTIVE_VIEW:
      return {
        ...state,
        activeView: action.payload,
      }
    
    case ActionTypes.ADD_PROCESSING_JOB:
      return {
        ...state,
        processingJobs: {
          ...state.processingJobs,
          [action.payload.jobId]: action.payload,
        },
      }
    
    case ActionTypes.UPDATE_PROCESSING_JOB:
      return {
        ...state,
        processingJobs: {
          ...state.processingJobs,
          [action.payload.jobId]: {
            ...state.processingJobs[action.payload.jobId],
            ...action.payload,
          },
        },
      }
    
    case ActionTypes.REMOVE_PROCESSING_JOB:
      const { [action.payload]: removed, ...remainingJobs } = state.processingJobs
      return {
        ...state,
        processingJobs: remainingJobs,
      }
    
    case ActionTypes.SET_ANALYTICS:
      return {
        ...state,
        analytics: action.payload,
      }
    
    case ActionTypes.SET_SUBSCRIPTION_PLANS:
      return {
        ...state,
        subscriptionPlans: action.payload,
      }
    
    case ActionTypes.ADD_EXPORT_JOB:
      return {
        ...state,
        exports: {
          ...state.exports,
          [action.payload.exportId]: action.payload,
        },
      }
    
    case ActionTypes.UPDATE_EXPORT_JOB:
      return {
        ...state,
        exports: {
          ...state.exports,
          [action.payload.exportId]: {
            ...state.exports[action.payload.exportId],
            ...action.payload,
          },
        },
      }
    
    default:
      return state
  }
}

// Create context
const AppContext = createContext()

// Context provider component
export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState)

  // Initialize app with mock data (in production, this would load from API)
  useEffect(() => {
    const initializeApp = async () => {
      try {
        dispatch({ type: ActionTypes.SET_LOADING, payload: true })
        
        // In development, use mock data
        // In production, these would be actual API calls
        dispatch({ type: ActionTypes.SET_USER, payload: mockData.user })
        dispatch({ type: ActionTypes.SET_TEMPLATES, payload: mockData.templates })
        dispatch({ type: ActionTypes.SET_VIDEOS, payload: mockData.videos })
        dispatch({ type: ActionTypes.SET_SUBSCRIPTION_PLANS, payload: mockData.subscriptionPlans })
        
        // Set mock analytics data
        dispatch({
          type: ActionTypes.SET_ANALYTICS,
          payload: {
            metrics: {
              totalViews: 12500,
              engagementRate: 8.2,
              shares: 324,
              avgWatchTime: 105, // seconds
            },
            videoPerformance: [
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
            ],
            suggestions: [
              {
                type: 'content',
                title: 'Optimal Post Time',
                description: 'Your audience is most active between 2-4 PM on weekdays',
              },
              {
                type: 'format',
                title: 'Vertical Videos Perform Better',
                description: 'Your 9:16 videos get 40% more engagement than 16:9',
              },
            ],
          },
        })
        
      } catch (error) {
        dispatch({ type: ActionTypes.SET_ERROR, payload: error.message })
      } finally {
        dispatch({ type: ActionTypes.SET_LOADING, payload: false })
      }
    }

    initializeApp()
  }, [])

  // Action creators
  const actions = {
    // User actions
    setUser: (user) => dispatch({ type: ActionTypes.SET_USER, payload: user }),
    updateUser: (updates) => dispatch({ type: ActionTypes.UPDATE_USER, payload: updates }),
    
    // Video actions
    setVideos: (videos) => dispatch({ type: ActionTypes.SET_VIDEOS, payload: videos }),
    addVideo: (video) => dispatch({ type: ActionTypes.ADD_VIDEO, payload: video }),
    updateVideo: (video) => dispatch({ type: ActionTypes.UPDATE_VIDEO, payload: video }),
    deleteVideo: (videoId) => dispatch({ type: ActionTypes.DELETE_VIDEO, payload: videoId }),
    setCurrentVideo: (video) => dispatch({ type: ActionTypes.SET_CURRENT_VIDEO, payload: video }),
    
    // Template actions
    setTemplates: (templates) => dispatch({ type: ActionTypes.SET_TEMPLATES, payload: templates }),
    setSelectedTemplate: (template) => dispatch({ type: ActionTypes.SET_SELECTED_TEMPLATE, payload: template }),
    
    // UI actions
    setLoading: (loading) => dispatch({ type: ActionTypes.SET_LOADING, payload: loading }),
    setError: (error) => dispatch({ type: ActionTypes.SET_ERROR, payload: error }),
    setActiveView: (view) => dispatch({ type: ActionTypes.SET_ACTIVE_VIEW, payload: view }),
    
    // Processing actions
    addProcessingJob: (job) => dispatch({ type: ActionTypes.ADD_PROCESSING_JOB, payload: job }),
    updateProcessingJob: (job) => dispatch({ type: ActionTypes.UPDATE_PROCESSING_JOB, payload: job }),
    removeProcessingJob: (jobId) => dispatch({ type: ActionTypes.REMOVE_PROCESSING_JOB, payload: jobId }),
    
    // Analytics actions
    setAnalytics: (analytics) => dispatch({ type: ActionTypes.SET_ANALYTICS, payload: analytics }),
    
    // Subscription actions
    setSubscriptionPlans: (plans) => dispatch({ type: ActionTypes.SET_SUBSCRIPTION_PLANS, payload: plans }),
    
    // Export actions
    addExportJob: (job) => dispatch({ type: ActionTypes.ADD_EXPORT_JOB, payload: job }),
    updateExportJob: (job) => dispatch({ type: ActionTypes.UPDATE_EXPORT_JOB, payload: job }),
  }

  const value = {
    state,
    actions,
    dispatch,
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}

// Custom hook to use the app context
export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}

export default AppContext
