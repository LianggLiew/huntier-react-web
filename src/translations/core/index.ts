export type CoreTranslations = {
  navbar: {
    findJobs: string;
    companies: string;
    resources: string;
    about: string;
    myProfile: string;
  };
  footer: {
    termsOfService: string;
    privacy: string;
    cookies: string;
    copyright: string;
  };
  languageToggle: {
    english: string;
    chinese: string;
  };
  navigation: {
    home: string;
    jobs: string;
    resume: string;
    interviews: string;
    points: string;
    profile: string;
  };
};

export const loadCoreTranslations = async (locale: string): Promise<CoreTranslations> => {
  try {
    const translations = await import(`./${locale}.json`);
    return translations.default;
  } catch (error) {
    console.warn(`Failed to load core translations for ${locale}, falling back to en`);
    const fallback = await import('./en.json');
    return fallback.default;
  }
};