import { Building2, Users, Globe, ChevronRight } from "lucide-react";
import Image from "next/image";
import { ImageStorage } from "@/lib/img-storage";

interface CompanyTestimonialsProps {
  lang: string;
}

export function CompanyTestimonials({ lang }: CompanyTestimonialsProps) {
  return (
    <section className="py-16 lg:py-28 w-full bg-gradient-to-b from-white to-emerald-50/40 dark:from-gray-950 dark:to-emerald-950/20 relative overflow-hidden">
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
        <div className="flex flex-col items-center justify-center mb-10 lg:mb-20">
          <div className="relative">
            <div className="absolute -inset-6 rounded-full bg-gradient-to-r from-emerald-500/20 to-teal-500/20 blur-lg animate-pulse"></div>
            <div className="inline-flex items-center gap-1 lg:gap-2 px-2 lg:px-4 py-1 lg:py-2 mb-3 lg:mb-6 bg-emerald-50/80 dark:bg-emerald-900/30 border border-emerald-200/80 dark:border-emerald-800/80 rounded-full backdrop-blur-sm shadow-sm relative">
              <Building2 className="h-3 lg:h-4 w-3 lg:w-4 text-emerald-600 dark:text-emerald-400" />
              <span className="text-xs lg:text-sm font-medium text-emerald-600 dark:text-emerald-400">{lang === 'en' ? 'Trusted Partners' : '合作伙伴'}</span>
            </div>
          </div>
          <h2 className="text-xl lg:text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-3 lg:mb-6">
            {lang === 'en' ? 'Companies trust ' : '企业信赖'}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-500">
              {lang === 'en' ? 'Huntier' : 'Huntier'}
            </span>
            <br className="hidden md:block" />
            {lang === 'en' ? 'for talent solutions' : '的人才解决方案'}
          </h2>
          <p className="text-sm lg:text-xl text-center text-muted-foreground max-w-2xl">
            {lang === 'en' 
              ? 'See how leading companies are transforming their hiring process with our AI-powered platform' 
              : '了解领先企业如何通过我们的AI驱动平台改变招聘流程'}
          </p>
        </div>
        
        {/* Company Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-8 mb-8 lg:mb-16">

          {/* Manufacturing Excellence Corp */}
          <div className="group bg-gradient-to-br from-white to-emerald-50/80 dark:from-gray-900 dark:to-emerald-950/50 rounded-2xl p-4 lg:p-6 shadow-xl border border-emerald-100/80 dark:border-emerald-800/50 transform transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl relative backdrop-blur-md">
            {/* Company Header */}
            <div className="flex items-center gap-2 lg:gap-3 mb-4 lg:mb-6">
              <div className="w-8 lg:w-12 h-8 lg:h-12 rounded-lg bg-white dark:bg-gray-800 p-1 lg:p-2 shadow-md overflow-hidden">
                <Image
                  src={ImageStorage.getCompanyLogo('manufacturing-excellence-logo.png')}
                  alt="Manufacturing Excellence Logo"
                  width={32}
                  height={32}
                  className="w-full h-full object-contain"
                  unoptimized
                />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-sm lg:text-lg">Manufacturing Excellence</h3>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] lg:text-xs bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300 px-1.5 lg:px-2 py-0.5 rounded-full">Manufacturing</span>
                  <span className="text-[10px] lg:text-xs text-muted-foreground">Malaysia</span>
                </div>
              </div>
            </div>
            
            {/* Group Photo */}
            <div className="relative mb-4 lg:mb-6 rounded-xl overflow-hidden">
              <div className="h-32 lg:h-48 relative">
                <Image
                  src={ImageStorage.getCompanyPhoto('manufacturing-team.jpg')}
                  alt="Manufacturing Excellence Team"
                  fill
                  className="object-cover"
                  unoptimized
                />
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="absolute bottom-2 lg:bottom-3 left-2 lg:left-3 text-white">
                  <p className="text-xs lg:text-sm font-medium">Factory Team</p>
                  <p className="text-[10px] lg:text-xs opacity-90">200+ Employees</p>
                </div>
              </div>
              <div className="absolute top-2 lg:top-3 right-2 lg:right-3 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-full px-1.5 lg:px-2 py-0.5 lg:py-1 text-[10px] lg:text-xs font-medium text-emerald-600 dark:text-emerald-400">
                {lang === 'en' ? '3 years partner' : '合作3年'}
              </div>
            </div>
            
            {/* Testimonial */}
            <p className="text-foreground font-medium mb-4 lg:mb-6 text-xs lg:text-sm leading-relaxed">
              {lang === 'en' 
                ? '"Finding skilled technicians was our biggest challenge. Huntier\'s AI matching helped us build a world-class manufacturing team efficiently."'
                : '"寻找熟练技术员是我们最大的挑战。Huntier的AI匹配帮助我们高效地建立了世界级的制造团队。"'
              }
            </p>
            
            {/* Company Stats */}
            <div className="flex justify-between items-center mb-3 lg:mb-4 p-2 lg:p-3 bg-emerald-50/80 dark:bg-emerald-900/30 rounded-lg">
              <div className="text-center">
                <div className="text-sm lg:text-lg font-bold text-emerald-600 dark:text-emerald-400">200+</div>
                <div className="text-[10px] lg:text-xs text-muted-foreground">{lang === 'en' ? 'Team Size' : '团队规模'}</div>
              </div>
              <div className="text-center">
                <div className="text-sm lg:text-lg font-bold text-emerald-600 dark:text-emerald-400">45%</div>
                <div className="text-[10px] lg:text-xs text-muted-foreground">{lang === 'en' ? 'Cost Reduction' : '成本降低'}</div>
              </div>
              <div className="text-center">
                <div className="text-sm lg:text-lg font-bold text-emerald-600 dark:text-emerald-400">25</div>
                <div className="text-[10px] lg:text-xs text-muted-foreground">{lang === 'en' ? 'Years in Business' : '营业年数'}</div>
              </div>
            </div>
            
            {/* Representative */}
            <div className="flex items-center gap-2 lg:gap-3">
              <div className="w-8 lg:w-10 h-8 lg:h-10 rounded-full overflow-hidden">
                <Image
                  src={ImageStorage.getAvatar('robert-lee.jpg')}
                  alt="Robert Lee"
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                  unoptimized
                />
              </div>
              <div>
                <p className="font-semibold text-xs lg:text-sm">{lang === 'en' ? 'Robert Lee' : '罗伯特·李'}</p>
                <p className="text-[10px] lg:text-xs text-muted-foreground">{lang === 'en' ? 'Operations Director' : '运营总监'}</p>
              </div>
            </div>
          </div>

          {/* Trivo Manufacturing */}
          <div className="group bg-gradient-to-br from-white to-emerald-50/80 dark:from-gray-900 dark:to-emerald-950/50 rounded-2xl p-4 lg:p-6 shadow-xl border border-emerald-100/80 dark:border-emerald-800/50 transform transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl relative backdrop-blur-md">
            {/* Company Header */}
            <div className="flex items-center gap-2 lg:gap-3 mb-4 lg:mb-6">
              <div className="w-8 lg:w-12 h-8 lg:h-12 rounded-lg bg-white dark:bg-gray-800 p-1 lg:p-2 shadow-md overflow-hidden">
                <Image
                  src={ImageStorage.getCompanyLogo('trivo-electronics-logo.png')}
                  alt="Trivo Electronics Logo"
                  width={32}
                  height={32}
                  className="w-full h-full object-contain"
                  unoptimized
                />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg">Trivo Electronics Sdn. Bhd.</h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full">Manufacturing</span>
                  <span className="text-xs text-muted-foreground">China & Malaysia</span>
                </div>
              </div>
            </div>
            
            {/* Group Photo */}
            <div className="relative mb-4 lg:mb-6 rounded-xl overflow-hidden">
              <div className="h-32 lg:h-48 relative">
                <Image
                  src={ImageStorage.getCompanyPhoto('trivo-electronics-team.jpg')}
                  alt="Trivo Electronics Team"
                  fill
                  className="object-cover"
                  unoptimized
                />
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="absolute bottom-2 lg:bottom-3 left-2 lg:left-3 text-white">
                  <p className="text-sm font-medium">Team Photo</p>
                  <p className="text-xs opacity-90">52 Employees</p>
                </div>
              </div>
              <div className="absolute top-2 lg:top-3 right-2 lg:right-3 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-full px-1.5 lg:px-2 py-0.5 lg:py-1 text-[10px] lg:text-xs font-medium text-emerald-600 dark:text-emerald-400">
                {lang === 'en' ? '2 years with Huntier' : '与Huntier合作2年'}
              </div>
            </div>
            
            {/* Testimonial */}
            <p className="text-foreground font-medium mb-4 lg:mb-6 text-xs lg:text-sm leading-relaxed">
              {lang === 'en' 
                ? '"Huntier revolutionized our hiring process. We reduced time-to-hire by 60% and found exceptional talent that perfectly matches our company culture."'
                : '"Huntier彻底改变了我们的招聘流程。我们将招聘时间缩短了60%，找到了完美匹配公司文化的优秀人才。"'
              }
            </p>
            
            {/* Company Stats */}
            <div className="flex justify-between items-center mb-3 lg:mb-4 p-2 lg:p-3 bg-emerald-50/80 dark:bg-emerald-900/30 rounded-lg">
              <div className="text-center">
                <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">52</div>
                <div className="text-xs text-muted-foreground">{lang === 'en' ? 'Employees' : '员工'}</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">60%</div>
                <div className="text-xs text-muted-foreground">{lang === 'en' ? 'Time Saved' : '节省时间'}</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">4.9</div>
                <div className="text-xs text-muted-foreground">{lang === 'en' ? 'Satisfaction' : '满意度'}</div>
              </div>
            </div>
            
            {/* Representative */}
            <div className="flex items-center gap-2 lg:gap-3">
              <div className="w-8 lg:w-10 h-8 lg:h-10 rounded-full overflow-hidden">
                <Image
                  src={ImageStorage.getAvatar('sarah-kim.jpg')}
                  alt="Sarah Kim"
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                  unoptimized
                />
              </div>
              <div>
                <p className="font-semibold text-sm">{lang === 'en' ? 'Sarah Kim' : '莎拉·金'}</p>
                <p className="text-xs text-muted-foreground">{lang === 'en' ? 'Head of Talent Acquisition' : '人才招聘主管'}</p>
              </div>
            </div>
          </div>

          {/* Global Services Inc */}
          <div className="group bg-gradient-to-br from-white to-emerald-50/80 dark:from-gray-900 dark:to-emerald-950/50 rounded-2xl p-6 shadow-xl border border-emerald-100/80 dark:border-emerald-800/50 transform transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl relative backdrop-blur-md md:col-span-2 lg:col-span-1">
            {/* Company Header */}
            <div className="flex items-center gap-2 lg:gap-3 mb-4 lg:mb-6">
              <div className="w-8 lg:w-12 h-8 lg:h-12 rounded-lg bg-white dark:bg-gray-800 p-1 lg:p-2 shadow-md overflow-hidden">
                <Image
                  src={ImageStorage.getCompanyLogo('global-services-logo.png')}
                  alt="Global Services Inc Logo"
                  width={32}
                  height={32}
                  className="w-full h-full object-contain"
                  unoptimized
                />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg">Global Services Inc</h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full">Consulting</span>
                  <span className="text-xs text-muted-foreground">China</span>
                </div>
              </div>
            </div>
            
            {/* Group Photo */}
            <div className="relative mb-4 lg:mb-6 rounded-xl overflow-hidden">
              <div className="h-32 lg:h-48 relative">
                <Image
                  src={ImageStorage.getCompanyPhoto('global-services-team.jpg')}
                  alt="Global Services Inc Team"
                  fill
                  className="object-cover"
                  unoptimized
                />
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="absolute bottom-2 lg:bottom-3 left-2 lg:left-3 text-white">
                  <p className="text-sm font-medium">Global Team</p>
                  <p className="text-xs opacity-90">1000+ Employees</p>
                </div>
              </div>
              <div className="absolute top-2 lg:top-3 right-2 lg:right-3 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-full px-1.5 lg:px-2 py-0.5 lg:py-1 text-[10px] lg:text-xs font-medium text-emerald-600 dark:text-emerald-400">
                {lang === 'en' ? 'Strategic Partner' : '战略伙伴'}
              </div>
            </div>
            
            {/* Testimonial */}
            <p className="text-foreground font-medium mb-4 lg:mb-6 text-xs lg:text-sm leading-relaxed">
              {lang === 'en' 
                ? '"Huntier\'s cross-border talent solutions enabled our rapid expansion across Asia. Their platform bridges cultural and professional gaps seamlessly."'
                : '"Huntier的跨境人才解决方案使我们能够在亚洲快速扩张。他们的平台无缝地弥合了文化和专业差距。"'
              }
            </p>
            
            {/* Company Stats */}
            <div className="flex justify-between items-center mb-3 lg:mb-4 p-2 lg:p-3 bg-emerald-50/80 dark:bg-emerald-900/30 rounded-lg">
              <div className="text-center">
                <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">1000+</div>
                <div className="text-xs text-muted-foreground">{lang === 'en' ? 'Global Team' : '全球团队'}</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">12</div>
                <div className="text-xs text-muted-foreground">{lang === 'en' ? 'Countries' : '国家'}</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">300%</div>
                <div className="text-xs text-muted-foreground">{lang === 'en' ? 'Growth' : '增长'}</div>
              </div>
            </div>
            
            {/* Representative */}
            <div className="flex items-center gap-2 lg:gap-3">
              <div className="w-8 lg:w-10 h-8 lg:h-10 rounded-full overflow-hidden">
                <Image
                  src={ImageStorage.getAvatar('maria-chen.jpg')}
                  alt="Maria Chen"
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                  unoptimized
                />
              </div>
              <div>
                <p className="font-semibold text-sm">{lang === 'en' ? 'Maria Chen' : '玛丽亚·陈'}</p>
                <p className="text-xs text-muted-foreground">{lang === 'en' ? 'Chief People Officer' : '首席人事官'}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom CTA */}
        <div className="flex justify-center">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full opacity-70 blur group-hover:opacity-100 transition duration-300"></div>
            <button className="relative bg-white dark:bg-gray-900 rounded-full px-4 lg:px-8 py-2 lg:py-3 flex items-center gap-1 lg:gap-2 font-medium text-emerald-600 dark:text-emerald-400 shadow-md text-sm lg:text-base">
              {lang === 'en' ? 'Become a partner' : '成为合作伙伴'}
              <ChevronRight className="h-3 lg:h-4 w-3 lg:w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}