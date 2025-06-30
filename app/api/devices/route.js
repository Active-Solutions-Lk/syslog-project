import { NextResponse } from 'next/server';
import prismaLogger from '@/lib/prisma-logger';

export async function GET() {
  try {
    // Fetch all devices and count logs related to each
    const devicesWithLogCounts = await prismaLogger.devices.findMany({
      select: {
        id: true,
        host_name: true,
        status: true,
        port: true,
        ip: true,
        created_at: true,
        updated_at: true,
        _count: {
          select: {
            log_mirror: true, // This gives us the log count
          }
        }
      }
    });

    // Format result: flatten _count.log_mirror into logCount
    const formattedDevices = devicesWithLogCounts.map(device => ({
      id: device.id,
      host_name: device.host_name,
      status: device.status,
      port: device.port,
      ip: device.ip,
      created_at: device.created_at,
      updated_at: device.updated_at,
      logCount: device._count.log_mirror
    }));

    return NextResponse.json({ success: true, data: formattedDevices }, { status: 200 });
  } catch (error) {
    console.error('Error fetching device log counts:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch log counts' }, { status: 500 });
  }
}
