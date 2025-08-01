import { type NextRequest, NextResponse } from "next/server"

// List of supported locales
export const locales = ["en", "zh"]
export const defaultLocale = "en"

// Protected routes that require authentication
const protectedRoutes = [
  '/profile',
  '/jobs', // Jobs page requires auth now
  '/applications',
  '/settings'
]

// Routes that require onboarding to be completed
const onboardingRequiredRoutes = [
  '/jobs',
  '/applications'
]

// Public routes that don't require authentication
const publicRoutes = [
  '/',
  '/verify-otp',
  '/about',
  '/resources'
]

async function validateSessionToken(sessionToken: string): Promise<boolean> {
  try {
    // Use internal URL for server-side requests
    const baseUrl = process.env.NEXTAUTH_URL || process.env.VERCEL_URL || 'http://localhost:3000'
    const response = await fetch(`${baseUrl}/api/auth/validate-session`, {
      method: 'GET',
      headers: {
        'Cookie': `session-token=${sessionToken}`
      }
    })
    
    if (response.ok) {
      const result = await response.json()
      return result.success && result.data?.valid
    }
    return false
  } catch {
    return false
  }
}

export async function middleware(request: NextRequest) {
  // Get pathname
  const { pathname } = request.nextUrl

  // Skip locale handling for static files and API routes
  const fileExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.ico', '.webp']
  if (fileExtensions.some(ext => pathname.endsWith(ext)) || pathname.startsWith('/api/')) {
    return
  }

  // Extract locale from pathname
  let pathnameWithoutLocale = pathname
  let locale = defaultLocale
  const pathnameHasLocale = locales.some((loc) => {
    if (pathname.startsWith(`/${loc}/`) || pathname === `/${loc}`) {
      locale = loc
      pathnameWithoutLocale = pathname.replace(`/${loc}`, '') || '/'
      return true
    }
    return false
  })

  // Redirect if there is no locale
  if (!pathnameHasLocale) {
    request.nextUrl.pathname = `/${defaultLocale}${pathname}`
    return NextResponse.redirect(request.nextUrl)
  }

  // Check if route requires authentication
  const isProtectedRoute = protectedRoutes.some(route => 
    pathnameWithoutLocale === route || pathnameWithoutLocale.startsWith(`${route}/`)
  )

  const isPublicRoute = publicRoutes.some(route => 
    pathnameWithoutLocale === route || pathnameWithoutLocale.startsWith(`${route}/`)
  )

  // Allow access to public routes
  if (isPublicRoute && !isProtectedRoute) {
    return NextResponse.next()
  }

  // Check authentication for protected routes
  if (isProtectedRoute) {
    const sessionToken = request.cookies.get('session-token')?.value

    if (!sessionToken) {
      // Redirect to login page with return URL
      const loginUrl = new URL(`/${locale}/verify-otp`, request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }

    // Validate session token
    const isValidSession = await validateSessionToken(sessionToken)
    
    if (!isValidSession) {
      // Clear invalid session and redirect to login
      const response = NextResponse.redirect(new URL(`/${locale}/verify-otp`, request.url))
      response.cookies.delete('session-token')
      response.cookies.delete('refresh-token')
      return response
    }

    // For routes that require onboarding, we'll let the client-side ProtectedRoute handle this
    // since we need user profile data which is more complex to validate in middleware
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
