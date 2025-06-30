import { PrismaClient } from '@/generated/prisma-logger'

const prisma = new PrismaClient()

export async function POST(request) {
  try {
    const data = await request.json()
    //console.log('Request body:', data)

    const { deviceId, extensionId, extension, name, maxSize, allow, category } = data

    // Validate required fields
    if (!extension) {
      //console.log('Validation failed: extension missing')
      return new Response(
        JSON.stringify({ error: 'Invalid input: extension is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Validate extension format
    if (!extension.startsWith('.')) {
      //console.log('Validation failed: invalid extension format')
      return new Response(
        JSON.stringify({ error: 'Invalid extension: must start with a dot (e.g., .png)' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Parse and validate maxSize
    let maxSizeValue = 80000 // Default
    if (maxSize) {
      const parsedMaxSize = parseFloat(maxSize.replace(/[^0-9.]/g, ''))
      if (isNaN(parsedMaxSize) || parsedMaxSize <= 0) {
        //console.log('Validation failed: invalid maxSize')
        return new Response(
          JSON.stringify({ error: 'Invalid maxSize: must be a positive number (e.g., 500MB)' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        )
      }
      maxSizeValue = parsedMaxSize
    }

    const allowValue = allow !== undefined ? (allow ? 1 : 0) : 0

    // Handle deviceId (0 or null creates new device)
    let device_id
    if (deviceId === 0 || deviceId === null || deviceId === undefined) {
      //console.log('Creating new device')
      const timestamp = Date.now()
      const newDevice = await prisma.devices.create({
        data: {
          host_name: `device_${timestamp}`,
          ip: '0.0.0.0',
          port: 0,
          status: 'active',
          created_at: new Date(),
          updated_at: new Date(),
        },
      })
      device_id = newDevice.id
      //console.log(`Created new device with ID: ${device_id}`)
    } else {
      device_id = parseInt(deviceId)
      if (isNaN(device_id)) {
        //console.log('Validation failed: invalid deviceId')
        return new Response(
          JSON.stringify({ error: 'Invalid deviceId: must be a valid integer' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        )
      }

      // Check if device_id exists
      const device = await prisma.devices.findUnique({
        where: { id: device_id },
      })
      if (!device) {
        //console.log(`Validation failed: Device with ID ${deviceId} not found`)
        return new Response(
          JSON.stringify({ error: `Device with ID ${deviceId} not found` }),
          { status: 404, headers: { 'Content-Type': 'application/json' } }
        )
      }
    }

    // Handle extensionId (0 or null creates new file_type)
    let fileTypeId
    if (extensionId === 0 || extensionId === null || extensionId === undefined) {
      // Check if file_type exists for the extension and category
      let fileType = await prisma.file_types.findFirst({
        where: {
          extension,
          name: category || name || 'Unknown',
        },
      })

      // Create new file_type if it doesn't exist
      if (!fileType) {
        fileType = await prisma.file_types.create({
          data: {
            name: category || name || 'Unknown',
            extension,
            allow: allowValue,
            max_size: Math.round(maxSizeValue), // Int for file_types
            created_at: new Date(),
            updated_at: new Date(),
          },
        })
        //console.log(`Created new file_type with ID: ${fileType.id}`)
      }
      fileTypeId = fileType.id
    } else {
      fileTypeId = parseInt(extensionId)
      if (isNaN(fileTypeId)) {
        //console.log('Validation failed: invalid extensionId')
        return new Response(
          JSON.stringify({ error: 'Invalid extensionId: must be a valid integer' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        )
      }

      // Verify file_type_id exists
      const fileType = await prisma.file_types.findUnique({
        where: { id: fileTypeId },
      })
      if (!fileType) {
        //console.log(`Validation failed: File type with ID ${extensionId} not found`)
        return new Response(
          JSON.stringify({ error: `File type with ID ${extensionId} not found` }),
          { status: 404, headers: { 'Content-Type': 'application/json' } }
        )
      }

      // Update file_types if name or category is provided
      if (name || category) {
        await prisma.file_types.update({
          where: { id: fileTypeId },
          data: {
            name: category || name || fileType.name,
            updated_at: new Date(),
          },
        })
      }
    }

    // Upsert device_file_types
    const updatedRecord = await prisma.device_file_types.upsert({
      where: {
        device_id_file_type_id: {
          device_id,
          file_type_id: fileTypeId,
        },
      },
      update: {
        allow: allowValue,
        max_size: maxSizeValue,
      },
      create: {
        device_id,
        file_type_id: fileTypeId,
        allow: allowValue,
        max_size: maxSizeValue,
      },
    })

    return new Response(
      JSON.stringify({
        message: `Successfully ${updatedRecord.max_size === 80000 ? 'created' : 'updated'} extension ${extension} for device ${device_id}`,
        data: updatedRecord,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error updating/creating device_file_types:', error)
    return new Response(
      JSON.stringify({ error: `Failed to process extension ${data?.extension || 'unknown'}: ${error.message}` }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  } finally {
    await prisma.$disconnect()
  }
}