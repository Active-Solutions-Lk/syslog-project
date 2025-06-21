export async function fetchUsers () {
  try {
    const response = await fetch('/api/users')
    if (!response.ok) {
      throw new Error('Bad Response')
    }
    const usersData = await response.json()
    // Extract the data array and filter unique names
    const uniqueUsers = []
    const seenNames = new Set()
    for (const user of usersData.data) {
      if (!seenNames.has(user.name)) {
        seenNames.add(user.name)
        uniqueUsers.push(user)
      }
    }
    return uniqueUsers
  } catch (error) {
    console.error('Error fetching users:', error)
    throw new Error('Unable to load user data. Refresh the page and try again.')
  }
}

export async function fetchDevices () {
  try {
    const response = await fetch('/api/devices')
    if (!response.ok) {
      throw new Error('Bad Response')
    }
    const devicesData = await response.json()
    const uniqueDevices = []
    const seenNames = new Set()
    for (const device of devicesData.data) {
      if (!seenNames.has(device.host_name)) {
        seenNames.add(device.host_name)
        uniqueDevices.push(device)
      }
    }
    return uniqueDevices
  } catch (error) {
    console.error('Error fetching devices:', error)
    throw new Error(
      'Unable to load device data. Refresh the page and try again.'
    )
  }
}

export async function fetchLogMirrorData ({
  userId,
  deviceId,
  fromDate,
  toDate
}) {
  try {
    // Fetch file types mapping from /api/file-types
    const fileTypeResponse = await fetch('/api/file-types', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    if (!fileTypeResponse.ok) {
      throw new Error('Failed to fetch file types')
    }
    const { extensionToCategory } = await fileTypeResponse.json()
    console.log('Extension to category mapping:', extensionToCategory)

    //conect with log-mirror endpoint

    const response = await fetch('/api/log-mirror', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userId, deviceId, fromDate, toDate })
    })
    if (!response.ok) {
      throw new Error('Bad Response')
    }
    const logs = await response.json()

    // Process login attempts
    const loginAttempts = logs
      .filter(log => log.event === 'sign-in')
      .map(log => {
        // Extract conType from message: e.g., "signed in to [DSM]" -> "DSM"
        const conTypeMatch = log.message.match(/signed in to \[(.*?)\]/)
        return {
          conType: conTypeMatch ? conTypeMatch[1] : 'Unknown',
          ipAddress: log.ip || 'Unknown'
        }
      })

    // Process filestation behavior
    const filestationActions = ['rename', 'mkdir', 'permission_change']

    const filestationBehavior = filestationActions.map(action => ({
      action:
        action.charAt(0).toUpperCase() + action.slice(1).replace('_', ' '),
      count: logs.filter(log => log.event === action).length
    }))

    // Process file transfer
    const fileTransferEvents = ['upload', 'download', 'delete', 'copy', 'cut']
    const fileTransfer = {}
    fileTransferEvents.forEach(event => {
      const eventLogs = logs.filter(log => log.event === event)
      const files = eventLogs.length
      // console.log(`Processing event: ${event}, found ${files} logs`);

      const size = eventLogs.reduce((sum, log) => {
        const rawSize = log.size || ''
        // console.log(`Log ID: ${log.id}, Event: ${event}, Raw size: "${rawSize}"`);

        const sizeValue = parseFloat(rawSize) || 0
        const unitMatch = rawSize.match(/[A-Z]+/i)
        const unit = unitMatch ? unitMatch[0].toUpperCase() : 'B'
        // console.log(`  Parsed sizeValue: ${sizeValue}, Unit: ${unit}`);

        let sizeInGB = sizeValue
        switch (unit) {
          case 'B':
            sizeInGB = sizeValue / 1024 / 1024 / 1024 // Bytes to GB
            break
          case 'KB':
            sizeInGB = sizeValue / 1024 / 1024 // KB to GB
            break
          case 'MB':
            sizeInGB = sizeValue / 1024 // MB to GB
            break
          case 'GB':
            sizeInGB = sizeValue // Already in GB
            break
          default:
            // console.warn(`  Unknown unit "${unit}" for Log ID: ${log.id}, treating as 0GB`);
            sizeInGB = 0
        }
        // console.log(`  Converted size: ${sizeInGB.toFixed(6)}GB`);
        return sum + sizeInGB
      }, 0)

      fileTransfer[event] = {
        files,
        size: `${size.toFixed(1)}GB`
      }
    })
    // console.log('fileTransfer',fileTransfer);

    // Process file types data
    // Extract unique file extensions from message

    // This part is not configured yet untill data base have proper upload/download logs
    const fileExtensions = [
      ...new Set(
        logs
          .filter(log => ['upload', 'download'].includes(log.event))
          .map(log => {
            const match = log.message.match(/\[([^\]]*?\.[a-zA-Z0-9]+)\]/)
            return match ? match[1].toLowerCase() : null
          })
          .filter(Boolean)
      )
    ]
    console.log('Unique file extensions:', fileExtensions)  

    // Map extensions to categories
    const fileCategories = [
      ...new Set(fileExtensions.map(ext => extensionToCategory[ext] || 'Other'))
    ]
    console.log('File categories:', fileCategories)

    const fileTypesData = fileCategories.map(category => {
      const typeLogs = logs.filter(log => {
        const match = log.message.match(/\[([^\]]*?\.[a-zA-Z0-9]+)\]/)
        if (!match) return false
        const ext = match[1].toLowerCase()
        const logCategory = extensionToCategory[ext] || 'Other'
        return (
          logCategory === category && ['upload', 'download'].includes(log.event)
        )
      })
      console.log(
        `Processing category: ${category}, found ${typeLogs.length} logs (upload/download only)`
      )

      const downloadLogs = typeLogs.filter(log => log.event === 'download')
      const uploadLogs = typeLogs.filter(log => log.event === 'upload')

      const downloadSize = downloadLogs.reduce((sum, log) => {
        const rawSize = log.size || ''
        const match = log.message.match(/\[([^\]]*?\.[a-zA-Z0-9]+)\]/)
        const ext = match ? match[1].toLowerCase() : 'Unknown'
        console.log(
          `Log ID: ${log.id}, Event: download, Extension: ${ext}, Category: ${category}, Raw size: "${rawSize}"`
        )

        const sizeValue = parseFloat(rawSize) || 0
        const unitMatch = rawSize.match(/[A-Z]+/i)
        const unit = unitMatch ? unitMatch[0].toUpperCase() : 'B'
        console.log(`  Parsed sizeValue: ${sizeValue}, Unit: ${unit}`)

        let sizeInGB = sizeValue
        switch (unit) {
          case 'B':
            sizeInGB = sizeValue / 1024 / 1024 / 1024
            break
          case 'KB':
            sizeInGB = sizeValue / 1024 / 1024
            break
          case 'MB':
            sizeInGB = sizeValue / 1024
            break
          case 'GB':
            sizeInGB = sizeValue
            break
          default:
            console.warn(
              `  Unknown unit "${unit}" for Log ID: ${log.id}, treating as 0GB`
            )
            sizeInGB = 0
        }
        console.log(`  Converted size: ${sizeInGB.toFixed(6)}GB`)
        return sum + sizeInGB
      }, 0)

      const uploadSize = uploadLogs.reduce((sum, log) => {
        const rawSize = log.size || ''
        const match = log.message.match(/\[([^\]]*?\.[a-zA-Z0-9]+)\]/)
        const ext = match ? match[1].toLowerCase() : 'Unknown'
        console.log(
          `Log ID: ${log.id}, Event: upload, Extension: ${ext}, Category: ${category}, Raw size: "${rawSize}"`
        )

        const sizeValue = parseFloat(rawSize) || 0
        const unitMatch = rawSize.match(/[A-Z]+/i)
        const unit = unitMatch ? unitMatch[0].toUpperCase() : 'B'
        console.log(`  Parsed sizeValue: ${sizeValue}, Unit: ${unit}`)

        let sizeInGB = sizeValue
        switch (unit) {
          case 'B':
            sizeInGB = sizeValue / 1024 / 1024 / 1024
            break
          case 'KB':
            sizeInGB = sizeValue / 1024 / 1024
            break
          case 'MB':
            sizeInGB = sizeValue / 1024
            break
          case 'GB':
            sizeInGB = sizeValue
            break
          default:
            console.warn(
              `  Unknown unit "${unit}" for Log ID: ${log.id}, treating as 0GB`
            )
            sizeInGB = 0
        }
        console.log(`  Converted size: ${sizeInGB.toFixed(6)}GB`)
        return sum + sizeInGB
      }, 0)

      return {
        type: category,
        downloadFiles: downloadLogs.length,
        downloadSize: `${downloadSize.toFixed(1)}GB`,
        uploadFiles: uploadLogs.length,
        uploadSize: `${uploadSize.toFixed(1)}GB`
      }
    })
    console.log('fileTypesData:', fileTypesData)

    return {
      loginAttempts,
      filestationBehavior,
      fileTransfer,
      fileTypesData
    }
  } catch (error) {
    console.error('Error fetching log mirror data:', error)
    throw new Error(
      'Unable to load log mirror data. Refresh the page and try again.'
    )
  }
}
