import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma-logger';
import bcrypt from 'bcryptjs';

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
    // Validate request body
    const body = await request.json();
    const { name, email, password, company } = body;

    // Input validation
    if (!name || !email || !password || !company) {
      return createErrorResponse(
        'Missing required fields: name, email, password, and company are required',
        400
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return createErrorResponse('Invalid email format', 400);
    }

    // Validate password strength
    if (password.length < 8) {
      return createErrorResponse(
        'Password must be at least 8 characters long',
        400
      );
    }

    // Check if user already exists
    const existingUser = await prisma.admin.findUnique({
      where: { email },
    });

    if (existingUser) {
      return createErrorResponse('User already exists with this email', 409);
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create user
    const user = await prisma.admin.create({
      data: {
        name,
        email,
        passwordHash,
        company,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    // Return success response
    return NextResponse.json(
      {
        message: 'User created successfully',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          company: user.company,
          createdAt: user.createdAt,
        },
        timestamp: new Date().toISOString(),
      },
      { status: 201 }
    );
  } catch (error) {
    // Handle specific Prisma errors
    if (error.code === 'P2002') {
      return createErrorResponse(
        'A user with this email already exists',
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

    // Handle resource not found (though unlikely in create operation)
    if (error.code === 'P2025') {
      return createErrorResponse('Resource not found', 404);
    }

    // Log error for debugging
    console.error('Signup error:', {
      message: error.message,
      stack: error.stack,
      code: error.code,
    });

    // Generic error response
    return createErrorResponse(
      'An unexpected error occurred during signup',
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