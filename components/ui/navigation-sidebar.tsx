'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  Compass, 
  FileText, 
  Home, 
  MessageSquare, 
  Trophy, 
  User 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { getDictionary } from '@/lib/dictionary';

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  isActive?: boolean;
}

interface NavigationSidebarProps {
  children?: React.ReactNode;
}

const NavigationSidebar = ({ children }: NavigationSidebarProps) => {
  const pathname = usePathname();
  
  // Extract language from pathname (default to 'en')
  const currentLang = pathname.startsWith('/zh') ? 'zh' : 'en';
  const dictionary = getDictionary(currentLang);
  
  const navigationItems: NavigationItem[] = [
    {
      id: 'home',
      label: dictionary?.navigation?.home || 'Home',
      icon: Home,
      href: `/${currentLang}`,
      isActive: pathname === `/${currentLang}`
    },
    {
      id: 'jobs',
      label: dictionary?.navigation?.jobs || 'Jobs',
      icon: Compass,
      href: `/${currentLang}/jobs`,
      isActive: pathname.includes('/jobs')
    },
    {
      id: 'resume',
      label: dictionary?.navigation?.resume || 'Resume',
      icon: FileText,
      href: `/${currentLang}/resume`,
      isActive: pathname.includes('/resume')
    },
    {
      id: 'interviews',
      label: dictionary?.navigation?.interviews || 'Interviews',
      icon: MessageSquare,
      href: `/${currentLang}/interviews`,
      isActive: pathname.includes('/interviews')
    },
    {
      id: 'points',
      label: dictionary?.navigation?.points || 'Points',
      icon: Trophy,
      href: `/${currentLang}/points`,
      isActive: pathname.includes('/points')
    }
  ];

  const profileItem: NavigationItem = {
    id: 'profile',
    label: dictionary?.navigation?.profile || 'Profile',
    icon: User,
    href: `/${currentLang}/profile`,
    isActive: pathname.includes('/profile')
  };

  return (
    <div className="flex min-h-screen">
      {/* Navigation Sidebar */}
      <div className="w-20 bg-gray-900 border-r border-gray-800 flex flex-col fixed top-0 left-0 h-screen z-[70]">
        {/* Company Logo */}
        <div className="flex items-center justify-center py-6">
          <div className="w-12 h-12 bg-emerald-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">H</span>
          </div>
        </div>
        
        {/* Navigation Items */}
        <div className="flex-1 flex flex-col items-center space-y-6">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.id}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center w-16 h-16 rounded-lg transition-all duration-200 group",
                  "text-gray-400 hover:text-white hover:bg-gray-800",
                  item.isActive && "bg-gray-800 text-white"
                )}
              >
                <Icon className="h-6 w-6 mb-1" />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Profile Item at Bottom */}
        <div className="mt-auto flex flex-col items-center pb-6">
          <Link
            href={profileItem.href}
            className={cn(
              "flex flex-col items-center justify-center w-16 h-16 rounded-lg transition-all duration-200 group",
              "text-gray-400 hover:text-white hover:bg-gray-800",
              profileItem.isActive && "bg-gray-800 text-white"
            )}
          >
            <User className="h-6 w-6 mb-1" />
            <span className="text-xs font-medium">{profileItem.label}</span>
          </Link>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 ml-20">
        {children}
      </div>
    </div>
  );
};

export { NavigationSidebar };