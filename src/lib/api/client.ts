import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

// Create axios instance
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add JWT token
axiosInstance.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor to handle errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

// ==================== AUTH ====================
const auth = {
  register: async (email: string, password: string, fullName?: string) => {
    const { data } = await axiosInstance.post('/api/auth/register', { email, password, fullName })
    return data
  },

  login: async (email: string, password: string) => {
    const { data } = await axiosInstance.post('/api/auth/login', { email, password })
    if (data.token) {
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
    }
    return data
  },

  logout: async () => {
    try {
      await axiosInstance.post('/api/auth/logout')
    } finally {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
  },

  getMe: async () => {
    const { data } = await axiosInstance.get('/api/auth/me')
    return data
  },

  upgradePlan: async (planId: string, deleteResources?: {
    fileIds?: string[]
    chartIds?: string[]
    dashboardIds?: string[]
  }) => {
    const { data } = await axiosInstance.patch('/api/auth/upgrade-plan', { 
      planId,
      deleteResources 
    })
    return data
  },

  updateProfile: async (updates: { fullName?: string; email?: string }) => {
    const { data } = await axiosInstance.patch('/api/auth/profile', updates)
    return data
  },

  changePassword: async (currentPassword: string, newPassword: string) => {
    const { data } = await axiosInstance.patch('/api/auth/change-password', {
      currentPassword,
      newPassword
    })
    return data
  },
}

// ==================== DASHBOARDS ====================
const dashboards = {
  getAll: async () => {
    const { data } = await axiosInstance.get('/api/dashboards')
    return data
  },

  getOne: async (id: string) => {
    const { data } = await axiosInstance.get(`/api/dashboards/${id}`)
    return data
  },

  create: async (payload: { name: string; description?: string }) => {
    const { data } = await axiosInstance.post('/api/dashboards', payload)
    return data
  },

  update: async (id: string, updates: { name?: string; description?: string }) => {
    const { data } = await axiosInstance.patch(`/api/dashboards/${id}`, updates)
    return data
  },

  delete: async (id: string) => {
    const { data } = await axiosInstance.delete(`/api/dashboards/${id}`)
    return data
  },
}

// ==================== PLANS ====================
const plans = {
  getAll: async () => {
    const { data } = await axiosInstance.get('/api/plans')
    return data
  },

  getOne: async (id: string) => {
    const { data } = await axiosInstance.get(`/api/plans/${id}`)
    return data
  },
}

// ==================== FILES ====================
const files = {
  getAll: async () => {
    const { data } = await axiosInstance.get('/api/files')
    return data
  },

  getOne: async (id: string) => {
    const { data } = await axiosInstance.get(`/api/files/${id}`)
    return data
  },

  getPreview: async (id: string) => {
    const { data } = await axiosInstance.get(`/api/files/${id}/preview`)
    return data
  },

  upload: async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    
    const { data } = await axiosInstance.post('/api/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return data
  },

  delete: async (id: string) => {
    const { data } = await axiosInstance.delete(`/api/files/${id}`)
    return data
  },
}

// ==================== CHARTS ====================
const charts = {
  getAll: async (dashboardId: string) => {
    const { data } = await axiosInstance.get('/api/charts', {
      params: { dashboardId }
    })
    return data
  },

  getOne: async (id: string) => {
    const { data } = await axiosInstance.get(`/api/charts/${id}`)
    return data
  },

  create: async (payload: {
    dashboard_id: string
    file_id: string
    chart_type: string
    chart_config: any
    title: string
  }) => {
    const { data } = await axiosInstance.post('/api/charts', payload)
    return data
  },

  update: async (id: string, updates: {
    chart_type?: string
    chart_config?: any
    title?: string
  }) => {
    const { data } = await axiosInstance.patch(`/api/charts/${id}`, updates)
    return data
  },

  delete: async (id: string) => {
    const { data } = await axiosInstance.delete(`/api/charts/${id}`)
    return data
  },
}

// ==================== UTILS ====================
export const getToken = () => {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('token')
}

export const getUser = () => {
  if (typeof window === 'undefined') return null
  const user = localStorage.getItem('user')
  return user ? JSON.parse(user) : null
}

export const isAuthenticated = () => {
  return !!getToken()
}

// ==================== EXPORT API OBJECT ====================
export const api = {
  auth,
  dashboards,
  plans,
  files,
  charts,
}

export default api
