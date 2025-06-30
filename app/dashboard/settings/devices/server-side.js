export async function FetchDevices () {
  try {
    const response = await fetch('/api/devices'); // ✅ Add leading slash
    if (!response.ok) {
      throw new Error('Bad API Response');
    }
    const data = await response.json(); // ✅ Add await
    // console.log('data', data);
    return data;
  } catch (error) {
    throw new Error(error.message || 'Error fetching devices');
  }
}
