'use client'

import { useState, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

interface SmartLogoProps {
  src?: string | null
  alt: string
  fallbackText: string
  className?: string
  imageClassName?: string
  containerClassName?: string
  onError?: () => void
  // Simple rules-based approach
  preferDarkBackground?: boolean // For known white text logos
}

/**
 * Simplified logo component with smart defaults for common logo types
 * More reliable than complex image analysis
 */
export function SmartLogo({
  src,
  alt,
  fallbackText,
  className,
  imageClassName,
  containerClassName,
  onError,
  preferDarkBackground = false
}: SmartLogoProps) {
  const [backgroundColor, setBackgroundColor] = useState<'white' | 'black'>('white')
  const [imageError, setImageError] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)

  // Simple heuristics based on common logo patterns
  const determineBackground = (imgSrc: string) => {
    const url = imgSrc.toLowerCase()
    
    // Heuristics for white/light logos (common patterns)
    const whiteLogoIndicators = [
      'white', 'light', 'inverse', 'dark-bg', 'negative',
      // Common file naming patterns for white logos
      '_white', '-white', '_light', '-light', '_inverse', '-inverse'
    ]
    
    // Check if URL suggests white/light logo
    const isLikelyWhiteLogo = whiteLogoIndicators.some(indicator => 
      url.includes(indicator)
    )
    
    // Check file extension for SVG
    const isSvg = url.endsWith('.svg')
    
    // Default logic
    if (preferDarkBackground || isLikelyWhiteLogo) {
      return 'black'
    }
    
    // For SVGs, assume they might contain white elements and need dark background
    // This is safer than assuming white background for SVGs
    if (isSvg) {
      return 'black'
    }
    
    return 'white' // Default fallback for other image types
  }

  const handleImageLoad = () => {
    // Background is now determined immediately when src changes
    // This function can be used for additional image load handling if needed
  }

  const handleImageError = () => {
    setImageError(true)
    onError?.()
  }

  // Reset on src change and immediately determine background
  useEffect(() => {
    setImageError(false)
    if (src) {
      const background = determineBackground(src)
      setBackgroundColor(background)
    } else {
      setBackgroundColor('white')
    }
  }, [src])

  const getBackgroundClasses = () => {
    return backgroundColor === 'black'
      ? 'bg-gray-900 dark:bg-gray-900 border-gray-700 dark:border-gray-600'
      : 'bg-white dark:bg-white border-gray-200 dark:border-gray-300'
  }

  const getFallbackTextClasses = () => {
    return backgroundColor === 'black' 
      ? 'text-white' 
      : 'text-gray-600 dark:text-gray-800'
  }

  return (
    <div className={cn(
      'flex items-center justify-center flex-shrink-0 shadow-sm overflow-hidden border transition-colors duration-300',
      getBackgroundClasses(),
      className,
      containerClassName
    )}>
      {src && !imageError ? (
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          className={cn('object-contain transition-opacity duration-300', imageClassName)}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
      ) : (
        <span className={cn(
          'font-semibold transition-colors duration-300',
          getFallbackTextClasses()
        )}>
          {fallbackText}
        </span>
      )}
    </div>
  )
}

// Enhanced utility hook with smart defaults
export function useSmartLogo(logoUrl?: string | null, companyName?: string) {
  const fallbackText = companyName?.substring(0, 2).toUpperCase() || 'CO'
  
  // Auto-detect if logo might be white/light based on common patterns
  const preferDarkBackground = logoUrl ? 
    ['white', 'light', 'inverse', '_white', '-white'].some(pattern => 
      logoUrl.toLowerCase().includes(pattern)
    ) : false
  
  return {
    logoUrl,
    fallbackText,
    alt: `${companyName} logo`,
    preferDarkBackground
  }
}