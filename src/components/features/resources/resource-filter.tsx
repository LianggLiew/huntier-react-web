"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Search, Filter, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

export interface ResourceFilterProps {
  onSearch: (query: string) => void
  onTypeFilter: (type: string) => void
  onTopicFilter: (topics: string[]) => void
  selectedTopics: string[]
  dictionary: any
  topics: string[]
}

export function ResourceFilter({
  onSearch,
  onTypeFilter,
  onTopicFilter,
  selectedTopics,
  dictionary,
  topics
}: ResourceFilterProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)
    onSearch(query)
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    onTypeFilter(value)
  }

  const handleTopicToggle = (topic: string) => {
    const updatedTopics = selectedTopics.includes(topic)
      ? selectedTopics.filter(t => t !== topic)
      : [...selectedTopics, topic]
    
    onTopicFilter(updatedTopics)
  }

  const handleClearTopics = () => {
    onTopicFilter([])
  }

  const filterItemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({ 
      opacity: 1, 
      y: 0,
      transition: { 
        delay: i * 0.05,
        duration: 0.3
      }
    })
  }

  return (
    <div className="space-y-4 w-full animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder={dictionary.resources.searchPlaceholder}
            value={searchQuery}
            onChange={handleSearch}
            className="pl-10 bg-background border-border/40 focus-visible:ring-1 focus-visible:ring-emerald-500/30"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
              onClick={() => {
                setSearchQuery("")
                onSearch("")
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        <div className="flex gap-2 items-center shrink-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-1 border-border/40">
                <Filter className="mr-1 h-4 w-4" /> 
                {dictionary.resources.filterByTopic}
                {selectedTopics.length > 0 && (
                  <Badge variant="secondary" className="ml-1 bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300">
                    {selectedTopics.length}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {topics.map((topic, i) => (
                <motion.div 
                  key={topic}
                  custom={i}
                  initial="hidden"
                  animate="visible"
                  variants={filterItemVariants}
                >
                  <DropdownMenuCheckboxItem
                    checked={selectedTopics.includes(topic)}
                    onCheckedChange={() => handleTopicToggle(topic)}
                  >
                    {topic}
                  </DropdownMenuCheckboxItem>
                </motion.div>
              ))}
              {selectedTopics.length > 0 && (
                <>
                  <DropdownMenuSeparator />
                  <div className="p-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full text-xs" 
                      onClick={handleClearTopics}
                    >
                      Clear All
                    </Button>
                  </div>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="w-full overflow-auto pb-1">
        <Tabs 
          defaultValue="all" 
          value={activeTab} 
          onValueChange={handleTabChange}
          className="w-full"
        >
          <TabsList className="w-full bg-muted/50 p-1">
            <TabsTrigger 
              value="all" 
              className="flex-1 data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-foreground"
            >
              {dictionary.resources.categories.all}
            </TabsTrigger>
            <TabsTrigger 
              value="article" 
              className="flex-1 data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-foreground"
            >
              {dictionary.resources.categories.articles}
            </TabsTrigger>
            <TabsTrigger 
              value="video" 
              className="flex-1 data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-foreground"
            >
              {dictionary.resources.categories.videos}
            </TabsTrigger>
            <TabsTrigger 
              value="tool" 
              className="flex-1 data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-foreground"
            >
              {dictionary.resources.categories.tools}
            </TabsTrigger>
            <TabsTrigger 
              value="guide" 
              className="flex-1 data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-foreground"
            >
              {dictionary.resources.categories.guides}
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  )
}
