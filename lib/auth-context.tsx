'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { jwtUtils } from './jwt'

export interface User {
  id: string
  email?: string
  phone?: string
  isVerified: boolean
  lastLogin?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (token: string, userData: User) => void
  logout: () => void
  refreshToken: () => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Login function
  const login = (token: string, userData: User) => {
    localStorage.setItem('access-token', token)
    setUser(userData)
  }

  // Logout function
  const logout = async () => {
    try {
      // Call logout API to clear server-side tokens
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      })
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      // Clear client-side data
      localStorage.removeItem('access-token')
      setUser(null)
    }
  }

  // Refresh token function
  const refreshToken = async (): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        credentials: 'include'
      })

      if (!response.ok) {
        throw new Error('Refresh failed')
      }

      const data = await response.json()
      localStorage.setItem('access-token', data.accessToken)
      setUser(data.user)
      return true
    } catch (error) {
      console.error('Token refresh error:', error)
      // Clear invalid session
      localStorage.removeItem('access-token')
      setUser(null)
      return false
    }
  }

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('access-token')
      
      if (token) {
        // Verify token validity
        const payload = jwtUtils.verifyAccessToken(token)
        if (payload) {
          setUser({
            id: payload.userId,
            email: payload.email,
            phone: payload.phone,
            isVerified: payload.isVerified
          })
        } else {
          // Token is invalid, try to refresh
          const refreshed = await refreshToken()
          if (!refreshed) {
            localStorage.removeItem('access-token')
          }
        }
      }
      
      setIsLoading(false)
    }

    initializeAuth()
  }, [])

  // Auto-refresh token before expiration
  useEffect(() => {
    if (!user) return

    const token = localStorage.getItem('access-token')
    if (!token) return

    const payload = jwtUtils.verifyAccessToken(token)
    if (!payload?.exp) return

    // Calculate time until token expires (minus 1 minute buffer)
    const timeUntilExpiry = (payload.exp * 1000) - Date.now() - 60000

    if (timeUntilExpiry > 0) {
      const refreshTimer = setTimeout(() => {
        refreshToken()
      }, timeUntilExpiry)

      return () => clearTimeout(refreshTimer)
    }
  }, [user])

  const value = {
    user,
    isLoading,
    login,
    logout,
    refreshToken
  }

  return (
    <AuthContext.Provider value={value}>
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

// Higher-order component for protected routes
export function withAuth<P extends object>(
  Component: React.ComponentType<P>
) {
  return function AuthenticatedComponent(props: P) {
    const { user, isLoading } = useAuth()
    
    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
        </div>
      )
    }
    
    if (!user) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
            <p className="text-muted-foreground mb-4">Please log in to access this page</p>
            <a 
              href="/verify-otp" 
              className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Go to Login
            </a>
          </div>
        </div>
      )
    }
    
    return <Component {...props} />
  }
}