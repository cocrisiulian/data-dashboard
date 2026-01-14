'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { api, getUser, getToken, isAuthenticated } from '@/lib/api/client'

type User = {
  id: string
  email: string
  fullName: string | null
  isAdmin?: boolean
  plan?: {
    id: string
    name: string
    maxFiles: number
    maxCharts: number
    maxDashboards: number
  }
}

type AuthContextType = {
  user: User | null
  token: string | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, fullName?: string) => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = getUser()
    const storedToken = getToken()
    if (storedUser && storedToken) {
      setUser(storedUser)
      setToken(storedToken)
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    const data = await api.auth.login(email, password)
    setUser(data.user)
    setToken(data.token)
  }

  const register = async (email: string, password: string, fullName?: string) => {
    await api.auth.register(email, password, fullName)
    // Auto-login after registration
    await login(email, password)
  }

  const logout = async () => {
    await api.auth.logout()
    setUser(null)
    setToken(null)
  }

  const refreshUser = async () => {
    if (!isAuthenticated()) return
    
    try {
      const userData = await api.auth.getMe()
      setUser(userData)
      localStorage.setItem('user', JSON.stringify(userData))
    } catch (error) {
      console.error('Failed to refresh user:', error)
      await logout()
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
