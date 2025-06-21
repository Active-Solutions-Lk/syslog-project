import { PrismaClient } from '@/generated/prisma-logger';

const prisma = new PrismaClient();

export async function POST() {
  try {
    // Fetch file types mapping from file_types table
    const fileTypesRecords = await prisma.file_types.findMany({
      where: { allow: 1 || 0 }, // Only fetch allowed extensions
      select: { extension: true, name: true }
    });
    const extensionToCategory = fileTypesRecords.reduce((map, record) => {
      map[record.extension.toLowerCase()] = record.name;
      return map;
    }, {});
    
    await prisma.$disconnect();
    return Response.json({ extensionToCategory });
  } catch (error) {
    await prisma.$disconnect();
    console.error('Error fetching file types:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}