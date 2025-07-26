import { type NextRequest, NextResponse } from "next/server"

// List of supported locales
export const locales = ["en", "zh"]
export const defaultLocale = "en"

export function middleware(request: NextRequest) {
  // Get pathname
  const { pathname } = request.nextUrl

  // Skip locale handling for static files in the public directory
  const fileExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.ico', '.webp']
  if (fileExtensions.some(ext => pathname.endsWith(ext))) {
    return
  }

  // Check if pathname has a locale
  const pathnameHasLocale = locales.some((locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`)

  if (pathnameHasLocale) return

  // Redirect if there is no locale
  const locale = defaultLocale
  request.nextUrl.pathname = `/${locale}${pathname}`
  return NextResponse.redirect(request.nextUrl)
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
