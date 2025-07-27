import { useState, useEffect, useRef } from 'react'

interface UseHeaderVisibilityOptions {
  threshold?: number
  rootMargin?: string
  dependencies?: any[]
}

interface UseHeaderVisibilityReturn {
  headerRef: React.RefObject<HTMLDivElement>
  isHeaderVisible: boolean
  getStickyContainerClasses: (baseClasses: string, fixedClasses: string) => string
}

/**
 * Custom hook for tracking header visibility and providing sticky behavior
 * @param options Configuration options for IntersectionObserver
 * @returns Object with headerRef, visibility state, and utility function for classes
 */
export function useHeaderVisibility(options: UseHeaderVisibilityOptions = {}): UseHeaderVisibilityReturn {
  const {
    threshold = 0.1,
    rootMargin = '-50px 0px 0px 0px',
    dependencies = []
  } = options

  const [isHeaderVisible, setIsHeaderVisible] = useState(true)
  const headerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Only set up observer if dependencies are met (e.g., data is loaded)
    if (dependencies.length > 0 && dependencies.some(dep => !dep)) {
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsHeaderVisible(entry.isIntersecting)
      },
      { 
        threshold,
        rootMargin
      }
    )

    if (headerRef.current) {
      observer.observe(headerRef.current)
    }

    return () => observer.disconnect()
  }, dependencies)

  const getStickyContainerClasses = (baseClasses: string, fixedClasses: string): string => {
    return `${baseClasses} transition-all duration-300 ${!isHeaderVisible ? fixedClasses : 'relative'}`
  }

  return {
    headerRef,
    isHeaderVisible,
    getStickyContainerClasses
  }
}