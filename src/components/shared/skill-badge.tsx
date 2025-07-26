"use client"

import { useState } from 'react'
import { Badge } from "@/components/ui/badge"

interface SkillBadgeProps {
  skill: string
  index: number
}

export function SkillBadge({ skill, index }: SkillBadgeProps) {
  const [isHovered, setIsHovered] = useState(false)
  
  // Stagger the animation delay based on index
  const animationDelay = `${0.05 * index}s`
  
  return (
    <span className="relative group">
      <Badge 
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`
          bg-gradient-to-r from-emerald-50/90 to-emerald-50/70 
          dark:from-emerald-900/50 dark:to-emerald-900/30
          text-emerald-700 dark:text-emerald-300
          hover:text-emerald-800 dark:hover:text-emerald-200
          hover:from-emerald-100/90 hover:to-emerald-50/90
          dark:hover:from-emerald-800/50 dark:hover:to-emerald-900/50
          shadow-sm hover:shadow-md border border-emerald-100/60 dark:border-emerald-800/40
          hover:border-emerald-200/80 dark:hover:border-emerald-700/60
          transition-all duration-300 whitespace-nowrap
          ${isHovered ? 'scale-110 translate-y-[-2px]' : 'scale-100'}
          animate-fade-in cursor-default
        `}
        style={{ animationDelay }}
      >
        {skill}
      </Badge>
      
      {/* Glow effect on hover */}
      <span 
        className={`
          absolute inset-0 rounded-full blur-sm bg-emerald-300/30 dark:bg-emerald-500/40 -z-10
          opacity-0 group-hover:opacity-100 transition-opacity duration-300
        `}
      ></span>
    </span>
  )
}
