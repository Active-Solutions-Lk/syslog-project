import { NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma-logger';

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const data = await req.json();

    const newFolder = await prisma.secure_folders.create({
      data: {
        name: data.nickname,
        device_id: parseInt(data.device), // ensure it's an integer
        path: data.path,
      },
    });

    return NextResponse.json({ success: true, folder: newFolder });
  } catch (error) {
    console.error('Add Folder Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
