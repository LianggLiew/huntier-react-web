/**
 * Simple logout button component for testing authentication
 * This is a temporary component for Phase 1 testing
 */

'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { LogOut } from 'lucide-react'

export function LogoutButton() {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleLogout = async () => {
    setIsLoading(true)
    
    try {
      // Call logout API endpoint
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'  // Include cookies for refresh token
      })

      if (!response.ok) {
        throw new Error('Logout failed')
      }

      // Clear local storage
      localStorage.removeItem('access-token')
      
      toast({
        title: 'Logged out successfully',
        description: 'You have been signed out of your account'
      })

      // Redirect to login page
      window.location.href = '/en/verify-otp'
      
    } catch (error) {
      console.error('Logout error:', error)
      toast({
        title: 'Logout failed',
        description: 'There was an error signing out',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button 
      variant="outline" 
      onClick={handleLogout}
      disabled={isLoading}
      className="flex items-center gap-2"
    >
      <LogOut className="h-4 w-4" />
      {isLoading ? 'Signing out...' : 'Logout'}
    </Button>
  )
}