export async function FetchSummary (userId) {
  try {
    // Step 1: Fetch file types
    const fileTypesRaw = await fetch('/api/file-types').then(res => {
      if (!res.ok) throw new Error('Failed to fetch file types')
      return res.json()
    })

    // Convert array to extensionToCategory mapping
    const extensionToCategory = {}
    for (const { extension, name } of fileTypesRaw) {
      extensionToCategory[extension.toLowerCase()] = name
    }

    if (!extensionToCategory || typeof extensionToCategory !== 'object') {
      throw new Error('Invalid file types format received from API')
    }

    const extToTypeMap = extensionToCategory

    // Step 2: Fetch all user logs
    const response = await fetch('/api/user-summary', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    })

    if (!response.ok) throw new Error('API Endpoint Not Ok')

    const logs = await response.json()
    console.log('Fetched logs:', logs)

    // Step 3: Process logs and group by user
    const usersMap = {}

    // Category translation to align with previous output
    const categoryTranslation = {
      Images: 'Photo',
      Videos: 'Video',
      Documents: 'Document',
      Audio: 'Other',
      Archives: 'Other',
      Code: 'Other'
    }

    logs.forEach(log => {
      const uId = log.users?.id
      if (!uId) {
        console.log('Skipping log: missing user ID', log)
        return
      }

      const username = log.users?.name || 'Unknown'
      const status = 'Active'
      const folderId = log.file_folder || 'default'

      if (!usersMap[uId]) {
        usersMap[uId] = {
          id: uId,
          name: username,
          status,
          totalFiles: 0,
          totalSize: 0,
          created: 0,
          deleted: 0,
          fileTypesMap: {},
          folderId
        }
      }

      const userData = usersMap[uId]

      const filePath = log.path || ''
      const fileName = filePath.split('/').pop() || 'unknown'
      const extension = '.' + (fileName.split('.').pop() || '').toLowerCase()
      const rawCategory = extToTypeMap[extension] || 'Other'
      const category = categoryTranslation[rawCategory] || 'Other'

      if (!userData.fileTypesMap[category]) {
        userData.fileTypesMap[category] = {
          type: category,
          createCount: 0,
          readCount: 0,
          deleteCount: 0,
          totalSize: 0,
          uploads: [],
          downloads: [],
          deleted: [] // Initialize deleted array
        }
      }

      const sizeInBytes = parseSizeToBytes(log.size || '0')
      const { date, time } = formatDateTime(log.received_at)

      const fileInfo = {
        name: fileName,
        size: formatBytes(sizeInBytes), // Store size as formatted GB string
        date,
        time,
        path: filePath
      }

      console.log('Processing log:', {
        uId,
        event: log.event,
        fileName,
        extension,
        rawCategory,
        category,
        sizeInBytes
      })

      // Categorize by event type
      if (log.event === 'create' || log.event === 'upload') {
        userData.created += 1
        userData.fileTypesMap[category].createCount += 1
        userData.fileTypesMap[category].uploads.push(fileInfo)
        userData.fileTypesMap[category].totalSize += sizeInBytes
      } else if (log.event === 'delete') {
        userData.deleted += 1
        userData.fileTypesMap[category].deleteCount += 1
        userData.fileTypesMap[category].deleted.push(fileInfo) // Populate deleted array
      } else if (log.event === 'read' || log.event === 'download') {
        userData.fileTypesMap[category].readCount += 1
        userData.fileTypesMap[category].downloads.push(fileInfo)
      }

      userData.totalFiles += 1
      userData.totalSize += sizeInBytes
    })

    // Step 4: Final formatting
    const users = Object.values(usersMap).map(user => ({
      ...user,
      totalSize: formatBytes(user.totalSize),
      fileTypes: Object.values(user.fileTypesMap).map(fileType => ({
        ...fileType,
        totalSize: formatBytes(fileType.totalSize) // Format file type size as GB
      }))
    }))

    console.log('Formatted users:', users)
    return users
  } catch (error) {
    console.error('FetchSummary error:', error)
    throw new Error('API Endpoint Not Ok')
  }
}

// Helper to convert size string like '12 KB' to bytes
function parseSizeToBytes (sizeStr) {
  if (!sizeStr) return 0
  if (typeof sizeStr === 'number') return sizeStr

  const size = parseFloat(sizeStr)
  if (isNaN(size)) return 0

  const lower = sizeStr.toLowerCase()
  if (lower.includes('kb')) return size * 1024
  if (lower.includes('mb')) return size * 1024 * 1024
  if (lower.includes('gb')) return size * 1024 * 1024 * 1024

  return size // Assume it's already in bytes
}

// Helper to format bytes as human-readable size in GB
function formatBytes (bytes) {
  if (bytes === 0) return '0.00 GB'
  const gb = bytes / (1024 * 1024 * 1024) // Convert bytes to GB
  return `${gb.toFixed(2)} GB`
}

// Helper to split date and time
function formatDateTime (dateStr) {
  const dateObj = new Date(dateStr)
  const date = dateObj.toISOString().split('T')[0]
  const time = dateObj.toTimeString().split(' ')[0].slice(0, 5) // "hh:mm"
  return { date, time }
}
