import { PrismaClient } from '@/generated/prisma-logger'

const prisma = new PrismaClient()

export async function POST(request) {
  try {
    const extensionData = await request.json()
    const { deviceId, extensionId, extension, status } = extensionData

    // Validate input
    if (!deviceId || !extensionId || !extension || !['Enabled', 'Disabled'].includes(status)) {
      return new Response(
        JSON.stringify({ error: 'Invalid input: deviceId, extensionId, extension, and status (Enabled/Disabled) are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Map status to allow (1 for Enabled, 0 for Disabled)
    const allow = status === 'Enabled' ? 1 : 0

    // Upsert device_file_types
    const updatedRecord = await prisma.device_file_types.upsert({
      where: {
        device_id_file_type_id: {
          device_id: parseInt(deviceId),
          file_type_id: parseInt(extensionId),
        },
      },
      update: {
        allow,
      },
      create: {
        device_id: parseInt(deviceId),
        file_type_id: parseInt(extensionId),
        allow,
        max_size: 0, // Default value; adjust if needed
      },
    })

    return new Response(
      JSON.stringify({ message: `Successfully ${updatedRecord.max_size === 0 ? 'created' : 'updated'} extension ${extension} for device ${deviceId}`, data: updatedRecord }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error updating/creating device_file_types:', error)
    return new Response(
      JSON.stringify({ error: `Failed to process extension ${extensionData?.extension || 'unknown'}: ${error.message}` }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  } finally {
    await prisma.$disconnect()
  }
}