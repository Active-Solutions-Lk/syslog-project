import { NextResponse } from 'next/server'
import { PrismaClient } from '@/generated/prisma-logger'

const prisma = new PrismaClient()

export async function POST(req) {
  try {
    const body = await req.json() // If filters needed, parse here

    // Fetch logs where path is not null
    const logs = await prisma.log_mirror.findMany({
      where: {
        path: {
          not: null,
        },
      },
      select: {
        id: true,
        path: true,
        event: true,
        file_folder: true,
        size: true,
        ip: true,
        message: true,
        category: true,
        received_at: true,
        synced_at: true,
        devices: {
          select: {
            id: true,
            host_name: true, // if devices table has host_name
          },
        },
        users: {
          select: {
            id: true,
            name: true, // if users table has username
          },
        },
      },
      orderBy: {
        received_at: 'desc',
      },
    })

    return NextResponse.json({ success: true, data: logs })
  } catch (error) {
    console.error('Error fetching logs:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
