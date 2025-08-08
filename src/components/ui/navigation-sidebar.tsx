'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  Compass, 
  FileText, 
  MessageSquare, 
  Trophy, 
  User,
  Menu,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { getDictionary } from '@/lib/dictionary';
import { ComingSoonModal } from '@/components/ui/coming-soon-modal';
import { AuthFloatingCard } from '@/components/ui/auth-floating-card';
import { useAuth } from '@/hooks/useAuth';

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href?: string;
  isActive?: boolean;
  isComingSoon?: boolean;
}

interface NavigationSidebarProps {
  children?: React.ReactNode;
  params?: { lang: string };
  isMobileMenuOpen?: boolean;
  onToggleMobileMenu?: () => void;
}

const NavigationSidebar = ({ children, params, isMobileMenuOpen = false, onToggleMobileMenu }: NavigationSidebarProps) => {
  const pathname = usePathname();
  const { user, profile, isAuthenticated, logout, login } = useAuth();
  const [isComingSoonModalOpen, setIsComingSoonModalOpen] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState('');
  const [isAuthCardOpen, setIsAuthCardOpen] = useState(false);
  
  // Extract language from pathname (default to 'en')
  const currentLang = pathname.startsWith('/zh') ? 'zh' : 'en';
  const dictionary = getDictionary(currentLang);
  
  const navigationItems: NavigationItem[] = [
    {
      id: 'profile',
      label: dictionary?.navigation?.profile || 'Profile',
      icon: User,
      href: isAuthenticated ? `/${currentLang}/profile` : `/${currentLang}/verify-otp`,
      isActive: pathname.includes('/profile')
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
      isComingSoon: true,
      isActive: false
    },
    {
      id: 'interviews',
      label: dictionary?.navigation?.interviews || 'Interviews',
      icon: MessageSquare,
      isComingSoon: true,
      isActive: false
    },
    {
      id: 'points',
      label: dictionary?.navigation?.points || 'Points',
      icon: Trophy,
      isComingSoon: true,
      isActive: false
    }
  ];


  const handleComingSoonClick = (featureName: string) => {
    setSelectedFeature(featureName);
    setIsComingSoonModalOpen(true);
  };

  const handleAuthClick = () => {
    setIsAuthCardOpen(true);
  };

  const handleLogin = async (email: string, password: string) => {
    // Use the login function from auth context
    if (login) {
      await login(email, password);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-[75] bg-black/50" onClick={onToggleMobileMenu} />
      )}

      {/* Navigation Sidebar */}
      <div className={cn(
        "w-20 bg-gray-900 border-r border-gray-800 flex flex-col fixed top-0 left-0 h-screen z-[80] transition-transform duration-300",
        "lg:translate-x-0", // Always visible on desktop
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full" // Slide in/out on mobile
      )}>
        {/* Company Logo / Auth Button */}
        <div className="flex items-center justify-center py-6">
          <button
            onClick={handleAuthClick}
            className={cn(
              "w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-200 relative group",
              isAuthenticated 
                ? "bg-emerald-600 hover:bg-emerald-700" 
                : "bg-gray-600 hover:bg-gray-500"
            )}
            title={isAuthenticated ? 'Click to logout' : 'Click to login'}
          >
            {isAuthenticated ? (
              <span className="text-white font-bold text-lg">
                {(profile?.firstName && profile.firstName.charAt(0)) || (user?.email && user.email.charAt(0)) || 'U'}
              </span>
            ) : (
              <span className="text-whit    e font-bold text-lg">H</span>
            )}
            {/* Status indicator */}
            <div className={cn(
              "absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-gray-900",
              isAuthenticated ? "bg-green-500" : "bg-gray-400"
            )} />
          </button>
        </div>
        
        {/* Navigation Items */}
        <div className="flex-1 flex flex-col items-center space-y-6">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            
            if (item.isComingSoon) {
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    handleComingSoonClick(item.label);
                    if (onToggleMobileMenu) onToggleMobileMenu();
                  }}
                  className={cn(
                    "flex flex-col items-center justify-center w-16 h-16 rounded-lg transition-all duration-200 group",
                    "text-gray-400 hover:text-white hover:bg-gray-800 relative"
                  )}
                >
                  <Icon className="h-6 w-6 mb-1" />
                  <span className="text-xs font-medium">{item.label}</span>
                </button>
              );
            }
            
            return (
              <Link
                key={item.id}
                href={item.href!}
                className={cn(
                  "flex flex-col items-center justify-center w-16 h-16 rounded-lg transition-all duration-200 group",
                  "text-gray-400 hover:text-white hover:bg-gray-800",
                  item.isActive && "bg-gray-800 text-white"
                )}
                onClick={() => {
                  if (onToggleMobileMenu) onToggleMobileMenu();
                }}
              >
                <Icon className="h-6 w-6 mb-1" />
                <span className="text-xs font-medium">{item.label}</span> 
              </Link>
            );
          })}
        </div>

      </div>
      
      {/* Main Content */}
      <div className="flex-1 lg:ml-20">
        {children}
      </div>
      
      {/* Coming Soon Modal */}
      <ComingSoonModal
        isOpen={isComingSoonModalOpen}
        onClose={() => setIsComingSoonModalOpen(false)}
        featureName={selectedFeature}
        dictionary={dictionary}
      />
      
      {/* Auth Floating Card */}
      <AuthFloatingCard
        isOpen={isAuthCardOpen}
        onClose={() => setIsAuthCardOpen(false)}
        isAuthenticated={isAuthenticated}
        user={user}
        onLogin={handleLogin}
        onLogout={logout}
        dictionary={dictionary}
      />
    </div>
  );
};

export { NavigationSidebar };