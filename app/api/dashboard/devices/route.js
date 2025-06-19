import { NextResponse } from 'next/server'
import prismaLogger from '../../../../lib/prisma-logger'

export async function GET() {
  try {
    // Fetch devices with their status
    const devices = await prismaLogger.devices.findMany({
      select: {
        id: true,
        host_name: true,
        status: true,
        _count: {
          select: {
            log_mirror: {
              where: {
                received_at: {
                  gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
                }
              }
            }
          }
        }
      },
      orderBy: {
        id: 'asc'
      }
    })

    // Transform devices data to match your frontend format
    const devicesData = devices.map(device => ({
      id: device.id.toString(),
      active: device.status === 'active' && device._count.log_mirror > 0,
      name: device.host_name
    }))

    // Get the last 7 days for chart data
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    // Fetch log data for the last 7 days grouped by day and device
    const logData = await prismaLogger.log_mirror.findMany({
      where: {
        received_at: {
          gte: sevenDaysAgo
        }
      },
      select: {
        received_at: true,
        hostname: true,
        devices: {
          select: {
            host_name: true
          }
        }
      }
    })

    // Process chart data
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const chartData = []

    // Generate data for each day of the week
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dayName = dayNames[date.getDay()]
      
      const dayData = {
        name: dayName
      }

      // Count logs for each device on this day
      devices.forEach(device => {
        const deviceLogs = logData.filter(log => {
          if (!log.received_at || !log.devices) return false
          
          const logDate = new Date(log.received_at)
          const isSameDay = logDate.toDateString() === date.toDateString()
          const isSameDevice = log.devices.host_name === device.host_name
          
          return isSameDay && isSameDevice
        })

        // Use device name as key, with log count as value
        const deviceKey = device.host_name.replace(/\s+/g, '') // Remove spaces for key
        dayData[deviceKey] = deviceLogs.length
      })

      chartData.push(dayData)
    }

    // Get summary statistics
    const totalDevices = devices.length
    const activeDevices = devicesData.filter(device => device.active).length

    return NextResponse.json({
      success: true,
      data: {
        devices: devicesData,
        chartData: chartData,
        summary: {
          total: totalDevices,
          active: activeDevices,
          inactive: totalDevices - activeDevices
        }
      }
    })

  } catch (error) {
    console.error('Error fetching devices data:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch devices data',
        details: error.message
      },
      { status: 500 }
    )
  }
}

// Optional: POST endpoint to update device status
export async function POST(request) {
  try {
    const { deviceId, status } = await request.json()

    if (!deviceId || !status) {
      return NextResponse.json(
        {
          success: false,
          error: 'Device ID and status are required'
        },
        { status: 400 }
      )
    }

    const updatedDevice = await prismaLogger.devices.update({
      where: {
        id: parseInt(deviceId)
      },
      data: {
        status: status,
        updated_at: new Date()
      }
    })

    return NextResponse.json({
      success: true,
      data: updatedDevice
    })

  } catch (error) {
    console.error('Error updating device:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update device',
        details: error.message
      },
      { status: 500 }
    )
  }
}