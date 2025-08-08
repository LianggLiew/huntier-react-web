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

  // Validate session with automatic refresh on failure
  const validateSession = useCallback(async (skipRefresh: boolean = false) => {
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
        return true
      } else {
        // If session is invalid and we haven't tried refresh yet, attempt token refresh
        if (!skipRefresh && response.status === 401) {
          console.log('Session expired, attempting token refresh...')
          
          const refreshResponse = await fetch('/api/auth/refresh', {
            method: 'POST',
            credentials: 'include'
          })

          if (refreshResponse.ok) {
            const refreshResult = await refreshResponse.json()
            
            if (refreshResult.success && refreshResult.data?.user) {
              console.log('Token refresh successful')
              setUser({
                ...refreshResult.data.user,
                isAuthenticated: true
              })
              
              // Try to fetch profile after successful refresh
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
                console.warn('Failed to fetch profile after refresh:', profileError)
              }
              
              return true
            }
          }
          
          console.warn('Token refresh failed, user needs to login again')
        }
        
        // Clear user state if validation and refresh both failed
        setUser(null)
        setProfile(null)
        if (result.error) {
          console.warn('Session validation failed:', result.error)
        }
        return false
      }
    } catch (err) {
      console.error('Session validation error:', err)
      setUser(null)
      setProfile(null)
      setError('Failed to validate session')
      return false
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

      // Clear localStorage data to prevent data leakage between users
      if (typeof window !== 'undefined') {
        localStorage.removeItem('userProfileImage')
        localStorage.removeItem('userPersonalInfo')
        localStorage.removeItem('userProfileData')
        localStorage.removeItem('huntier_redirect_after_auth')
      }
    } catch (err) {
      console.error('Logout error:', err)
      // Even if API fails, clear client state and localStorage
      setUser(null)
      setProfile(null)
      
      // Clear localStorage even on error to prevent data leakage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('userProfileImage')
        localStorage.removeItem('userPersonalInfo')
        localStorage.removeItem('userProfileData')
        localStorage.removeItem('huntier_redirect_after_auth')
      }
      setError('Logout failed')
    } finally {
      setLoading(false)
    }
  }, [])

  // Proactive token refresh - checks if token expires soon and refreshes it
  const checkAndRefreshToken = useCallback(async () => {
    if (!isAuthenticated) return false

    try {
      const refreshResponse = await fetch('/api/auth/refresh', {
        method: 'POST',
        credentials: 'include'
      })

      if (refreshResponse.ok) {
        const refreshResult = await refreshResponse.json()
        
        if (refreshResult.success && refreshResult.data?.user) {
          console.log('Proactive token refresh successful')
          setUser(current => ({
            ...current!,
            ...refreshResult.data.user,
            isAuthenticated: true
          }))
          return true
        }
      } else if (refreshResponse.status === 401) {
        // Refresh token expired, user needs to login again
        console.warn('Refresh token expired, logging out user')
        setUser(null)
        setProfile(null)
        return false
      }
    } catch (error) {
      console.warn('Proactive token refresh failed:', error)
    }
    
    return false
  }, [isAuthenticated])

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

  // Set up proactive token refresh (every 20 minutes - before JWT expires at 24 hours)
  useEffect(() => {
    const interval = setInterval(() => {
      if (isAuthenticated) {
        checkAndRefreshToken()
      }
    }, 20 * 60 * 1000) // 20 minutes

    return () => clearInterval(interval)
  }, [isAuthenticated, checkAndRefreshToken])

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