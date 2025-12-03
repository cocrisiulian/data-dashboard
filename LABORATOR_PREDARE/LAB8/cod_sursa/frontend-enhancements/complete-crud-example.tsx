// Example: Complete CRUD Operations with Lab 7 API
// Demonstrates all operations needed for Lab 8

import { useState, useEffect } from 'react'

// ==========================================
// API Client with all CRUD operations
// ==========================================

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

class ApiClient {
  private getHeaders() {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null
    return {
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
    }
  }

  // ========== AUTH ==========
  
  async login(email: string, password: string) {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    
    if (!response.ok) throw new Error('Login failed')
    const data = await response.json()
    
    // Save token
    if (data.token) {
      localStorage.setItem('auth_token', data.token)
    }
    
    return data
  }

  async register(email: string, password: string, username: string) {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, username }),
    })
    
    if (!response.ok) throw new Error('Registration failed')
    return response.json()
  }

  async getMe() {
    const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
      headers: this.getHeaders(),
    })
    
    if (!response.ok) throw new Error('Failed to fetch user')
    return response.json()
  }

  // ========== FILES (CSV) ==========
  
  async uploadFile(file: File) {
    const formData = new FormData()
    formData.append('file', file)
    
    const token = localStorage.getItem('auth_token')
    const response = await fetch(`${API_BASE_URL}/api/files/upload`, {
      method: 'POST',
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
      },
      body: formData,
    })
    
    if (!response.ok) throw new Error('Upload failed')
    return response.json()
  }

  async getFiles() {
    const response = await fetch(`${API_BASE_URL}/api/files`, {
      headers: this.getHeaders(),
    })
    
    if (!response.ok) throw new Error('Failed to fetch files')
    return response.json()
  }

  async getFile(fileId: string) {
    const response = await fetch(`${API_BASE_URL}/api/files/${fileId}`, {
      headers: this.getHeaders(),
    })
    
    if (!response.ok) throw new Error('Failed to fetch file')
    return response.json()
  }

  async deleteFile(fileId: string) {
    const response = await fetch(`${API_BASE_URL}/api/files/${fileId}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    })
    
    if (!response.ok) throw new Error('Failed to delete file')
    return response.json()
  }

  // ========== DASHBOARDS ==========
  
  async getDashboards() {
    const response = await fetch(`${API_BASE_URL}/api/dashboards`, {
      headers: this.getHeaders(),
    })
    
    if (!response.ok) throw new Error('Failed to fetch dashboards')
    return response.json()
  }

  async getDashboard(dashboardId: string) {
    const response = await fetch(`${API_BASE_URL}/api/dashboards/${dashboardId}`, {
      headers: this.getHeaders(),
    })
    
    if (!response.ok) throw new Error('Failed to fetch dashboard')
    return response.json()
  }

  async createDashboard(name: string, description?: string) {
    const response = await fetch(`${API_BASE_URL}/api/dashboards`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ name, description }),
    })
    
    if (!response.ok) throw new Error('Failed to create dashboard')
    return response.json()
  }

  async updateDashboard(dashboardId: string, data: { name?: string; description?: string }) {
    const response = await fetch(`${API_BASE_URL}/api/dashboards/${dashboardId}`, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    })
    
    if (!response.ok) throw new Error('Failed to update dashboard')
    return response.json()
  }

  async deleteDashboard(dashboardId: string) {
    const response = await fetch(`${API_BASE_URL}/api/dashboards/${dashboardId}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    })
    
    if (!response.ok) throw new Error('Failed to delete dashboard')
    return response.json()
  }

  // ========== CHARTS ==========
  
  async getCharts(dashboardId?: string) {
    const url = dashboardId 
      ? `${API_BASE_URL}/api/charts?dashboardId=${dashboardId}`
      : `${API_BASE_URL}/api/charts`
    
    const response = await fetch(url, {
      headers: this.getHeaders(),
    })
    
    if (!response.ok) throw new Error('Failed to fetch charts')
    return response.json()
  }

  async createChart(data: {
    dashboard_id: string
    file_id: string
    chart_type: string
    chart_config: object
    title: string
  }) {
    const response = await fetch(`${API_BASE_URL}/api/charts`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    })
    
    if (!response.ok) throw new Error('Failed to create chart')
    return response.json()
  }

  async updateChart(chartId: string, data: {
    title?: string
    chart_type?: string
    chart_config?: object
  }) {
    const response = await fetch(`${API_BASE_URL}/api/charts/${chartId}`, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    })
    
    if (!response.ok) throw new Error('Failed to update chart')
    return response.json()
  }

  async deleteChart(chartId: string) {
    const response = await fetch(`${API_BASE_URL}/api/charts/${chartId}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    })
    
    if (!response.ok) throw new Error('Failed to delete chart')
    return response.json()
  }

  // ========== PLANS ==========
  
  async getPlans() {
    const response = await fetch(`${API_BASE_URL}/api/plans`, {
      headers: { 'Content-Type': 'application/json' },
    })
    
    if (!response.ok) throw new Error('Failed to fetch plans')
    return response.json()
  }

  async getPlan(planId: string) {
    const response = await fetch(`${API_BASE_URL}/api/plans/${planId}`, {
      headers: { 'Content-Type': 'application/json' },
    })
    
    if (!response.ok) throw new Error('Failed to fetch plan')
    return response.json()
  }
}

export const apiClient = new ApiClient()

// ==========================================
// React Component Example - File Management
// ==========================================

export function FileManagementExample() {
  const [files, setFiles] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load files on mount
  useEffect(() => {
    loadFiles()
  }, [])

  const loadFiles = async () => {
    try {
      setLoading(true)
      const data = await apiClient.getFiles()
      setFiles(data)
      setError(null)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleUpload = async (file: File) => {
    try {
      setLoading(true)
      await apiClient.uploadFile(file)
      await loadFiles() // Refresh list
      alert('File uploaded successfully!')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (fileId: string) => {
    if (!confirm('Are you sure?')) return
    
    try {
      setLoading(true)
      await apiClient.deleteFile(fileId)
      await loadFiles() // Refresh list
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">File Management (CRUD)</h2>
      
      {/* Upload Form */}
      <div className="mb-6 p-4 border rounded">
        <input
          type="file"
          accept=".csv"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) handleUpload(file)
          }}
          disabled={loading}
        />
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-800 rounded">
          Error: {error}
        </div>
      )}

      {/* Files List */}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="space-y-2">
          {files.map((file) => (
            <div key={file.id} className="flex items-center justify-between p-3 border rounded">
              <div>
                <div className="font-medium">{file.file_name}</div>
                <div className="text-sm text-gray-500">
                  {(file.file_size / 1024).toFixed(2)} KB
                </div>
              </div>
              <button
                onClick={() => handleDelete(file.id)}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                disabled={loading}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ==========================================
// Usage in Pages
// ==========================================

/*
// In your page component:

import { apiClient } from '@/lib/api/client'
import { FileManagementExample } from '@/components/examples/crud-example'

export default function FilesPage() {
  return (
    <div>
      <FileManagementExample />
    </div>
  )
}
*/
