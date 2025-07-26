'use client';

import { useState, useEffect } from 'react';
import { translationManager } from '@/lib/translation-manager';

export interface TranslationState {
  translations: Record<string, any>;
  loading: boolean;
  error: string | null;
}

/**
 * Hook for loading multiple translation scopes
 */
export function useTranslations(scopes: string[], locale: string): TranslationState {
  const [state, setState] = useState<TranslationState>({
    translations: {},
    loading: true,
    error: null
  });

  useEffect(() => {
    let isMounted = true;

    const loadTranslations = async () => {
      try {
        setState(prev => ({ ...prev, loading: true, error: null }));

        const promises = scopes.map(scope => 
          translationManager.load(scope, locale)
            .then(translations => ({ scope, translations }))
        );

        const results = await Promise.all(promises);
        
        if (!isMounted) return;

        const mergedTranslations = results.reduce((acc, { scope, translations }) => ({
          ...acc,
          [scope]: translations
        }), {});

        setState({
          translations: mergedTranslations,
          loading: false,
          error: null
        });
      } catch (error) {
        if (!isMounted) return;
        
        setState(prev => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : 'Translation loading failed'
        }));
      }
    };

    loadTranslations();

    return () => {
      isMounted = false;
    };
  }, [scopes.join(','), locale]);

  return state;
}

/**
 * Hook for progressive translation loading with core-first approach
 */
export function useProgressiveTranslations(
  featureScopes: string[], 
  locale: string
): TranslationState & { coreReady: boolean } {
  const [coreTranslations, setCoreTranslations] = useState<any>(null);
  const [featureTranslations, setFeatureTranslations] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load core translations immediately
  useEffect(() => {
    let isMounted = true;

    translationManager.load('core', locale)
      .then(core => {
        if (isMounted) {
          setCoreTranslations(core);
          setLoading(false);
        }
      })
      .catch(err => {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Core translation loading failed');
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [locale]);

  // Load feature translations progressively
  useEffect(() => {
    if (!coreTranslations) return;

    let isMounted = true;

    const loadFeatures = async () => {
      for (const scope of featureScopes) {
        try {
          const translations = await translationManager.load(scope, locale);
          if (isMounted) {
            setFeatureTranslations(prev => ({
              ...prev,
              [scope]: translations
            }));
          }
        } catch (err) {
          console.warn(`Failed to load feature translations for ${scope}:`, err);
        }
      }
    };

    loadFeatures();

    return () => {
      isMounted = false;
    };
  }, [featureScopes.join(','), locale, coreTranslations]);

  return {
    translations: {
      core: coreTranslations,
      ...featureTranslations
    },
    loading,
    error,
    coreReady: !!coreTranslations
  };
}

/**
 * Hook for single scope translation loading
 */
export function useTranslation(scope: string, locale: string) {
  const result = useTranslations([scope], locale);
  
  return {
    translation: result.translations[scope] || {},
    loading: result.loading,
    error: result.error
  };
}