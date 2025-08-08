'use client'

import { BriefcaseBusiness, Sparkles, Database, Zap, Brain } from "lucide-react"

interface HeroIllustrationProps {
  lang: string
}

export function HeroIllustration({ lang }: HeroIllustrationProps) {
  return (
    <div className="flex-1 relative w-full">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-600 to-teal-400 rounded-2xl blur-2xl opacity-20 dark:opacity-30 animate-pulse"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.1)_0,transparent_70%)] dark:bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.15)_0,transparent_70%)]"></div>
      
      <div className="relative h-[250px] lg:h-[400px] md:h-[500px] w-full bg-gradient-to-br from-white via-white to-emerald-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 rounded-2xl shadow-xl border border-emerald-100 dark:border-emerald-900/50 backdrop-blur-sm">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-600"></div>
        
        {/* AI Avatar Interview UI */}
        <div className="absolute top-2 lg:top-4 right-2 lg:right-4 left-2 lg:left-4 bottom-2 lg:bottom-4 rounded-lg border border-emerald-100 dark:border-emerald-900/50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-2 lg:p-3 shadow-lg">
          <div className="flex items-center gap-1 lg:gap-2 mb-2 lg:mb-3">
            <div className="h-1.5 lg:h-3 w-1.5 lg:w-3 rounded-full bg-red-500"></div>
            <div className="h-1.5 lg:h-3 w-1.5 lg:w-3 rounded-full bg-yellow-500"></div>
            <div className="h-1.5 lg:h-3 w-1.5 lg:w-3 rounded-full bg-green-500"></div>
            <div className="ml-2 lg:ml-4 h-3 lg:h-4 w-20 lg:w-32 flex items-center">
              <div className="h-2 lg:h-3 w-2 lg:w-3 rounded-full bg-emerald-500 mr-1 lg:mr-2"></div>
              <div className="h-2 lg:h-3 w-16 lg:w-24 bg-emerald-100 dark:bg-emerald-900/50 rounded-md"></div>
            </div>
          </div>
          
          <div className="flex gap-2 lg:gap-4 h-[200px] lg:h-[320px]">
            {/* Interview sidebar */}
            <div className="w-8 lg:w-16 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg flex flex-col items-center gap-1 lg:gap-2 p-1 lg:p-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className={`h-4 lg:h-8 w-4 lg:w-8 rounded-lg ${i === 1 ? 'bg-emerald-500 text-white' : 'bg-white dark:bg-gray-700'} flex items-center justify-center shadow-sm`}>
                  {i === 1 ? <BriefcaseBusiness className="h-2 lg:h-4 w-2 lg:w-4" /> : <div className="h-2 lg:h-4 w-2 lg:w-4 bg-emerald-200 dark:bg-emerald-800 rounded-sm"></div>}
                </div>
              ))}
              <div className="flex-1"></div>
              <div className="h-4 lg:h-8 w-4 lg:w-8 rounded-full bg-gradient-to-r from-emerald-600 to-teal-500"></div>
            </div>
            
            {/* Interview AI Interface */}
            <div className="flex-1 space-y-1 lg:space-y-2">
              <div className="h-4 lg:h-6 w-full bg-emerald-100 dark:bg-emerald-900/40 rounded-lg flex items-center px-1 lg:px-2 gap-1">
                <Sparkles className="h-2 lg:h-3 w-2 lg:w-3 text-emerald-600 dark:text-emerald-400" />
                <div className="h-1.5 lg:h-2 w-12 lg:w-20 bg-emerald-200/70 dark:bg-emerald-800/50 rounded-sm"></div>
              </div>
              
              {/* AI Avatar Interview Session */}
              <div className="flex gap-1 lg:gap-2 h-[170px] lg:h-[290px]">
                <div className="w-1/2 rounded-lg bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-900/30 dark:to-gray-900/90 p-1 lg:p-2 border border-emerald-100 dark:border-emerald-900/50">
                  <div className="flex justify-between mb-1 lg:mb-2">
                    <div className="flex items-center gap-1">
                      <div className="h-3 lg:h-6 w-3 lg:w-6 rounded-full bg-emerald-500"></div>
                      <div>
                        <div className="h-1 lg:h-2 w-8 lg:w-16 bg-emerald-200/70 dark:bg-emerald-800/50 rounded-sm"></div>
                        <div className="h-0.5 lg:h-1 w-6 lg:w-12 bg-emerald-100/70 dark:bg-emerald-900/50 rounded-sm mt-0.5 lg:mt-1"></div>
                      </div>
                    </div>
                    <div className="flex items-center gap-0.5 lg:gap-1">
                      <div className="h-2 lg:h-4 w-2 lg:w-4 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
                        <Brain className="h-1 lg:h-2 w-1 lg:w-2 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div className="h-0.5 lg:h-1 w-4 lg:w-8 bg-emerald-100 dark:bg-emerald-900/50 rounded-sm"></div>
                    </div>
                  </div>
                  
                  <div className="mt-1 lg:mt-2 space-y-1">
                    <div className="h-1 lg:h-2 w-full bg-emerald-100 dark:bg-emerald-900/50 rounded-sm"></div>
                    <div className="h-1 lg:h-2 w-5/6 bg-emerald-100 dark:bg-emerald-900/50 rounded-sm"></div>
                    <div className="h-1 lg:h-2 w-4/6 bg-emerald-100 dark:bg-emerald-900/50 rounded-sm"></div>
                  </div>
                  
                  <div className="absolute bottom-8 lg:bottom-16 left-12 lg:left-24 w-16 lg:w-24">
                    <div className="p-1 lg:p-2 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-emerald-100 dark:border-emerald-900/50 text-[8px] lg:text-xs">
                      <div className="font-medium text-emerald-600 dark:text-emerald-400 mb-0.5 lg:mb-1">
                        {lang === 'en' ? 'AI Avatar' : 'AI虚拟形象'}
                      </div>
                      <div className="h-0.5 lg:h-1 w-full bg-emerald-100 dark:bg-emerald-900/50 rounded-sm mb-0.5"></div>
                      <div className="h-0.5 lg:h-1 w-3/4 bg-emerald-100 dark:bg-emerald-900/50 rounded-sm"></div>
                    </div>
                  </div>
                </div>
                
                <div className="w-1/2 space-y-1 lg:space-y-2">
                  <div className="rounded-lg bg-white dark:bg-gray-700 p-1 lg:p-2 border border-emerald-100 dark:border-emerald-900/50">
                    <div className="flex justify-between mb-1">
                      <div className="flex items-center gap-1">
                        <Database className="h-2 lg:h-3 w-2 lg:w-3 text-emerald-600 dark:text-emerald-400" />
                        <div className="h-1 lg:h-2 w-8 lg:w-16 bg-emerald-100 dark:bg-emerald-900/50 rounded-sm"></div>
                      </div>
                    </div>
                    <div className="h-8 lg:h-16 w-full bg-gradient-to-br from-emerald-500/90 to-teal-500/90 rounded-md opacity-80 relative">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-white text-[8px] lg:text-xs font-medium">
                          {lang === 'en' ? 'Vector Match' : '向量匹配'}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="rounded-lg bg-white dark:bg-gray-700 p-1 lg:p-2 border border-emerald-100 dark:border-emerald-900/50">
                    <div className="flex justify-between mb-1">
                      <div className="flex items-center gap-1">
                        <Zap className="h-2 lg:h-3 w-2 lg:w-3 text-emerald-600 dark:text-emerald-400" />
                        <div className="h-1 lg:h-2 w-6 lg:w-12 bg-emerald-100 dark:bg-emerald-900/50 rounded-sm"></div>
                      </div>
                    </div>
                    <div className="space-y-0.5 lg:space-y-1">
                      <div className="flex items-center gap-1">
                        <div className="h-1.5 lg:h-3 w-1.5 lg:w-3 rounded-full bg-emerald-500"></div>
                        <div className="h-1 lg:h-2 w-full bg-gradient-to-r from-emerald-500 to-emerald-100 dark:to-emerald-900/50 rounded-full"></div>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="h-1.5 lg:h-3 w-1.5 lg:w-3 rounded-full bg-teal-500"></div>
                        <div className="h-1 lg:h-2 w-4/5 bg-gradient-to-r from-teal-500 to-teal-100 dark:to-teal-900/50 rounded-full"></div>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="h-1.5 lg:h-3 w-1.5 lg:w-3 rounded-full bg-blue-500"></div>
                        <div className="h-1 lg:h-2 w-3/5 bg-gradient-to-r from-blue-500 to-blue-100 dark:to-blue-900/50 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Feature badges */}
        <div className="absolute -bottom-2 lg:-bottom-4 -right-2 lg:-right-4 h-auto bg-white dark:bg-gray-900 shadow-lg rounded-xl p-1.5 lg:p-3 border border-emerald-100 dark:border-emerald-900/50 animate-float-slow flex items-center gap-1 lg:gap-2">
          <div className="bg-emerald-100 dark:bg-emerald-900/70 p-1 lg:p-2 rounded-lg">
            <Brain className="h-2 lg:h-4 w-2 lg:w-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-[8px] lg:text-xs">
            <p className="font-medium">{lang === 'en' ? 'AI Avatars' : 'AI虚拟形象'}</p>
            <p className="text-muted-foreground text-[6px] lg:text-[10px]">{lang === 'en' ? 'Interactive' : '互动面试'}</p>
          </div>
        </div>
        
        <div className="absolute top-3 lg:top-6 -left-2 lg:-left-4 h-auto bg-white dark:bg-gray-900 shadow-lg rounded-xl p-1.5 lg:p-3 border border-emerald-100 dark:border-emerald-900/50 animate-float-medium flex items-center gap-1 lg:gap-2">
          <div className="bg-emerald-100 dark:bg-emerald-900/70 p-1 lg:p-2 rounded-lg">
            <Database className="h-2 lg:h-4 w-2 lg:w-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-[8px] lg:text-xs">
            <p className="font-medium">{lang === 'en' ? 'Smart Match' : '智能匹配'}</p>
            <p className="text-muted-foreground text-[6px] lg:text-[10px]">{lang === 'en' ? 'Precision' : '精准技术'}</p>
          </div>
        </div>
      </div>
    </div>
  )
}