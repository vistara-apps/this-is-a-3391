// API service layer for VidSynth AI
// This handles all external API calls and data processing

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api'

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL
  }

  // Generic request handler
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('API request failed:', error)
      throw error
    }
  }

  // User Management
  async getUser(userId) {
    return this.request(`/users/${userId}`)
  }

  async updateUser(userId, userData) {
    return this.request(`/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    })
  }

  // Video Management
  async uploadVideo(file, metadata = {}) {
    const formData = new FormData()
    formData.append('video', file)
    formData.append('metadata', JSON.stringify(metadata))

    return this.request('/videos/upload', {
      method: 'POST',
      headers: {}, // Remove Content-Type to let browser set it for FormData
      body: formData,
    })
  }

  async getVideos(userId, filters = {}) {
    const queryParams = new URLSearchParams(filters).toString()
    return this.request(`/videos?userId=${userId}&${queryParams}`)
  }

  async getVideo(videoId) {
    return this.request(`/videos/${videoId}`)
  }

  async updateVideo(videoId, updates) {
    return this.request(`/videos/${videoId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    })
  }

  async deleteVideo(videoId) {
    return this.request(`/videos/${videoId}`, {
      method: 'DELETE',
    })
  }

  // AI Processing
  async processVideoWithAI(videoId, processingType, options = {}) {
    return this.request('/ai/process', {
      method: 'POST',
      body: JSON.stringify({
        videoId,
        processingType,
        options,
      }),
    })
  }

  async getProcessingStatus(jobId) {
    return this.request(`/ai/status/${jobId}`)
  }

  // Template Management
  async getTemplates(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString()
    return this.request(`/templates?${queryParams}`)
  }

  async getTemplate(templateId) {
    return this.request(`/templates/${templateId}`)
  }

  async applyTemplate(videoId, templateId, customizations = {}) {
    return this.request('/templates/apply', {
      method: 'POST',
      body: JSON.stringify({
        videoId,
        templateId,
        customizations,
      }),
    })
  }

  // Analytics
  async getAnalytics(userId, timeRange = '7d') {
    return this.request(`/analytics/${userId}?timeRange=${timeRange}`)
  }

  async getVideoAnalytics(videoId) {
    return this.request(`/analytics/video/${videoId}`)
  }

  // Export and Platform Integration
  async exportVideo(videoId, exportSettings) {
    return this.request('/export', {
      method: 'POST',
      body: JSON.stringify({
        videoId,
        exportSettings,
      }),
    })
  }

  async getExportStatus(exportId) {
    return this.request(`/export/status/${exportId}`)
  }

  // Subscription Management
  async getSubscriptionPlans() {
    return this.request('/subscription/plans')
  }

  async createSubscription(userId, planId, paymentMethodId) {
    return this.request('/subscription/create', {
      method: 'POST',
      body: JSON.stringify({
        userId,
        planId,
        paymentMethodId,
      }),
    })
  }

  async updateSubscription(subscriptionId, updates) {
    return this.request(`/subscription/${subscriptionId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    })
  }

  async cancelSubscription(subscriptionId) {
    return this.request(`/subscription/${subscriptionId}/cancel`, {
      method: 'POST',
    })
  }

  // Payment Processing (Stripe integration)
  async createPaymentIntent(amount, currency = 'usd') {
    return this.request('/payment/create-intent', {
      method: 'POST',
      body: JSON.stringify({ amount, currency }),
    })
  }

  async confirmPayment(paymentIntentId, paymentMethodId) {
    return this.request('/payment/confirm', {
      method: 'POST',
      body: JSON.stringify({
        paymentIntentId,
        paymentMethodId,
      }),
    })
  }
}

// Create singleton instance
const apiService = new ApiService()

export default apiService

// Mock data for development (when API is not available)
export const mockData = {
  user: {
    userId: 'user-123',
    email: 'demo@vidsynth.ai',
    name: 'Demo User',
    subscriptionTier: 'free',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  templates: [
    {
      templateId: 'template-1',
      name: 'TikTok Dance Challenge',
      description: 'Perfect for viral dance content',
      category: 'social',
      previewUrl: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=300&h=400&fit=crop',
      isPremium: false,
      duration: 15,
      aspectRatio: '9:16',
    },
    {
      templateId: 'template-2',
      name: 'Product Showcase',
      description: 'Professional product presentation',
      category: 'business',
      previewUrl: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=400&fit=crop',
      isPremium: true,
      duration: 30,
      aspectRatio: '16:9',
    },
  ],

  videos: [
    {
      videoId: 'video-1',
      userId: 'user-123',
      originalFilename: 'summer-sale-promo.mp4',
      processedFilename: 'summer-sale-promo-processed.mp4',
      templateUsed: 'template-2',
      exportSettings: {
        platform: 'instagram',
        quality: 'high',
        format: 'mp4',
      },
      analysisData: {
        views: 2800,
        engagement: 9.2,
        shares: 45,
        avgWatchTime: 25,
      },
      status: 'completed',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
  ],

  subscriptionPlans: [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      interval: 'month',
      features: [
        'Limited templates',
        'Watermarked exports',
        'Basic editing tools',
        '5 exports per month',
      ],
    },
    {
      id: 'creator',
      name: 'Creator',
      price: 19,
      interval: 'month',
      features: [
        'All templates',
        'No watermark',
        'Advanced AI tools',
        'Unlimited exports',
        'Custom branding',
        'Priority support',
      ],
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 49,
      interval: 'month',
      features: [
        'Everything in Creator',
        '4K export quality',
        'Advanced analytics',
        'API access',
        'White-label solution',
        'Dedicated support',
      ],
    },
  ],
}
