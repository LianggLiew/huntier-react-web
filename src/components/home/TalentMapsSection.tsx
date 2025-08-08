'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import {
  Globe,
  MapPin,
  Users,
  TrendingUp,
  Building2,
  Star,
  ChevronRight,
  Zap,
  Award,
  Target,
  BarChart3,
  Activity,
  ArrowRight,
  Filter
} from "lucide-react";

interface TalentMapsSectionProps {
  lang: string;
}

// City data for interactive markers
const chinaCities = [
  { name: 'Beijing', nameZh: '北京', x: 65, y: 45, talents: 1600, tier: 1 },
  { name: 'Shanghai', nameZh: '上海', x: 71, y: 62, talents: 1400, tier: 1 },
  { name: 'Guangdong', nameZh: '广东', x: 60.5, y: 80, talents: 500, tier: 1 },
  { name: 'Jiangsu', nameZh: '江苏', x: 68, y: 57.5, talents: 500, tier: 2 },
  { name: 'Fujian', nameZh: '福建', x: 67, y: 72, talents: 500, tier: 2 },
  { name: 'Shaanxi', nameZh: '陕西', x: 55, y: 52.5, talents: 400, tier: 2 },
  { name: 'Heilongjiang', nameZh: '黑龙江', x: 80.7, y: 30, talents: 200, tier: 2 },
  { name: 'Sichuan', nameZh: '四川', x: 47, y: 64, talents: 350, tier: 2 },
  { name: 'Hunan', nameZh: '湖南', x: 58, y: 69, talents: 80, tier: 3 },
  { name: 'Hunbei', nameZh: '湖北', x: 59, y: 63.5, talents: 200, tier: 2 },
  { name: 'Henan', nameZh: '河南', x: 60, y: 57, talents: 200, tier: 2 },
  { name: 'Shandong', nameZh: '山东', x: 66.5, y: 53, talents: 200, tier: 2 }
];

const malaysiaCities = [
  { name: 'Kuala Lumpur', nameZh: '吉隆坡', x: 17, y: 59, talents: 1500, growth: 20, state: 'Federal Territory' },
  { name: 'Selangor', nameZh: '雪兰莪', x: 16, y: 55, talents: 1200, growth: 25, state: 'Selangor' },
  { name: 'Penang', nameZh: '槟城', x: 8, y: 37.5, talents: 800, growth: 18, state: 'Penang' },
  { name: 'Johor', nameZh: '柔佛', x: 32, y: 68, talents: 900, growth: 22, state: 'Johor' },
  { name: 'Sabah', nameZh: '沙巴', x: 85, y: 44.5, talents: 600, growth: 35, state: 'Sabah' },
  { name: 'Sarawak', nameZh: '砂拉越', x: 68, y: 64, talents: 700, growth: 28, state: 'Sarawak' }
];

export function TalentMapsSection({ lang }: TalentMapsSectionProps) {
  const [totalTalents, setTotalTalents] = useState(0);
  const [chinaTalents, setChinaTalents] = useState(0);
  const [malaysiaTalents, setMalaysiaTalents] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [activeCity, setActiveCity] = useState<any>(null);
  const [selectedCountry, setSelectedCountry] = useState<'china' | 'malaysia' | null>(null);

  // Calculate totals
  const chinaTotalTalents = chinaCities.reduce((sum, city) => sum + city.talents, 0);
  const malaysiaTotalTalents = malaysiaCities.reduce((sum, city) => sum + city.talents, 0);
  const grandTotal = chinaTotalTalents + malaysiaTotalTalents;

  // Animated counters
  useEffect(() => {
    if (!isVisible) return;

    const duration = 2500;
    const steps = 100;
    const chinaIncrement = chinaTotalTalents / steps;
    const malaysiaIncrement = malaysiaTotalTalents / steps;
    const totalIncrement = grandTotal / steps;

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      setChinaTalents(Math.min(Math.floor(chinaIncrement * currentStep), chinaTotalTalents));
      setMalaysiaTalents(Math.min(Math.floor(malaysiaIncrement * currentStep), malaysiaTotalTalents));
      setTotalTalents(Math.min(Math.floor(totalIncrement * currentStep), grandTotal));

      if (currentStep >= steps) {
        clearInterval(timer);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [isVisible, chinaTotalTalents, malaysiaTotalTalents, grandTotal]);

  // Intersection observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    const element = document.getElementById('talent-maps-section');
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <section 
      id="talent-maps-section"
      className="py-16 lg:py-36 w-full bg-gradient-to-b from-gray-950 via-gray-900 to-emerald-950/20 relative overflow-hidden"
    >
      {/* Enhanced dark background with animated elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Animated grid pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMTBiMjgxIiBzdHJva2Utd2lkdGg9IjAuNSIgb3BhY2l0eT0iMC4xIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20"></div>
        
        {/* Floating particles */}
        <div className="absolute top-1/4 left-1/6 w-1 h-1 bg-emerald-400/60 rounded-full animate-float-slow"></div>
        <div className="absolute top-1/3 right-1/4 w-1.5 h-1.5 bg-red-400/50 rounded-full animate-float-medium"></div>
        <div className="absolute bottom-1/3 left-1/3 w-1 h-1 bg-blue-400/60 rounded-full animate-float-fast"></div>
        <div className="absolute bottom-1/4 right-1/6 w-2 h-2 bg-teal-400/40 rounded-full animate-float-slow"></div>
        
        {/* Geographic connection lines */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/2 left-1/4 w-96 h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent transform rotate-12"></div>
          <div className="absolute top-1/3 right-1/4 w-80 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent transform -rotate-12"></div>
        </div>
        
        {/* Radial gradients */}
        <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-radial from-emerald-900/20 via-emerald-900/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-radial from-blue-900/20 via-blue-900/10 to-transparent rounded-full blur-3xl"></div>
      </div>
      
      <div className="container max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section header */}
        <div className="text-center mb-10 lg:mb-20 relative">
          <div className="absolute left-1/2 transform -translate-x-1/2 -top-20 w-60 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent"></div>
          
          {/* Global Talent Network Badge */}
        
          <h2 className="text-xl lg:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-4 lg:mb-8 text-white">
            {lang === 'en' ? 'Huntier ' : 'Huntier '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-blue-400 to-red-400">
              {lang === 'en' ? 'Talent Reserve' : '人才储备'}
            </span>
            <br/>
            <span className="text-sm lg:text-3xl md:text-4xl lg:text-5xl text-gray-300 font-medium">
              {lang === 'en' ? 'Across China & Malaysia' : '遍布中国和马来西亚'}
            </span>
          </h2>
          
          <p className="text-sm lg:text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-6 lg:mb-12">
            {lang === 'en' 
              ? 'Discover our extensive talent network spanning major cities and economic hubs across two dynamic markets, connecting skilled professionals with global opportunities.'
              : '探索我们广泛的人才网络，覆盖两个充满活力的市场的主要城市和经济中心，将技能专业人士与全球机会连接起来。'
            }
          </p>
          
          {/* Quick Stats Bar */}
          <div className="flex flex-wrap justify-center gap-8 lg:gap-20 mb-8 lg:mb-16">
            <div className="text-center">
              <div className="text-2xl lg:text-4xl md:text-5xl font-bold text-emerald-400 mb-1 lg:mb-2">
                {totalTalents.toLocaleString()}+
              </div>
              <p className="text-xs lg:text-base text-gray-400 font-medium">
                {lang === 'en' ? 'Total Talents' : '总人才数'}
              </p>
            </div>
            <div className="text-center">
              <div className="text-2xl lg:text-4xl md:text-5xl font-bold text-blue-400 mb-1 lg:mb-2">
                {chinaCities.length + malaysiaCities.length}+
              </div>
              <p className="text-xs lg:text-base text-gray-400 font-medium">
                {lang === 'en' ? 'Active Cities' : '活跃城市'}
              </p>
            </div>
          </div>
        </div>
        
        {/* Maps Container */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-16 mb-10 lg:mb-20">
          
          {/* China Map Container */}
          <div className={`group relative transition-all duration-700 ${selectedCountry === 'china' ? 'xl:col-span-2 scale-105' : selectedCountry === 'malaysia' ? 'opacity-30 scale-95' : ''}`}>
            {/* Glow effect */}
            <div className="absolute -inset-4 bg-gradient-to-r from-red-500/20 via-orange-500/20 to-red-500/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity blur-2xl"></div>
            
            <div className="relative bg-gray-900/60 backdrop-blur-xl rounded-3xl p-3 lg:p-4 sm:p-6 lg:p-8 xl:p-12 shadow-2xl border border-red-500/20 hover:border-red-500/40 transition-all duration-500 overflow-hidden">
              {/* Top decorative line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 via-orange-500 to-red-600"></div>
              
              {/* Background pattern */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(239,68,68,0.1)_0,transparent_50%)]"></div>
              
              <div className="relative z-10">
                {/* Header */}
                <div className="flex items-center justify-between mb-4 lg:mb-8">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="absolute -inset-3 bg-red-500/30 rounded-xl blur-lg animate-pulse"></div>
                      <div className="relative bg-gradient-to-br from-red-100 to-red-50 dark:from-red-900/80 dark:to-red-800/50 p-4 rounded-xl shadow-lg">
                        <MapPin className="h-8 w-8 text-red-600 dark:text-red-400" />
                      </div>
                    </div>
                    <div>
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100/10 border border-red-500/30 text-xs text-red-400 mb-2">
                        <TrendingUp className="h-3 w-3" />
                        {lang === 'en' ? 'Top Tier Talents' : '高端技术人才'}
                      </div>
                      <h3 className="text-sm lg:text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-1 lg:mb-2">
                        {lang === 'en' ? 'China Coverage' : '中国覆盖图'}
                      </h3>
                      <p className="text-gray-300">
                        {lang === 'en' ? 'Major economic hubs & tech centers' : '主要经济中心和科技枢纽'}
                      </p>
                    </div>
                  </div>
                  
                  {/* China Counter */}
                  <div className="text-right">
                    <div className="text-xl lg:text-4xl lg:text-5xl font-bold text-red-400 mb-1 lg:mb-2">
                      {chinaTalents.toLocaleString()}+
                    </div>
                    <p className="text-xs lg:text-base text-gray-400 font-medium">
                      {lang === 'en' ? 'Talents' : '人才'}
                    </p>
                  </div>
                </div>
                
                {/* China Map with Interactive Markers */}
                <div className="relative mb-4 lg:mb-8 group/map">
                  <div className="relative w-full aspect-[5/4] sm:aspect-[4/3] lg:aspect-[3/2] min-h-[280px] max-h-[480px] rounded-2xl overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 border border-red-500/20">
                    <Image
                      src="/china-map.png"
                      alt="China Map"
                      fill
                      className="object-contain opacity-80 group-hover/map:opacity-100 transition-opacity duration-500"
                      priority
                    />
                    
                    {/* Interactive City Markers */}
                    {chinaCities.map((city, index) => (
                      <div
                        key={city.name}
                        className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group/marker"
                        style={{ left: `${city.x}%`, top: `${city.y}%` }}
                        onMouseEnter={() => setActiveCity(city)}
                        onMouseLeave={() => setActiveCity(null)}
                        onClick={() => setSelectedCountry(selectedCountry === 'china' ? null : 'china')}
                      >
                        {/* Marker Pulse Effect */}
                        <div className={`absolute inset-0 rounded-full animate-ping ${
                          city.tier === 1 ? 'bg-red-400/60' : 'bg-orange-400/60'
                        }`} style={{ 
                          width: `${Math.max(12, city.talents / 300)}px`, 
                          height: `${Math.max(12, city.talents / 300)}px`,
                          animationDelay: `${index * 200}ms`
                        }}></div>
                        
                        {/* Main Marker */}
                        <div 
                          className={`relative rounded-full border-2 border-white shadow-lg group-hover/marker:scale-125 transition-all duration-300 ${
                            city.tier === 1 
                              ? 'bg-gradient-to-r from-red-500 to-red-600' 
                              : 'bg-gradient-to-r from-orange-500 to-orange-600'
                          } flex items-center justify-center text-white font-bold text-xs`}
                          style={{ 
                            width: `${Math.max(20, city.talents / 250)}px`, 
                            height: `${Math.max(20, city.talents / 250)}px` 
                          }}
                        >
                          {city.tier === 1 ? '★' : '●'}
                        </div>
                        
                        {/* Tooltip */}
                        {activeCity?.name === city.name && (
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-4 py-3 bg-gray-900/95 backdrop-blur-sm rounded-lg border border-red-500/30 shadow-xl min-w-48 z-50">
                            <h4 className="font-bold text-white mb-1">
                              {lang === 'en' ? city.name : city.nameZh}
                            </h4>
                            <div className="space-y-1 text-sm">
                              <div className="flex justify-between text-gray-300">
                                <span>{lang === 'en' ? 'Talents:' : '人才:'}</span>
                                <span className="text-red-400 font-semibold">{city.talents.toLocaleString()}</span>
                              </div>
                              {/* <div className="flex justify-between text-gray-300">
                                <span>{lang === 'en' ? 'Growth:' : '增长:'}</span>
                                <span className="text-green-400 font-semibold">+{city.growth}%</span>
                              </div> */}
                              <div className="flex justify-between text-gray-300">
                                <span>{lang === 'en' ? 'Tier:' : '级别:'}</span>
                                <span className="text-yellow-400 font-semibold">
                                  {lang === 'en' ? `Tier ${city.tier}` : `${city.tier}线城市`}
                                </span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* China Stats Footer */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
                  <div className="text-center p-4 bg-red-500/10 rounded-xl border border-red-500/20">
                    <div className="text-2xl font-bold text-red-400 mb-1">4</div>
                    <p className="text-xs text-gray-400">{lang === 'en' ? 'Tier 1 Cities' : '一线城市'}</p>
                  </div>
                  <div className="text-center p-4 bg-orange-500/10 rounded-xl border border-orange-500/20">
                    <div className="text-2xl font-bold text-orange-400 mb-1">9</div>
                    <p className="text-xs text-gray-400">{lang === 'en' ? 'Tier 2 Cities' : '二线城市'}</p>
                  </div>
                  <div className="text-center p-4 bg-green-500/10 rounded-xl border border-green-500/20">
                    <div className="text-2xl font-bold text-green-400 mb-1">80%</div>
                    <p className="text-xs text-gray-400">{lang === 'en' ? 'Bachelor Degree' : '学士学位'}</p>
                  </div>
                  <div className="text-center p-4 bg-blue-500/10 rounded-xl border border-blue-500/20">
                    <div className="text-2xl font-bold text-blue-400 mb-1">17%</div>
                    <p className="text-xs text-gray-400">{lang === 'en' ? 'Master Degree' : '硕士学位'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Malaysia Map Container */}
          <div className={`group relative transition-all duration-700 ${selectedCountry === 'malaysia' ? 'xl:col-span-2 scale-105' : selectedCountry === 'china' ? 'opacity-30 scale-95' : ''}`}>
            {/* Glow effect */}
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 via-teal-500/20 to-blue-500/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity blur-2xl"></div>
            
            <div className="relative bg-gray-900/60 backdrop-blur-xl rounded-3xl p-4 sm:p-6 lg:p-8 xl:p-12 shadow-2xl border border-blue-500/20 hover:border-blue-500/40 transition-all duration-500 overflow-hidden">
              {/* Top decorative line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-teal-500 to-blue-600"></div>
              
              {/* Background pattern */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.1)_0,transparent_50%)]"></div>
              
              <div className="relative z-10">
                {/* Header */}
                <div className="flex items-center justify-between mb-4 lg:mb-8">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="absolute -inset-3 bg-blue-500/30 rounded-xl blur-lg animate-pulse"></div>
                      <div className="relative bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/80 dark:to-blue-800/50 p-4 rounded-xl shadow-lg">
                        <Building2 className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                      </div>
                    </div>
                    <div>
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/10 border border-blue-500/30 text-xs text-blue-400 mb-2">
                        <Star className="h-3 w-3" />
                        {lang === 'en' ? 'Skilled & Linguistic Talents' : '语言天赋人才'}
                      </div>
                      <h3 className="text-sm lg:text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-1 lg:mb-2">
                        {lang === 'en' ? 'Malaysia Coverage' : '马来西亚覆盖图'}
                      </h3>
                      <p className="text-gray-300">
                        {lang === 'en' ? 'Strategic locations & business hubs' : '战略位置和商业中心'}
                      </p>
                    </div>
                  </div>
                  
                  {/* Malaysia Counter */}
                  <div className="text-right">
                    <div className="text-xl lg:text-4xl lg:text-5xl font-bold text-blue-400 mb-1 lg:mb-2">
                      {malaysiaTalents.toLocaleString()}+
                    </div>
                    <p className="text-xs lg:text-base text-gray-400 font-medium">
                      {lang === 'en' ? 'Talents' : '人才'}
                    </p>
                  </div>
                </div>
                
                {/* Malaysia Map with Interactive Markers */}
                <div className="relative mb-4 lg:mb-8 group/map">
                  <div className="relative w-full aspect-[5/4] sm:aspect-[4/3] lg:aspect-[3/2] min-h-[280px] max-h-[480px] rounded-2xl overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 border border-blue-500/20">
                    <Image
                      src="/malaysia-map.png"
                      alt="Malaysia Map"
                      fill
                      className="object-contain opacity-80 group-hover/map:opacity-100 transition-opacity duration-500"
                      priority
                    />
                    
                    {/* Interactive City Markers */}
                    {malaysiaCities.map((city, index) => (
                      <div
                        key={city.name}
                        className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group/marker"
                        style={{ left: `${city.x}%`, top: `${city.y}%` }}
                        onMouseEnter={() => setActiveCity(city)}
                        onMouseLeave={() => setActiveCity(null)}
                        onClick={() => setSelectedCountry(selectedCountry === 'malaysia' ? null : 'malaysia')}
                      >
                        {/* Marker Pulse Effect */}
                        <div className="absolute inset-0 rounded-full animate-ping bg-blue-400/60" style={{ 
                          width: `${Math.max(16, city.talents / 150)}px`, 
                          height: `${Math.max(16, city.talents / 150)}px`,
                          animationDelay: `${index * 250}ms`
                        }}></div>
                        
                        {/* Main Marker */}
                        <div 
                          className="relative rounded-full border-2 border-white shadow-lg group-hover/marker:scale-125 transition-all duration-300 bg-gradient-to-r from-blue-500 to-teal-500 flex items-center justify-center text-white font-bold text-xs"
                          style={{ 
                            width: `${Math.max(20, city.talents / 120)}px`, 
                            height: `${Math.max(20, city.talents / 120)}px` 
                          }}
                        >
                          ◆
                        </div>
                        
                        {/* Tooltip */}
                        {activeCity?.name === city.name && (
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-4 py-3 bg-gray-900/95 backdrop-blur-sm rounded-lg border border-blue-500/30 shadow-xl min-w-48 z-50">
                            <h4 className="font-bold text-white mb-1">{city.name}</h4>
                            <div className="space-y-1 text-sm">
                              <div className="flex justify-between text-gray-300">
                                <span>{lang === 'en' ? 'Talents:' : '人才:'}</span>
                                <span className="text-blue-400 font-semibold">{city.talents.toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between text-gray-300">
                                <span>{lang === 'en' ? 'Growth:' : '增长:'}</span>
                                <span className="text-green-400 font-semibold">+{city.growth}%</span>
                              </div>
                              <div className="flex justify-between text-gray-300">
                                <span>{lang === 'en' ? 'State:' : '州:'}</span>
                                <span className="text-teal-400 font-semibold text-xs">{city.state}</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Malaysia Stats Footer */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
                  <div className="text-center p-4 bg-blue-500/10 rounded-xl border border-blue-500/20">
                    <div className="text-2xl font-bold text-blue-400 mb-1">6</div>
                    <p className="text-xs text-gray-400">{lang === 'en' ? 'Key States' : '重点州属'}</p>
                  </div>
                  <div className="text-center p-4 bg-teal-500/10 rounded-xl border border-teal-500/20">
                    <div className="text-2xl font-bold text-teal-400 mb-1">3</div>
                    <p className="text-xs text-gray-400">{lang === 'en' ? 'Economic Zones' : '经济特区'}</p>
                  </div>
                  <div className="text-center p-4 bg-green-500/10 rounded-xl border border-green-500/20">
                    <div className="text-2xl font-bold text-green-400 mb-1">45%</div>
                    <p className="text-xs text-gray-400">{lang === 'en' ? 'HASS Percentage' : '文商科占比'}</p>
                  </div>
                  <div className="text-center p-4 bg-purple-500/10 rounded-xl border border-purple-500/20">
                    <div className="text-2xl font-bold text-purple-400 mb-1">55%</div>
                    <p className="text-xs text-gray-400">{lang === 'en' ? 'STEM Percentage' : '理工科占比'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}