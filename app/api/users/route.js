import { NextResponse } from 'next/server';
import prismaLogger from '@/lib/prisma-logger';

export async function GET() {
  try {
    // Fetch all users from the database
    const users = await prismaLogger.users.findMany({
      select: {
        id: true,
        name: true,
        created_at: true,
        updated_at: true,
      },
    });

    // Return the users data as a JSON response
    return NextResponse.json({ success: true, data: users }, { status: 200 });
  } catch (error) {
    console.error('Error fetching users:', error);

    // Return an error response if something goes wrong
    return NextResponse.json(
      { success: false, message: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}