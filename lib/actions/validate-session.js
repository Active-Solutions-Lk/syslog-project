export async function validateSession(sessionToken, origin) {
  try {
    // Validate session token by calling the API
    const response = await fetch(`${origin}/api/auth/session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sessionToken }),
    });

    if (!response.ok) {
      return { isValid: false };
    }

    const data = await response.json();
    const session = data.session;

    // Check if session exists and is not expired
    if (!session || new Date(session.expires) < new Date()) {
      return { isValid: false };
    }

    // Session is valid
    return { isValid: true, session };
  } catch (error) {
    console.error('Session validation error:', error);
    return { isValid: false };
  }
}

export async function validateActivationKey(origin) {
  try {
    // Validate activation key by calling the API
    const response = await fetch(`${origin}/api/auth/chk-activation`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('Response status:', response.status);

    if(response.status === 200) {
      return { isActivated: true, message: 'Activation key is valid' };
    }else{
      const errorData = await response.json();
      console.error('Activation key validation error:', errorData);
      return { isActivated: false, error: errorData.error || 'Activation key is invalid or expired' };
    }
  } catch (error) {
    console.error('Activation key validation error:', error);
    return { isActivated: false, error: 'Network error. Please try again.' };
  }
}