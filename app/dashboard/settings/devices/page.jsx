'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Bell, ChevronDown, Search } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { useRouter } from 'next/navigation'

export default function DeviceSettings () {
  const [query, setQuery] = useState('')
  const router = useRouter()

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  }

  const devices = [
    {
      name: 'Shaheer NAS',
      ip: '192.168.0.53',
      port: '5000',
      logCount: '3620',
      status: 'Active',
      deviceId: 'device-001' // Unique ID for each device
    },
    {
      name: 'Shaheer NAS',
      ip: '192.168.0.53',
      port: '5000',
      logCount: '3620',
      status: 'Deactive',
      deviceId: 'device-002'
    },
    {
      name: 'Active Com',
      ip: '192.168.0.39',
      port: '514',
      logCount: '20',
      status: 'Active',
      deviceId: 'device-003'
    }
  ]

  // Filter devices based on query
  const filteredDevices = devices.filter(device =>
    Object.values(device).join(' ').toLowerCase().includes(query.toLowerCase())
  )

  // Handle edit button click
  const handleEditClick = deviceId => {
    router.push(`/dashboard/settings/devices/${deviceId}`)
  }

  return (
    <div className='flex min-h-screen flex-col'>
      <motion.div
        className='flex-1 p-2 pt-0 md:p-4'
        variants={containerVariants}
        initial='hidden'
        animate='visible'
      >
        <motion.div variants={itemVariants} className='mb-5 w-full'>
          <div className='justify-end flex h-10 items-center border bg-specialbg bg-opacity-25 pr-3 border-subtitle rounded-lg gap-2 md:h-12'>
            <Input
              placeholder='Search Devices'
              value={query}
              onChange={e => setQuery(e.target.value)}
              className='relative h-8 flex bg-transparent border-none items-end text-end border-r-0 justify-end pr-10 ring-0 focus:ring-slate-50 focus:ring-0 md:h-10 md:text-base'
            />
            <Search
              style={{ transform: 'rotate(90deg)' }}
              className='h-4 w-4 md:h-5 md:w-5'
            />
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className='rounded-lg border-none shadow-none overflow-x-auto'
        >
          <Table className='min-w-full'>
            <TableHeader>
              <TableRow className='bg-transparent'>
                <TableHead className='text-lg font-bold text-start p-2 m-0 text-title md:text-xl'>
                  Device
                </TableHead>
                <TableHead className='text-lg font-bold text-start p-2 m-0 text-title md:text-xl'>
                  IP
                </TableHead>
                <TableHead className='text-lg font-bold text-start p-2 m-0 text-title md:text-xl'>
                  Port
                </TableHead>
                <TableHead className='text-lg font-bold text-start p-2 m-0 text-title md:text-xl'>
                  Log Count
                </TableHead>
                <TableHead className='text-lg font-bold text-start p-2 m-0 text-title md:text-xl'>
                  Status
                </TableHead>
                <TableHead className='text-lg font-bold text-center p-2 m-0 text-title md:text-xl'>
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDevices.map((device, index) => (
                <TableRow key={index} className='p-0 m-0 hover:bg-gray-50'>
                  <TableCell className='text-start p-2 m-0 text-sm md:text-base'>
                    {device.name}
                  </TableCell>
                  <TableCell className='text-start p-2 m-0 text-sm md:text-base'>
                    {device.ip}
                  </TableCell>
                  <TableCell className='text-start p-2 m-0 text-sm md:text-base'>
                    {device.port}
                  </TableCell>
                  <TableCell className='text-start p-2 m-0 text-sm md:text-base'>
                    {device.logCount}
                  </TableCell>
                  <TableCell className=' text-start p-0m-0'>
                    {device.status}
                  </TableCell>

                  <TableCell className='text-center p-2 m-0 text-sm md:text-base'>
                    <Button
                      variant='outline'
                      size='xs'
                      className='border px-2 border-specialBlue text-xs md:text-base'
                      onClick={() => handleEditClick(device.deviceId)}
                    >
                      Settings
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </motion.div>
      </motion.div>
    </div>
  )
}
