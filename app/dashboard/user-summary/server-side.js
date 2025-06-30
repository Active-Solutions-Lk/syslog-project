export async function getProcessedUserSummaries () {
  try {
    const [usersData, devicesData, logsData, fileTypeData] = await Promise.all([
      fetch('/api/users').then(res => res.json()),
      fetch('/api/devices').then(res => res.json()),
      fetch('/api/fetch-logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      }).then(res => res.json()),
      fetch('/api/file-types').then(res => res.json())
    ])

    const users = usersData.data
    const devices = devicesData.data
    const logs = logsData.data
    const extensionToCategory = fileTypeData.extensionToCategory || {}


    //console.log('fileTypeData', fileTypeData?.extension);

    // // Debug: confirm data fetched
    // //console.log('Fetched data:', {
    //   users: users.length,
    //   devices: devices.length,
    //   logs: logs.length,
    //   extensionToCategory
    // })

    const userMap = new Map()
    const folderMap = new Map(devices.map(dev => [dev.id, dev.host_name]))

    for (const user of users) {
      userMap.set(user.id, {
        id: user.id,
        name: user.name,
        status: user.status || 'Active',
        totalFiles: 0,
        totalSizeBytes: 0,
        created: 0,
        deleted: 0,
        fileTypes: {
          Video: { createCount: 0, readCount: 0, deleteCount: 0, totalSize: 0 },
          Photo: { createCount: 0, readCount: 0, deleteCount: 0, totalSize: 0 },
          Document: {
            createCount: 0,
            readCount: 0,
            deleteCount: 0,
            totalSize: 0
          },
          Other: { createCount: 0, readCount: 0, deleteCount: 0, totalSize: 0 }
        },
        folderId: null
      })
    }

    // Category translation to align extensionToCategory with userMap
    const categoryTranslation = {
      Images: 'Photo',
      Videos: 'Video',
      Documents: 'Document',
      Audio: 'Other',
      Archives: 'Other',
      Code: 'Other'
    }

    for (const log of logs) {
      const userId = log.users?.id
      if (!userId || !userMap.has(userId)) {
        // //console.log('Skipping log: invalid or missing userId', { userId, log })
        continue
      }

      if (log.message.includes('File/Folder: Folder')) {
        // //console.log('Skipping folder log:', log.message)
        continue
      }

      const userObj = userMap.get(userId)

      const extractedPath = extractPathFromMessage(log.message)
      const extension = getFileExtension(extractedPath)

      // ✅ Skip if no extension — nothing is counted
      if (!extension) {
        // //console.log('Skipping log with no file extension:', log.message)
        continue
      }

      //console.log('extension', extension);

      // ✅ Now count this log as a "valid file"
      userObj.totalFiles += 1

      if (log.event === 'upload' || log.event === 'copy') userObj.created += 1
      if (log.event === 'delete') userObj.deleted += 1

      if (!userObj.folderId && log.hostname) {
        userObj.folderId = folderMap.get(log.hostname) || null
      }

      const rawCategory = extensionToCategory[extension] || 'Other'
      const category = categoryTranslation[rawCategory] || 'Other'
      const size = parseFileSize(log.size)

      // //console.log('Processing log:', {
      //   message: log.message,
      //   extractedPath,
      //   extension,
      //   rawCategory,
      //   category,
      //   size,
      //   userId
      // })

      const fileTypeStats =
        userObj.fileTypes[category] || userObj.fileTypes.Other

      if (log.event === 'upload' || log.event === 'copy')
        fileTypeStats.createCount += 1
      else if (log.event === 'delete') fileTypeStats.deleteCount += 1
      else if (log.event === 'read') fileTypeStats.readCount += 1

      fileTypeStats.totalSize += size
      userObj.totalSizeBytes += size
    }

    // Final formatting
    const finalUsers = []

    for (const user of userMap.values()) {
      finalUsers.push({
        id: user.id,
        name: user.name,
        status: user.status,
        totalFiles: user.totalFiles,
        totalSize: formatSize(user.totalSizeBytes),
        created: user.created,
        deleted: user.deleted,
        fileTypes: Object.entries(user.fileTypes).map(([type, stats]) => ({
          type,
          createCount: stats.createCount,
          readCount: stats.readCount,
          deleteCount: stats.deleteCount,
          totalSize: formatSize(stats.totalSize) // Format file type size as GB
        })),
        folderId: user.folderId || 'N/A'
      })
    }

    // Debug: final output
    // //console.log('Final users:', finalUsers);

    return finalUsers
  } catch (err) {
    console.error('Error processing user summaries:', err)
    throw new Error('Failed to fetch and process user data')
  }
}

// Extract path from `message` field (e.g., "Path: /some/path/file.jpg")
function extractPathFromMessage (message) {
  try {
    const match = message.match(/Path:\s*([^,\n\r]+)/i)
    return match ? match[1].trim() : ''
  } catch {
    return ''
  }
}

// Get file extension from a path like "/test/a.mp4" → ".mp4"
function getFileExtension (filePath) {
  if (!filePath || typeof filePath !== 'string') return ''
  const lastDot = filePath.lastIndexOf('.')
  if (lastDot === -1 || lastDot === filePath.length - 1) return ''
  return filePath.substring(lastDot).toLowerCase()
}

// Parse size strings like "47.38 KB", "2.5 MB", "1.1 GB"
function parseFileSize (sizeStr) {
  try {
    if (!sizeStr || typeof sizeStr !== 'string') return 0
    const match = sizeStr.trim().match(/([\d.]+)\s*(KB|MB|GB)/i)
    if (!match) return 0

    const value = parseFloat(match[1])
    const unit = match[2].toUpperCase()

    switch (unit) {
      case 'GB':
        return value * 1024 * 1024
      case 'MB':
        return value * 1024
      case 'KB':
        return value
      default:
        return 0
    }
  } catch (error) {
    console.error('Error parsing size:', sizeStr, error)
    return 0
  }
}

// Convert total size in KB to human-readable format in GB
function formatSize (bytes) {
  if (!bytes || bytes === 0) return '0.00 GB'
  const gb = bytes / (1024 * 1024) // Convert KB to GB
  return `${gb.toFixed(2)} GB`
}
