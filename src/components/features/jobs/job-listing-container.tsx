'use client'

import { useState } from "react"
import { JobListing } from "./job-listing"
import { Job, JobFilters } from "@/types/job"
import { useHeaderVisibility } from "@/hooks/useHeaderVisibility"

interface JobListingContainerProps {
  lang: string
  title: string
  subtitle: string
  isMobileMenuOpen?: boolean
  onToggleMobileMenu?: () => void
}

export function JobListingContainer({ lang, title, subtitle, isMobileMenuOpen, onToggleMobileMenu}: JobListingContainerProps) {
  const [filters, setFilters] = useState<JobFilters>({})
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('recent')
  const [showFilters, setShowFilters] = useState(false)

  const { headerRef, getStickyContainerClasses } = useHeaderVisibility({
    dependencies: [true] // Always ready since we're tracking the fixed header
  })

  return (
    <>
      {/* Fixed Header that stays at top - positioned outside the scrolling container */}
      <div ref={headerRef} className="fixed top-0 left-0 lg:left-20 right-0 z-[60] bg-gray-50/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
        <div className="container max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-6">
          <div className="mb-2 sm:mb-4">
            <h1 className="hidden sm:block text-lg sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2">
              {title.includes('Huntier') ? (
                <>
                  {title.split('Huntier')[0]}
                  <span className="text-emerald-600">Huntier</span>
                  {title.split('Huntier')[1]}
                </>
              ) : (
                title
              )}
            </h1>
          </div>
          <JobListing 
            lang={lang} 
            headerOnly={true}
            filters={filters}
            setFilters={setFilters}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            sortBy={sortBy}
            setSortBy={setSortBy}
            showFilters={showFilters}
            setShowFilters={setShowFilters}
            isMobileMenuOpen={isMobileMenuOpen}
            onToggleMobileMenu={onToggleMobileMenu}
          />
        </div>
      </div>
      
      {/* Spacer for fixed header */}
      <div className="h-28 sm:h-32 lg:h-36"></div>
      
      {/* Main Content */}
      <div className="container max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        <JobListing 
          lang={lang} 
          contentOnly={true}
          filters={filters}
          setFilters={setFilters}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          sortBy={sortBy}
          setSortBy={setSortBy}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          getStickyContainerClasses={getStickyContainerClasses}
        />
      </div>
    </>
  )
}