"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface ResourceTopicBadgeProps {
  topic: string
  isSelected: boolean
  onToggle: (topic: string) => void
  className?: string
}

export function ResourceTopicBadge({
  topic,
  isSelected,
  onToggle,
  className
}: ResourceTopicBadgeProps) {
  const [isHovering, setIsHovering] = useState(false)
  
  return (
    <motion.button
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => onToggle(topic)}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className={cn(
        "px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200",
        isSelected 
          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border-emerald-300/50 dark:border-emerald-700/50" 
          : "bg-background border border-border/40 text-muted-foreground hover:text-foreground hover:border-border",
        isHovering && !isSelected && "shadow-sm",
        className
      )}
    >
      {topic}
    </motion.button>
  )
}
