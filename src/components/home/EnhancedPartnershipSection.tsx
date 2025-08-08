'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  GraduationCap,
  Building2,
  Globe,
  ChevronLeft,
  ChevronRight,
  Sparkles
} from "lucide-react";

interface EnhancedPartnershipSectionProps {
  lang: string;
}

// University logos from static assets in /public/uni-logos folder
const universityLogos = [
  { id: 1, name: 'Peking University', logo: '/uni-logos/pku-logo.png' },
  { id: 2, name: 'Shanghai Jiao Tong University', logo: '/uni-logos/sjtu-logo.png' },
  { id: 3, name: 'Zhejiang University', logo: '/uni-logos/zju-logo.png' },
  { id: 4, name: 'Fudan University', logo: '/uni-logos/fdu-logo.png' },
  { id: 5, name: 'Wuhan University', logo: '/uni-logos/whu-logo.png' },
  { id: 6, name: 'Sichuan University', logo: '/uni-logos/scu-logo.png' },
  { id: 7, name: 'Xiamen University', logo: '/uni-logos/xmu-logo.png' },
  { id: 8, name: 'Nankai University', logo: '/uni-logos/nku-logo.png' },
  { id: 9, name: 'Tianjin University', logo: '/uni-logos/tju-logo.png' },
  { id: 10, name: 'Xi\'an Jiaotong University', logo: '/uni-logos/xjtu-logo.png' },
  { id: 11, name: 'Dalian University of Technology', logo: '/uni-logos/dzkju-logo.png' },
  { id: 12, name: 'Fuzhou University', logo: '/uni-logos/fzu-logo.png' },
  { id: 13, name: 'Guangzhou University', logo: '/uni-logos/gzu-logo.png' },
  { id: 14, name: 'Hebei Polytechnic University', logo: '/uni-logos/hbpu-logo.png' },
  { id: 15, name: 'Nanchang University', logo: '/uni-logos/ncu-logo.png' },
  { id: 16, name: 'Northwestern Polytechnical University', logo: '/uni-logos/npu-logo.png' },
  { id: 17, name: 'Qinghai University', logo: '/uni-logos/qhu-logo.png' },
  { id: 18, name: 'Renmin University of China', logo: '/uni-logos/rmuc-logo.png' },
  { id: 19, name: 'Tianjin University', logo: '/uni-logos/tianjin-logo.png' },
  { id: 20, name: 'Zhongshan University', logo: '/uni-logos/zsu-logo.png' },
];

export function EnhancedPartnershipSection({ lang }: EnhancedPartnershipSectionProps) {
  const [universityCount, setUniversityCount] = useState(0);
  const [govCorpCount, setGovCorpCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('right');

  // Target numbers
  const universityTarget = 50;
  const govCorpTarget = 200;
  const totalTarget = universityTarget + govCorpTarget;

  // Animated counters
  useEffect(() => {
    if (!isVisible) return;

    const duration = 2000;
    const steps = 60;
    const universityIncrement = universityTarget / steps;
    const govCorpIncrement = govCorpTarget / steps;
    const totalIncrement = totalTarget / steps;

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      setUniversityCount(Math.min(Math.floor(universityIncrement * currentStep), universityTarget));
      setGovCorpCount(Math.min(Math.floor(govCorpIncrement * currentStep), govCorpTarget));
      setTotalCount(Math.min(Math.floor(totalIncrement * currentStep), totalTarget));

      if (currentStep >= steps) {
        clearInterval(timer);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [isVisible, universityTarget, govCorpTarget, totalTarget]);

  // Carousel auto-rotation
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setSlideDirection('right');
      setCurrentIndex((prev) => (prev + 3) % universityLogos.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);


  // Intersection observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    const element = document.getElementById('enhanced-partnership-section');
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  const handlePrevious = () => {
    setSlideDirection('left');
    setCurrentIndex((prev) => (prev - 3 + universityLogos.length) % universityLogos.length);
  };

  const handleNext = () => {
    setSlideDirection('right');
    setCurrentIndex((prev) => (prev + 3) % universityLogos.length);
  };

  // Get visible logos (3 for mobile, 5 for desktop)
  const getVisibleLogos = () => {
    // Use window width to determine visible count, default to 5 for SSR
    const visibleCount = typeof window !== 'undefined' && window.innerWidth < 1024 ? 3 : 5;
    const logos = [];
    for (let i = 0; i < visibleCount; i++) {
      const index = (currentIndex + i) % universityLogos.length;
      logos.push(universityLogos[index]);
    }
    return logos;
  };

  return (
    <section 
      id="enhanced-partnership-section"
      className="py-16 lg:py-32 w-full bg-gradient-to-b from-emerald-50/70 via-white to-emerald-50/40 dark:from-emerald-950/30 dark:via-gray-950 dark:to-emerald-950/20 relative overflow-hidden"
    >
      {/* Background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiMxMGIyODEiIGZpbGwtb3BhY2l0eT0iLjAzIiBkPSJNMzYgMzRoLTJ2LTJoMnYyem0tNCAwaDJ2LTJoMnptLTQgMGgydi0yaDB6Ii8+PC9nPjwvc3ZnPg==')] opacity-20 dark:opacity-10"></div>
        <div className="absolute top-20 -left-40 w-96 h-96 bg-gradient-to-r from-emerald-200/20 to-teal-200/20 dark:from-emerald-900/10 dark:to-teal-900/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-20 -right-40 w-96 h-96 bg-gradient-to-r from-teal-200/20 to-emerald-200/20 dark:from-teal-900/10 dark:to-emerald-900/10 rounded-full blur-[120px]"></div>
        
        {/* Floating particles */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 rounded-full bg-emerald-500/40 animate-float-slow"></div>
        <div className="absolute top-3/4 right-1/4 w-3 h-3 rounded-full bg-teal-500/30 animate-float-medium"></div>
        <div className="absolute top-1/2 left-3/4 w-1.5 h-1.5 rounded-full bg-emerald-400/50 animate-float-fast"></div>
      </div>
      
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section header */}
        <div className="text-center mb-10 lg:mb-20 relative">
          <div className="absolute left-1/2 transform -translate-x-1/2 -top-16 w-40 h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent"></div>      
          <h2 className="text-xl lg:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-3 lg:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-700 to-gray-600 dark:from-white dark:via-gray-200 dark:to-gray-400">
            {lang === 'en' ? 'Huntier ' : 'Huntier '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-500 dark:from-emerald-400 dark:via-teal-300 dark:to-emerald-400">
              {lang === 'en' ? 'University Coverage' : '大学覆盖范围'}
            </span>
          </h2>
          <p className="text-sm lg:text-xl text-muted-foreground max-w-[900px] mx-auto leading-relaxed">
            {lang === 'en' 
              ? 'Showcasing our extensive university network and educational coverage across leading institutions in Malaysia and China.'
              : '展示我们在马来西亚和中国领先院校的广泛大学网络和教育覆盖范围。'
            }
          </p>
        </div>
        
        {/* Top Section: Partnership Statistics */}
        <div className="mb-10 lg:mb-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-8 max-w-4xl mx-auto">
            
            {/* Universities Card */}
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-teal-500 rounded-3xl opacity-0 group-hover:opacity-20 transition-opacity blur-xl"></div>
              <div className="relative bg-white/80 dark:bg-gray-900/60 backdrop-blur-md rounded-3xl p-4 lg:p-8 shadow-2xl border border-emerald-100/80 dark:border-emerald-800/50 hover:transform hover:scale-[1.02] transition-all duration-500 text-center">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-600"></div>
                
                <div className="relative mb-3 lg:mb-6">
                  <div className="absolute -inset-3 bg-emerald-500/20 rounded-xl blur-lg animate-pulse"></div>
                  <div className="relative bg-gradient-to-br from-emerald-100 to-emerald-50 dark:from-emerald-900/80 dark:to-emerald-800/50 p-2 lg:p-4 rounded-xl shadow-lg mx-auto w-fit">
                    <GraduationCap className="h-4 lg:h-8 w-4 lg:w-8 text-emerald-600 dark:text-emerald-400" />
                  </div>
                </div>
                
                <div className="text-2xl lg:text-5xl font-bold text-emerald-600 dark:text-emerald-400 mb-1 lg:mb-2">
                  {universityCount}+
                </div>
                <h3 className="text-sm lg:text-xl font-bold text-gray-900 dark:text-white mb-1 lg:mb-2">
                  {lang === 'en' ? 'Universities' : '大学'}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-xs lg:text-sm mb-2 lg:mb-4">
                  {lang === 'en' ? 'Academic & Educational Institutions' : '学术及教育机构'}
                </p>               
              </div>
            </div>
            
            {/* Government & Enterprise Card */}
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-teal-600 to-blue-500 rounded-3xl opacity-0 group-hover:opacity-20 transition-opacity blur-xl"></div>
              <div className="relative bg-white/80 dark:bg-gray-900/60 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-teal-100/80 dark:border-teal-800/50 hover:transform hover:scale-[1.02] transition-all duration-500 text-center">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-600 via-blue-500 to-teal-600"></div>
                
                <div className="relative mb-3 lg:mb-6">
                  <div className="absolute -inset-3 bg-teal-500/20 rounded-xl blur-lg animate-pulse"></div>
                  <div className="relative bg-gradient-to-br from-teal-100 to-teal-50 dark:from-teal-900/80 dark:to-teal-800/50 p-2 lg:p-4 rounded-xl shadow-lg mx-auto w-fit">
                    <Building2 className="h-4 lg:h-8 w-4 lg:w-8 text-teal-600 dark:text-teal-400" />
                  </div>
                </div>
                
                <div className="text-2xl lg:text-5xl font-bold text-teal-600 dark:text-teal-400 mb-1 lg:mb-2">
                  {govCorpCount}+
                </div>
                <h3 className="text-sm lg:text-xl font-bold text-gray-900 dark:text-white mb-1 lg:mb-2">
                  {lang === 'en' ? 'Government & Enterprise' : '政府及企业'}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-xs lg:text-sm mb-2 lg:mb-4">
                  {lang === 'en' ? 'Official Partners & Organizations' : '官方合作伙伴及组织'}
                </p>
              </div>
            </div>
            
            {/* Total Partners Card */}
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 via-teal-500 to-blue-500 rounded-3xl opacity-0 group-hover:opacity-20 transition-opacity blur-xl"></div>
              <div className="relative bg-white/80 dark:bg-gray-900/60 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-800/50 dark:to-teal-800/50 hover:transform hover:scale-[1.02] transition-all duration-500 text-center">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-600 via-teal-500 to-blue-500"></div>
                
                <div className="relative mb-3 lg:mb-6">
                  <div className="absolute -inset-3 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-xl blur-lg animate-pulse"></div>
                  <div className="relative bg-gradient-to-br from-emerald-100 via-teal-50 to-blue-50 dark:from-emerald-900/80 dark:via-teal-900/50 dark:to-blue-900/50 p-2 lg:p-4 rounded-xl shadow-lg mx-auto w-fit">
                    <Globe className="h-4 lg:h-8 w-4 lg:w-8 text-emerald-600 dark:text-emerald-400" />
                  </div>
                </div>
                
                <div className="text-2xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 via-teal-500 to-blue-500 mb-1 lg:mb-2">
                  {totalCount}+
                </div>
                <h3 className="text-sm lg:text-xl font-bold text-gray-900 dark:text-white mb-1 lg:mb-2">
                  {lang === 'en' ? 'Total Partners' : '合作伙伴总数'}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-xs lg:text-sm mb-2 lg:mb-4">
                  {lang === 'en' ? 'Combined Partnership Network' : '综合合作伙伴网络'}
                </p>
              </div>
            </div>
            
          </div>
        </div>
        
        {/* Bottom Section: University Logos Carousel */}
        <div className="relative">
          <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-3xl blur-xl"></div>
          <div 
            className="relative bg-white/80 dark:bg-gray-900/60 backdrop-blur-md rounded-3xl p-4 lg:p-12 shadow-2xl border border-emerald-100/80 dark:border-emerald-800/50"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-600"></div>
            
            {/* Header */}
            <div className="text-center mb-6 lg:mb-12">
              <div className="inline-flex items-center gap-1 lg:gap-2 px-3 lg:px-6 py-1.5 lg:py-3 rounded-full bg-emerald-100/70 dark:bg-emerald-900/40 text-xs lg:text-sm text-emerald-700 dark:text-emerald-300 mb-3 lg:mb-6">
                <GraduationCap className="h-3 lg:h-5 w-3 lg:w-5" />
                {lang === 'en' ? 'University Coverage' : '所覆盖高校名单'}
              </div>
              <h3 className="text-lg lg:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2 lg:mb-4">
                {lang === 'en' ? 'Academic Excellence Network' : '学术卓越网络'}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm lg:text-lg">
                {lang === 'en' ? 'Partnering with leading universities and educational institutions across Asia-Pacific region' : '与亚太地区领先的大学和教育机构合作'}
              </p>
            </div>
            
            {/* University Logos Carousel */}
            <div className="relative overflow-hidden">
              <div className="flex justify-center mb-4 lg:mb-8">
                <div 
                  className={`grid grid-cols-3 md:grid-cols-3 lg:grid-cols-5 gap-2 lg:gap-8 transition-all duration-700 ease-in-out transform ${
                    slideDirection === 'right' ? 'animate-slideInRight' : 'animate-slideInLeft'
                  }`}
                  key={currentIndex} // Force re-render for animation
                >
                  {getVisibleLogos().map((university, index) => (
                    <div 
                      key={`${university.id}-${currentIndex}`} 
                      className="group relative opacity-0 animate-fadeInStagger"
                      style={{ 
                        animationDelay: `${index * 80}ms`,
                        animationDuration: '500ms',
                        animationFillMode: 'forwards'
                      }}
                    >
                      <div className="flex items-center justify-center p-3 lg:p-6 group-hover:scale-110 transition-all duration-300">
                        <Image
                          src={university.logo}
                          alt={university.name}
                          width={80}
                          height={80}
                          className="object-contain transition-all duration-300 group-hover:scale-110"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Navigation Controls */}
              <div className="flex flex-col items-center gap-4">
                <div className="flex items-center justify-center gap-4">
                  {/* Left Arrow */}
                  <button
                    onClick={handlePrevious}
                    className="p-2 lg:p-3 rounded-full bg-emerald-100 dark:bg-emerald-900/30 hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-all hover:scale-110 shadow-md"
                    aria-label="Previous universities"
                  >
                    <ChevronLeft className="h-3 lg:h-5 w-3 lg:w-5 text-emerald-600 dark:text-emerald-400" />
                  </button>
                  
                  {/* Dot Indicators - between arrows */}
                  <div className="flex gap-2 px-4">
                    {universityLogos.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          index === currentIndex
                            ? 'bg-emerald-500 w-8'
                            : 'bg-emerald-200 dark:bg-emerald-800 hover:bg-emerald-300'
                        }`}
                        aria-label={`Go to university ${index + 1}`}
                      />
                    ))}
                  </div>
                  
                  {/* Right Arrow */}
                  <button
                    onClick={handleNext}
                    className="p-2 lg:p-3 rounded-full bg-emerald-100 dark:bg-emerald-900/30 hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-all hover:scale-110 shadow-md"
                    aria-label="Next universities"
                  >
                    <ChevronRight className="h-3 lg:h-5 w-3 lg:w-5 text-emerald-600 dark:text-emerald-400" />
                  </button>
                </div>  
              </div>
            </div>          
          </div>
        </div>
        
        
      </div>
    </section>
  );
}