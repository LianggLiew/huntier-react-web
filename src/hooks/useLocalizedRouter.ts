'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

type ParamsType = Promise<{ lang: string }> | { lang: string };

/**
 * Enhanced router hook that handles language-aware navigation
 * Automatically prefixes routes with the current language parameter
 */
export function useLocalizedRouter(params: ParamsType) {
  const router = useRouter();
  const [lang, setLang] = useState('en');
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize language from params
  useEffect(() => {
    const initializeLanguage = async () => {
      try {
        const resolvedParams = await params;
        setLang(resolvedParams.lang || 'en');
        setIsInitialized(true);
      } catch (error) {
        console.warn('Failed to resolve language params, using default:', error);
        setLang('en');
        setIsInitialized(true);
      }
    };
    
    initializeLanguage();
  }, [params]);

  // Language-aware push navigation
  const push = useCallback((path: string, options?: any) => {
    if (!isInitialized) {
      console.warn('Router not initialized yet, queuing navigation...');
      // Queue the navigation for when router is ready
      setTimeout(() => push(path, options), 100);
      return;
    }
    
    // Remove leading slash if present to avoid double slashes
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    const localizedPath = `/${lang}/${cleanPath}`;
    
    router.push(localizedPath, options);
  }, [router, lang, isInitialized]);

  // Language-aware replace navigation
  const replace = useCallback((path: string, options?: any) => {
    if (!isInitialized) {
      console.warn('Router not initialized yet, queuing navigation...');
      setTimeout(() => replace(path, options), 100);
      return;
    }
    
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    const localizedPath = `/${lang}/${cleanPath}`;
    
    router.replace(localizedPath, options);
  }, [router, lang, isInitialized]);

  // Language-aware prefetch
  const prefetch = useCallback((path: string) => {
    if (!isInitialized) return;
    
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    const localizedPath = `/${lang}/${cleanPath}`;
    
    router.prefetch(localizedPath);
  }, [router, lang, isInitialized]);

  // Utility to get current language
  const getCurrentLang = useCallback(() => lang, [lang]);

  // Utility to build localized path without navigating
  const buildPath = useCallback((path: string) => {
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    return `/${lang}/${cleanPath}`;
  }, [lang]);

  return {
    push,
    replace,
    prefetch,
    getCurrentLang,
    buildPath,
    lang,
    isInitialized,
    // Expose original router for advanced use cases
    originalRouter: router
  };
}