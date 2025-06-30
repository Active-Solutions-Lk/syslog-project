import { PrismaClient } from '@/generated/prisma-logger'

const prisma = new PrismaClient()

export async function GET () {
  const prisma = new PrismaClient()
  try {
    const fileTypesRecords = await prisma.file_types.findMany({
      select: {  extension: true, name: true }
    })
    await prisma.$disconnect()
    return Response.json( fileTypesRecords )
  } catch (error) {
    await prisma.$disconnect()
    console.error('Error fetching file types:', error)
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

