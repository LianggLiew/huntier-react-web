import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GraduationCap, Users, Sparkles, ChevronRight } from "lucide-react";

interface CampusAmbassadorSectionProps {
  lang: string;
  dictionary: any;
}

export function CampusAmbassadorSection({ lang, dictionary }: CampusAmbassadorSectionProps) {
  return (
    <section className="py-12 lg:py-24 w-full bg-gradient-to-br from-white via-emerald-50/40 to-teal-50/50 dark:from-gray-950 dark:via-emerald-950/30 dark:to-teal-950/40 relative overflow-visible">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(16,185,129,0.15)_0,transparent_70%)] dark:bg-[radial-gradient(ellipse_at_top_right,rgba(16,185,129,0.12)_0,transparent_70%)]"></div>
      
      {/* Enhanced decorative elements for visual consistency */}
      <div className="absolute top-1/4 -right-20 w-96 h-96 rounded-full bg-gradient-to-r from-emerald-400/25 to-teal-300/25 blur-[120px]"></div>
      <div className="absolute bottom-1/3 -left-20 w-96 h-96 rounded-full bg-gradient-to-r from-emerald-400/25 to-teal-300/25 blur-[120px]"></div>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiMxMGIyODEiIGZpbGwtb3BhY2l0eT0iLjAyIiBkPSJNMzYgMzRoLTJ2LTJoMnYyem0tNCAwaDJ2LTJoMnptLTQgMGgydi0yaDB6Ii8+PC9nPjwvc3ZnPg==')] opacity-10 dark:opacity-5 pointer-events-none select-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 isolate">
        <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md rounded-3xl p-4 lg:p-8 md:p-12 lg:p-16 shadow-2xl border border-emerald-100 dark:border-emerald-900/50 relative">
          {/* Glass reflection effect */}
          <div className="absolute -top-10 -left-10 right-20 h-20 bg-gradient-to-r from-white via-white to-transparent dark:from-gray-900 dark:via-gray-900 dark:to-transparent rounded-full blur-md transform rotate-12 opacity-70"></div>
          
          {/* Top accent */}
          <div className="absolute top-0 left-1/4 right-1/4 h-1 bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-600"></div>
          
          <div className="max-w-3xl mx-auto text-center relative z-10">
            <div className="mb-4 lg:mb-8">
              <div className="relative inline-block">
                <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-emerald-500/20 to-teal-500/20 blur-lg animate-pulse"></div>
                <div className="relative flex items-center justify-center">
                  <GraduationCap className="h-8 lg:h-14 w-8 lg:w-14 text-emerald-600 dark:text-emerald-400 mx-auto relative" />
                  <Users className="h-4 lg:h-8 w-4 lg:w-8 text-teal-500 dark:text-teal-400 absolute -top-1 lg:-top-2 -right-1 lg:-right-2 bg-white dark:bg-gray-900 rounded-full p-0.5 lg:p-1" />
                </div>
              </div>
            </div>
            
            <h2 className="text-xl lg:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 lg:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-800 to-gray-600 dark:from-white dark:via-gray-200 dark:to-gray-400">
              {dictionary.home.ambassador.title}{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-500">
                {dictionary.home.ambassador.titleHighlight}
              </span>
            </h2>
            
            <p className="text-sm lg:text-xl text-muted-foreground mb-6 lg:mb-10 leading-relaxed">
              {dictionary.home.ambassador.subtitle}
            </p>
            
            <div className="flex justify-center">
              <Button size="lg" className="rounded-full bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 shadow-lg hover:shadow-xl transition-all px-6 lg:px-12 py-3 lg:py-7 text-sm lg:text-lg group">
                <Link href={`/${lang}/campus-ambassador`} className="flex items-center gap-2">
                  <Sparkles className="h-4 lg:h-5 w-4 lg:w-5 text-white" />
                  <span className="font-medium text-white">{dictionary.home.ambassador.becomeAmbassadorButton}</span>
                  <ChevronRight className="h-4 lg:h-5 w-4 lg:w-5 text-white transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </div>
          
          {/* Bottom decorative elements */}
          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent"></div>
        </div>
      </div>
    </section>
  );
}