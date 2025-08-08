'use client'

import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/hooks/useAuth"

interface ProfileButtonProps {
  lang: string
  dictionary: any
}

export function ProfileButton({ lang, dictionary }: ProfileButtonProps) {
  const { isAuthenticated, user, profile } = useAuth()

  // Determine the correct destination based on auth state and onboarding status
  let href = `/${lang}/verify-otp` // Default for non-authenticated users
  let buttonText = dictionary.home.signInButton || 'Sign In'

  if (isAuthenticated && user) {
    if (user.needsOnboarding && !profile?.onboardingCompleted) {
      href = `/${lang}/onboarding`
      buttonText = 'Complete Setup'
    } else {
      href = `/${lang}/profile`
      buttonText = dictionary.home.viewProfileButton
    }
  }

  const handleClick = () => {
    // If user is not authenticated and clicking profile button, set flag for profile-originated flow
    if (!isAuthenticated && href === `/${lang}/verify-otp`) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('huntier_profile_flow', 'true')
      }
    }
  }

  return (
    <Button 
      size="lg" 
      variant="outline" 
      className="rounded-full border-2 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition-all px-4 lg:px-8 py-3 lg:py-6 text-sm lg:text-lg group border-emerald-200 dark:border-emerald-800" 
      asChild
    >
      <Link href={href} className="flex items-center gap-2" onClick={handleClick}>
        {buttonText}
        <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </Link>
    </Button>
  )
}