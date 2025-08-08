'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import {
  GraduationCap,
  Building2,
  Network,
  CheckCircle,
  Users,
  Globe,
  Calendar,
  TrendingUp,
  Flag,
  Shield,
  ShieldCheck,
  Handshake,
  MapPin,
  ExternalLink
} from "lucide-react";

interface PartnershipSectionProps {
  lang: string;
}

export function PartnershipSection({ lang }: PartnershipSectionProps) {
  const [universityCount, setUniversityCount] = useState(0);
  const [partnerCount, setPartnerCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  // Animated counters
  useEffect(() => {
    if (!isVisible) return;

    const universityTarget = 50;
    const partnerTarget = 200;
    const duration = 2000;
    const steps = 60;
    const universityIncrement = universityTarget / steps;
    const partnerIncrement = partnerTarget / steps;

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      setUniversityCount(Math.min(Math.floor(universityIncrement * currentStep), universityTarget));
      setPartnerCount(Math.min(Math.floor(partnerIncrement * currentStep), partnerTarget));

      if (currentStep >= steps) {
        clearInterval(timer);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [isVisible]);

  // Intersection observer for animation trigger
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    const element = document.getElementById('partnership-section');
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <section 
      id="partnership-section"
      className="py-32 w-full bg-gradient-to-b from-emerald-50/70 via-white to-emerald-50/40 dark:from-emerald-950/30 dark:via-gray-950 dark:to-emerald-950/20 relative overflow-hidden"
    >
      {/* Enhanced background elements with particles */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiMxMGIyODEiIGZpbGwtb3BhY2l0eT0iLjAzIiBkPSJNMzYgMzRoLTJ2LTJoMnYyem0tNCAwaDJ2LTJoMnptLTQgMGgydi0yaDB6Ii8+PC9nPjwvc3ZnPg==')] opacity-20 dark:opacity-10"></div>
        
        {/* Animated floating particles */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 rounded-full bg-emerald-500/40 animate-float-slow"></div>
        <div className="absolute top-3/4 right-1/4 w-3 h-3 rounded-full bg-teal-500/30 animate-float-medium"></div>
        <div className="absolute top-1/2 left-3/4 w-1.5 h-1.5 rounded-full bg-emerald-400/50 animate-float-fast"></div>
        <div className="absolute bottom-1/3 right-1/3 w-2.5 h-2.5 rounded-full bg-teal-400/40 animate-float-slow"></div>
        
        {/* Background gradient blobs */}
        <div className="absolute top-20 -left-40 w-96 h-96 bg-gradient-to-r from-emerald-200/20 to-teal-200/20 dark:from-emerald-900/10 dark:to-teal-900/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-20 -right-40 w-96 h-96 bg-gradient-to-r from-teal-200/20 to-emerald-200/20 dark:from-teal-900/10 dark:to-emerald-900/10 rounded-full blur-[120px]"></div>
      </div>
      
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section header with premium styling */}
        <div className="text-center mb-20 relative">
          <div className="absolute left-1/2 transform -translate-x-1/2 -top-16 w-40 h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent"></div>
          
          {/* Trusted Network Badge */}
          <div className="relative inline-block mb-8">
            <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-emerald-500/20 to-teal-500/20 blur-lg animate-pulse"></div>
            <div className="inline-flex items-center gap-2 px-6 py-3 mb-6 bg-emerald-50/80 dark:bg-emerald-900/30 border border-emerald-200/80 dark:border-emerald-800/80 rounded-full backdrop-blur-sm shadow-lg relative">
              <Network className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                {lang === 'en' ? 'Trusted Network' : '可信网络'}
              </span>
              <CheckCircle className="h-4 w-4 text-emerald-500" />
            </div>
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-700 to-gray-600 dark:from-white dark:via-gray-200 dark:to-gray-400">
            {lang === 'en' ? 'Huntier has ' : 'Huntier已与'}
            <br className="hidden sm:block" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-500 dark:from-emerald-400 dark:via-teal-300 dark:to-emerald-400">
              {lang === 'en' ? 'partnered with' : '合作伙伴'}
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-[900px] mx-auto leading-relaxed">
            {lang === 'en' 
              ? 'Building a robust ecosystem through strategic partnerships with leading educational institutions, government agencies, and enterprise organizations across Malaysia and China.'
              : '通过与马来西亚和中国领先的教育机构、政府机构和企业组织的战略合作，构建强大的生态系统。'
            }
          </p>
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-10 w-32 h-32 bg-emerald-500/5 dark:bg-emerald-500/3 rounded-full blur-3xl"></div>
        </div>
        
        {/* Two main partnership containers */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          
          {/* Universities Partnership Container */}
          <div className="group relative">
            {/* Glow effect on hover */}
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-teal-500 rounded-3xl opacity-0 group-hover:opacity-20 transition-opacity blur-xl"></div>
            
            <div className="relative bg-white/80 dark:bg-gray-900/60 backdrop-blur-md rounded-3xl p-8 lg:p-10 shadow-2xl border border-emerald-100/80 dark:border-emerald-800/50 hover:transform hover:scale-[1.02] transition-all duration-500 overflow-hidden">
              {/* Top decorative line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-600"></div>
              
              {/* Background pattern */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.1)_0,transparent_50%)] dark:bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.05)_0,transparent_50%)]"></div>
              
              <div className="relative z-10">
                {/* Header with icon and counter */}
                <div className="flex items-start justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="absolute -inset-2 bg-emerald-500/20 rounded-xl blur-md animate-pulse"></div>
                      <div className="relative bg-gradient-to-br from-emerald-100 to-emerald-50 dark:from-emerald-900/80 dark:to-emerald-800/50 p-4 rounded-xl shadow-lg">
                        <GraduationCap className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                      </div>
                    </div>
                    <div>
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/70 dark:bg-emerald-900/40 text-xs text-emerald-700 dark:text-emerald-300 mb-2">
                        <span className="flex h-1.5 w-1.5 relative">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-600"></span>
                        </span>
                        {lang === 'en' ? 'Academic Partners' : '学术合作伙伴'}
                      </div>
                      <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
                        {lang === 'en' ? 'Universities &' : '大学及'}
                        <br />
                        {lang === 'en' ? 'Academic Institutions' : '学术机构'}
                      </h3>
                    </div>
                  </div>
                  
                  {/* Animated Counter */}
                  <div className="text-right">
                    <div className="text-4xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-500">
                      {universityCount}+
                    </div>
                    <p className="text-sm text-muted-foreground font-medium">
                      {lang === 'en' ? 'Institutions' : '机构'}
                    </p>
                  </div>
                </div>
                
                {/* University logos grid */}
                <div className="mb-8">
                  <div className="grid grid-cols-4 gap-4 mb-6">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                      <div key={i} className="group/logo relative">
                        <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-full opacity-0 group-hover/logo:opacity-100 transition-opacity blur-sm"></div>
                        <div className="relative w-full aspect-square bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-900/30 dark:to-gray-800 rounded-full border border-emerald-100 dark:border-emerald-800/50 flex items-center justify-center shadow-md hover:shadow-lg transition-all cursor-pointer">
                          <div className="w-8 h-8 bg-emerald-500/20 dark:bg-emerald-500/30 rounded-full flex items-center justify-center">
                            <GraduationCap className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Partnership details */}
                  <div className="flex flex-wrap gap-3">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200/50 dark:border-emerald-800/50">
                      <Users className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                      <span className="text-xs font-medium text-emerald-700 dark:text-emerald-300">
                        {lang === 'en' ? 'Student Union Partnerships' : '学生会合作'}
                      </span>
                    </div>
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200/50 dark:border-emerald-800/50">
                      <Globe className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                      <span className="text-xs font-medium text-emerald-700 dark:text-emerald-300">
                        {lang === 'en' ? 'Youth Organizations' : '青年组织'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Government & Enterprise Partnership Container */}
          <div className="group relative">
            {/* Glow effect on hover */}
            <div className="absolute -inset-1 bg-gradient-to-r from-teal-600 to-blue-500 rounded-3xl opacity-0 group-hover:opacity-20 transition-opacity blur-xl"></div>
            
            <div className="relative bg-white/80 dark:bg-gray-900/60 backdrop-blur-md rounded-3xl p-8 lg:p-10 shadow-2xl border border-teal-100/80 dark:border-teal-800/50 hover:transform hover:scale-[1.02] transition-all duration-500 overflow-hidden">
              {/* Top decorative line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-600 via-blue-500 to-teal-600"></div>
              
              {/* Background pattern */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(20,184,166,0.1)_0,transparent_50%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(20,184,166,0.05)_0,transparent_50%)]"></div>
              
              <div className="relative z-10">
                {/* Header with icon and counter */}
                <div className="flex items-start justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="absolute -inset-2 bg-teal-500/20 rounded-xl blur-md animate-pulse"></div>
                      <div className="relative bg-gradient-to-br from-teal-100 to-teal-50 dark:from-teal-900/80 dark:to-teal-800/50 p-4 rounded-xl shadow-lg">
                        <div className="relative">
                          <Building2 className="h-8 w-8 text-teal-600 dark:text-teal-400" />
                          <Shield className="h-4 w-4 text-blue-600 dark:text-blue-400 absolute -top-1 -right-1" />
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100/70 dark:bg-teal-900/40 text-xs text-teal-700 dark:text-teal-300 mb-2">
                        <CheckCircle className="h-3 w-3 text-teal-600 dark:text-teal-400" />
                        {lang === 'en' ? 'Official Partners' : '官方合作伙伴'}
                      </div>
                      <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
                        {lang === 'en' ? 'Government &' : '政府及'}
                        <br />
                        {lang === 'en' ? 'Enterprise Partners' : '企业合作伙伴'}
                      </h3>
                    </div>
                  </div>
                  
                  {/* Animated Counter */}
                  <div className="text-right">
                    <div className="text-4xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-blue-500">
                      {partnerCount}+
                    </div>
                    <p className="text-sm text-muted-foreground font-medium">
                      {lang === 'en' ? 'Partners' : '合作伙伴'}
                    </p>
                  </div>
                </div>
                
                {/* Government and Enterprise sections */}
                <div className="space-y-8 mb-8">
                  
                  {/* Government Partners */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Flag className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {lang === 'en' ? 'Government Agencies' : '政府机构'}
                      </h4>
                    </div>
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      {[
                        { name: 'Embassy', icon: Flag },
                        { name: 'MIDA', icon: Building2 },
                        { name: 'MATRADE', icon: Globe }
                      ].map((agency, i) => (
                        <div key={i} className="group/agency relative">
                          <div className="absolute -inset-1 bg-gradient-to-r from-teal-500/20 to-blue-500/20 rounded-lg opacity-0 group-hover/agency:opacity-100 transition-opacity blur-sm"></div>
                          <div className="relative bg-gradient-to-br from-teal-50 to-white dark:from-teal-900/30 dark:to-gray-800 rounded-lg border border-teal-100 dark:border-teal-800/50 p-3 flex flex-col items-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer">
                            <agency.icon className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                            <span className="text-xs font-medium text-teal-700 dark:text-teal-300">{agency.name}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Enterprise Partners */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Building2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {lang === 'en' ? 'Enterprise Organizations' : '企业组织'}
                      </h4>
                    </div>
                    <div className="grid grid-cols-4 gap-3">
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                        <div key={i} className="group/corp relative">
                          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-teal-500/20 rounded-lg opacity-0 group-hover/corp:opacity-100 transition-opacity blur-sm"></div>
                          <div className="relative w-full aspect-square bg-gradient-to-br from-blue-50 to-white dark:from-blue-900/30 dark:to-gray-800 rounded-lg border border-blue-100 dark:border-blue-800/50 flex items-center justify-center shadow-md hover:shadow-lg transition-all cursor-pointer">
                            <div className="w-6 h-6 bg-blue-500/20 dark:bg-blue-500/30 rounded-md flex items-center justify-center">
                              <Building2 className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Certification badges */}
                  <div className="flex flex-wrap gap-3">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-200/50 dark:border-blue-800/50">
                      <ShieldCheck className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                      <span className="text-xs font-medium text-blue-700 dark:text-blue-300">
                        {lang === 'en' ? 'Certified Partnerships' : '认证合作伙伴关系'}
                      </span>
                    </div>
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-50 dark:bg-teal-900/30 border border-teal-200/50 dark:border-teal-800/50">
                      <Handshake className="h-3 w-3 text-teal-600 dark:text-teal-400" />
                      <span className="text-xs font-medium text-teal-700 dark:text-teal-300">
                        {lang === 'en' ? 'Strategic Alliances' : '战略联盟'}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Footer with stats
                <div className="border-t border-teal-100 dark:border-teal-800/50 pt-6">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{lang === 'en' ? 'Malaysia & China' : '马来西亚和中国'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400 font-medium">
                      <CheckCircle className="h-4 w-4" />
                      <span>{lang === 'en' ? 'Verified Partners' : '认证合作伙伴'}</span>
                    </div>
                  </div>
                </div> */}
              </div>
            </div>
          </div>
          
        </div>
        
        {/* Bottom CTA section
        <div className="text-center">
          <div className="inline-flex items-center gap-4 p-6 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/30 dark:to-teal-900/30 border border-emerald-100 dark:border-emerald-800/50 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-sm font-medium text-muted-foreground">
                {lang === 'en' ? 'Expanding our network daily' : '每日扩展我们的网络'}
              </span>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="border-emerald-200 dark:border-emerald-800 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
              asChild
            >
              <Link href={`/${lang}/partners`} className="flex items-center gap-2">
                {lang === 'en' ? 'View All Partners' : '查看所有合作伙伴'}
                <ExternalLink className="h-3 w-3" />
              </Link>
            </Button>
          </div>
        </div> */}
      </div>
    </section>
  );
}