'use client'

import Link from "next/link"
import Image from "next/image"
import { User, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/shared/theme-toggle"
import { LanguageToggle } from "@/components/shared/language-toggle"
import { NavClient } from "@/components/layout/nav-client"
import { useScrollDirection } from "@/hooks/useScrollDirection"
import { useAuth } from "@/hooks/useAuth"
import { cn } from "@/lib/utils"

interface NavbarProps {
  lang: string
  dictionary: any
  showMobileMenu?: boolean
  isMobileMenuOpen?: boolean
  onToggleMobileMenu?: () => void
}

export function Navbar({ lang, dictionary, showMobileMenu = false, isMobileMenuOpen = false, onToggleMobileMenu }: NavbarProps) {
  const { scrollDirection, isAtTop } = useScrollDirection()
  const { isAuthenticated } = useAuth()


  const navItems = [
    { name: dictionary.navbar?.jobs || 'Jobs', href: `/${lang}/jobs` },
    // { name: dictionary.navbar?.contact || 'Contact Us', href: `/${lang}/contact` },
  ]

  return (
    <header className={cn(
      "fixed top-0 z-[70] w-full border-b bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/60 transition-transform duration-300 ease-in-out",
      scrollDirection === 'down' && !isAtTop ? '-translate-y-full' : 'translate-y-0'
    )}>
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 flex h-16 items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Mobile Menu Button - only show when requested */}
          {showMobileMenu && onToggleMobileMenu && (
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden p-2 h-8 w-8"
              onClick={onToggleMobileMenu}
            >
              {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          )}

          <Link 
            href={`/${lang}`} 
            className="flex items-center transition-all hover:opacity-90 group"
          >
            <div className="relative">
              <Image
                src="/Huntier-new-white.png"
                alt="Huntier Logo"
                width={120}
                height={32}
                className="w-20 sm:w-[120px] h-auto transition-transform group-hover:scale-105 duration-300"
                priority
              />
              <div className="absolute inset-0 bg-emerald-400/20 rounded-lg blur-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
          </Link>
          <NavClient lang={lang} navItems={navItems} myProfileText={dictionary.navbar?.myProfile || 'My Profile'} />
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="hidden sm:flex items-center gap-4">
            <ThemeToggle />
            <LanguageToggle
              lang={lang}
              translations={{
                english: dictionary.languageToggle?.english || 'English',
                chinese: dictionary.languageToggle?.chinese || '中文',
              }}
            />
          <Button asChild variant="ghost" size="icon" className="rounded-full h-9 w-9 hidden md:flex hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all duration-300 hover:scale-110">
            <Link href={isAuthenticated ? `/${lang}/profile` : `/${lang}/verify-otp`}>
              <User className="h-[1.2rem] w-[1.2rem] text-emerald-600 dark:text-emerald-400" />
              <span className="sr-only">{isAuthenticated ? 'Profile' : 'Sign In'}</span>
            </Link>
          </Button>
          </div>
          
          {/* Mobile Menu */}
          <div className="flex sm:hidden items-center gap-2">
            <Button asChild variant="ghost" size="sm" className="h-8 px-2">
              <Link href={isAuthenticated ? `/${lang}/profile` : `/${lang}/verify-otp`}>
                <User className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
