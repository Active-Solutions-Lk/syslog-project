import { NextResponse } from 'next/server';
import prismaLogger from '@/lib/prisma-logger';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// Validate environment variables at startup
if (!process.env.DATABASE_URL || !process.env.LOGGER_DATABASE_URL) {
  throw new Error('Missing required environment variables: DATABASE_URL or LOGGER_DATABASE_URL');
}
if (!process.env.PROJECT_ID) {
  throw new Error('Missing required environment variable: PROJECT_ID');
}
const PROJECT_ID = parseInt(process.env.PROJECT_ID);
if (isNaN(PROJECT_ID)) {
  throw new Error('PROJECT_ID must be a valid integer');
}

// Utility function for standardized error responses
const createErrorResponse = (message, status, details = {}) => {
  return NextResponse.json(
    {
      error: message,
      timestamp: new Date().toISOString(),
      details
    },
    { status }
  );
};

// Utility function to wrap database calls with timeout
const withTimeout = (promise, ms) => {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Database operation timed out')), ms)
    )
  ]);
};

export async function handler(request) {
  // Restrict to POST method
  if (request.method !== 'POST') {
    return createErrorResponse(`Method ${request.method} not allowed`, 405);
  }

  try {
    // Parse request body
    let body;
    try {
      body = await request.json();
    } catch (error) {
      console.error('JSON parsing error:', { message: error.message });
      return createErrorResponse('Invalid JSON format', 400);
    }

    const { name, email, password, company, activationKey } = body;

    // Input validation
    if (!name || !email || !password || !company || !activationKey) {
      const missingFields = { name: !name, email: !email, password: !password, company: !company, activationKey: !activationKey };
      console.error('Validation error: Missing fields', { missingFields });
      return createErrorResponse('Missing required fields', 400, { missing: missingFields });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const trimmedActivationKey = activationKey.trim();
    if (trimmedActivationKey.length === 0) {
      console.error('Validation error: Empty activation key', { email: normalizedEmail });
      return createErrorResponse('Activation key cannot be empty', 400);
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      console.error('Validation error: Invalid email format', { email: normalizedEmail });
      return createErrorResponse('Invalid email format', 400);
    }

    if (password.length < 8) {
      console.error('Validation error: Password too short', { email: normalizedEmail });
      return createErrorResponse('Password must be at least 8 characters long', 400);
    }

    // Validate activation key against PROJECT_ID
    // Note: Assumes prisma.projects is the source of truth for project data
    let validatedKey;
    try {
      validatedKey = await withTimeout(
        prisma.projects.findFirst({
          where: {
            id: PROJECT_ID,
            activation_key: trimmedActivationKey
          },
          include: { packages: true }
        }),
        5000
      );
    } catch (error) {
      console.error('Project query error:', { message: error.message, project_id: PROJECT_ID, activationKey: trimmedActivationKey });
      return createErrorResponse('Failed to validate activation key', 500);
    }

    if (!validatedKey) {
      console.error('Validation error: Invalid activation key or project ID', { email: normalizedEmail, project_id: PROJECT_ID, activationKey: trimmedActivationKey });
      return createErrorResponse('Invalid activation key or project ID', 400);
    }

    // Parse package duration
    const durationStr = validatedKey.packages.duration || '';
    const match = durationStr.match(/(\d+)\s*(day|days|month|months|year|years)/i);
    if (!match) {
      console.error('Validation error: Invalid duration format', { durationStr });
      return createErrorResponse(`Invalid package duration format: ${durationStr || 'empty'}`, 400);
    }

    let addedDays = 0;
    const value = parseInt(match[1]);
    const unit = match[2].toLowerCase();
    if (unit.includes('day')) {
      addedDays = value;
    } else if (unit.includes('month')) {
      addedDays = value * 30;
    } else if (unit.includes('year')) {
      addedDays = value * 365;
    } else {
      console.error('Validation error: Unsupported duration unit', { unit });
      return createErrorResponse(`Unsupported duration unit: ${unit}`, 400);
    }

    // Validate project creation date
    const activatedDate = new Date(validatedKey.created_at);
    if (isNaN(activatedDate.getTime())) {
      console.error('Server error: Invalid project creation date', { project_id: PROJECT_ID });
      return createErrorResponse('Invalid project creation date', 500);
    }

    // Calculate expiration
    const expirationDate = new Date(activatedDate);
    expirationDate.setDate(expirationDate.getDate() + addedDays);
    if (new Date() > expirationDate) {
      console.error('Validation error: Expired activation key', { email: normalizedEmail, project_id: PROJECT_ID });
      return createErrorResponse('The activation key has expired', 403);
    }

    // Check for existing user
    let existingUser;
    try {
      existingUser = await withTimeout(
        prismaLogger.admin.findUnique({
          where: { email: normalizedEmail }
        }),
        5000
      );
    } catch (error) {
      console.error('User query error:', { email: normalizedEmail, message: error.message });
      return createErrorResponse('Failed to check existing user', 500);
    }
    if (existingUser) {
      console.error('Validation error: User already exists', { email: normalizedEmail });
      return createErrorResponse('User already exists with this email', 409);
    }

    // Hash password
    let passwordHash;
    try {
      passwordHash = await bcrypt.hash(password, 10);
    } catch (error) {
      console.error('Password hashing error:', { message: error.message });
      return createErrorResponse('Failed to hash password', 500);
    }

    // Synchronize project_id in prismaLogger
    // Assumption: A mirrored projects table exists in prismaLogger or project_id is pre-validated
    let projectExists = true;
    if (prisma !== prismaLogger) {
      try {
        // Check if project_id exists in a mirrored projects table or similar in prismaLogger
        // Replace with actual table name if different
        projectExists = await withTimeout(
          prismaLogger.project_details.findUnique({
            where: { id: PROJECT_ID }
          }),
          5000
        );
        if (!projectExists) {
          // Optionally create the project in prismaLogger if it doesn't exist
          await prismaLogger.project_details.create({
            data: {
              key: validatedKey.activation_key,
              project_id: validatedKey.id,
              created_at: validatedKey.created_at,
              updated_at: validatedKey.updated_at
            }
          });
        }
      } catch (error) {
        console.error('Project sync error:', { project_id: PROJECT_ID, message: error.message });
        return createErrorResponse('Failed to synchronize project ID', 500);
      }
    }

    // Create user and project details in a transaction
    let user, project;
    try {
      [user, project] = await withTimeout(
        prismaLogger.$transaction([
          prismaLogger.admin.create({
            data: {
              name: name.trim(),
              email: normalizedEmail,
              passwordHash,
              company: company.trim(),
            }
          }),
          prismaLogger.project_details.create({
            data: {
              key: validatedKey.activation_key,
              project_id: validatedKey.id
            }
          })
        ]),
        5000
      );
    } catch (transactionError) {
      console.error('Transaction error:', { message: transactionError.message, code: transactionError.code });
      return createErrorResponse('Failed to create user or project details', 500, {
        transactionError: transactionError.message
      });
    }

    // Success response
    return NextResponse.json(
      {
        message: 'User created successfully',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          company: user.company,
          createdAt: user.createdAt
        },
        timestamp: new Date().toISOString()
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Signup error:', {
      message: error.message,
      code: error.code,
      database: error.clientVersion === prismaLogger.clientVersion ? 'prismaLogger' : 'prisma'
    });
    if (error.code === 'P2002') {
      return createErrorResponse('A user with this email already exists', 409);
    }
    if (error.code === 'P1001') {
      return createErrorResponse('Unable to connect to the database', 500);
    }
    if (error.code === 'P2025') {
      return createErrorResponse('Resource not found', 404);
    }
    return createErrorResponse('An unexpected error occurred during signup', 500);
  }
}

// Export the handler for all HTTP methods
export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const DELETE = handler;
export const PATCH = handler;