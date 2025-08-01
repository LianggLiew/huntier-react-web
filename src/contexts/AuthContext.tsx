'use client'

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { 
  AuthContextType, 
  AuthProviderProps, 
  User, 
  UserProfile,
  ApiResponse,
  SessionValidationResponse
} from '@/types'

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Custom hook to use auth context
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// AuthProvider component
export function AuthProvider({ children, initialAuth }: AuthProviderProps): React.ReactElement {
  const [user, setUser] = useState<User | null>(initialAuth?.user || null)
  const [profile, setProfile] = useState<UserProfile | null>(initialAuth?.profile || null)
  const [loading, setLoading] = useState<boolean>(!initialAuth)
  const [error, setError] = useState<string | null>(null)

  // Computed state
  const isAuthenticated = Boolean(user?.isAuthenticated)

  // Validate session on mount and periodically
  const validateSession = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/auth/validate-session', {
        method: 'GET',
        credentials: 'include'
      })

      const result: ApiResponse<SessionValidationResponse> = await response.json()

      if (result.success && result.data?.valid && result.data.user) {
        setUser(result.data.user)
        setProfile(result.data.profile || null)
      } else {
        setUser(null)
        setProfile(null)
        if (result.error) {
          console.warn('Session validation failed:', result.error)
        }
      }
    } catch (err) {
      console.error('Session validation error:', err)
      setUser(null)
      setProfile(null)
      setError('Failed to validate session')
    } finally {
      setLoading(false)
    }
  }, [])

  // Login function
  const login = useCallback(async (sessionToken: string, userData: User): Promise<void> => {
    try {
      setLoading(true)
      setError(null)

      // The session token should already be set as HTTP-only cookie by the API
      setUser({
        ...userData,
        isAuthenticated: true
      })

      // Fetch user profile if user doesn't need onboarding
      if (!userData.needsOnboarding) {
        try {
          const profileResponse = await fetch('/api/user/profile', {
            method: 'GET',
            credentials: 'include'
          })

          if (profileResponse.ok) {
            const profileResult = await profileResponse.json()
            if (profileResult.success && profileResult.data) {
              setProfile(profileResult.data)
            }
          }
        } catch (profileError) {
          console.warn('Failed to fetch user profile:', profileError)
          // Not critical, user can still be logged in without profile
        }
      }
    } catch (err) {
      console.error('Login error:', err)
      setError('Login failed')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // Logout function
  const logout = useCallback(async (): Promise<void> => {
    try {
      setLoading(true)
      setError(null)

      // Call logout API to clear server-side session
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      })

      // Clear client state
      setUser(null)
      setProfile(null)
    } catch (err) {
      console.error('Logout error:', err)
      // Even if API fails, clear client state
      setUser(null)
      setProfile(null)
      setError('Logout failed')
    } finally {
      setLoading(false)
    }
  }, [])

  // Update user data
  const updateUser = useCallback((updates: Partial<User>): void => {
    setUser(current => {
      if (!current) return null
      return { ...current, ...updates }
    })
  }, [])

  // Update user profile
  const updateProfile = useCallback(async (updates: Partial<UserProfile>): Promise<void> => {
    try {
      // Make API call to save profile updates
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(updates)
      })

      if (!response.ok) {
        throw new Error('Failed to update profile')
      }

      const result = await response.json()

      if (result.success && result.data?.profile) {
        // Update local state with the returned profile data
        setProfile(result.data.profile)
      } else {
        throw new Error(result.error || 'Failed to update profile')
      }
    } catch (error) {
      console.error('Failed to update profile:', error)
      throw error
    }
  }, [])

  // Refresh user data
  const refreshUser = useCallback(async (): Promise<void> => {
    await validateSession()
  }, [validateSession])

  // Validate session on mount
  useEffect(() => {
    if (!initialAuth) {
      validateSession()
    }
  }, [validateSession, initialAuth])

  // Set up periodic session validation (every 15 minutes)
  useEffect(() => {
    const interval = setInterval(() => {
      if (isAuthenticated) {
        validateSession()
      }
    }, 15 * 60 * 1000) // 15 minutes

    return () => clearInterval(interval)
  }, [isAuthenticated, validateSession])

  // Context value
  const contextValue: AuthContextType = {
    user,
    profile,
    loading,
    error,
    isAuthenticated,
    login,
    logout,
    updateUser,
    updateProfile,
    refreshUser
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}