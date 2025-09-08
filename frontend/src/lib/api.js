import axios from 'axios'

// Create axios instance with production-ready configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
  // Enable request/response compression
  decompress: true,
  withCredentials: true,
})

// Request interceptor to add auth token and request ID
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    // Add request ID for tracking
    config.headers['X-Request-ID'] = crypto.randomUUID()
    
    // Add timestamp for debugging
    config.metadata = { startTime: new Date() }
    
    return config
  },
  (error) => {
    console.error('Request interceptor error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor to handle auth errors and logging
api.interceptors.response.use(
  (response) => {
    // Log successful requests in development
    if (import.meta.env.DEV) {
      const duration = new Date() - response.config.metadata?.startTime
      console.log(`✅ ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status} (${duration}ms)`)
    }
    return response
  },
  (error) => {
    // Log errors
    const duration = new Date() - error.config?.metadata?.startTime
    console.error(`❌ ${error.config?.method?.toUpperCase()} ${error.config?.url} - ${error.response?.status || 'Network Error'} (${duration}ms)`, error)
    
    // Handle different error types
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      // Use replace to avoid adding to history
      window.location.replace('/login')
    } else if (error.response?.status === 403) {
      console.error('Access forbidden')
    } else if (error.response?.status >= 500) {
      console.error('Server error occurred')
    } else if (!error.response) {
      console.error('Network error - check your connection')
    }
    
    return Promise.reject(error)
  }
)

// Retry utility function
const retryRequest = async (requestFn, maxRetries = 3, delay = 1000) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await requestFn()
    } catch (error) {
      if (i === maxRetries - 1 || error.response?.status < 500) {
        throw error
      }
      await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)))
    }
  }
}

// Auth API with retry logic
export const authAPI = {
  login: (credentials) => retryRequest(() => api.post('/auth/login', credentials)),
  register: (userData) => retryRequest(() => api.post('/auth/register', userData)),
  logout: () => api.post('/auth/logout'),
  getMe: () => retryRequest(() => api.get('/auth/me')),
}

// Reports API with retry logic
export const reportsAPI = {
  upload: (formData) => api.post('/reports/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 60000, // 60 seconds for file uploads
  }),
  getMyReports: (params) => retryRequest(() => api.get('/reports/my-reports', { params })),
  getReport: (id) => retryRequest(() => api.get(`/reports/${id}`)),
  getReportStatus: (id) => retryRequest(() => api.get(`/reports/${id}/status`)),
  deleteReport: (id) => api.delete(`/reports/${id}`),
  // Admin endpoints
  getAllReports: (params) => retryRequest(() => api.get('/reports/admin/all', { params })),
}

// User API with retry logic
export const userAPI = {
  getDashboard: () => retryRequest(() => api.get('/user/dashboard')),
  updateProfile: (profile) => retryRequest(() => api.put('/user/profile', { profile })),
}

// Admin API with retry logic
export const adminAPI = {
  getDashboard: () => retryRequest(() => api.get('/admin/dashboard')),
  getUsers: (params) => retryRequest(() => api.get('/admin/users', { params })),
  updateUserRole: (id, role) => retryRequest(() => api.put(`/admin/users/${id}/role`, { role })),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
}

export default api

