"use client"

import { motion } from "framer-motion"
import { ChevronRight, LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface ResourceSectionProps {
  title: string
  description?: string
  icon?: LucideIcon
  viewAllLink?: string
  viewAllText?: string
  className?: string
  children: React.ReactNode
}

export function ResourceSection({
  title,
  description,
  icon: Icon,
  viewAllLink,
  viewAllText = "View All",
  className,
  children
}: ResourceSectionProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        delayChildren: 0.1,
        staggerChildren: 0.05 
      }
    }
  }
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  }

  return (
    <section className={cn("mb-12", className)}>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-2">
        <div>
          <motion.h2 
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3 }}
            className="text-2xl font-bold flex items-center"
          >
            {Icon && <Icon className="mr-2 h-5 w-5 text-emerald-500" />}
            {title}
          </motion.h2>
          
          {description && (
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="text-muted-foreground mt-1"
            >
              {description}
            </motion.p>
          )}
        </div>
        
        {viewAllLink && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Button 
              variant="ghost" 
              className="text-emerald-600 hover:text-emerald-700 dark:text-emerald-500 dark:hover:text-emerald-400 -mr-2"
              asChild
            >
              <a href={viewAllLink}>
                {viewAllText} <ChevronRight className="ml-1 h-4 w-4" />
              </a>
            </Button>
          </motion.div>
        )}
      </div>
      
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
      >
        {children}
      </motion.div>
    </section>
  )
}
