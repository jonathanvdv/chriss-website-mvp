import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(_request: NextRequest) {
    const response = NextResponse.next()

    // TODO: switch to nonce-based CSP once Next.js experimental nonce propagation
    // is configured (experimental.serverActions.nonce or contentSecurityPolicy).
    // Until then, 'unsafe-inline' is required so Next.js hydration/prefetch
    // scripts are not blocked in production.
    const csp = [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline'",
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        "font-src 'self' https://fonts.gstatic.com",
        "img-src 'self' data: blob: https://*.realtor.ca https://basemaps.cartocdn.com",
        "connect-src 'self' https://basemaps.cartocdn.com https://ddfapi.realtor.ca",
        "worker-src 'self' blob:",
        "child-src 'self' blob: https://www.google.com",
        'frame-src https://www.google.com https://maps.google.com',
    ].join('; ')

    response.headers.set('Content-Security-Policy', csp)
    response.headers.set('X-Content-Type-Options', 'nosniff')
    response.headers.set('X-Frame-Options', 'DENY')
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
    response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(self)')
    response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload')

    return response
}

export const config = {
    matcher: [
        // Match all routes except static files and Next.js internals
        '/((?!_next/static|_next/image|favicon.ico|images/).*)',
    ],
}
