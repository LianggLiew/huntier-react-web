import { GraduationCap, MapPin, Award } from "lucide-react";
import Image from "next/image";
import { ImageStorage } from "@/lib/img-storage";
import { useEffect, useState } from "react";

interface University {
  id: string;
  name: string;
  nameZh: string;
  logo: string;
  country: string;
  ranking: string;
}

interface UniversityCoverageProps {
  lang: string;
}

// Mapping function to convert filename to university data
function fileNameToUniversityData(filename: string): University | null {
  const universityMap: Record<string, University> = {
    'university-malaya-logo.png': {
      id: 'university-malaya',
      name: 'University of Malaya',
      nameZh: '马来亚大学',
      logo: filename,
      country: 'Malaysia',
      ranking: '#70 Global'
    },
    'peking-university-logo.png': {
      id: 'peking-university', 
      name: 'Peking University',
      nameZh: '北京大学',
      logo: filename,
      country: 'China',
      ranking: '#12 Global'
    },
    'tsinghua-university-logo.png': {
      id: 'tsinghua-university',
      name: 'Tsinghua University', 
      nameZh: '清华大学',
      logo: filename,
      country: 'China',
      ranking: '#25 Global'
    },
    'usm-logo.png': {
      id: 'usm',
      name: 'Universiti Sains Malaysia',
      nameZh: '马来西亚理科大学', 
      logo: filename,
      country: 'Malaysia',
      ranking: '#143 Global'
    },
    'fudan-university-logo.png': {
      id: 'fudan-university',
      name: 'Fudan University',
      nameZh: '复旦大学',
      logo: filename, 
      country: 'China',
      ranking: '#44 Global'
    },
    'utm-logo.png': {
      id: 'utm',
      name: 'Universiti Teknologi Malaysia',
      nameZh: '马来西亚理工大学',
      logo: filename,
      country: 'Malaysia', 
      ranking: '#203 Global'
    }
  };

  return universityMap[filename] || null;
}

export function UniversityCoverage({ lang }: UniversityCoverageProps) {
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadUniversitiesFromBucket() {
      try {
        setLoading(true);
        const files = await ImageStorage.listFiles('university-logos');
        
        // Filter for image files and map to university data
        const universityData = files
          .filter(file => file.name.match(/\.(png|jpg|jpeg|svg)$/i))
          .map(file => fileNameToUniversityData(file.name))
          .filter(Boolean) as University[];
        
        setUniversities(universityData);
        setError(null);
      } catch (err) {
        console.error('Error loading universities from bucket:', err);
        setError('Failed to load university logos');
        
        // Fallback to empty array or could use fallback data
        setUniversities([]);
      } finally {
        setLoading(false);
      }
    }

    loadUniversitiesFromBucket();
  }, []);

  return (
    <section className="py-28 w-full bg-gradient-to-b from-emerald-50/40 to-white dark:from-emerald-950/20 dark:to-gray-950 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiMxMGIyODEiIGZpbGwtb3BhY2l0eT0iLjAyIiBkPSJNMzYgMzRoLTJ2LTJoMnYyem0tNCAwaDJ2LTJoMnptLTQgMGgydi0yaDB6Ci8+PC9nPjwvc3ZnPg==')] opacity-20 dark:opacity-10"></div>
        <div className="absolute left-0 bottom-1/4 w-96 h-96 bg-gradient-to-b from-emerald-200/20 to-transparent dark:from-emerald-900/15 dark:to-transparent rounded-full blur-[120px]"></div>
        <div className="absolute right-0 top-1/4 w-96 h-96 bg-gradient-to-b from-teal-200/20 to-transparent dark:from-teal-900/15 dark:to-transparent rounded-full blur-[120px]"></div>
      </div>
      
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="relative">
            <div className="absolute -inset-6 rounded-full bg-gradient-to-r from-emerald-500/20 to-teal-500/20 blur-lg animate-pulse"></div>
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 bg-emerald-50/80 dark:bg-emerald-900/30 border border-emerald-200/80 dark:border-emerald-800/80 rounded-full backdrop-blur-sm shadow-sm relative">
              <GraduationCap className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                {lang === 'en' ? 'University Network' : '大学网络'}
              </span>
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-6">
            {lang === 'en' ? 'Connecting ' : '连接'}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-500">
              {lang === 'en' ? 'top universities' : '顶尖大学'}
            </span>
            <br className="hidden md:block" />
            {lang === 'en' ? 'across Asia' : '遍布亚洲'}
          </h2>
          <p className="text-xl text-center text-muted-foreground max-w-2xl mx-auto">
            {lang === 'en' 
              ? 'Partnered with leading universities in China and Malaysia to create a bridge for exceptional talent' 
              : '与中国和马来西亚的顶尖大学合作，为优秀人才搭建桥梁'}
          </p>
        </div>

        {/* University Grid */}
        <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-6 mb-16">
          {universities.map((university) => (
            <div
              key={university.id}
              className="group bg-white/80 dark:bg-gray-900/50 rounded-2xl p-3 lg:p-6 border border-emerald-100/60 dark:border-emerald-800/30 hover:border-emerald-200 dark:hover:border-emerald-700 transition-all duration-300 hover:shadow-lg backdrop-blur-sm"
            >
              {/* University Logo */}
              <div className="w-10 h-10 lg:w-16 lg:h-16 mx-auto mb-2 lg:mb-4 bg-white dark:bg-gray-800 rounded-xl p-2 lg:p-3 shadow-sm group-hover:shadow-md transition-shadow">
                <Image
                  src={ImageStorage.getUniversityLogo(university.logo)}
                  alt={`${university.name} Logo`}
                  width={40}
                  height={40}
                  className="w-full h-full object-contain"
                  unoptimized
                />
              </div>
              
              {/* University Info */}
              <div className="text-center">
                <h3 className="font-bold text-xs lg:text-sm mb-1">
                  {lang === 'en' ? university.name : university.nameZh}
                </h3>
                
                {/* Country */}
                <div className="flex items-center justify-center gap-0.5 lg:gap-1 mb-1 lg:mb-2">
                  <MapPin className="h-2 w-2 lg:h-3 lg:w-3 text-muted-foreground" />
                  <span className="text-[10px] lg:text-xs text-muted-foreground">{university.country}</span>
                </div>
                
                {/* Ranking */}
                <div className="flex items-center justify-center gap-0.5 lg:gap-1">
                  <Award className="h-2 w-2 lg:h-3 lg:w-3 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-[10px] lg:text-xs font-medium text-emerald-600 dark:text-emerald-400">
                    {university.ranking}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Coverage Stats */}
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/30 dark:to-teal-900/30 rounded-2xl p-8 border border-emerald-100 dark:border-emerald-900/50">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">100+</div>
              <div className="text-sm text-muted-foreground">
                {lang === 'en' ? 'Partner Universities' : '合作大学'}
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">50K+</div>
              <div className="text-sm text-muted-foreground">
                {lang === 'en' ? 'Student Network' : '学生网络'}
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">2</div>
              <div className="text-sm text-muted-foreground">
                {lang === 'en' ? 'Countries' : '国家'}
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">85%</div>
              <div className="text-sm text-muted-foreground">
                {lang === 'en' ? 'Placement Rate' : '就业率'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}