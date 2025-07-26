"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Bookmark, BookmarkCheck, Clock, ExternalLink, Play } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export interface ResourceCardProps {
  id: string
  title: string
  description: string
  image: string
  type: "article" | "video" | "tool" | "guide"
  url: string
  category: string
  timeToConsume?: string
  isNew?: boolean
  isFeatured?: boolean
  dictionary: any
  className?: string
}

export function ResourceCard({ 
  id,
  title, 
  description, 
  image, 
  type,
  url,
  category,
  timeToConsume,
  isNew = false,
  isFeatured = false,
  dictionary,
  className
}: ResourceCardProps) {
  const [isSaved, setIsSaved] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  
  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsSaved(!isSaved)
  }

  const cardVariants = {
    hover: { 
      y: -8,
      boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
      transition: { duration: 0.3 }
    },
    initial: { 
      y: 0,
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
      transition: { duration: 0.3 }
    }
  }

  const iconVariants = {
    hover: { scale: 1.1, transition: { duration: 0.2 } },
    initial: { scale: 1, transition: { duration: 0.2 } }
  }

  const getTypeIcon = () => {
    switch (type) {
      case 'video':
        return <Play className="w-5 h-5" />
      case 'tool':
        return <ExternalLink className="w-5 h-5" />
      case 'guide':
        return <BookmarkCheck className="w-5 h-5" />
      case 'article':
      default:
        return <Clock className="w-5 h-5" />
    }
  }

  const getActionText = () => {
    switch (type) {
      case 'video':
        return dictionary.resources.watchNow
      case 'tool':
        return dictionary.resources.tryNow
      default:
        return dictionary.resources.readMore
    }
  }

  return (
    <Link href={url} target="_blank" rel="noopener noreferrer">
      <motion.div
        initial="initial"
        whileHover="hover"
        animate={isHovered ? "hover" : "initial"}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        variants={cardVariants}
        className={cn("h-full", className)}
      >
        <Card 
          className={cn(
            "overflow-hidden h-full border border-border/40 transition-all duration-300",
            isFeatured && "border-emerald-500/30 bg-gradient-to-br from-emerald-50/50 to-transparent dark:from-emerald-900/10"
          )}
        >
          <div className="relative aspect-video overflow-hidden">
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover transition-transform duration-500"
              style={{ transform: isHovered ? 'scale(1.05)' : 'scale(1)' }}
            />
            
            {/* Type badge */}
            <div className="absolute top-3 left-3 z-10">
              <Badge 
                variant="secondary"
                className={cn(
                  "font-medium shadow-sm",
                  type === 'video' && "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
                  type === 'article' && "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300", 
                  type === 'tool' && "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
                  type === 'guide' && "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
                )}
              >
                <span className="flex items-center gap-1">
                  {getTypeIcon()}
                  <span className="capitalize">{type}</span>
                </span>
              </Badge>
            </div>

            {/* New indicator */}
            {isNew && (
              <div className="absolute top-3 right-3 z-10">
                <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 font-medium shadow-sm">
                  New
                </Badge>
              </div>
            )}

            {/* Featured indicator */}
            {isFeatured && (
              <div 
                className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"
              >
                <div className="absolute bottom-3 left-3">
                  <Badge variant="default" className="bg-gradient-to-r from-emerald-600 to-teal-600 border-none text-white font-medium">
                    {dictionary.resources.featured}
                  </Badge>
                </div>
              </div>
            )}
          </div>
          
          <CardContent className="pt-4 pb-2">
            <div className="flex justify-between items-start gap-2">
              <h3 className="font-semibold text-lg mb-1 line-clamp-2">{title}</h3>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost" 
                      size="icon" 
                      className="shrink-0 text-muted-foreground hover:text-foreground" 
                      onClick={handleSave}
                    >
                      <motion.div variants={iconVariants}>
                        {isSaved ? <BookmarkCheck className="h-5 w-5 text-emerald-500" /> : <Bookmark className="h-5 w-5" />}
                      </motion.div>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {isSaved ? dictionary.resources.savedButton : dictionary.resources.saveButton}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <p className="text-muted-foreground text-sm mt-1 mb-3 line-clamp-2">{description}</p>
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="bg-background/80 text-xs font-normal">
                {category}
              </Badge>
              {timeToConsume && (
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {timeToConsume}
                </span>
              )}
            </div>
          </CardContent>
          
          <CardFooter className="p-4 pt-2">
            <Button 
              variant="default" 
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white border-none shadow-md"
            >
              {getActionText()} <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </Link>
  )
}
