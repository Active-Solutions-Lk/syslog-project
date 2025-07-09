import { NextResponse } from 'next/server';
import prismaLogger from '@/lib/prisma-logger';
import prisma from '@/lib/prisma';

// Helper for standardized error responses
const createErrorResponse = (message, status, details = {}) => {
  return NextResponse.json(
    {
      error: message,
      timestamp: new Date().toISOString(),
      details,
    },
    { status }
  );
};

// Utility to wrap DB calls with timeout
const withTimeout = (promise, ms) => {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Database operation timed out')), ms)
    ),
  ]);
};

export async function GET() {
  try {
    if (!process.env.PROJECT_ID) {
      throw new Error('Missing required environment variable: PROJECT_ID');
    }

    const PROJECT_ID = parseInt(process.env.PROJECT_ID);
    if (isNaN(PROJECT_ID)) {
      throw new Error('PROJECT_ID must be a valid integer');
    }

    // console.log('PROJECT_ID:', PROJECT_ID);

    // Get the latest project_details entry from the logger DB
    let projectDetails;
    try {
      projectDetails = await prismaLogger.project_details.findFirst({
        where: { project_id: PROJECT_ID },
        orderBy: { id: 'desc' },
      });
    } catch (error) {
      console.error('Logger DB error:', error);
      return createErrorResponse('Failed to fetch activation key from logger database', 500, { error: error.message });
    }

    if (!projectDetails || !projectDetails.key) {
      return createErrorResponse('Activation key not found in logger database', 404, { project_id: PROJECT_ID });
    }

    const trimmedActivationKey = projectDetails.key.trim();
    // console.log('Activation key:', trimmedActivationKey);

    // Validate the activation key from the main Prisma DB
    let validatedKey;
    try {
      validatedKey = await withTimeout(
        prisma.projects.findFirst({
          where: {
            id: PROJECT_ID,
            activation_key: trimmedActivationKey,
          },
          include: { packages: true },
        }),
        5000
      );
      // console.log('Validated key:', validatedKey);
    } catch (error) {
      console.error('Main DB error during project fetch:', error);
      return createErrorResponse('Failed to validate activation key', 500, { error: error.message });
    }

    if (!validatedKey) {
      return createErrorResponse('Invalid activation key or project ID', 400, {
        project_id: PROJECT_ID,
        activation_key: trimmedActivationKey,
        userMessage: 'The provided activation key is invalid. Please check and try again.',
      });
    }

    // Parse the package duration
    const durationStr = validatedKey.packages?.duration || '';
    const match = durationStr.match(/(\d+)\s*(day|days|month|months|year|years)/i);

    if (!match) {
      return createErrorResponse(`Invalid package duration format: ${durationStr || 'empty'}`, 400, {
        userMessage: 'The package duration is invalid. Please contact support.',
      });
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
      return createErrorResponse(`Unsupported duration unit: ${unit}`, 400, {
        userMessage: 'The package duration format is unsupported. Please contact support.',
      });
    }

    // Calculate expiration
    const activatedDate = new Date(validatedKey.created_at);
    if (isNaN(activatedDate.getTime())) {
      return createErrorResponse('Invalid project creation date', 500, {
        userMessage: 'Invalid project data. Please contact support.',
      });
    }

    const expirationDate = new Date(activatedDate);
    expirationDate.setDate(expirationDate.getDate() + addedDays);

    if (new Date() > expirationDate) {
      return createErrorResponse('The activation key has expired', 403, {
        activated_at: activatedDate.toISOString(),
        expires_at: expirationDate.toISOString(),
        userMessage: 'Your activation key has expired. Please renew your subscription.',
      });
    }

    // Success
    return NextResponse.json({
      message: 'Activation key validated successfully',
      project_id: PROJECT_ID,
      activated_at: activatedDate.toISOString(),
      expires_at: expirationDate.toISOString(),
      valid_for_days: addedDays,
      userMessage: 'Activation key is valid.',
    });
  } catch (error) {
    console.error('Unexpected error in activation key validation:', error);
    return createErrorResponse('Internal server error', 500, {
      error: error.message,
      userMessage: 'An unexpected error occurred. Please try again or contact support.',
    });
  }
}