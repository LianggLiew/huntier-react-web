import { getDictionaryAsync } from "@/lib/dictionary";
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
  Database,
  Handshake,
  GraduationCap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { AnimatedBackground } from "@/components/shared/animated-background";
import { Navbar } from "@/components/layout/navbar";
import { ProfileButton } from "@/components/home/ProfileButton";
import { HeroIllustration } from "@/components/home/HeroIllustration";
import { EnhancedPartnershipSection } from "@/components/home/EnhancedPartnershipSection";
import { TalentMapsSection } from "@/components/home/TalentMapsSection";
import { CompanyTestimonials } from "@/components/home/CompanyTestimonials";
import { CampusAmbassadorSection } from "@/components/home/CampusAmbassadorSection";

export default async function LocaleHomePage({ params }: { params: Promise<{ lang: string }> | { lang: string } }) {
  // Await the params if it's a promise
  const resolvedParams = await params;
  const lang = resolvedParams.lang;
  const dictionary = await getDictionaryAsync(lang);
  
  return (
    <>
      <Navbar lang={lang} dictionary={dictionary} />
      <div className="pt-16">
      {/* Add a prominent link to the onboarding flow */}
      {/* <div className="fixed bottom-10 right-10 z-50">
        <Link href={`/${resolvedParams.lang}/onboarding`}>
          <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all px-6 py-6 rounded-full">
            <Sparkles className="mr-2 h-5 w-5" />
            <span className="font-medium">{lang === 'en' ? 'Get Started' : '开始使用'}</span>
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </Link>
      </div> */}
      {/* Hero Section with advanced graphics */}
      <section className="relative w-full bg-gradient-to-b from-background via-background to-emerald-50/40 dark:from-background dark:via-background dark:to-emerald-950/30 py-12 lg:py-36 overflow-hidden">
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
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 lg:gap-16">
            <div className="flex-1 space-y-4 lg:space-y-8 text-center md:text-left">
              {/* Badge */}
              <div>
                <div className="inline-flex items-center gap-1 lg:gap-2 px-2 lg:px-4 py-1 lg:py-2 mb-3 lg:mb-6 bg-emerald-50/80 dark:bg-emerald-900/30 border border-emerald-200/80 dark:border-emerald-800/80 rounded-full backdrop-blur-sm shadow-sm">
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
                  </span>
                  <span className="text-xs lg:text-sm font-medium text-emerald-600 dark:text-emerald-400">
                    {lang === 'en' ? 'Exclusive Beta Access' : '独家测试版访问'}
                  </span>
                </div>
                
                {/* Headline with animation */}
                <div className="relative">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-700 to-gray-600 dark:from-white dark:via-gray-200 dark:to-gray-400 animate-gradient-x">
                    {dictionary.home.title} <br className="hidden sm:block" />
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-500 dark:from-emerald-400 dark:via-teal-300 dark:to-emerald-400 inline-flex items-center">
                      {dictionary.home.titleHighlight}
                      <Sparkles className="h-4 w-4 lg:h-8 lg:w-8 ml-1 lg:ml-2 text-emerald-500 dark:text-emerald-400 inline animate-pulse" />
                    </span> {dictionary.home.titleEnd}
                  </h1>
                  <p className="text-sm lg:text-xl md:text-2xl text-muted-foreground max-w-[650px] mx-auto md:mx-0 leading-relaxed">
                    {dictionary.home.subtitle}
                  </p>
                </div>
              </div>
              
              {/* CTA buttons with enhanced styling */}
              <div className="flex flex-col sm:flex-row gap-2 lg:gap-4 justify-center md:justify-start">
                <Button size="lg" className="rounded-full bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 hover:from-emerald-700 hover:via-emerald-600 hover:to-teal-600 shadow-lg hover:shadow-xl transition-all px-4 lg:px-8 py-3 lg:py-6 text-sm lg:text-lg group" asChild>
                  <Link href={`/${lang}/jobs`} className="flex items-center gap-2">
                    {dictionary.home.findJobsButton}
                    <ChevronRight className="h-3 w-3 lg:h-4 lg:w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                <ProfileButton lang={lang} dictionary={dictionary} />
              </div>
              
              {/* Early access community
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
              </div> */}
            </div>
            
            {/* Hero illustration with mobile optimization */}
            <HeroIllustration lang={lang} />
          </div>
        </div>
      </section>
      
      {/* Features section with enhanced graphics */}
      <section className="py-16 lg:py-32 w-full bg-gradient-to-b from-white via-white to-emerald-50/50 dark:from-gray-950 dark:via-gray-950 dark:to-emerald-950/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiMxMGIyODEiIGZpbGwtb3BhY2l0eT0iLjAyIiBkPSJNMzYgMzRoLTJ2LTJoMnYyem0tNCAwaDJ2LTJoMnptLTQgMGgydi0yaDB6Ii8+PC9nPjwvc3ZnPg==')] opacity-20 dark:opacity-10 pointer-events-none select-none"></div>
        
        {/* Background accent elements for consistency */}
        <div className="absolute top-40 left-0 w-64 h-64 rounded-full bg-gradient-to-br from-emerald-400/15 to-teal-300/10 blur-xl"></div>
        <div className="absolute bottom-40 right-0 w-80 h-80 rounded-full bg-gradient-to-br from-emerald-500/15 to-teal-400/10 blur-xl"></div>
        
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section header with animated elements */}
          <div className="text-center mb-10 lg:mb-20 relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 -top-10 w-40 h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent"></div>
            <h2 className="text-xl lg:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight mb-3 lg:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300">
              {lang === 'en' ? 'Why Choose ' : '为什么选择 '}<span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-500">Huntier</span>
            </h2>
            <p className="text-sm lg:text-xl text-muted-foreground max-w-[800px] mx-auto leading-relaxed">
              {lang === 'en' ? 'Huntier leverages the power of B (Business) + G (Government) + S (Schools) to create a robust and interconnected talent ecosystem. Here’s why choosing us for your services is the right decision:' 
              : '瀚拓充分利用 B(企业)+G(政府)+S(学校)的力量，打造一个强大且互联互通的人才生态系统。选择我们为您提供服务，是您正确的选择:'}
            </p>
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-10 w-20 h-20 bg-emerald-500/10 dark:bg-emerald-500/5 rounded-full blur-3xl"></div>
          </div>
          
          {/* Main features with enhanced styling and animations */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-8 mb-8 lg:mb-16">
            <div className="group p-4 lg:p-8 rounded-2xl bg-white/70 dark:bg-gray-900/50 hover:bg-white dark:hover:bg-gray-900/70 transition-all hover:shadow-xl relative backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="bg-gradient-to-br from-emerald-100 to-emerald-50 dark:from-emerald-900/80 dark:to-emerald-800/50 p-2 lg:p-4 rounded-xl w-fit mb-3 lg:mb-6 relative z-10 group-hover:scale-110 transition-transform duration-300 shadow-md group-hover:shadow-lg">
                <Handshake className="h-4 lg:h-8 w-4 lg:w-8 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="inline-flex items-center gap-1 lg:gap-2 px-1.5 lg:px-2 py-0.5 lg:py-1 rounded-full bg-emerald-100/70 dark:bg-emerald-900/40 text-[10px] lg:text-xs text-emerald-700 dark:text-emerald-300 mb-2 lg:mb-3">
                <span className="flex h-1.5 w-1.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-600"></span>
                </span>
                {lang === 'en' ? 'Trusted' : '值得信赖'}
              </div>
              <h3 className="text-lg lg:text-2xl font-bold mb-2 lg:mb-3 relative z-10">
                {lang === 'en' ? 'Trusted by Business Leaders' : '受企业领袖信赖'}
              </h3>
              <p className="text-xs lg:text-base text-muted-foreground relative z-10 leading-relaxed">
                {lang === 'en' ? (
                  <>Huntier is endorsed by <span className="font-medium text-emerald-600 dark:text-emerald-400">leading enterprises and well-established Chinese-Malaysian business associations,</span> reflecting the platform’s credibility and deep-rooted connections in the business community.</>
                ) : (
                  <>瀚拓获得了众多领先企业的认可，并受到知名<span className="font-medium text-emerald-600 dark:text-emerald-400">中马（中国-马来西亚）商会组织</span>的推荐，充分体现了平台在商业社群中的可信度与深厚资源网络。</>
                )}
              </p>
              <div className="absolute bottom-4 right-4 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <ChevronRight className="absolute bottom-3 lg:bottom-6 right-3 lg:right-6 h-3 lg:h-5 w-3 lg:w-5 text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            
            <div className="group p-4 lg:p-8 rounded-2xl bg-white/70 dark:bg-gray-900/50 hover:bg-white dark:hover:bg-gray-900/70 transition-all hover:shadow-xl relative backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="bg-gradient-to-br from-emerald-100 to-emerald-50 dark:from-emerald-900/80 dark:to-emerald-800/50 p-2 lg:p-4 rounded-xl w-fit mb-3 lg:mb-6 relative z-10 group-hover:scale-110 transition-transform duration-300 shadow-md group-hover:shadow-lg">
                <ShieldCheck className="h-4 lg:h-8 w-4 lg:w-8 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="inline-flex items-center gap-1 lg:gap-2 px-1.5 lg:px-2 py-0.5 lg:py-1 rounded-full bg-emerald-100/70 dark:bg-emerald-900/40 text-[10px] lg:text-xs text-emerald-700 dark:text-emerald-300 mb-2 lg:mb-3">
                <Sparkles className="h-2 lg:h-3 w-2 lg:w-3" />
                {lang === 'en' ? 'Backed' : '背书'}
              </div>
              <h3 className="text-lg lg:text-2xl font-bold mb-2 lg:mb-3 relative z-10">
                {lang === 'en' ? 'Government-Backed' : '政府支持的'}
              </h3>
              <p className="text-xs lg:text-base text-muted-foreground relative z-10 leading-relaxed">
                {lang === 'en' ? (
                  <>Through partnerships with official agencies like the <span className="font-medium text-emerald-600 dark:text-emerald-400">Malaysian Embassy in China, MIDA, MATRADE,</span> and others, we provide secure, compliant, and streamlined cross-border talent services.</>
                ) : (
                  <>瀚拓与 <span className="font-medium text-emerald-600 dark:text-emerald-400">马来西亚驻华大使馆、MIDA、MATRADE</span> 等官方机构合作，提供安全、合规且高效的跨境人才服务</>
                )}
              </p>
              <div className="absolute bottom-4 right-4 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <ChevronRight className="absolute bottom-3 lg:bottom-6 right-3 lg:right-6 h-3 lg:h-5 w-3 lg:w-5 text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            
            <div className="group p-4 lg:p-8 rounded-2xl bg-white/70 dark:bg-gray-900/50 hover:bg-white dark:hover:bg-gray-900/70 transition-all hover:shadow-xl relative backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="bg-gradient-to-br from-emerald-100 to-emerald-50 dark:from-emerald-900/80 dark:to-emerald-800/50 p-2 lg:p-4 rounded-xl w-fit mb-3 lg:mb-6 relative z-10 group-hover:scale-110 transition-transform duration-300 shadow-md group-hover:shadow-lg">
                <GraduationCap className="h-4 lg:h-8 w-4 lg:w-8 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="inline-flex items-center gap-1 lg:gap-2 px-1.5 lg:px-2 py-0.5 lg:py-1 rounded-full bg-emerald-100/70 dark:bg-emerald-900/40 text-[10px] lg:text-xs text-emerald-700 dark:text-emerald-300 mb-2 lg:mb-3">
                {lang === 'en' ? 'Ties' : '纽带'}
              </div>
              <h3 className="text-lg lg:text-2xl font-bold mb-2 lg:mb-3 relative z-10">
                {lang === 'en' ? 'Strong Campus Ties' : '全球机会网络'}
              </h3>
              <p className="text-xs lg:text-base text-muted-foreground relative z-10 leading-relaxed">
                {lang === 'en' ? (
                  <>With strong links to both Chinese and Malaysian<span className="font-medium text-emerald-600 dark:text-emerald-400"> university student unions and national youth organizations,</span> Huntier maintains a vibrant and reliable talent pipeline for the future workforce.</>
                )                  
                : 
                (
                  <>瀚拓与中马两国<span className="font-medium text-emerald-600 dark:text-emerald-400"> 高校学生会及国家级青年组织</span>保持紧密联系，持续打造充满活力且值得信赖的未来人才输送通道。</>
                )
                }
              </p>
              <div className="absolute bottom-4 right-4 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <ChevronRight className="absolute bottom-3 lg:bottom-6 right-3 lg:right-6 h-3 lg:h-5 w-3 lg:w-5 text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity" />
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
        </div>
      </section>
      
      {/* Enhanced Partnerships section */}
      <EnhancedPartnershipSection lang={lang} />
      
      {/* Talent Maps section */}
      <TalentMapsSection lang={lang} />
      
      {/* Company Testimonials Section */}
      {/* <CompanyTestimonials lang={lang} /> */}


      {/* Campus Ambassador Section */}
      <CampusAmbassadorSection lang={lang} dictionary={dictionary} />
      </div>
    </>
  );
}
