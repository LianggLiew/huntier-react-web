'use client'

import React from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { ProtectedRouteProps } from '@/types'
import { Skeleton } from '@/components/ui/skeleton'
import { Card } from '@/components/ui/card'
import { extractLanguageFromPath, buildLocalizedPath } from '@/lib/navigation'

// Default loading component
const DefaultLoadingComponent: React.FC = () => (
  <div className="min-h-screen bg-gradient-to-b from-background via-background to-emerald-50/40 dark:from-background dark:via-background dark:to-emerald-950/30 py-8 lg:py-12 relative flex flex-col">
    {/* Background elements */}
    <div className="absolute inset-0 pointer-events-none select-none">
      <div className="absolute top-0 left-0 right-0 w-[95%] h-96 bg-gradient-to-br from-emerald-300/25 via-teal-200/20 to-transparent dark:from-emerald-700/20 dark:via-teal-800/15 dark:to-transparent blur-[120px] transform -translate-y-1/4 rounded-full mx-auto"></div>
    </div>

    <div className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex-1 flex flex-col justify-center">
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 bg-emerald-50/80 dark:bg-emerald-900/30 border border-emerald-200/80 dark:border-emerald-800/80 rounded-full backdrop-blur-sm shadow-sm">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
          </span>
          <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
            Loading...
          </span>
        </div>

        <div className="space-y-4">
          <Skeleton className="h-12 w-3/4 mx-auto" />
          <Skeleton className="h-4 w-1/2 mx-auto" />
        </div>
      </div>

      <Card className="relative p-6 mb-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border border-emerald-100/50 dark:border-emerald-800/50 shadow-xl">
        <div className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </Card>
    </div>
  </div>
)

// Default fallback component for unauthenticated users
const DefaultFallbackComponent: React.FC = () => (
  <div className="min-h-screen bg-gradient-to-b from-background via-background to-emerald-50/40 dark:from-background dark:via-background dark:to-emerald-950/30 py-8 lg:py-12 relative flex flex-col">
    {/* Background elements */}
    <div className="absolute inset-0 pointer-events-none select-none">
      <div className="absolute top-0 left-0 right-0 w-[95%] h-96 bg-gradient-to-br from-emerald-300/25 via-teal-200/20 to-transparent dark:from-emerald-700/20 dark:via-teal-800/15 dark:to-transparent blur-[120px] transform -translate-y-1/4 rounded-full mx-auto"></div>
    </div>

    <div className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex-1 flex flex-col justify-center">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 bg-red-50/80 dark:bg-red-900/30 border border-red-200/80 dark:border-red-800/80 rounded-full backdrop-blur-sm shadow-sm">
          <span className="flex h-2 w-2 relative">
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
          </span>
          <span className="text-sm font-medium text-red-600 dark:text-red-400">
            Authentication Required
          </span>
        </div>

        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-700 to-gray-600 dark:from-white dark:via-gray-200 dark:to-gray-400">
          Please sign in to continue
        </h1>
        <p className="text-base md:text-lg text-muted-foreground max-w-[650px] mx-auto leading-relaxed">
          You need to be authenticated to access this page. You'll be redirected to the login page shortly.
        </p>
      </div>
    </div>
  </div>
)

/**
 * ProtectedRoute component that follows the interface contract
 * Protects routes that require authentication and optionally onboarding completion
 */
export function ProtectedRoute({
  children,
  requireOnboarding = false,
  redirectTo = '/auth',
  loadingComponent: LoadingComponent = DefaultLoadingComponent,
  fallbackComponent: FallbackComponent = DefaultFallbackComponent
}: ProtectedRouteProps): React.ReactElement {
  const { user, profile, loading, isAuthenticated } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  
  // Extract language from pathname using utility function
  const lang = extractLanguageFromPath(pathname)

  useEffect(() => {
    if (loading) return // Wait for auth state to load

    if (!isAuthenticated || !user) {
      // User is not authenticated, redirect to login with language prefix
      const cleanRedirectTo = redirectTo.startsWith('/') ? redirectTo.slice(1) : redirectTo
      const langRedirectTo = buildLocalizedPath(lang, cleanRedirectTo)
      router.push(langRedirectTo)
      return
    }

    if (requireOnboarding) {
      // Check if onboarding is required
      if (user.needsOnboarding || !profile?.onboardingCompleted) {
        router.push(buildLocalizedPath(lang, 'onboarding'))
        return
      }
    }
  }, [isAuthenticated, user, profile, loading, requireOnboarding, redirectTo, router, lang])

  // Show loading state while checking authentication
  if (loading) {
    return <LoadingComponent />
  }

  // Show fallback if not authenticated
  if (!isAuthenticated || !user) {
    return <FallbackComponent />
  }

  // Check onboarding requirement
  if (requireOnboarding && (user.needsOnboarding || !profile?.onboardingCompleted)) {
    // Will redirect to onboarding in useEffect, show loading in the meantime
    return <LoadingComponent />
  }

  // User is authenticated and meets all requirements, render children
  return <>{children}</>
}

export default ProtectedRoute