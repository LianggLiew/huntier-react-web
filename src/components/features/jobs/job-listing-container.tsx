'use client'

import { useState } from "react"
import { JobListing } from "./job-listing"
import { Job, JobFilters } from "@/types/job"
import { useHeaderVisibility } from "@/hooks/useHeaderVisibility"

interface JobListingContainerProps {
  lang: string
  title: string
  subtitle: string
}

export function JobListingContainer({ lang, title, subtitle }: JobListingContainerProps) {
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
      <div ref={headerRef} className="fixed top-0 left-20 right-0 z-[60] bg-gray-50/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="mb-4">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
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
          />
        </div>
      </div>
      
      {/* Spacer for fixed header */}
      <div className="h-36"></div>
      
      {/* Main Content */}
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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