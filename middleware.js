import { NextResponse } from 'next/server'
import {
  validateSession,
  validateActivationKey
} from './lib/actions/validate-session'

export async function middleware (request) {
  // Extract sessionToken from cookies
  const sessionToken = request.cookies.get('sessionToken')?.value

  // If no sessionToken, redirect to login
  if (!sessionToken) {
    return NextResponse.redirect(new URL('/login?error=Session expired. Please login again', request.url))
  }

  // Validate session using the extracted function
  const { isValid } = await validateSession(
    sessionToken,
    request.nextUrl.origin
  )
  const { isActivated,error } = await validateActivationKey(request.nextUrl.origin)

  // console.log('Session validation result:', isValid);
  // console.log('Activation key validation result:', isActivated)

  if (!isValid || !isActivated) {
    return NextResponse.redirect(
      new URL(`/login?error= ${error} `, request.url)
    )
  }

  // Session is valid, proceed with the request
  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*'] // Protect all routes under /dashboard
}
