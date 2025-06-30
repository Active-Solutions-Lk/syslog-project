import { NextResponse } from 'next/server'
import { PrismaClient } from '@/generated/prisma-logger'

const prisma = new PrismaClient()

// POST: Update or create working times
export async function POST(request) {
  try {
    const { deviceId, workingTimes } = await request.json()
    //console.log('received workingTimes', workingTimes)

    if (!deviceId || !workingTimes) {
      return NextResponse.json({ error: 'Missing deviceId or workingTimes' }, { status: 400 })
    }

    // Validate workingTimes structure
    if (
      !workingTimes.monFri?.start ||
      !workingTimes.monFri?.end ||
      !workingTimes.satSun?.start ||
      !workingTimes.satSun?.end
    ) {
      return NextResponse.json({ error: 'Invalid workingTimes format' }, { status: 400 })
    }

    const monFriData = {
      from: workingTimes.monFri.start,
      to: workingTimes.monFri.end,
      updated_at: new Date()
    }

    const satSunData = {
      from: workingTimes.satSun.start,
      to: workingTimes.satSun.end,
      updated_at: new Date()
    }

    // Save monFri
    const monFriRecord = await prisma.work_time.findFirst({
      where: { device_id: Number(deviceId), period: 'monFri' }
    })

    if (monFriRecord) {
      await prisma.work_time.update({
        where: { id: monFriRecord.id },
        data: monFriData
      })
    } else {
      await prisma.work_time.create({
        data: {
          device_id: Number(deviceId),
          period: 'monFri',
          ...monFriData,
          created_at: new Date()
        }
      })
    }

    // Save satSun
    const satSunRecord = await prisma.work_time.findFirst({
      where: { device_id: Number(deviceId), period: 'satSun' }
    })

    if (satSunRecord) {
      await prisma.work_time.update({
        where: { id: satSunRecord.id },
        data: satSunData
      })
    } else {
      await prisma.work_time.create({
        data: {
          device_id: Number(deviceId),
          period: 'satSun',
          ...satSunData,
          created_at: new Date()
        }
      })
    }

    const response = {
      monFri: {
        start: workingTimes.monFri.start,
        end: workingTimes.monFri.end
      },
      satSun: {
        start: workingTimes.satSun.start,
        end: workingTimes.satSun.end
      }
    }

    //console.log('Saved Working Times:', response)

    return NextResponse.json(
      { message: 'Working times updated successfully', data: response },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error updating working times:', error)
    return NextResponse.json({ error: 'Failed to update working times: ' + error.message }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}


// GET: Fetch working times for a device
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const deviceId = searchParams.get('deviceId')

    if (!deviceId) {
      return NextResponse.json(
        { error: 'Missing deviceId' },
        { status: 400 }
      )
    }

    const records = await prisma.work_time.findMany({
      where: { device_id: Number(deviceId) },
      select: { period: true, from: true, to: true }
    })

    const response = {
      monFri: {
        start: records.find(r => r.period === 'monFri')?.from.toISOString().substring(11, 16) || '09:00',
        end: records.find(r => r.period === 'monFri')?.to.toISOString().substring(11, 16) || '17:00'
      },
      satSun: {
        start: records.find(r => r.period === 'satSun')?.from.toISOString().substring(11, 16) || '10:00',
        end: records.find(r => r.period === 'satSun')?.to.toISOString().substring(11, 16) || '15:00'
      }
    }

    return NextResponse.json(response, { status: 200 })
  } catch (error) {
    console.error('Error fetching working times:', error)
    return NextResponse.json(
      { error: 'Failed to fetch working times: ' + error.message },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}