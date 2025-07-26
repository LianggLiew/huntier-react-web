type TranslationCache = Map<string, any>;
type PreloadQueue = Set<string>;

export class TranslationManager {
  private cache: TranslationCache = new Map();
  private preloadQueue: PreloadQueue = new Set();
  private loadingPromises: Map<string, Promise<any>> = new Map();

  /**
   * Load translations for a specific scope and language
   */
  async load(scope: string, locale: string): Promise<any> {
    const key = `${scope}-${locale}`;
    
    // Return from cache if available
    if (this.cache.has(key)) {
      return this.cache.get(key);
    }
    
    // Return existing loading promise if in progress
    if (this.loadingPromises.has(key)) {
      return this.loadingPromises.get(key);
    }
    
    // Start loading
    const loadPromise = this.loadFromFile(scope, locale, key);
    this.loadingPromises.set(key, loadPromise);
    
    try {
      const result = await loadPromise;
      this.cache.set(key, result);
      return result;
    } finally {
      this.loadingPromises.delete(key);
    }
  }

  private async loadFromFile(scope: string, locale: string, key: string): Promise<any> {
    try {
      // Determine the import path based on scope type
      let importPath: string;
      
      if (scope === 'core') {
        importPath = `@/translations/core/${locale}.json`;
      } else if (scope.startsWith('pages/')) {
        const pageName = scope.replace('pages/', '');
        importPath = `@/translations/pages/${pageName}/${locale}.json`;
      } else if (scope.startsWith('features/')) {
        const featureName = scope.replace('features/', '');
        importPath = `@/translations/features/${featureName}/${locale}.json`;
      } else {
        // Legacy support - assume it's a feature
        importPath = `@/translations/features/${scope}/${locale}.json`;
      }
      
      const translations = await import(importPath);
      return translations.default;
    } catch (error) {
      console.warn(`Failed to load translations for ${key}:`, error);
      
      // Fallback to English if locale is not found
      if (locale !== 'en') {
        try {
          return await this.load(scope, 'en');
        } catch (fallbackError) {
          console.error(`Failed to load fallback translations for ${scope}:`, fallbackError);
        }
      }
      
      return {};
    }
  }

  /**
   * Preload translations for anticipated usage
   */
  preload(scopes: string[], locale: string): void {
    scopes.forEach(scope => {
      const key = `${scope}-${locale}`;
      if (!this.cache.has(key) && !this.preloadQueue.has(key)) {
        this.preloadQueue.add(key);
        // Load asynchronously without awaiting
        this.load(scope, locale).catch(error => {
          console.warn(`Preload failed for ${key}:`, error);
          this.preloadQueue.delete(key);
        });
      }
    });
  }

  /**
   * Check if translation was loaded from cache
   */
  wasFromCache(scope: string, locale: string): boolean {
    const key = `${scope}-${locale}`;
    return this.cache.has(key) && !this.loadingPromises.has(key);
  }

  /**
   * Clear all cached translations
   */
  clearCache(): void {
    this.cache.clear();
    this.preloadQueue.clear();
    this.loadingPromises.clear();
  }

  /**
   * Get cache statistics for monitoring
   */
  getCacheStats() {
    return {
      cacheSize: this.cache.size,
      preloadQueueSize: this.preloadQueue.size,
      loadingPromises: this.loadingPromises.size,
      cachedKeys: Array.from(this.cache.keys())
    };
  }
}

// Global instance
export const translationManager = new TranslationManager();