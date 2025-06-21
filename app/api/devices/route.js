import { NextResponse } from 'next/server';
import prismaLogger from '@/lib/prisma-logger';

export async function GET() {
  try {
    // Fetch all devices from the database
    const devices = await prismaLogger.devices.findMany({
      select: {
        id: true,
        host_name: true,
        status: true,
        created_at: true,
        updated_at: true,
      },
    });

    // Return the devices data as a JSON response
    return NextResponse.json({ success: true, data: devices }, { status: 200 });
  } catch (error) {
    console.error('Error fetching devices:', error);

    // Return an error response if something goes wrong
    return NextResponse.json(
      { success: false, message: 'Failed to fetch devices' },
      { status: 500 }
    );
  }
}