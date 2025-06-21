import { PrismaClient } from '@/generated/prisma-logger';

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { userId, deviceId, fromDate, toDate } = await req.json();

    // Build where clause for filtering
    const where = {
      AND: [
        fromDate ? { received_at: { gte: new Date(fromDate) } } : {},
        toDate ? { received_at: { lte: new Date(toDate) } } : {},
        userId ? { user: parseInt(userId) } : {},
        deviceId ? { hostname: parseInt(deviceId) } : {},
      ]
    };

    // Fetch log_mirror data
    const logs = await prisma.log_mirror.findMany({
      where,
      include: {
        users: true,
        devices: true
      }
    });

    await prisma.$disconnect();

    return Response.json(logs);
  } catch (error) {
    await prisma.$disconnect();
    console.error('Error fetching log mirror data:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}