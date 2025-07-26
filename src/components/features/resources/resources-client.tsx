"use client"

import { useState, useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { BookOpen, BookText, Code, Compass, FileText, GraduationCap, Laptop, LayoutGrid, Leaf, Lightbulb, PenTool, Presentation, Search, Sparkles, Bookmark, Clock, TrendingUp } from "lucide-react"

import { AnimatedBackground } from "@/components/shared/animated-background"
import { ResourceCard } from "@/components/features/resources/resource-card"
import { ResourceFilter } from "@/components/features/resources/resource-filter"
import { ResourceHighlight } from "@/components/features/resources/resource-highlight"
import { ResourceSection } from "@/components/features/resources/resource-section"
import { ResourceTopicBadge } from "@/components/features/resources/resource-topic-badge"
import { Button } from "@/components/ui/button"
import { ResourceData, resourcesData, getLocalizedResourcesData, getAllTopics, getAllCategories } from "@/lib/resources-data"

type Dictionary = Record<string, any>;

interface ResourcesClientProps {
  dictionary: Dictionary;
  lang: string;
}

export function ResourcesClient({ dictionary, lang }: ResourcesClientProps) {
  // Get localized resources based on language
  const localizedResources = getLocalizedResourcesData(resourcesData, lang);
  const allTopics = getAllTopics(resourcesData, lang);
  const allCategories = getAllCategories(resourcesData, lang);
  
  // State for filtering and searching
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [filteredResources, setFilteredResources] = useState(localizedResources);

  // Apply filters
  useEffect(() => {
    const filtered = localizedResources.filter(resource => {
      // Search query filter
      const matchesSearch = searchQuery === "" || 
        resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.category.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Type filter
      const matchesType = selectedType === "all" || resource.type === selectedType;
      
      // Topics filter
      const matchesTopics = selectedTopics.length === 0 || 
        selectedTopics.some(topic => resource.topics.includes(topic));
      
      return matchesSearch && matchesType && matchesTopics;
    });
    
    setFilteredResources(filtered);
  }, [searchQuery, selectedType, selectedTopics, localizedResources]);

  // Get featured resource
  const featuredResource = localizedResources.find(r => r.isFeatured);
  
  // Get new resources
  const newResources = localizedResources
    .filter(r => r.isNew && (!featuredResource || r.id !== featuredResource.id))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.05 
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.3 }
    }
  };

  // Generate category icons
  const categoryIcons: {[key: string]: React.ReactNode} = {};
  
  // Add icons for all categories
  allCategories.forEach(category => {
    // Default icon is Lightbulb
    let icon = <Lightbulb className="h-5 w-5 text-emerald-500" />;
    
    // Assign specific icons based on category content
    if (category.toLowerCase().includes("interview")) {
      icon = <Presentation className="h-5 w-5 text-indigo-500" />;
    } else if (category.toLowerCase().includes("portfolio")) {
      icon = <FileText className="h-5 w-5 text-blue-500" />;
    } else if (category.toLowerCase().includes("system") || category.toLowerCase().includes("design")) {
      icon = <Code className="h-5 w-5 text-violet-500" />;
    } else if (category.toLowerCase().includes("resume")) {
      icon = <FileText className="h-5 w-5 text-emerald-500" />;
    } else if (category.toLowerCase().includes("salary") || category.toLowerCase().includes("negotiation")) {
      icon = <Sparkles className="h-5 w-5 text-amber-500" />;
    } else if (category.toLowerCase().includes("learning") || category.toLowerCase().includes("path")) {
      icon = <Compass className="h-5 w-5 text-teal-500" />;
    } else if (category.toLowerCase().includes("brand")) {
      icon = <Leaf className="h-5 w-5 text-emerald-500" />;
    } else if (category.toLowerCase().includes("cloud")) {
      icon = <Laptop className="h-5 w-5 text-sky-500" />;
    } else if (category.toLowerCase().includes("career") || category.toLowerCase().includes("growth")) {
      icon = <GraduationCap className="h-5 w-5 text-orange-500" />;
    } else if (category.toLowerCase().includes("open")) {
      icon = <BookOpen className="h-5 w-5 text-green-500" />;
    }
    
    categoryIcons[category] = icon;
  });

  return (
    <div className="relative min-h-screen pb-16">
      {/* Background elements */}
      <div className="absolute inset-0 pointer-events-none select-none">
        <AnimatedBackground intensity={2} speed={3} />
        
        {/* Main gradient blob */}
        <div className="absolute top-0 left-0 right-0 w-[95%] h-96 bg-gradient-to-br from-emerald-300/20 via-teal-200/15 to-transparent dark:from-emerald-700/15 dark:via-teal-800/10 dark:to-transparent blur-[120px] transform -translate-y-1/4 rounded-full mx-auto"></div>
        
        {/* Floating decorative elements */}
        <div className="absolute top-[25%] right-[10%] w-32 h-32 rounded-full bg-gradient-to-br from-emerald-400/10 to-teal-300/5 dark:from-emerald-600/10 dark:to-teal-500/5 blur-xl animate-float-slow"></div>
        <div className="absolute top-[45%] left-[5%] w-40 h-40 rounded-full bg-gradient-to-br from-teal-400/10 to-emerald-300/5 dark:from-teal-600/10 dark:to-emerald-500/5 blur-xl animate-float-medium"></div>
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiMxMGIyODEiIGZpbGwtb3BhY2l0eT0iLjAyIiBkPSJNMzYgMzRoLTJ2LTJoMnYyem0tNCAwaDJ2LTJoMnptLTQgMGgydi0yaDB6Ii8+PC9nPjwvc3ZnPg==')] opacity-20 dark:opacity-10"></div>
      </div>
      
      {/* Header with enhanced animations */}
      <header className="container mx-auto py-12 md:py-16 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.2
                }
              }
            }}
          >
            <motion.h1 
              variants={{
                hidden: { opacity: 0, y: -20 },
                visible: { 
                  opacity: 1, 
                  y: 0,
                  transition: { duration: 0.6, type: "spring" }
                }
              }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent animate-gradient-x"
            >
              {dictionary.resources.title}
            </motion.h1>
            
            <motion.p 
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { 
                  opacity: 1, 
                  y: 0,
                  transition: { duration: 0.7 }
                }
              }}
              className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto"
            >
              {dictionary.resources.subtitle}
            </motion.p>
            
            {/* Decorative icons */}
            <div className="relative h-12 mt-8">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="flex justify-center items-center gap-8 text-muted-foreground/50"
              >
                <Bookmark className="h-6 w-6 animate-float-slow" />
                <FileText className="h-6 w-6 animate-float-medium" />
                <Presentation className="h-6 w-6 animate-float-fast" />
                <Code className="h-6 w-6 animate-float-medium" />
                <Laptop className="h-6 w-6 animate-float-slow" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="container mx-auto px-4 relative z-10 space-y-12">
        {/* Filters */}
        <ResourceFilter
          onSearch={setSearchQuery}
          onTypeFilter={setSelectedType}
          onTopicFilter={setSelectedTopics}
          selectedTopics={selectedTopics}
          dictionary={dictionary}
          topics={allTopics}
        />
        
        {/* Featured resource */}
        {featuredResource && !searchQuery && selectedType === 'all' && selectedTopics.length === 0 && (
          <section className="mb-12">
            <ResourceHighlight
              title={featuredResource.title}
              description={featuredResource.description}
              image={featuredResource.image}
              url={featuredResource.url}
              type={featuredResource.type}
              category={featuredResource.category}
              dictionary={dictionary}
            />
          </section>
        )}
        
        {/* New content section */}
        {newResources.length > 0 && !searchQuery && selectedType === 'all' && selectedTopics.length === 0 && (
          <ResourceSection
            title={dictionary.resources.newContent}
            icon={Sparkles}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {newResources.slice(0, 3).map((resource) => (
                <ResourceCard
                  key={resource.id}
                  id={resource.id}
                  title={resource.title}
                  description={resource.description}
                  image={resource.image}
                  type={resource.type as "article" | "video" | "tool" | "guide"}
                  url={resource.url}
                  category={resource.category}
                  timeToConsume={resource.timeToConsume}
                  isNew={resource.isNew}
                  dictionary={dictionary}
                />
              ))}
            </div>
          </ResourceSection>
        )}
        
        {/* Topics quick selection */}
        {!searchQuery && selectedType === 'all' && selectedTopics.length === 0 && (
          <ResourceSection
            title={dictionary.resources.browseByTopic}
            icon={Bookmark}
            className="mb-10"
          >
            <div className="flex flex-wrap gap-2">
              {allTopics.map((topic) => (
                <ResourceTopicBadge
                  key={topic}
                  topic={topic}
                  isSelected={selectedTopics.includes(topic)}
                  onToggle={(topic: string) => {
                    if (selectedTopics.includes(topic)) {
                      setSelectedTopics(selectedTopics.filter(t => t !== topic));
                    } else {
                      setSelectedTopics([...selectedTopics, topic]);
                    }
                  }}
                />
              ))}
            </div>
          </ResourceSection>
        )}
        
        {/* Category quick links */}
        {!searchQuery && selectedType === 'all' && selectedTopics.length === 0 && (
          <ResourceSection
            title={dictionary.resources.browseByCategory}
            icon={LayoutGrid}
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
              {allCategories.map((category) => (
                <motion.button
                  key={category}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  onClick={() => setSearchQuery(category)}
                  className="p-4 rounded-lg border border-border/40 bg-card/50 hover:bg-card hover:shadow-md transition-all flex flex-col items-center justify-center gap-3 text-center"
                >
                  {categoryIcons[category] || <Lightbulb className="h-5 w-5 text-emerald-500" />}
                  <span className="text-sm font-medium">{category}</span>
                </motion.button>
              ))}
            </div>
          </ResourceSection>
        )}
        
        {/* All resources grid */}
        <ResourceSection
          title={searchQuery || selectedType !== 'all' || selectedTopics.length > 0
            ? `${dictionary.resources.searchResults} (${filteredResources.length})`
            : dictionary.resources.popular}
          icon={searchQuery || selectedType !== 'all' || selectedTopics.length > 0 ? Search : TrendingUp}
        >
          {(searchQuery || selectedType !== 'all' || selectedTopics.length > 0) && filteredResources.length === 0 ? (
            <div className="flex flex-col items-center mx-auto py-12">
              <Search className="h-16 w-16 text-muted-foreground/30 mb-4" />
              <h3 className="text-xl font-medium mb-2">{dictionary.resources.noResults}</h3>
              <p className="text-muted-foreground mb-6 text-center">{dictionary.resources.adjustSearch}</p>
              <Button 
                variant="default"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedType("all");
                  setSelectedTopics([]);
                }}
              >
                {dictionary.resources.clearFilters}
              </Button>
            </div>
          ) : (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <AnimatePresence>
                {filteredResources
                  .filter(r => !featuredResource || r.id !== featuredResource.id || searchQuery || selectedType !== 'all' || selectedTopics.length > 0)
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map((resource, index) => (
                    <motion.div
                      key={resource.id}
                      variants={itemVariants}
                      layout
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.3 }}
                      custom={index}
                    >
                      <ResourceCard
                        id={resource.id}
                        title={resource.title}
                        description={resource.description}
                        image={resource.image}
                        type={resource.type as "article" | "video" | "tool" | "guide"}
                        url={resource.url}
                        category={resource.category}
                        timeToConsume={resource.timeToConsume}
                        isNew={resource.isNew}
                        dictionary={dictionary}
                      />
                    </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </ResourceSection>
      </main>
    </div>
  )
}
