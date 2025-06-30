'use client'
import { useState, useEffect } from 'react'

export function useSessionToken() {
  const [sessionToken, setSessionToken] = useState(null)

  useEffect(() => {
    const getSessionToken = () => {
      let token = localStorage.getItem('sessionToken')
      if (!token) {
        token = sessionStorage.getItem('sessionToken')
      }
      return token
    }

    const token = getSessionToken()
    if (token) {
      setSessionToken(token)
    } else {
      // Optionally handle missing token
      // console.log('No session token found in either localStorage or sessionStorage')
    }
  }, [])

  return sessionToken
}
