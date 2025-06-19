import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma-logger';
import bcrypt from 'bcryptjs';
import { nanoid } from 'nanoid';

// Utility function to create standardized error responses
const createErrorResponse = (message, status) => {
  return NextResponse.json(
    {
      error: message,
      timestamp: new Date().toISOString(),
    },
    { status }
  );
};

export async function POST(request) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const { email, password, rememberMe } = body;

    if (!email || !password) {
      return createErrorResponse(
        'Missing required fields: email and password are required',
        400
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return createErrorResponse('Invalid email format', 400);
    }

    // Validate password
    if (password.length < 8) {
      return createErrorResponse(
        'Password must be at least 8 characters long',
        400
      );
    }

    // Find user by email
    const user = await prisma.admin.findUnique({
      where: { email },
    });

    if (!user) {
      return createErrorResponse('Invalid email or password', 401);
    }

    // Check if password matches
    const passwordMatch = await bcrypt.compare(password, user.passwordHash);

    if (!passwordMatch) {
      return createErrorResponse('Invalid email or password', 401);
    }

    // Generate secure session token using nanoid
    const sessionToken = nanoid(32);

    // Set session expiry based on rememberMe
    const expiryDays = rememberMe ? 30 : 7;
    const expires = new Date();
    expires.setDate(expires.getDate() + expiryDays);

    // Create session in database
    const session = await prisma.session.create({
      data: {
        id: nanoid(32),
        userId: String(user.id),
        sessionToken,
        expires,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    // Return success response with user info (excluding password)
    const { passwordHash, ...userWithoutPassword } = user;

    return NextResponse.json(
      {
        message: 'Login successful',
        user: userWithoutPassword,
        sessionToken: session.sessionToken,
        expires: session.expires,
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    // Handle specific Prisma errors
    if (error.code === 'P2002') {
      return createErrorResponse(
        'A session conflict occurred',
        409
      );
    }

    // Handle database connection errors
    if (error.code === 'P1001') {
      return createErrorResponse(
        'Unable to connect to the database',
        500
      );
    }

    // Handle resource not found
    if (error.code === 'P2025') {
      return createErrorResponse('Resource not found', 404);
    }

    // Log error for debugging
    console.error('Sign-in error:', {
      message: error.message,
      stack: error.stack,
      code: error.code,
    });

    // Generic error response
    return createErrorResponse(
      'An unexpected error occurred during sign-in',
      500
    );
  }
}

// Handle unsupported methods
export async function GET() {
  return createErrorResponse('Method not allowed', 405);
}

export async function PUT() {
  return createErrorResponse('Method not allowed', 405);
}

export async function DELETE() {
  return createErrorResponse('Method not allowed', 405);
}

export async function PATCH() {
  return createErrorResponse('Method not allowed', 405);
}