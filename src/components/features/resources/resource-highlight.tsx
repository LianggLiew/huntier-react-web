"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { BookmarkCheck, ChevronRight, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface ResourceHighlightProps {
  title: string
  description: string
  image: string
  url: string
  type: string
  category: string
  dictionary: any
}

export function ResourceHighlight({
  title,
  description,
  image,
  url,
  type,
  category,
  dictionary
}: ResourceHighlightProps) {
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
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        delayChildren: 0.3,
        staggerChildren: 0.2 
      }
    }
  }
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        type: "spring",
        stiffness: 100
      }
    }
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="relative overflow-hidden rounded-xl border border-border/40 bg-gradient-to-br from-emerald-50/40 via-background to-background dark:from-emerald-900/10 dark:via-background dark:to-background shadow-lg"
    >
      <div className="absolute inset-0 pointer-events-none select-none">
        {/* Background design elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-emerald-300/20 to-teal-200/10 dark:from-emerald-700/15 dark:to-teal-800/5 rounded-full blur-3xl -translate-y-1/3 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-br from-teal-300/15 to-emerald-200/10 dark:from-teal-700/10 dark:to-emerald-800/5 rounded-full blur-2xl translate-y-1/3 -translate-x-1/3"></div>
      </div>
      
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/2 relative aspect-video md:aspect-auto">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover"
          />
        </div>
        
        <motion.div 
          variants={itemVariants}
          className="md:w-1/2 p-6 md:p-8 flex flex-col justify-center"
        >
          <div className="mb-4 flex items-center space-x-2">
            <Badge className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-none">
              {dictionary.resources.featured}
            </Badge>
            <Badge variant="outline" className="bg-background/80">
              {category}
            </Badge>
          </div>
          
          <motion.h2 
            variants={itemVariants}
            className="text-2xl md:text-3xl font-bold mb-3"
          >
            {title}
          </motion.h2>
          
          <motion.p 
            variants={itemVariants}
            className="text-muted-foreground mb-6"
          >
            {description}
          </motion.p>
          
          <motion.div 
            variants={itemVariants}
            className="mt-auto"
          >
            <Link href={url} target="_blank" rel="noopener noreferrer">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white border-none shadow-md px-6"
              >
                {getActionText()}
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Decorative elements */}
      <BookmarkCheck className="absolute top-4 right-4 text-emerald-500/20 h-24 w-24 rotate-12 dark:text-emerald-600/10" />
    </motion.div>
  )
}
