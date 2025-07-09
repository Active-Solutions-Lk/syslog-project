import { NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma-logger';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    // Parse the request body
    const { sessionToken } = await request.json();

    if (!sessionToken) {
      return NextResponse.json(
        { error: 'Session token is required' },
        { status: 400 }
      );
    }

    // Query the session and include admin details
    const session = await prisma.session.findUnique({
      where: { sessionToken },
      include: {
        admin: {
          select: {
            id: true,
            name: true,
            email: true,
            company: true,
            created_at: true,
            updated_at: true,
          },
        },
      },
    });

    if (!session) {
      return NextResponse.json(
        { error: 'Invalid or expired session token' },
        { status: 401 }
      );
    }

    // Return session and admin details
    return NextResponse.json({
      session: {
        id: session.id,
        adminId: session.adminId,
        createdAt: session.createdAt,
        updatedAt: session.updatedAt,
        expires: session.expires,
        sessionToken: session.sessionToken,
      },
      admin: session.admin,
    });
  } catch (error) {
    console.error('Error fetching session:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}