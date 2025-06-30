export async function fetchDeviceData (deviceId) {
  try {
    const res = await fetch(`/api/device-settings?deviceId=${deviceId}`, {
      cache: 'no-store'
    })

    if (!res.ok) {
      console.error(
        'Fetch failed with status:',
        res.status,
        'Response:',
        await res.text()
      )
      throw new Error(`Failed to fetch device data: ${res.status}`)
    }

    const data = await res.json()
    if (!data.device) {
      throw new Error('Device data not found in response')
    }
    return data.device
  } catch (error) {
    console.error('Fetch Device Error:', error)
    throw error // Rethrow to handle in the client
  }
}

export async function fetchFileTypes () {
  try {
    const response = await fetch('/api/file-types', {
      cache: 'no-store'
    })
    if (!response.ok) {
      console.error(
        'Fetch file types failed with status:',
        response.status,
        'Response:',
        await response.text()
      )
      throw new Error(`Failed to fetch file types: ${response.status}`)
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Fetch File Types Error:', error)
    throw error
  }
}

export async function NewExtension(extensionData) {
  try {
    const response = await fetch('/api/device-settings/update-device-file-type', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(extensionData),
    });

    if (!response.ok) {
      throw new Error(`Bad response from API endpoint: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    return result; // Return the response data for potential use
  } catch (error) {
    throw new Error(`Failed to update extension ${extensionData.extension}: ${error.message}`);
  }
}


export async function SendData(data) {
  try {
    const response = await fetch('/api/device-settings/new-extension', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        deviceId: data.deviceId,
        extensionId: data.extensionId,
        extension: data.extension,
        name: data.name,
        maxSize: data.maxSize,
        allow: data.enabled ? 1 : 0,
        category: data.category,
      }),
    })

    if (!response.ok) {
      throw new Error(`Bad response from API endpoint: ${response.status} ${response.statusText}`)
    }

    const result = await response.json()
    return result
  } catch (error) {
    throw new Error(`Failed to save extension ${data.extension}: ${error.message}`)
  }
}

export async function UpdateWorkingTimes(deviceId, workingTimes) {
  try {
    const response = await fetch('/api/device-settings/update-working-times', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        deviceId,
        workingTimes,
      }),
    })

    if (!response.ok) {
      throw new Error(`Bad response from API endpoint: ${response.status} ${response.statusText}`)
    }

    const result = await response.json()
    return result
  } catch (error) {
    throw new Error(`Failed to update working times: ${error.message}`)
  }
}