/**
 * Navigation utilities for language-aware routing
 * Provides common navigation patterns and route builders
 */

// Common route patterns
export const ROUTES = {
  HOME: '',
  JOBS: 'jobs',
  PROFILE: 'profile', 
  ONBOARDING: 'onboarding',
  AUTH: {
    LOGIN: 'auth/login',
    REGISTER: 'auth/register',
    VERIFY: 'auth/verify-otp'
  },
  APPLICATIONS: 'applications',
  SETTINGS: 'settings',
  HELP: 'help'
} as const;

/**
 * Build a localized path with language prefix
 * @param lang - Language code (e.g., 'en', 'es', 'fr')
 * @param path - Route path (without leading slash)
 * @returns Localized path with language prefix
 */
export function buildLocalizedPath(lang: string, path: string): string {
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `/${lang}/${cleanPath}`;
}

/**
 * Extract language from pathname
 * @param pathname - Current pathname from router
 * @returns Language code or 'en' as default
 */
export function extractLanguageFromPath(pathname: string): string {
  const segments = pathname.split('/').filter(Boolean);
  // Assume first segment is language if it's 2-3 characters
  if (segments.length > 0 && /^[a-z]{2,3}$/i.test(segments[0])) {
    return segments[0];
  }
  return 'en'; // Default language
}

/**
 * Common navigation functions that can be used across components
 */
export class NavigationHelper {
  constructor(private lang: string, private router: any) {}

  // Authentication flows
  goToLogin = () => this.router.push(ROUTES.AUTH.LOGIN);
  goToRegister = () => this.router.push(ROUTES.AUTH.REGISTER);
  goToVerifyOTP = () => this.router.push(ROUTES.AUTH.VERIFY);

  // Main app flows
  goToHome = () => this.router.push(ROUTES.HOME);
  goToJobs = () => this.router.push(ROUTES.JOBS);
  goToProfile = () => this.router.push(ROUTES.PROFILE);
  goToOnboarding = () => this.router.push(ROUTES.ONBOARDING);
  goToApplications = () => this.router.push(ROUTES.APPLICATIONS);
  goToSettings = () => this.router.push(ROUTES.SETTINGS);

  // Utility methods
  buildPath = (route: string) => buildLocalizedPath(this.lang, route);
  
  // Dynamic routes
  goToJob = (jobId: string | number) => 
    this.router.push(`${ROUTES.JOBS}/${jobId}`);
  
  goToApplication = (applicationId: string) => 
    this.router.push(`${ROUTES.APPLICATIONS}/${applicationId}`);
}

/**
 * Utility type for components that need standardized params handling
 * Use this type for page components that need language-aware navigation
 */
export type WithLocalizedNavigationProps<T = {}> = T & LocalizedPageProps;

/**
 * Get standard page props type for [lang] routes
 */
export type LocalizedPageProps = {
  params: Promise<{ lang: string }> | { lang: string };
};