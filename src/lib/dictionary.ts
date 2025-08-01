// Page-based translation dictionary system with backward compatibility
import { loadAllTranslations, loadCoreTranslations } from '../translations';

// Cache for loaded translations
let translationCache: Record<string, any> = {};

// Load all translations using the new page-based system
const loadTranslations = async (locale: string): Promise<any> => {
  if (translationCache[locale]) {
    return translationCache[locale];
  }

  try {
    // Always ensure core translations are loaded first
    const coreKey = `core-${locale}`;
    if (!translationCache[coreKey]) {
      const coreTranslations = await loadCoreTranslations(locale);
      translationCache[coreKey] = coreTranslations;
    }

    // Then load full translations
    const translations = await loadAllTranslations(locale);
    translationCache[locale] = translations;
    return translations;
  } catch (error) {
    console.warn(`Failed to load translations for ${locale}, using core fallback`);
    try {
      const coreTranslations = await loadCoreTranslations(locale);
      return coreTranslations;
    } catch (coreError) {
      console.error(`Failed to load core translations for ${locale}:`, coreError);
      return {};
    }
  }
};

// Synchronous version for immediate use (returns cached or starts loading)
export const getDictionary = (locale: string) => {
  // If we have cached translations, return them
  if (translationCache[locale]) {
    return translationCache[locale];
  }

  // Start loading translations in background for next time
  loadTranslations(locale).then(translations => {
    translationCache[locale] = translations;
  }).catch(error => {
    console.warn(`Failed to load translations for ${locale}:`, error);
  });

  // Return empty object for immediate use - component should handle loading state
  return {};
};

// Async version for components that can wait for full translations
export const getDictionaryAsync = async (locale: string) => {
  return await loadTranslations(locale);
};

// Get core translations immediately (for components like navbar/footer)
export const getCoreTranslations = async (locale: string) => {
  const coreKey = `core-${locale}`;
  if (translationCache[coreKey]) {
    return translationCache[coreKey];
  }
  
  try {
    const coreTranslations = await loadCoreTranslations(locale);
    translationCache[coreKey] = coreTranslations;
    return coreTranslations;
  } catch (error) {
    console.error(`Failed to load core translations for ${locale}:`, error);
    return {};
  }
};
