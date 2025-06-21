import { NextResponse } from 'next/server'
import prismaLogger from '../../../../lib/prisma-logger'

export async function GET() {
  try {
    // Define today's date range in IST (June 19, 2025, 00:00:00 to 23:59:59, UTC+05:30)
    // Get current date in Sri Lanka Standard Time (SLST, UTC+05:30)
    const now = new Date()
    // SLST offset in minutes (+5:30)
    const SLST_OFFSET = 330
    // Convert current UTC time to SLST
    const slstNow = new Date(now.getTime() + (SLST_OFFSET - now.getTimezoneOffset()) * 60000)
    // Get year, month, day in SLST
    const year = slstNow.getFullYear()
    const month = slstNow.getMonth()
    const day = slstNow.getDate()
    // Start of today in SLST
    const todayStart = new Date(Date.UTC(year, month, day, 0, 0, 0, 0) - (SLST_OFFSET * 60000 * -1))
    // End of today in SLST
    const todayEnd = new Date(Date.UTC(year, month, day, 23, 59, 59, 999) - (SLST_OFFSET * -60000))

    // Query for uploads (count 'copy' events)
    const uploadsCount = await prismaLogger.log_mirror.count({
      where: {
        event: 'copy',
        received_at: {
          gte: todayStart,
          lte: todayEnd,
        },
      },
    })

    // Query for downloads (assuming no explicit download event; set to 0)
    const downloadsCount = 0 // Placeholder: Adjust if downloads are identifiable

    // Query for user access (count 'sign-in' events or category 'Sign-in')
    const userAccessCount = await prismaLogger.log_mirror.count({
      where: {
        OR: [
          { event: 'sign-in' },
          { category: 'Sign-in' },
        ],
        received_at: {
          gte: todayStart,
          lte: todayEnd,
        },
      },
    })

    // Query for total user count from admin table
    const totalUsersCount = await prismaLogger.admin.count()

    // Return the counts in a JSON response
    return NextResponse.json({
      uploads: uploadsCount,
      downloads: downloadsCount,
      userAccess: userAccessCount,
      totalUsers: totalUsersCount,
    }, { status: 200 })

  } catch (error) {
    console.error('Error fetching today figures:', error)
    return NextResponse.json(
      { error: 'Failed to fetch today figures' },
      { status: 500 }
    )
  }
}