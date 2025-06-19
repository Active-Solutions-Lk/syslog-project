import { NextResponse } from 'next/server'
import prismaLogger from '../../../../lib/prisma-logger'

export async function GET() {
  try {
    // Get total count of logs from log_mirror table
    const totalLogs = await prismaLogger.log_mirror.count()

    // Today's logs
    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)
    const todayEnd = new Date()
    todayEnd.setHours(23, 59, 59, 999)
    const todayLogs = await prismaLogger.log_mirror.count({
      where: {
        received_at: {
          gte: todayStart,
          lte: todayEnd
        }
      }
    })

    // Get last 6 months including current month
    const now = new Date()
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ]
    const monthlyData = []

    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1)
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999)

      const monthCount = await prismaLogger.log_mirror.count({
        where: {
          received_at: {
            gte: monthStart,
            lte: monthEnd
          }
        }
      })

      monthlyData.push({
        month: `${monthNames[monthStart.getMonth()]} ${monthStart.getFullYear()}`,
        count: monthCount
      })
    }

    return NextResponse.json({
      totalLogs,
      todayLogs,
      monthlyData,
      message: 'Log count retrieved successfully'
    }, { status: 200 })

  } catch (error) {
    console.error('Log count error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch log count' },
      { status: 500 }
    )
  }
}
