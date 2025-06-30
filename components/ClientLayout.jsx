'use client'

import { useEffect, useState } from 'react'
import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app-sidebar'
import AppNavbar from '@/components/app-navbar'


export default function ClientLayout ({ children }) {
  const [sessionToken, setSessionToken] = useState(null)

  useEffect(() => {
    // Check both localStorage and sessionStorage
    const getSessionToken = () => {
      // First check localStorage (Remember Me = true)
      let token = localStorage.getItem('sessionToken')

      // If not found, check sessionStorage (Remember Me = false)
      if (!token) {
        token = sessionStorage.getItem('sessionToken')
      }

      return token
    }

    const token = getSessionToken()
    // console.log('Retrieved token from storage:', token)

    if (token) {
      setSessionToken(token)
    } else {
      console.log(
        'No session token found in either localStorage or sessionStorage'
      )
    }
  }, [])

  useEffect(() => {
    if (sessionToken) {
      // console.log('Session token available:', sessionToken)
      // You can use it here or pass it to children via context
    }
  }, [sessionToken])

  // console.log('ClientLayout rendered with sessionToken:', sessionToken)

  return (
    <SidebarProvider>
      <div className='flex w-full min-h-screen'>
        <AppSidebar />
        <div className='flex-1 w-full flex flex-col'>
          <AppNavbar />
          <main className='flex-1 p-6 pt-4 overflow-y-auto'>{children}</main>
        </div>
      </div>
    </SidebarProvider>
  )
}
