import { getDictionary } from "@/lib/dictionary";
import { 
  BriefcaseBusiness, 
  Briefcase, 
  Building2, 
  Award, 
  Sparkles, 
  Zap, 
  Brain, 
  BarChart3, 
  Target, 
  Users, 
  Globe, 
  ShieldCheck, 
  ChevronRight,
  Star,
  Database 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { AnimatedBackground } from "@/components/animated-background";
import { Navbar } from "@/components/navbar";

export default async function LocaleHomePage({ params }: { params: Promise<{ lang: string }> | { lang: string } }) {
  // Await the params if it's a promise
  const resolvedParams = await params;
  const lang = resolvedParams.lang;
  const dictionary = getDictionary(lang);
  
  return (
    <>
      <Navbar lang={lang} />
      <div className="pt-16">
      {/* Add a prominent link to the onboarding flow */}
      <div className="fixed bottom-10 right-10 z-50">
        <Link href={`/${resolvedParams.lang}/onboarding`}>
          <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all px-6 py-6 rounded-full">
            <Sparkles className="mr-2 h-5 w-5" />
            <span className="font-medium">{lang === 'en' ? 'Get Started' : '开始使用'}</span>
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </Link>
      </div>
      {/* Hero Section with advanced graphics */}
      <section className="relative w-full bg-gradient-to-b from-background via-background to-emerald-50/40 dark:from-background dark:via-background dark:to-emerald-950/30 py-24 lg:py-36 overflow-hidden">
        {/* Unified background design */}
        <div className="absolute inset-0 pointer-events-none select-none">
          <AnimatedBackground intensity={5} speed={3} />
          
          {/* Main gradient blob */}
          <div className="absolute top-0 left-0 right-0 w-[95%] h-96 bg-gradient-to-br from-emerald-300/25 via-teal-200/20 to-transparent dark:from-emerald-700/20 dark:via-teal-800/15 dark:to-transparent blur-[120px] transform -translate-y-1/4 rounded-full mx-auto"></div>
          
          {/* Floating orbs with consistent style */}
          <div className="absolute top-[15%] left-[10%] w-32 h-32 rounded-full bg-gradient-to-br from-emerald-400/15 to-teal-300/10 blur-xl animate-float-slow"></div>
          <div className="absolute top-[35%] right-[5%] w-40 h-40 rounded-full bg-gradient-to-br from-emerald-500/15 to-teal-400/10 blur-xl animate-float-medium"></div>
          <div className="absolute bottom-[20%] left-[15%] w-24 h-24 rounded-full bg-gradient-to-br from-teal-400/15 to-emerald-300/10 blur-lg animate-float-fast"></div>
          
          {/* Subtle grid pattern */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiMxMGIyODEiIGZpbGwtb3BhY2l0eT0iLjAyIiBkPSJNMzYgMzRoLTJ2LTJoMnYyem0tNCAwaDJ2LTJoMnptLTQgMGgydi0yaDB6Ii8+PC9nPjwvc3ZnPg==')] opacity-20 dark:opacity-10"></div>
        </div>
        
        {/* Content container */}
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-16">
            <div className="flex-1 space-y-8 text-center md:text-left">
              {/* Badge */}
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 bg-emerald-50/80 dark:bg-emerald-900/30 border border-emerald-200/80 dark:border-emerald-800/80 rounded-full backdrop-blur-sm shadow-sm">
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
                  </span>
                  <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                    {lang === 'en' ? 'Exclusive Beta Access' : '独家测试版访问'}
                  </span>
                </div>
                
                {/* Headline with animation */}
                <div className="relative">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-700 to-gray-600 dark:from-white dark:via-gray-200 dark:to-gray-400 animate-gradient-x">
                    {dictionary.home.title} <br className="hidden sm:block" />
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-500 dark:from-emerald-400 dark:via-teal-300 dark:to-emerald-400 inline-flex items-center">
                      {dictionary.home.titleHighlight}
                      <Sparkles className="h-8 w-8 ml-2 text-emerald-500 dark:text-emerald-400 inline animate-pulse" />
                    </span> {dictionary.home.titleEnd}
                  </h1>
                  <p className="text-xl md:text-2xl text-muted-foreground max-w-[650px] mx-auto md:mx-0 leading-relaxed">
                    {dictionary.home.subtitle}
                  </p>
                </div>
              </div>
              
              {/* CTA buttons with enhanced styling */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Button size="lg" className="rounded-full bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 hover:from-emerald-700 hover:via-emerald-600 hover:to-teal-600 shadow-lg hover:shadow-xl transition-all px-8 py-6 text-lg group" asChild>
                  <Link href={`/${lang}/jobs`} className="flex items-center gap-2">
                    {dictionary.home.findJobsButton}
                    <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="rounded-full border-2 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition-all px-8 py-6 text-lg group border-emerald-200 dark:border-emerald-800" asChild>
                  <Link href={`/${lang}/profile`} className="flex items-center gap-2">
                    {dictionary.home.viewProfileButton}
                    <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </div>
              
              {/* Early access community */}
              <div className="hidden md:flex justify-start items-center gap-3 pt-8">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full ring-2 ring-white dark:ring-gray-900 bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-500 flex items-center justify-center text-white font-medium">
                      {i}
                    </div>
                  ))}
                  <div className="w-10 h-10 rounded-full ring-2 ring-white dark:ring-gray-900 bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-500 flex items-center justify-center text-white text-xs">
                    +
                  </div>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center">
                    <span className="bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 text-xs px-2 py-0.5 rounded-full">
                      {lang === 'en' ? 'Coming Soon' : '即将推出'}
                    </span>
                  </div>
                  <span className="text-sm font-medium">
                    {lang === 'en' ? 'Join our ' : '加入我们的 '}
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      {lang === 'en' ? 'exclusive beta' : '独家测试版'}
                    </span>
                    {lang === 'en' ? ' launch' : ' 发布'}
                  </span>
                </div>
              </div>
            </div>                {/* Hero illustration with advanced effects */}
            <div className="flex-1 relative w-full">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-600 to-teal-400 rounded-2xl blur-2xl opacity-20 dark:opacity-30 animate-pulse"></div>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.1)_0,transparent_70%)] dark:bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.15)_0,transparent_70%)]"></div>
              
              <div className="relative h-[400px] md:h-[500px] w-full bg-gradient-to-br from-white via-white to-emerald-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 rounded-2xl shadow-xl border border-emerald-100 dark:border-emerald-900/50 backdrop-blur-sm">
                {/* Decorative elements */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-600"></div>
                
                {/* AI Avatar Interview UI */}
                <div className="absolute top-8 right-8 left-8 bottom-8 rounded-lg border border-emerald-100 dark:border-emerald-900/50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 shadow-lg">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="h-3 w-3 rounded-full bg-red-500"></div>
                    <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                    <div className="h-3 w-3 rounded-full bg-green-500"></div>
                    <div className="ml-4 h-6 w-56 flex items-center">
                      <div className="h-4 w-4 rounded-full bg-emerald-500 mr-2"></div>
                      <div className="h-3.5 w-48 bg-emerald-100 dark:bg-emerald-900/50 rounded-md"></div>
                    </div>
                  </div>
                  
                  <div className="flex gap-6 h-[350px]">
                    {/* Interview sidebar */}
                    <div className="w-20 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg flex flex-col items-center gap-4 p-3">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className={`h-10 w-10 rounded-lg ${i === 1 ? 'bg-emerald-500 text-white' : 'bg-white dark:bg-gray-700'} flex items-center justify-center shadow-sm`}>
                          {i === 1 ? <BriefcaseBusiness className="h-5 w-5" /> : <div className="h-5 w-5 bg-emerald-200 dark:bg-emerald-800 rounded-sm"></div>}
                        </div>
                      ))}
                      <div className="flex-1"></div>
                      <div className="h-10 w-10 rounded-full bg-gradient-to-r from-emerald-600 to-teal-500"></div>
                    </div>
                    
                    {/* Interview AI Interface */}
                    <div className="flex-1 space-y-4">
                      <div className="h-10 w-full bg-emerald-100 dark:bg-emerald-900/40 rounded-lg flex items-center px-4 gap-2">
                        <Sparkles className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                        <div className="h-4 w-40 bg-emerald-200/70 dark:bg-emerald-800/50 rounded-sm"></div>
                      </div>
                      
                      {/* AI Avatar Interview Session */}
                      <div className="flex gap-4 h-[310px]">
                        <div className="w-1/2 rounded-lg bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-900/30 dark:to-gray-900/90 p-4 border border-emerald-100 dark:border-emerald-900/50">
                          <div className="flex justify-between mb-4">
                            <div className="flex items-center gap-2">
                              <div className="h-8 w-8 rounded-full bg-emerald-500"></div>
                              <div>
                                <div className="h-3 w-24 bg-emerald-200/70 dark:bg-emerald-800/50 rounded-sm"></div>
                                <div className="h-2 w-16 bg-emerald-100/70 dark:bg-emerald-900/50 rounded-sm mt-1"></div>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <div className="h-5 w-5 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
                                <Brain className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                              </div>
                              <div className="h-2 w-10 bg-emerald-100 dark:bg-emerald-900/50 rounded-sm"></div>
                            </div>
                          </div>
                          
                          <div className="mt-4 space-y-3">
                            <div className="h-3 w-full bg-emerald-100 dark:bg-emerald-900/50 rounded-sm"></div>
                            <div className="h-3 w-5/6 bg-emerald-100 dark:bg-emerald-900/50 rounded-sm"></div>
                            <div className="h-3 w-4/6 bg-emerald-100 dark:bg-emerald-900/50 rounded-sm"></div>
                          </div>
                          
                          <div className="absolute bottom-24 left-40 w-32">
                            <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-emerald-100 dark:border-emerald-900/50 text-xs">
                              <div className="font-medium text-emerald-600 dark:text-emerald-400 mb-1">
                                {lang === 'en' ? 'AI Interview Avatar' : 'AI面试虚拟形象'}
                              </div>
                              <div className="h-2 w-full bg-emerald-100 dark:bg-emerald-900/50 rounded-sm mb-1"></div>
                              <div className="h-2 w-5/6 bg-emerald-100 dark:bg-emerald-900/50 rounded-sm"></div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="w-1/2 space-y-4">
                          <div className="rounded-lg bg-white dark:bg-gray-700 p-4 border border-emerald-100 dark:border-emerald-900/50">
                            <div className="flex justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <Database className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                                <div className="h-3 w-32 bg-emerald-100 dark:bg-emerald-900/50 rounded-sm"></div>
                              </div>
                            </div>
                            <div className="h-24 w-full bg-gradient-to-br from-emerald-500/90 to-teal-500/90 rounded-md opacity-80 relative">
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-white text-xs font-medium">
                                  {lang === 'en' ? 'Semantic Vector Match' : '语义向量匹配'}
                                </div>
                              </div>
                              {/* Connection lines representing vector matching */}
                              <div className="absolute inset-0">
                                <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 border-t border-l border-white/30 rounded-tl-lg"></div>
                                <div className="absolute top-1/4 right-1/4 w-1/2 h-1/2 border-t border-r border-white/30 rounded-tr-lg"></div>
                                <div className="absolute bottom-1/4 left-1/4 w-1/2 h-1/2 border-b border-l border-white/30 rounded-bl-lg"></div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="rounded-lg bg-white dark:bg-gray-700 p-4 border border-emerald-100 dark:border-emerald-900/50">
                            <div className="flex justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <Zap className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                                <div className="h-3 w-36 bg-emerald-100 dark:bg-emerald-900/50 rounded-sm"></div>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <div className="h-4 w-4 rounded-full bg-emerald-500"></div>
                                <div className="h-3 w-full bg-gradient-to-r from-emerald-500 to-emerald-100 dark:to-emerald-900/50 rounded-full"></div>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="h-4 w-4 rounded-full bg-teal-500"></div>
                                <div className="h-3 w-4/5 bg-gradient-to-r from-teal-500 to-teal-100 dark:to-teal-900/50 rounded-full"></div>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="h-4 w-4 rounded-full bg-blue-500"></div>
                                <div className="h-3 w-3/5 bg-gradient-to-r from-blue-500 to-blue-100 dark:to-blue-900/50 rounded-full"></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Feature badges */}
                <div className="absolute -bottom-4 -right-4 h-auto bg-white dark:bg-gray-900 shadow-lg rounded-xl p-3 border border-emerald-100 dark:border-emerald-900/50 animate-float-slow flex items-center gap-2">
                  <div className="bg-emerald-100 dark:bg-emerald-900/70 p-2 rounded-lg">
                    <Brain className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div className="text-xs">
                    <p className="font-medium">{lang === 'en' ? 'AI Avatars' : 'AI虚拟形象'}</p>
                    <p className="text-muted-foreground text-[10px]">{lang === 'en' ? 'Interactive Interviews' : '互动面试'}</p>
                  </div>
                </div>
                
                <div className="absolute top-6 -left-4 h-auto bg-white dark:bg-gray-900 shadow-lg rounded-xl p-3 border border-emerald-100 dark:border-emerald-900/50 animate-float-medium flex items-center gap-2">
                  <div className="bg-emerald-100 dark:bg-emerald-900/70 p-2 rounded-lg">
                    <Database className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div className="text-xs">
                    <p className="font-medium">{lang === 'en' ? 'Smart Matching' : '智能匹配'}</p>
                    <p className="text-muted-foreground text-[10px]">{lang === 'en' ? 'Precision Technology' : '精准技术'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features section with enhanced graphics */}
      <section className="py-32 w-full bg-gradient-to-b from-white via-white to-emerald-50/50 dark:from-gray-950 dark:via-gray-950 dark:to-emerald-950/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiMxMGIyODEiIGZpbGwtb3BhY2l0eT0iLjAyIiBkPSJNMzYgMzRoLTJ2LTJoMnYyem0tNCAwaDJ2LTJoMnptLTQgMGgydi0yaDB6Ii8+PC9nPjwvc3ZnPg==')] opacity-20 dark:opacity-10 pointer-events-none select-none"></div>
        
        {/* Background accent elements for consistency */}
        <div className="absolute top-40 left-0 w-64 h-64 rounded-full bg-gradient-to-br from-emerald-400/15 to-teal-300/10 blur-xl"></div>
        <div className="absolute bottom-40 right-0 w-80 h-80 rounded-full bg-gradient-to-br from-emerald-500/15 to-teal-400/10 blur-xl"></div>
        
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section header with animated elements */}
          <div className="text-center mb-20 relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 -top-10 w-40 h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent"></div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300">
              {lang === 'en' ? 'Why Choose ' : '为什么选择 '}<span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-500">Huntier</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-[800px] mx-auto leading-relaxed">
              {lang === 'en' ? 'Our cutting-edge platform leverages the latest in AI and machine learning to connect you with opportunities that perfectly match your unique skillset and career aspirations' 
              : '我们的前沿平台利用最新的人工智能和机器学习技术，为您匹配完全符合您独特技能和职业抱负的机会'}
            </p>
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-10 w-20 h-20 bg-emerald-500/10 dark:bg-emerald-500/5 rounded-full blur-3xl"></div>
          </div>
          
          {/* Main features with enhanced styling and animations */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="group p-8 rounded-2xl bg-white/70 dark:bg-gray-900/50 hover:bg-white dark:hover:bg-gray-900/70 transition-all hover:shadow-xl relative backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="bg-gradient-to-br from-emerald-100 to-emerald-50 dark:from-emerald-900/80 dark:to-emerald-800/50 p-4 rounded-xl w-fit mb-6 relative z-10 group-hover:scale-110 transition-transform duration-300 shadow-md group-hover:shadow-lg">
                <Database className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="inline-flex items-center gap-2 px-2 py-1 rounded-full bg-emerald-100/70 dark:bg-emerald-900/40 text-xs text-emerald-700 dark:text-emerald-300 mb-3">
                <span className="flex h-1.5 w-1.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-600"></span>
                </span>
                {lang === 'en' ? 'New Technology' : '新技术'}
              </div>
              <h3 className="text-2xl font-bold mb-3 relative z-10">
                {lang === 'en' ? 'Intelligent Job Matching' : '智能职位匹配'}
              </h3>
              <p className="text-muted-foreground relative z-10 leading-relaxed">
                {lang === 'en' ? (
                  <>Our <span className="font-medium text-emerald-600 dark:text-emerald-400">smart matching technology</span> goes beyond traditional methods to understand your unique skills and experience, finding opportunities that truly align with your career goals. Our advanced system achieves 94% match accuracy, helping you discover ideal positions you might otherwise miss.</>
                ) : (
                  <>我们的<span className="font-medium text-emerald-600 dark:text-emerald-400">智能匹配技术</span>超越传统方法，理解您独特的技能和经验，找到真正符合您职业目标的机会。我们的先进系统实现了94%的匹配准确率，帮助您发现可能错过的理想职位。</>
                )}
              </p>
              <div className="absolute bottom-4 right-4 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <ChevronRight className="absolute bottom-6 right-6 h-5 w-5 text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            
            <div className="group p-8 rounded-2xl bg-white/70 dark:bg-gray-900/50 hover:bg-white dark:hover:bg-gray-900/70 transition-all hover:shadow-xl relative backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="bg-gradient-to-br from-emerald-100 to-emerald-50 dark:from-emerald-900/80 dark:to-emerald-800/50 p-4 rounded-xl w-fit mb-6 relative z-10 group-hover:scale-110 transition-transform duration-300 shadow-md group-hover:shadow-lg">
                <Brain className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="inline-flex items-center gap-2 px-2 py-1 rounded-full bg-emerald-100/70 dark:bg-emerald-900/40 text-xs text-emerald-700 dark:text-emerald-300 mb-3">
                <Sparkles className="h-3 w-3" />
                {lang === 'en' ? 'Featured' : '精选'}
              </div>
              <h3 className="text-2xl font-bold mb-3 relative z-10">
                {lang === 'en' ? 'AI-Powered Career Tools' : 'AI驱动的职业工具'}
              </h3>
              <p className="text-muted-foreground relative z-10 leading-relaxed">
                {lang === 'en' ? (
                  <>Enhance your job search with our suite of <span className="font-medium text-emerald-600 dark:text-emerald-400">AI-powered tools</span> including interview preparation, resume optimization, and personalized coaching. Our comprehensive approach helps you showcase your strengths effectively, with users reporting 72% higher interview success rates and significantly improved offer negotiations.</>
                ) : (
                  <>使用我们的<span className="font-medium text-emerald-600 dark:text-emerald-400">AI驱动工具套件</span>增强您的求职过程，包括面试准备、简历优化和个性化指导。我们全面的方法帮助您有效展示自己的优势，用户报告面试成功率提高72%，并显著改善了offer谈判。</>
                )}
              </p>
              <div className="absolute bottom-4 right-4 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <ChevronRight className="absolute bottom-6 right-6 h-5 w-5 text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            
            <div className="group p-8 rounded-2xl bg-white/70 dark:bg-gray-900/50 hover:bg-white dark:hover:bg-gray-900/70 transition-all hover:shadow-xl relative backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="bg-gradient-to-br from-emerald-100 to-emerald-50 dark:from-emerald-900/80 dark:to-emerald-800/50 p-4 rounded-xl w-fit mb-6 relative z-10 group-hover:scale-110 transition-transform duration-300 shadow-md group-hover:shadow-lg">
                <Globe className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="inline-flex items-center gap-2 px-2 py-1 rounded-full bg-emerald-100/70 dark:bg-emerald-900/40 text-xs text-emerald-700 dark:text-emerald-300 mb-3">
                {lang === 'en' ? 'Trusted' : '值得信赖'}
              </div>
              <h3 className="text-2xl font-bold mb-3 relative z-10">
                {lang === 'en' ? 'Global Opportunity Network' : '全球机会网络'}
              </h3>
              <p className="text-muted-foreground relative z-10 leading-relaxed">
                {lang === 'en' ? 
                  'Access our database of over 10,000 curated job listings, updated daily, from Fortune 500 companies to innovative startups across 75+ industries and 120+ countries worldwide. Our platform is completely free for job seekers.' 
                : 
                  '访问我们每日更新的超过10,000个精选职位数据库，涵盖从财富500强公司到创新型初创企业，横跨75+行业和120+国家。我们的平台对求职者完全免费。'
                }
              </p>
              <div className="absolute bottom-4 right-4 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <ChevronRight className="absolute bottom-6 right-6 h-5 w-5 text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
          
          {/* Technology spotlight section */}
          <div className="rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50/50 dark:from-emerald-900/30 dark:to-teal-900/20 border border-emerald-100 dark:border-emerald-900/50 p-8 mb-16 flex flex-col md:flex-row gap-8 items-center backdrop-blur-sm">
            <div className="md:w-1/2 space-y-4">
              <div className="inline-flex items-center rounded-full bg-emerald-100 dark:bg-emerald-900/50 px-3 py-1 text-sm font-medium text-emerald-700 dark:text-emerald-300">
                <Database className="h-4 w-4 mr-2" />
                {lang === 'en' ? 'NextGen Technology' : '下一代技术'}
              </div>
              <h3 className="text-2xl font-bold">
                {lang === 'en' ? 'How Our Smart Matching Technology Works' : '我们的智能匹配技术如何工作'}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {lang === 'en' 
                  ? 'Traditional job matching relies on simple keyword matching. Our advanced technology goes beyond basic methods to create meaningful connections between your skills and the right opportunities.'
                  : '传统的职位匹配依赖于简单的关键词匹配。我们的先进技术超越了基本方法，在您的技能和合适的机会之间创造有意义的连接。'
                }
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <div className="h-6 w-6 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center mt-0.5">
                    <ChevronRight className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <span>
                    {lang === 'en' 
                      ? 'Analyzes resumes and job descriptions for meaningful patterns' 
                      : '分析简历和职位描述中的有意义模式'
                    }
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-6 w-6 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center mt-0.5">
                    <ChevronRight className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <span>
                    {lang === 'en' 
                      ? 'Recognizes connections between related skills and requirements' 
                      : '识别相关技能和需求之间的联系'
                    }
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-6 w-6 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center mt-0.5">
                    <ChevronRight className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <span>
                    {lang === 'en' 
                      ? 'Creates precise matches based on capability, not just exact keyword matches' 
                      : '基于能力而非仅仅是精确关键词匹配创建精准匹配'
                    }
                  </span>
                </li>
              </ul>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg border border-emerald-100 dark:border-emerald-900/50 relative">
                <div className="w-full h-36 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center relative">
                  {/* Vector visualization */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative w-20 h-20">
                      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 h-2 w-2 bg-emerald-500 rounded-full"></div>
                      <div className="absolute bottom-0 left-0 h-2 w-2 bg-emerald-400 rounded-full"></div>
                      <div className="absolute bottom-0 right-0 h-2 w-2 bg-teal-500 rounded-full"></div>
                      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 h-full w-[1px] bg-emerald-200 dark:bg-emerald-700"></div>
                      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-emerald-200 dark:bg-emerald-700"></div>
                      <div className="absolute bottom-0 left-0 w-[1px] h-full bg-emerald-200 dark:bg-emerald-700"></div>
                      <div className="absolute bottom-0 right-0 w-[1px] h-full bg-emerald-200 dark:bg-emerald-700"></div>
                    </div>
                  </div>
                  
                  <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                    {lang === 'en' ? 'Advanced Pattern Recognition' : '高级模式识别'}
                  </div>
                </div>
                
                <div className="mt-4 text-center">
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>{lang === 'en' ? 'Traditional Match' : '传统匹配'}</span>
                    <span>45%</span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full">
                    <div className="h-full w-[45%] bg-gray-400 dark:bg-gray-600 rounded-full"></div>
                  </div>
                  
                  <div className="flex justify-between text-xs text-muted-foreground mb-1 mt-3">
                    <span>{lang === 'en' ? 'Smart Technology Match' : '智能技术匹配'}</span>
                    <span>94%</span>
                  </div>
                  <div className="h-2 w-full bg-emerald-100 dark:bg-emerald-900/50 rounded-full">
                    <div className="h-full w-[94%] bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Additional features row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group rounded-2xl p-6 bg-gradient-to-br from-emerald-50 to-emerald-100/70 dark:from-emerald-900/40 dark:to-emerald-900/20 border border-emerald-200/70 dark:border-emerald-800/30 hover:shadow-lg transition-all flex items-center gap-4">
              <div className="bg-white dark:bg-gray-800 p-3 rounded-xl shadow-sm">
                <Target className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <h3 className="font-semibold">{lang === 'en' ? 'Smart Recommendations' : '智能推荐'}</h3>
                <p className="text-sm text-muted-foreground">
                  {lang === 'en' ? 'Personalized job recommendations based on your profile' : '基于您的档案提供个性化职位推荐'}
                </p>
              </div>
            </div>
            
            <div className="group rounded-2xl p-6 bg-gradient-to-br from-emerald-50 to-emerald-100/70 dark:from-emerald-900/40 dark:to-emerald-900/20 border border-emerald-200/70 dark:border-emerald-800/30 hover:shadow-lg transition-all flex items-center gap-4">
              <div className="bg-white dark:bg-gray-800 p-3 rounded-xl shadow-sm">
                <BarChart3 className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <h3 className="font-semibold">{lang === 'en' ? 'Salary Insights' : '薪资洞察'}</h3>
                <p className="text-sm text-muted-foreground">
                  {lang === 'en' ? 'Real-time market data on compensation packages' : '薪酬方案的实时市场数据'}
                </p>
              </div>
            </div>
            
            <div className="group rounded-2xl p-6 bg-gradient-to-br from-emerald-50 to-emerald-100/70 dark:from-emerald-900/40 dark:to-emerald-900/20 border border-emerald-200/70 dark:border-emerald-800/30 hover:shadow-lg transition-all flex items-center gap-4">
              <div className="bg-white dark:bg-gray-800 p-3 rounded-xl shadow-sm">
                <Database className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <h3 className="font-semibold">{lang === 'en' ? 'Skills Database' : '技能数据库'}</h3>
                <p className="text-sm text-muted-foreground">
                  {lang === 'en' ? 'Identify skill gaps and access personalized learning paths' : '识别技能差距并获取个性化学习路径'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Early adopters section - enhanced with 3D perspective design */}
      <section className="py-28 w-full bg-gradient-to-b from-white to-emerald-50/40 dark:from-gray-950 dark:to-emerald-950/20 relative overflow-hidden">
        {/* Enhanced background elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiMxMGIyODEiIGZpbGwtb3BhY2l0eT0iLjAzIiBkPSJNMzYgMzRoLTJ2LTJoMnYyem0tNCAwaDJ2LTJoMnptLTQgMGgydi0yaDB6Ii8+PC9nPjwvc3ZnPg==')] opacity-20 dark:opacity-10"></div>
          <div className="absolute left-0 top-1/4 w-96 h-96 bg-gradient-to-b from-emerald-200/30 to-transparent dark:from-emerald-900/20 dark:to-transparent rounded-full blur-[120px]"></div>
          <div className="absolute right-0 bottom-1/4 w-96 h-96 bg-gradient-to-b from-teal-200/30 to-transparent dark:from-teal-900/20 dark:to-transparent rounded-full blur-[120px]"></div>
          
          {/* Animated floating particles */}
          <div className="absolute top-1/4 left-1/4 w-3 h-3 rounded-full bg-emerald-500/30 animate-float-slow"></div>
          <div className="absolute top-3/4 right-1/4 w-2 h-2 rounded-full bg-teal-500/30 animate-float-medium"></div>
          <div className="absolute top-1/2 left-3/4 w-4 h-4 rounded-full bg-emerald-400/30 animate-float-fast"></div>
          <div className="absolute bottom-1/3 right-1/3 w-3 h-3 rounded-full bg-teal-400/30 animate-float-slow"></div>
        </div>
        
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col items-center justify-center mb-20">
            <div className="relative">
              <div className="absolute -inset-6 rounded-full bg-gradient-to-r from-emerald-500/20 to-teal-500/20 blur-lg animate-pulse"></div>
              <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 bg-emerald-50/80 dark:bg-emerald-900/30 border border-emerald-200/80 dark:border-emerald-800/80 rounded-full backdrop-blur-sm shadow-sm relative">
                <Users className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">{lang === 'en' ? 'Beta Testers' : '测试用户'}</span>
              </div>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-6">
              {lang === 'en' ? 'Join our early adopters ' : '加入我们的早期用户'}
              <br className="hidden md:block" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-500">
                {lang === 'en' ? 'community' : '社区'}
              </span>
            </h2>
            <p className="text-xl text-center text-muted-foreground max-w-2xl">
              {lang === 'en' 
                ? 'What our beta testers are saying about the Huntier experience' 
                : '测试用户对Huntier体验的评价'}
            </p>
          </div>
          
          {/* Testimonial carousel with 3D perspective effect */}
          <div className="relative perspective-1000">
            {/* 3D carousel container */}
            <div className="relative h-[450px] md:h-[400px] w-full">
              {/* Testimonial 1 - Centered and elevated */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-full max-w-2xl z-30">
                <div className="bg-gradient-to-br from-white to-emerald-50/80 dark:from-gray-900 dark:to-emerald-950/50 rounded-2xl p-8 shadow-2xl relative backdrop-blur-md border border-emerald-100/80 dark:border-emerald-800/50 transform transition-all duration-500 hover:scale-[1.02] group">
                  {/* Spotlight effect on hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.1)_0,transparent_70%)] dark:bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.15)_0,transparent_70%)] rounded-2xl"></div>
                  
                  {/* Glowing border on top */}
                  <div className="absolute -top-px left-20 right-20 h-px bg-gradient-to-r from-transparent via-emerald-500 to-transparent"></div>
                  <div className="absolute -bottom-px left-20 right-20 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent"></div>
                  
                  {/* Content */}
                  <div className="flex flex-col items-center text-center">
                    {/* Quote icon with glow */}
                    <div className="relative mb-6">
                      <div className="absolute -inset-3 bg-emerald-500/20 rounded-full blur-md"></div>
                      <div className="relative bg-white dark:bg-gray-800 rounded-full p-2 shadow-md">
                        <svg className="w-6 h-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                        </svg>
                      </div>
                    </div>
                    
                    {/* Testimonial */}
                    <p className="text-lg text-foreground font-medium mb-6 relative">
                      {lang === 'en' 
                        ? '"I\'ve been testing the Huntier beta for two weeks and I\'m impressed by how accurately the AI matches my skills to opportunities. The interface is intuitive and the job recommendations are spot on."'
                        : '"我已经测试了Huntier测试版两周，我对AI如何准确地将我的技能与机会匹配感到印象深刻。界面直观，职位推荐非常准确。"'
                      }
                    </p>
                    
                    {/* Star rating */}
                    <div className="flex justify-center mb-4">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400 drop-shadow-sm" />
                      ))}
                    </div>
                    
                    {/* Profile */}
                    <div className="flex flex-col items-center">
                      <div className="relative w-16 h-16 mb-3">
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-500 rounded-full blur-sm"></div>
                        <div className="relative bg-gradient-to-r from-emerald-500 to-teal-400 w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-semibold shadow-lg">
                          AT
                        </div>
                      </div>
                      <h4 className="font-bold text-lg">{lang === 'en' ? 'Alex Thompson' : '艾力克斯·汤普森'}</h4>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full">{lang === 'en' ? 'Beta Tester' : '测试用户'}</span>
                        <span className="text-sm text-muted-foreground">{lang === 'en' ? 'Software Engineer' : '软件工程师'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Testimonial 2 - Left and back */}
              <div className="absolute top-8 -left-4 w-full max-w-md z-10 opacity-80 transform translate-x-12 scale-90  ">
                <div className="bg-gradient-to-br from-white to-emerald-50/80 dark:from-gray-900 dark:to-emerald-950/50 rounded-2xl p-6 shadow-lg relative backdrop-blur-sm border border-emerald-100/60 dark:border-emerald-800/30">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-gradient-to-r from-emerald-500 to-teal-400 w-14 h-14 rounded-full flex items-center justify-center text-white text-lg font-medium shadow-md">
                      SR
                    </div>
                    <div>
                      <h4 className="font-semibold">{lang === 'en' ? 'Sophia Rodriguez' : '索菲亚·罗德里格斯'}</h4>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full">{lang === 'en' ? 'Beta' : '测试'}</span>
                        <p className="text-xs text-muted-foreground">{lang === 'en' ? 'Marketing Manager' : '营销经理'}</p>
                      </div>
                    </div>
                  </div>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-4">
                    {lang === 'en' 
                      ? '"The AI interview preparation feature in the Huntier beta is a game-changer. It helped me practice for interviews with tailored questions based on the specific job requirements."'
                      : '"Huntier测试版中的AI面试准备功能改变了游戏规则。它帮助我根据特定的工作要求，通过量身定制的问题来练习面试。"'
                    }
                  </p>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Testimonial 3 - Right and back */}
              <div className="absolute top-8 -right-4 w-full max-w-md z-10 opacity-80 transform -translate-x-12 scale-90 rotate-[4deg]">
                <div className="bg-gradient-to-br from-white to-emerald-50/80 dark:from-gray-900 dark:to-emerald-950/50 rounded-2xl p-6 shadow-lg relative backdrop-blur-sm border border-emerald-100/60 dark:border-emerald-800/30">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-gradient-to-r from-emerald-500 to-teal-400 w-14 h-14 rounded-full flex items-center justify-center text-white text-lg font-medium shadow-md">
                      JW
                    </div>
                    <div>
                      <h4 className="font-semibold">{lang === 'en' ? 'James Wilson' : '詹姆斯·威尔逊'}</h4>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full">{lang === 'en' ? 'Beta' : '测试'}</span>
                        <p className="text-xs text-muted-foreground">{lang === 'en' ? 'Data Scientist' : '数据科学家'}</p>
                      </div>
                    </div>
                  </div>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-4">
                    {lang === 'en' 
                      ? '"As a beta tester, I\'ve been impressed with how Huntier analyzes my skills and matches them to relevant opportunities. The semantic vector matching is incredibly accurate."'
                      : '"作为测试用户，我对Huntier如何分析我的技能并将它们与相关机会匹配印象深刻。语义向量匹配非常准确。"'
                    }
                  </p>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Navigation indicators */}
            <div className="flex justify-center gap-2 mt-8">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50"></div>
              <div className="w-2 h-2 rounded-full bg-emerald-200 dark:bg-emerald-800"></div>
              <div className="w-2 h-2 rounded-full bg-emerald-200 dark:bg-emerald-800"></div>
            </div>
            
            {/* Join community CTA */}
            <div className="flex justify-center mt-12">
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full opacity-70 blur group-hover:opacity-100 transition duration-300"></div>
                <button className="relative bg-white dark:bg-gray-900 rounded-full px-8 py-3 flex items-center gap-2 font-medium text-emerald-600 dark:text-emerald-400 shadow-md">
                  {lang === 'en' ? 'Join the community' : '加入社区'}
                  <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats section - redesigned for pre-release */}
      <section className="py-16 w-full bg-gradient-to-b from-emerald-50/70 to-emerald-100/30 dark:from-emerald-950/30 dark:to-emerald-950/10">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 bg-emerald-50/80 dark:bg-emerald-900/30 border border-emerald-200/80 dark:border-emerald-800/80 rounded-full">
              <BarChart3 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">{lang === 'en' ? 'Platform Insights' : '平台洞察'}</span>
            </div>
            <h3 className="text-2xl md:text-3xl font-bold">
              {lang === 'en' 
                ? 'Our beta platform ' 
                : '我们的测试平台'}
              <span className="text-emerald-600 dark:text-emerald-400">
                {lang === 'en' ? 'by the numbers' : '数字概览'}
              </span>
            </h3>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="p-6 bg-white/80 dark:bg-gray-900/60 rounded-xl shadow-md backdrop-blur-sm border border-emerald-100 dark:border-emerald-900/50 hover:transform hover:scale-105 transition-all">
              <div className="flex justify-center mb-4">
                <div className="bg-emerald-100 dark:bg-emerald-900/50 p-3 rounded-xl">
                  <Database className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>
              <div className="text-3xl md:text-4xl font-bold text-emerald-600 dark:text-emerald-400 text-center">94%</div>
              <p className="text-muted-foreground mt-2 text-center">{lang === 'en' ? 'AI Matching Accuracy' : 'AI匹配准确率'}</p>
            </div>
            
            <div className="p-6 bg-white/80 dark:bg-gray-900/60 rounded-xl shadow-md backdrop-blur-sm border border-emerald-100 dark:border-emerald-900/50 hover:transform hover:scale-105 transition-all">
              <div className="flex justify-center mb-4">
                <div className="bg-emerald-100 dark:bg-emerald-900/50 p-3 rounded-xl">
                  <Brain className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>
              <div className="text-3xl md:text-4xl font-bold text-emerald-600 dark:text-emerald-400 text-center">5k+</div>
              <p className="text-muted-foreground mt-2 text-center">{lang === 'en' ? 'Skills Analyzed' : '分析的技能'}</p>
            </div>
            
            <div className="p-6 bg-white/80 dark:bg-gray-900/60 rounded-xl shadow-md backdrop-blur-sm border border-emerald-100 dark:border-emerald-900/50 hover:transform hover:scale-105 transition-all">
              <div className="flex justify-center mb-4">
                <div className="bg-emerald-100 dark:bg-emerald-900/50 p-3 rounded-xl">
                  <Building2 className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>
              <div className="text-3xl md:text-4xl font-bold text-emerald-600 dark:text-emerald-400 text-center">200+</div>
              <p className="text-muted-foreground mt-2 text-center">{lang === 'en' ? 'Beta Partners' : '测试合作伙伴'}</p>
            </div>
            
            <div className="p-6 bg-white/80 dark:bg-gray-900/60 rounded-xl shadow-md backdrop-blur-sm border border-emerald-100 dark:border-emerald-900/50 hover:transform hover:scale-105 transition-all">
              <div className="flex justify-center mb-4">
                <div className="bg-emerald-100 dark:bg-emerald-900/50 p-3 rounded-xl">
                  <Users className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>
              <div className="text-3xl md:text-4xl font-bold text-emerald-600 dark:text-emerald-400 text-center">1k+</div>
              <p className="text-muted-foreground mt-2 text-center">{lang === 'en' ? 'Beta Testers' : '测试用户'}</p>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <div className="inline-flex items-center p-2 rounded-full bg-emerald-100/50 dark:bg-emerald-900/30 text-sm text-emerald-700 dark:text-emerald-300">
              <span className="px-3 py-1 bg-white dark:bg-gray-800 rounded-full shadow-sm">{lang === 'en' ? 'Launch Target' : '发布目标'}</span>
              <span className="px-3">Q3 2025</span>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-24 w-full bg-gradient-to-br from-white via-emerald-50/40 to-teal-50/50 dark:from-gray-950 dark:via-emerald-950/30 dark:to-teal-950/40 relative overflow-visible">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(16,185,129,0.15)_0,transparent_70%)] dark:bg-[radial-gradient(ellipse_at_top_right,rgba(16,185,129,0.12)_0,transparent_70%)]"></div>
        
        {/* Enhanced decorative elements for visual consistency */}
        <div className="absolute top-1/4 -right-20 w-96 h-96 rounded-full bg-gradient-to-r from-emerald-400/25 to-teal-300/25 blur-[120px]"></div>
        <div className="absolute bottom-1/3 -left-20 w-96 h-96 rounded-full bg-gradient-to-r from-emerald-400/25 to-teal-300/25 blur-[120px]"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiMxMGIyODEiIGZpbGwtb3BhY2l0eT0iLjAyIiBkPSJNMzYgMzRoLTJ2LTJoMnYyem0tNCAwaDJ2LTJoMnptLTQgMGgydi0yaDB6Ii8+PC9nPjwvc3ZnPg==')] opacity-10 dark:opacity-5 pointer-events-none select-none"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 isolate">
          <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md rounded-3xl p-8 md:p-12 lg:p-16 shadow-2xl border border-emerald-100 dark:border-emerald-900/50 relative">
            {/* Glass reflection effect */}
            <div className="absolute -top-10 -left-10 right-20 h-20 bg-gradient-to-r from-white via-white to-transparent dark:from-gray-900 dark:via-gray-900 dark:to-transparent rounded-full blur-md transform rotate-12 opacity-70"></div>
            
            {/* Top accent */}
            <div className="absolute top-0 left-1/4 right-1/4 h-1 bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-600"></div>
            
            <div className="max-w-3xl mx-auto text-center relative z-10">
              <div className="mb-8">
                <div className="relative inline-block">
                  <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-emerald-500/20 to-teal-500/20 blur-lg animate-pulse"></div>
                  <Zap className="h-14 w-14 text-emerald-600 dark:text-emerald-400 mx-auto relative" />
                </div>
              </div>
              
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-800 to-gray-600 dark:from-white dark:via-gray-200 dark:to-gray-400">
                {lang === 'en' 
                  ? 'Be among the ' 
                  : '成为'} 
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-500">
                  {lang === 'en' ? 'first' : '第一批'}
                </span> 
                {lang === 'en' 
                  ? ' to experience the future of job searching' 
                  : '体验求职未来的人'}
              </h2>
              
              <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
                {lang === 'en' 
                  ? 'Join our exclusive beta program and help shape the future of Huntier\'s AI-powered job platform while gaining early access to cutting-edge career tools.'
                  : '加入我们的独家测试计划，帮助塑造Huntier AI驱动的求职平台的未来，同时提前获得尖端职业工具的访问权限。'
                }
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button size="lg" className="rounded-full bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 shadow-lg hover:shadow-xl transition-all px-12 py-7 text-lg group" asChild>
                  <Link href={`/${lang}/jobs`} className="flex items-center gap-2">
                    {lang === 'en' ? 'Join the Beta' : '加入测试'}
                    <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="rounded-full border-2 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all px-12 py-7 text-lg" asChild>
                  <Link href={`/${lang}/about`}>
                    {lang === 'en' ? 'Learn More' : '了解更多'}
                  </Link>
                </Button>
              </div>
              
              <div className="mt-12 flex items-center justify-center">
                <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-100 dark:border-emerald-800">
                  <Sparkles className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  <div className="text-sm">
                    <span className="font-medium">{lang === 'en' ? 'Limited spots available' : '名额有限'}</span> -
                    <span className="text-emerald-600 dark:text-emerald-400"> {lang === 'en' ? 'Apply now for early access' : '立即申请抢先体验'}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Bottom decorative elements */}
            <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent"></div>
          </div>
        </div>
      </section>
      </div>
    </>
  );
}
