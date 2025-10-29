"use client"

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { apiClient, User, AuthResponse } from '@/lib/api'

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (usernameOrEmail: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (username: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const isAuthenticated = !!user

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check if we have a token
        const token = localStorage.getItem('auth_token')
        if (token) {
          apiClient.setToken(token)
          // Try to get current user
          const response = await apiClient.getCurrentUser()
          if (response.success && response.data) {
            setUser(response.data)
          } else {
            // Token is invalid, clear it
            apiClient.setToken(null)
            localStorage.removeItem('auth_token')
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error)
        // Clear invalid token
        apiClient.setToken(null)
        localStorage.removeItem('auth_token')
      } finally {
        setIsLoading(false)
      }
    }

    initializeAuth()
  }, [])

  const login = async (usernameOrEmail: string, password: string) => {
    try {
      setIsLoading(true)
      const response = await apiClient.login(usernameOrEmail, password)
      
      if (response.success && response.data) {
        const { user: userData, access_token } = response.data
        apiClient.setToken(access_token)
        setUser(userData)
        return { success: true }
      } else {
        return { 
          success: false, 
          error: response.message || response.error || 'Login failed' 
        }
      }
    } catch (error) {
      console.error('Login error:', error)
      return { 
        success: false, 
        error: 'An unexpected error occurred' 
      }
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (username: string, email: string, password: string) => {
    try {
      setIsLoading(true)
      const response = await apiClient.register(username, email, password)
      
      if (response.success && response.data) {
        const { user: userData, access_token } = response.data
        apiClient.setToken(access_token)
        setUser(userData)
        return { success: true }
      } else {
        return { 
          success: false, 
          error: response.message || response.error || 'Registration failed' 
        }
      }
    } catch (error) {
      console.error('Registration error:', error)
      return { 
        success: false, 
        error: 'An unexpected error occurred' 
      }
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    apiClient.setToken(null)
    setUser(null)
    // Clear any anonymous ID as well
    if (typeof window !== 'undefined') {
      localStorage.removeItem('anonymous_id')
    }
  }

  const refreshUser = async () => {
    try {
      const response = await apiClient.getCurrentUser()
      if (response.success && response.data) {
        setUser(response.data)
      } else {
        // Token might be invalid
        logout()
      }
    } catch (error) {
      console.error('Refresh user error:', error)
      logout()
    }
  }

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    refreshUser,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

