// Translation loader functions for page-based i18n system

interface TranslationCache {
  [key: string]: any;
}

const translationCache: TranslationCache = {};

// Map page routes to their translation paths
const pageTranslationMap: Record<string, string> = {
  'home': 'pages/home',
  'jobs': 'pages/jobs', 
  'resources': 'pages/resources',
  'onboarding': 'pages/onboarding',
  'profile': 'features/profile',
  'verify-otp': 'features/auth',
  'auth': 'features/auth',
  'about': 'pages/about' // Add if about page translations exist
};

// Load core translations (navbar, footer, navigation, language toggle)
export const loadCoreTranslations = async (locale: string): Promise<any> => {
  const cacheKey = `core-${locale}`;
  
  if (translationCache[cacheKey]) {
    return translationCache[cacheKey];
  }

  try {
    const translations = await import(`./core/${locale}.json`);
    translationCache[cacheKey] = translations.default;
    return translations.default;
  } catch (error) {
    console.warn(`Failed to load core translations for ${locale}, falling back to en`);
    if (locale !== 'en') {
      return loadCoreTranslations('en');
    }
    // Return minimal fallback
    return {
      navbar: { findJobs: "Find Jobs", companies: "Companies", resources: "Resources", about: "About", myProfile: "My Profile" },
      footer: { termsOfService: "Terms of Service", privacy: "Privacy", cookies: "Cookies", copyright: "© {year} Huntier Inc. All rights reserved." },
      languageToggle: { english: "English", chinese: "中文 (Chinese)" },
      navigation: { home: "Home", jobs: "Jobs", resume: "Resume", interviews: "Interviews", points: "Points", profile: "Profile" }
    };
  }
};

// Load page-specific translations
export const loadPageTranslations = async (page: string, locale: string): Promise<any> => {
  const translationPath = pageTranslationMap[page];
  if (!translationPath) {
    console.warn(`No translation path found for page: ${page}`);
    return {};
  }

  const cacheKey = `${page}-${locale}`;
  
  if (translationCache[cacheKey]) {
    return translationCache[cacheKey];
  }

  try {
    const translations = await import(`./${translationPath}/${locale}.json`);
    translationCache[cacheKey] = translations.default;
    return translations.default;
  } catch (error) {
    console.warn(`Failed to load ${page} translations for ${locale}, falling back to en`);
    if (locale !== 'en') {
      return loadPageTranslations(page, 'en');
    }
    // Return empty object for missing translations
    return {};
  }
};

// Get dictionary for a specific page (Option A: Hybrid approach)
export const getPageDictionary = async (page: string, locale: string): Promise<any> => {
  const [core, pageSpecific] = await Promise.all([
    loadCoreTranslations(locale),
    loadPageTranslations(page, locale)
  ]);

  // Handle special cases where page translations should be nested
  if (page === 'profile') {
    return {
      ...core,
      profile: pageSpecific
    };
  } else if (page === 'verify-otp' || page === 'auth') {
    return {
      ...core,
      verifyOtp: pageSpecific
    };
  } else if (page === 'resources') {
    return {
      ...core, 
      resources: pageSpecific
    };
  } else if (page === 'jobs') {
    return {
      ...core,
      jobs: pageSpecific
    };
  } else if (page === 'home') {
    return {
      ...core,
      home: pageSpecific
    };
  } else if (page === 'onboarding') {
    return {
      ...core,
      onboarding: pageSpecific
    };
  }

  // Default: merge at root level
  return {
    ...core,
    ...pageSpecific
  };
};

// Load all translations (for backward compatibility)
export const loadAllTranslations = async (locale: string): Promise<any> => {
  const [core, home, jobs, resources, onboarding, profile, auth] = await Promise.all([
    loadCoreTranslations(locale),
    loadPageTranslations('home', locale),
    loadPageTranslations('jobs', locale), 
    loadPageTranslations('resources', locale),
    loadPageTranslations('onboarding', locale),
    loadPageTranslations('profile', locale),
    loadPageTranslations('auth', locale)
  ]);

  return {
    ...core,
    home,
    jobs,
    resources,
    onboarding,
    profile,
    verifyOtp: auth
  };
};