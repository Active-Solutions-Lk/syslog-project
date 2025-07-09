'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton
} from '@/components/ui/sidebar'
import {
  LayoutDashboard,
  BellRing,
  FileUser,
  MonitorCog,
  FolderKey,
  Folder,
  Users,
  Settings,
  Plus
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { LogoFill } from './ui/logo'
import Image from 'next/image'

export function AppSidebar () {
  const pathname = usePathname()
  const [settingsOpen, setSettingsOpen] = useState(false)

  const menuItems = [
    {
      title: 'Dashboard',
      icon: LayoutDashboard,
      href: '/dashboard',
      color: 'text-primary-customized'
    },
    {
      title: 'Alerts',
      icon: BellRing,
      href: '/dashboard/alerts',
      color: 'text-primary-customized'
    },
    {
      title: 'User Reports',
      icon: FileUser,
      href: '/dashboard/user-reports',
      color: 'text-primary-customized'
    },
    {
      title: 'Secure Folder',
      icon: FolderKey,
      href: '/dashboard/secure-folder',
      color: 'text-primary-customized'
    },
    {
      title: 'User Summary',
      icon: Users,
      href: '/dashboard/user-summary',
      color: 'text-primary-customized'
    },
    // {
    //   title: 'System Log',
    //   icon: MonitorCog,
    //   href: '/dashboard/system-log',
    //   color: 'text-primary-customized'
    // },
    {
      title: 'Settings',
      icon: Settings,
      href: '/dasboard/settings',
      color: 'text-primary-customized',
      hasSubmenu: true,
      submenu: [
        // { title: 'Account Settings', href: '/dashboard/settings/account' },
        { title: 'Devices Settings', href: '/dashboard/settings/devices' },
        // { title: 'App Settings', href: '/dashboard/settings/app' }
      ]
    }
  ]

  return (
    <Sidebar className='h-screen border-none bg-white '>
      <SidebarHeader className='flex bg-white flex-col gap-0 px-4 py-2'>
        <div className='flex items-center justify-center gap-2'>
          <LogoFill className='h-8 w-8 md:h-10 md:w-10' />
        </div>
        <div className='relative mb-2 mt-4 rounded-lg bg-slate-100 flex items-center justify-between h-[45px] px-2'>
          <div className='text-sm font-medium text-gray-800'>Add New NAS</div>
          <Button
            size='icon'
            variant='outline'
            className='h-6 w-6 rounded-full border-2 border-primary-customized bg-transparent text-primary-customized hover:bg-blue-800 hover:text-white'
          >
            <Plus className='h-4 w-4' />
          </Button>
        </div>
      </SidebarHeader>
      <SidebarContent className='ms-4 mt-2 bg-white'>
        <SidebarMenu>
          {menuItems.map(item => (
            <SidebarMenuItem key={item.title} className='mb-3 text-xs'>
              {item.hasSubmenu ? (
                <div className='relative'>
                  <SidebarMenuButton
                    className={cn(
                      'w-full justify-start gap-2 hover:bg-slate-100',
                      pathname.startsWith(item.href) &&
                        'bg-transparent text-xs font-medium'
                    )}
                    onClick={() => setSettingsOpen(!settingsOpen)}
                  >
                    <item.icon
                      className={cn('h-3 w-3 md:h-4 md:w-4', item.color)}
                    />
                    <span className='text-xs md:text-sm'>{item.title}</span>
                    <motion.div
                      className='ml-auto'
                      animate={{ rotate: settingsOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <svg
                        width='12'
                        height='12'
                        viewBox='0 0 12 12'
                        fill='none'
                        xmlns='http://www.w3.org/2000/svg'
                      >
                        <path
                          d='M2 4L6 8L10 4'
                          stroke='currentColor'
                          strokeWidth='1.5'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                        />
                      </svg>
                    </motion.div>
                  </SidebarMenuButton>
                  {settingsOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className='ml-6 md:ml-9 mt-1 flex flex-col gap-1'
                    >
                      {item.submenu.map(subItem => (
                        <Link
                          key={subItem.title}
                          href={subItem.href}
                          className={cn(
                            'block rounded-md text-xs md:text-sm px-1 py-1.5 hover:bg-slate-100',
                            pathname === subItem.href &&
                              'bg-slate-100 font-medium'
                          )}
                        >
                          {subItem.title}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </div>
              ) : (
                <Link href={item.href} passHref>
                  <SidebarMenuButton
                    className={cn(
                      'w-full justify-start gap-2 hover:bg-slate-100',
                      pathname === item.href &&
                        'bg-transparent text-xs md:text-sm font-extrabold'
                    )}
                  >
                    <item.icon
                      className={cn('h-3 w-3 md:h-4 md:w-4', item.color)}
                    />
                    <span className='text-xs md:text-sm'>{item.title}</span>
                  </SidebarMenuButton>
                </Link>
              )}
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className='mt-auto'>
        <div className='p-4'>
          <div className='rounded-lg bg-transparent p-1'>
            <div className='flex flex-col items-center'>
              <Image
                src='/images/update-to-pro.png'
                alt='Upgrade'
                width={150}
                height={150}
                className='h-32 w-32 md:h-40 md:w-40'
              />
              <div className='flex flex-col items-center'>
                <span className='text-xs md:text-sm font-medium text-center text-[#B2AF50]'>
                  Upgrade to pro
                  <br />
                  for more features
                </span>
                <Button className='mt-2 bg-primary-customized h-8 hover:bg-primary-customized bg-opacity-75 text-xs md:text-sm'>
                  UPGRADE
                </Button>
              </div>
            </div>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
