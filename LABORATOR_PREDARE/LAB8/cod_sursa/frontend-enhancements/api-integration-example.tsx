// Example: File Upload with API Integration
// Frontend component showing CRUD operation with Lab 7 API

import { useState } from 'react'
import { apiClient } from '@/lib/api/client'

export function FileUploadExample() {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!file) {
      setError('Please select a file')
      return
    }

    // Reset states
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      // Create FormData for file upload
      const formData = new FormData()
      formData.append('file', file)

      // API call to Lab 7 endpoint: POST /api/files/upload
      const response = await apiClient.uploadFile(formData)

      console.log('Upload successful:', response)
      setSuccess(true)
      setFile(null)
      
      // Reset form
      ;(e.target as HTMLFormElement).reset()

    } catch (err: any) {
      console.error('Upload error:', err)
      setError(err.response?.data?.message || 'Failed to upload file')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 border rounded-lg">
      <h3 className="text-lg font-bold mb-4">Upload CSV File</h3>
      
      <form onSubmit={handleFileUpload} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Select CSV File
          </label>
          <input
            type="file"
            accept=".csv"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <button
          type="submit"
          disabled={loading || !file}
          className="w-full bg-primary text-white py-2 rounded hover:bg-primary/90 disabled:opacity-50"
        >
          {loading ? 'Uploading...' : 'Upload File'}
        </button>

        {/* Success message */}
        {success && (
          <div className="p-3 bg-green-100 text-green-800 rounded">
            ✓ File uploaded successfully!
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="p-3 bg-red-100 text-red-800 rounded">
            ✗ {error}
          </div>
        )}
      </form>

      {/* API Request Details */}
      <div className="mt-6 p-4 bg-slate-100 rounded text-xs">
        <h4 className="font-bold mb-2">API Request Details</h4>
        <div className="space-y-1">
          <div><strong>Method:</strong> POST</div>
          <div><strong>Endpoint:</strong> /api/files/upload</div>
          <div><strong>Headers:</strong> Authorization: Bearer {'{token}'}</div>
          <div><strong>Body:</strong> FormData (multipart/form-data)</div>
        </div>
      </div>
    </div>
  )
}

// ==========================================
// API Client Implementation (lib/api/client.ts)
// ==========================================

export const apiClient = {
  // Base URL from environment variable
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000',

  // Helper: Get auth token from localStorage
  getAuthToken() {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token')
    }
    return null
  },

  // Helper: Create headers with auth
  getHeaders() {
    const token = this.getAuthToken()
    return {
      'Authorization': token ? `Bearer ${token}` : '',
    }
  },

  // Upload file
  async uploadFile(formData: FormData) {
    const response = await fetch(`${this.baseURL}/api/files/upload`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: formData, // Don't set Content-Type, browser will set it with boundary
    })

    if (!response.ok) {
      throw new Error('Upload failed')
    }

    return response.json()
  },

  // Get all files
  async getFiles() {
    const response = await fetch(`${this.baseURL}/api/files`, {
      method: 'GET',
      headers: {
        ...this.getHeaders(),
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch files')
    }

    return response.json()
  },

  // Delete file
  async deleteFile(fileId: string) {
    const response = await fetch(`${this.baseURL}/api/files/${fileId}`, {
      method: 'DELETE',
      headers: {
        ...this.getHeaders(),
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Failed to delete file')
    }

    return response.json()
  },

  // Create chart
  async createChart(data: {
    dashboard_id: string
    file_id: string
    chart_type: string
    chart_config: object
    title: string
  }) {
    const response = await fetch(`${this.baseURL}/api/charts`, {
      method: 'POST',
      headers: {
        ...this.getHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error('Failed to create chart')
    }

    return response.json()
  },
}

// ==========================================
// Error Handling Best Practices
// ==========================================

/*
1. Always use try-catch for async operations
2. Show user-friendly error messages
3. Log errors to console for debugging
4. Provide loading states for better UX
5. Reset form state after successful operation

Example Error Handling:
*/

async function exampleWithErrorHandling() {
  try {
    const result = await apiClient.getFiles()
    // Handle success
    console.log('Files:', result)
  } catch (error: any) {
    // Network error
    if (error.message === 'Failed to fetch') {
      console.error('Network error - backend might be down')
    }
    
    // Authentication error
    if (error.response?.status === 401) {
      console.error('Unauthorized - redirect to login')
      window.location.href = '/login'
    }
    
    // Validation error
    if (error.response?.status === 400) {
      console.error('Bad request:', error.response.data)
    }
    
    // Server error
    if (error.response?.status === 500) {
      console.error('Server error - try again later')
    }
  }
}
