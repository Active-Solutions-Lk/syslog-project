'use server'

const root = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000' // ✅ fallback if env var not set

export async function signupUser (formData) {
  // console.log('formData', formData);
  try {
    const response = await fetch(`${root}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })

    let data
    const contentType = response.headers.get('content-type')
    if (contentType && contentType.includes('application/json')) {
      data = await response.json()
    } else {
      throw new Error('Unexpected server response format')
    }

    if (!response.ok) {
      let errorMessage = data.error || 'Unable to create account'

      switch (response.status) {
        case 400:
          errorMessage = data.error || 'Invalid input data provided'
          break
        case 409:
          errorMessage = data.error || 'A user with this email already exists'
          break
        case 403:
          errorMessage = data.error || 'The activation key is invalid or expired'
          break
        case 404:
          errorMessage = 'API endpoint not found'
          break
        case 405:
          errorMessage = 'Method not allowed'
          break
        case 500:
          errorMessage = 'Server error occurred. Please try again later.'
          break
        case 503:
          errorMessage = 'Service unavailable. Please try again later.'
        default:
          errorMessage = 'An unexpected error occurred'
      }

      return {
        success: false,
        error: errorMessage,
        status: response.status
      }
    }

    return {
      success: true,
      message: data.message || 'Welcome to Active Solutions!',
      data
    }
  } catch (error) {
    console.error('Signup error:', error)
    return {
      success: false,
      error: 'Network error. Please check your connection and try again.',
      status: null
    }
  }
}

export async function loginUser (formData) {
  try {
    const response = await fetch(`${root}/api/auth/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: formData.email,
        password: formData.password,
        rememberMe: formData.rememberMe || false
      })
    })

    const contentType = response.headers.get('content-type')
    let data
    if (contentType && contentType.includes('application/json')) {
      data = await response.json()
    } else {
      throw new Error('Unexpected server response format')
    }

    if (!response.ok) {
      let errorMessage = data.error || 'Invalid email or password'
      switch (response.status) {
        case 400:
          errorMessage = data.error || 'Invalid input data provided'
          break
        case 401:
          errorMessage = data.error || 'Invalid email or password'
          break
        case 404:
          errorMessage = 'API endpoint not found'
          break
        case 405:
          errorMessage = 'Method not allowed'
          break
        case 409:
          errorMessage = data.error || 'A session conflict occurred'
          break
        case 500:
          errorMessage = 'Server error occurred. Please try again later.'
          break
        default:
          errorMessage = 'An unexpected error occurred'
      }

      return {
        success: false,
        error: errorMessage,
        status: response.status
      }
    }

    return {
      success: true,
      message: data.message || 'Login successful',
      data
    }
  } catch (error) {
    console.error('Login error:', error)
    return {
      success: false,
      error: 'Network error. Please check your connection and try again.',
      status: null
    }
  }
}
