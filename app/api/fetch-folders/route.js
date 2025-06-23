import { NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma-logger';

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const body = await req.json(); // If you want filters, parse them here

    // Optional: You can filter by device_id, name, etc.
    const folders = await prisma.secure_folders.findMany({
      select: {
        id: true,
        name: true,
        path: true,
        device_id: true,
        created_at: true,
        updated_at: true,
        devices: {
          select: {
            id: true,
            host_name: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
      // where: {
      //   device_id: body.device_id, // optional filter
      // },
    });

    return NextResponse.json({ success: true, data: folders });
  } catch (error) {
    console.error('Error fetching folders:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
