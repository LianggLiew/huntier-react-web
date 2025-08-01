'use client'

import Link from "next/link"
import { BriefcaseBusiness, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/shared/theme-toggle"
import { LanguageToggle } from "@/components/shared/language-toggle"
import { NavClient } from "@/components/layout/nav-client"
import { NotificationBell } from "@/components/shared/notification-bell"
import { useScrollDirection } from "@/hooks/useScrollDirection"
import { useAuth } from "@/hooks/useAuth"
import { cn } from "@/lib/utils"

interface NavbarProps {
  lang: string
  dictionary: any
}

export function Navbar({ lang, dictionary }: NavbarProps) {
  const { scrollDirection, isAtTop } = useScrollDirection()
  const { isAuthenticated, logout } = useAuth()

  // Sample notifications for demo purposes
  const sampleNotifications = [
    {
      id: "1",
      title: "New Job Match",
      message: "We've found 3 new jobs that match your skills and preferences!",
      time: "Just now",
      read: false,
    },
    {
      id: "2",
      title: "Application Update",
      message: "Your application for Senior Frontend Developer at TechCorp has moved to the next stage.",
      time: "2 hours ago",
      read: false,
    },
    {
      id: "3",
      title: "Profile View",
      message: "A recruiter from DesignTech viewed your profile.",
      time: "Yesterday",
      read: true,
    },
  ]

  const navItems = [
    { name: dictionary.navbar?.resources || 'Resources', href: `/${lang}/resources` },
    { name: dictionary.navbar?.about || 'About', href: `/${lang}/about` },
  ]

  return (
    <header className={cn(
      "fixed top-0 z-50 w-full border-b bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/60 transition-transform duration-300 ease-in-out",
      scrollDirection === 'down' && !isAtTop ? '-translate-y-full' : 'translate-y-0'
    )}>
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link 
            href={`/${lang}`} 
            className="flex items-center gap-2 transition-all hover:opacity-90 group"
          >
            <div className="relative">
              <BriefcaseBusiness className="h-6 w-6 text-emerald-600 transition-transform group-hover:scale-110 duration-300" />
              <div className="absolute inset-0 bg-emerald-400/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
            <span className="text-xl font-bold tracking-tight relative">
              huntier
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-500 group-hover:w-full transition-all duration-300"></span>
            </span>
          </Link>
          <NavClient lang={lang} navItems={navItems} myProfileText={dictionary.navbar?.myProfile || 'My Profile'} />
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <LanguageToggle
            lang={lang}
            translations={{
              english: dictionary.languageToggle?.english || 'English',
              chinese: dictionary.languageToggle?.chinese || '中文',
            }}
          />
          <NotificationBell notifications={sampleNotifications} />
          {isAuthenticated && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => logout()} 
              className="ml-2"
            >
              Logout
            </Button>
          )}
          <Button asChild variant="ghost" size="icon" className="rounded-full h-9 w-9 hidden md:flex hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all duration-300 hover:scale-110">
            <Link href={isAuthenticated ? `/${lang}/profile` : `/${lang}/verify-otp`}>
              <User className="h-[1.2rem] w-[1.2rem] text-emerald-600 dark:text-emerald-400" />
              <span className="sr-only">{isAuthenticated ? 'Profile' : 'Sign In'}</span>
            </Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
