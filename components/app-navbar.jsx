'use client'

import { SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Bell, ChevronDown } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const  AppNavbar = ()=> {
  return (
    <header className='flex items-center justify-between sticky top-0 z-10 bg-white/80 backdrop-blur border-none p-1'>
      <div>
        <div className='flex items-center gap-2'>
          <SidebarTrigger />
          <h3 className='text-md text-secondary text-subtitle font-semibold'>
            Dashboard
          </h3>
        </div>
        <div className='text-xs ps-9 text-muted-foreground'>
          Saturday, May 24, 2025 10:40 AM
        </div>
      </div>
      <div className='flex items-center gap-4'>
        <Button
          className='text-primary-customized'
          variant='ghost'
          size='icon'
        >
          <Bell className='h-6 w-6' />
        </Button>
        <div className='flex items-center gap-3'>
          <Avatar className='h-8 w-8 bg-blue-100 text-primary-customized'>
            <AvatarFallback>AS</AvatarFallback>
            <AvatarImage
              src='/images/dp.jpeg'
              alt='User'
              className='h-8 w-8 rounded-full'
            />
          </Avatar>
          <span className='font-medium text-subtitle text-sm'>
            Ahamed Shaheer
          </span>
          <ChevronDown className='h-4 w-4' />
        </div>
      </div>
    </header>
  )
}

export default AppNavbar