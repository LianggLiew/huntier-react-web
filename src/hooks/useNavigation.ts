'use client';

import { useLocalizedRouter } from './useLocalizedRouter';
import { NavigationHelper, type LocalizedPageProps } from '@/lib/navigation';
import { useMemo } from 'react';

/**
 * Comprehensive navigation hook that combines localized routing with helper methods
 * This is the main hook components should use for navigation
 */
export function useNavigation(params: LocalizedPageProps['params']) {
  const localizedRouter = useLocalizedRouter(params);
  
  // Create navigation helper with current language and router
  const navigation = useMemo(() => 
    new NavigationHelper(localizedRouter.lang, localizedRouter),
    [localizedRouter.lang, localizedRouter]
  );

  return {
    // Localized router methods
    ...localizedRouter,
    
    // Pre-built navigation helpers
    navigation,
    
    // Quick access to common actions
    goToHome: navigation.goToHome,
    goToJobs: navigation.goToJobs,
    goToProfile: navigation.goToProfile,
    goToOnboarding: navigation.goToOnboarding,
    goToLogin: navigation.goToLogin,
    goToApplications: navigation.goToApplications,
    
    // Utility methods
    isReady: localizedRouter.isInitialized,
  };
}

/**
 * Simplified hook for components that only need basic navigation
 */
export function useSimpleNavigation(params: LocalizedPageProps['params']) {
  const { push, replace, lang, isInitialized } = useLocalizedRouter(params);
  
  return {
    push,
    replace,
    lang,
    isReady: isInitialized
  };
}