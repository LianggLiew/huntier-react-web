"use client"

import { useRef, useEffect, useState } from 'react'
import Image from 'next/image'

interface CompanyLogoProps {
  logo: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  verified?: boolean
  featured?: boolean
  imageSrc?: string
}

export function CompanyLogo({ 
  logo, 
  size = 'md', 
  className = '',
  verified = false,
  featured = false,
  imageSrc
}: CompanyLogoProps) {
  const logoRef = useRef<HTMLDivElement>(null)
  
  // Use state to track if the logo has been loaded to avoid flashing
  const [isLoaded, setIsLoaded] = useState(false)
  
  useEffect(() => {
    // Make logo visible immediately
    if (logoRef.current) {
      // Short delay to ensure DOM is ready
      setTimeout(() => {
        setIsLoaded(true);
      }, 10);
    }
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-scale-in')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1 }
    )

    if (logoRef.current) {
      observer.observe(logoRef.current)
    }

    return () => {
      if (logoRef.current) {
        observer.unobserve(logoRef.current)
      }
    }
  }, [])

  const [isHovered, setIsHovered] = useState(false)
  
  const sizes = {
    sm: 'h-10 w-10 text-lg',
    md: 'h-14 w-14 text-xl',
    lg: 'h-16 w-16 text-2xl',
    xl: 'h-20 w-20 text-3xl',
  }

  return (
    <div 
      ref={logoRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        relative flex shrink-0 items-center justify-center
        rounded-lg bg-gradient-to-br from-emerald-50 to-teal-100
        dark:from-emerald-900/70 dark:to-teal-900/30 
        text-emerald-600 dark:text-emerald-400 font-bold
        shadow-sm overflow-hidden
        transition-all duration-300
        company-logo-wrapper
        ${sizes[size]} ${className}
        ${isLoaded ? 'opacity-100' : 'opacity-0'}
      `}
    >
      {imageSrc ? (
        <Image
          src={imageSrc}
          alt={`${logo} logo`}
          fill
          className="object-cover"
        />
      ) : (
        logo
      )}
      
      {/* Verification badge */}
      {verified && (
        <div className="absolute -bottom-1 -right-1 bg-white dark:bg-gray-900 rounded-full w-5 h-5 flex items-center justify-center shadow-sm border border-emerald-100 dark:border-emerald-800">
          <svg className="w-3.5 h-3.5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
          </svg>
        </div>
      )}
      
      {/* Featured indicator */}
      {featured && (
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 to-amber-300"></div>
      )}
      
      <div className="absolute inset-0 animate-shine"></div>
      
      {/* Hover effect - z-index ensures it stays on top */}
      <div className={`absolute inset-0 bg-gradient-to-r from-emerald-400/10 to-teal-400/10 transition-opacity duration-300 z-10 pointer-events-none ${isHovered ? 'opacity-100' : 'opacity-0'}`}></div>
    </div>
  )
}
