import { NextResponse } from 'next/server'
import { PrismaClient } from '@/generated/prisma-logger'

const prisma = new PrismaClient()

export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const deviceId = parseInt(searchParams.get('deviceId'))

  if (isNaN(deviceId)) {
    return NextResponse.json({ error: 'Invalid or missing deviceId' }, { status: 400 })
  }

  try {
    const device = await prisma.devices.findUnique({
      where: { id: deviceId },
      include: {
        device_file_types: {
          include: {
            file_types: true
          }
        },
        work_time: true
      }
    })

    if (!device) {
      return NextResponse.json({ error: 'Device not found' }, { status: 404 })
    }

    const logCounts = await prisma.log_mirror.aggregate({
      _count: {
        id: true
      },
      where: {
        hostname: deviceId
      }
    })

    const allocatedLogs = 25000 // Replace with actual value from config or DB
    const usedLogs = logCounts._count.id
    const availableLogs = allocatedLogs - usedLogs

    return NextResponse.json({
      device: {
        name: device.host_name,
        ip: device.ip,
        port: device.port,
        status: device.status,
        logCount: {
          allocated: allocatedLogs,
          used: usedLogs,
          available: availableLogs
        },
        extensions: device.device_file_types.map(dft => ({
          name: dft.file_types.extension,
          maxSize: `${dft.max_size}MB`,
          enabled: dft.allow === 1,
          category:dft.file_types.name
        })),
        workingTime: {
          monFri: extractTime(device.work_time, 'monFri'),
          satSun: extractTime(device.work_time, 'satSun')
        }
      }
    })
  } catch (error) {
    console.error('Error fetching device settings:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

function extractTime(workTimes, period) {
  const entry = workTimes.find(w => w.period === period)
//   //console.log('workTimes',workTimes);
//   //console.log('period',period);
  if (!entry) {
    if (period === 'monFri') {
      return { start: '00:00', end: '00:00' }
    } else if (period === 'satSun') {
      return { start: '00:00', end: '00:00' }
    } else {
      return { start: '', end: '' }
    }
  }
  return {
    start: entry.from.toISOString().slice(11, 16),
    end: entry.to.toISOString().slice(11, 16)
  }
}