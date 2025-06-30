// middleware.js
import { NextResponse } from 'next/server';

export async function middleware(request) {
  // Extract sessionToken from cookies (we'll adjust for localStorage/sessionStorage later)
  const sessionToken = request.cookies.get('sessionToken')?.value;

  // If no sessionToken, redirect to login
  if (!sessionToken) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    // Validate session token by calling the API
    const response = await fetch(`${request.nextUrl.origin}/api/auth/session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sessionToken }),
    });

    if (!response.ok) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    const data = await response.json();
    const session = data.session;

    // Check if session exists and is not expired
    if (!session || new Date(session.expires) < new Date()) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Session is valid, proceed with the request
    return NextResponse.next();
  } catch (error) {
    console.error('Middleware error:', error);
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: ['/dashboard/:path*'], // Protect all routes under /dashboard
};