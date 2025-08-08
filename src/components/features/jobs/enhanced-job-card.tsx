"use client"

import { useState } from 'react'
import Link from "next/link"
import { Building2, MapPin, Star } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { SmartLogo, useSmartLogo } from "@/components/ui/smart-logo"
import { cn } from "@/lib/utils"
import { ApplicationButton } from "./ApplicationButton"
import { JobBookmarkButton } from "./JobBookmarkButton"

interface EnhancedJobCardProps {
  id: string
  title: string
  company: string
  location: string
  salary: string
  postDate: string
  tags?: string[]
  matchPercentage?: number
  isFeatured?: boolean
  isSaved?: boolean
  lang: string
  jobId?: number
}

export function EnhancedJobCard({
  id,
  title,
  company,
  location,
  salary,
  postDate,
  tags = [],
  matchPercentage,
  isFeatured = false,
  isSaved = false,
  lang,
  jobId
}: EnhancedJobCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [saved, setSaved] = useState(isSaved)
  const { logoUrl, fallbackText, alt, preferDarkBackground } = useSmartLogo(null, company)
  
  return (
    <Link href={`/${lang}/job/${id}`} passHref>
      <Card 
        className={cn(
          "cursor-pointer group relative border overflow-hidden transition-all duration-300",
          isHovered ? "shadow-lg scale-[1.02]" : "shadow-md",
          isFeatured ? "bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-900/30 dark:to-gray-900" : "bg-white dark:bg-gray-900"
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {isFeatured && (
          <div className="absolute top-0 left-0 w-0 h-0 border-t-[64px] border-l-[64px] border-t-emerald-500 border-l-transparent border-r-transparent rotate-90 z-10">
            <span className="absolute top-[-55px] left-[-47px] transform -rotate-90 text-[10px] uppercase tracking-wide font-bold text-white">Featured</span>
          </div>
        )}

        <div 
          className={cn(
            "absolute inset-0 opacity-0 bg-gradient-to-br from-emerald-100/30 to-teal-100/20 dark:from-emerald-900/10 dark:to-teal-900/5 transition-opacity duration-300",
            isHovered && "opacity-100"
          )}
        />
        
        <CardContent className="p-4 sm:p-5 relative z-20">
          {/* Application Status Badge & Bookmark - Top Right */}
          <div className="absolute right-3 sm:right-4 top-3 sm:top-4 flex items-center gap-1 sm:gap-2">
            {jobId && (
              <>
                <JobBookmarkButton 
                  jobId={jobId}
                  isSaved={isSaved}
                  variant="ghost"
                  size="sm"
                />
                <ApplicationButton 
                  jobId={jobId} 
                  lang={lang} 
                  variant="badge"
                  size="sm"
                />
              </>
            )}
          </div>
          
          <div className="flex flex-col gap-2">
            <div className="flex items-start justify-between pr-12 sm:pr-16">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                {/* Company Logo */}
                <SmartLogo
                  src={logoUrl}
                  alt={alt}
                  fallbackText={fallbackText}
                  preferDarkBackground={preferDarkBackground}
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex-shrink-0"
                  containerClassName="text-xs sm:text-sm"
                />
                <h3 className="font-semibold text-base sm:text-lg truncate">
                  {title}
                  <span className="block max-w-0 group-hover:max-w-full h-0.5 bg-emerald-500/60 transition-all duration-500"></span>
                </h3>
              </div>
              
              {matchPercentage && (
                <Badge className={cn(
                  "bg-emerald-50 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 transition-all text-xs sm:text-sm shrink-0",
                  isHovered ? "scale-110" : ""
                )}>
                  {matchPercentage}% match
                </Badge>
              )}
            </div>
            
            <div className="flex flex-wrap gap-1 sm:gap-1.5 text-xs sm:text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Building2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span className="truncate">{company}</span>
              </div>
              <span className="px-1">•</span>
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span className="truncate">{location}</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center mt-1 gap-2">
              <span className="font-medium text-emerald-700 dark:text-emerald-400 text-sm sm:text-base truncate">{salary}</span>
              <span className="text-xs sm:text-sm text-muted-foreground shrink-0">{postDate}</span>
            </div>
            
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="bg-emerald-50/70 dark:bg-emerald-900/20 text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
          
          {!jobId && (
            <button 
              className={cn(
                "absolute top-4 right-4 p-1.5 rounded-full transition-all",
                saved ? "text-amber-500" : "text-gray-300 dark:text-gray-600",
                isHovered && !saved && "text-gray-400 dark:text-gray-500"
              )}
              onClick={(e) => {
                e.preventDefault();
                setSaved(!saved);
              }}
            >
              <Star className={cn(
                "w-5 h-5 transition-transform",
                saved && "fill-current",
                isHovered && "scale-110"
              )} />
            </button>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}
