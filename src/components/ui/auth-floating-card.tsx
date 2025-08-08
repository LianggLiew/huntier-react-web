'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { LogOut, Mail, Lock, User } from 'lucide-react'

interface AuthFloatingCardProps {
  isOpen: boolean
  onClose: () => void
  isAuthenticated: boolean
  user?: any
  onLogin: (email: string, password: string) => Promise<void>
  onLogout: () => Promise<void>
  dictionary?: any
  currentLang?: string
}

export function AuthFloatingCard({ 
  isOpen, 
  onClose, 
  isAuthenticated, 
  user,
  onLogin,
  onLogout,
  dictionary,
  currentLang = 'en'
}: AuthFloatingCardProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (!isOpen) return null

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      setError('Please fill in all fields')
      return
    }
    
    setLoading(true)
    setError('')
    
    try {
      await onLogin(email, password)
      setEmail('')
      setPassword('')
      onClose()
    } catch (err) {
      setError('Login failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    setLoading(true)
    try {
      await onLogout()
      onClose()
      // Redirect to homepage after successful logout
      if (typeof window !== 'undefined') {
        window.location.href = `/${currentLang}`
      }
    } catch (err) {
      setError('Logout failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-[100] bg-black/20"
        onClick={onClose}
      />
      
      {/* Floating Card */}
      <div className="fixed top-20 left-24 z-[101] bg-gray-900 rounded-lg shadow-2xl border border-gray-700 p-6 w-80">
        {isAuthenticated ? (
          // Logout Card
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-white" />
              </div>
            </div>
            
            <h3 className="text-lg font-semibold text-white mb-2">
              {dictionary?.auth?.welcome || 'Welcome back!'}
            </h3>
            
            <p className="text-gray-300 mb-1">
              {user?.firstName || user?.email || 'User'}
            </p>
            
            <p className="text-gray-400 text-sm mb-6">
              {user?.email}
            </p>
            
            {error && (
              <p className="text-red-400 text-sm mb-4">{error}</p>
            )}
            
            <Button
              onClick={handleLogout}
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              {loading ? 'Logging out...' : (dictionary?.auth?.logout || 'Logout')}
            </Button>
          </div>
        ) : (
          // Guest Card
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-white" />
              </div>
            </div>
            
            <h3 className="text-lg font-semibold text-white mb-2">
              {dictionary?.auth?.guest || 'Guest User'}
            </h3>
            
            <p className="text-gray-300 mb-1">
              {dictionary?.auth?.guestWelcome || 'Welcome to Huntier'}
            </p>
            
            <p className="text-gray-400 text-sm mb-6">
              {dictionary?.auth?.guestDescription || 'Sign in to unlock all features'}
            </p>
            
            {error && (
              <p className="text-red-400 text-sm mb-4">{error}</p>
            )}
            
            <Button
              onClick={() => {
                // Store current page URL for redirect after authentication (but not if already on auth pages)
                if (typeof window !== 'undefined') {
                  const currentPath = window.location.pathname;
                  if (!currentPath.includes('/verify-otp') && !currentPath.includes('/onboarding')) {
                    localStorage.setItem('huntier_redirect_after_auth', currentPath);
                  }
                }
                window.location.href = `/${currentLang}/verify-otp`;
              }}
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center gap-2"
            >
              <LogOut className="h-4 w-4 rotate-180" />
              {dictionary?.auth?.signIn || 'Sign In'}
            </Button>
            
            
          </div>
        )}
      </div>
    </>
  )
}