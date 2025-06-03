'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Trash2, Filter, HardDriveUpload, HardDriveDownload, Copy, CopyX } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

export default function UserReportsPage () {
  const currentDate = new Date('2025-05-27T12:44:00+05:30').toLocaleString(
    'en-US',
    {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short',
      hour12: true,
      timeZone: 'Asia/Kolkata'
    }
  )

  // Mock data
  const loginAttempts = [
    { conType: 'DSM-1', ipAddress: '192.168.0.1' },
    { conType: 'FTM-2', ipAddress: '192.168.0.1' },
    { conType: 'SMB-4', ipAddress: '192.168.0.1' },
    { conType: 'SSH-4', ipAddress: '192.168.0.1' },
    { conType: 'DSM-1', ipAddress: '192.168.0.1' },
    { conType: 'FTM-2', ipAddress: '192.168.0.1' },
    // { conType: 'FTM-2', ipAddress: '192.168.0.1' }
  ]

  const filestationBehavior = [
    { action: 'Rename', count: 15 },
    { action: 'Write', count: 5 },
    { action: 'Permission Change', count: 23 }
  ]

  const fileTransfer = {
    upload: { files: 5000, size: '12.5GB' },
    download: { files: 5000, size: '12.5GB' },
    deleted: { files: 5000, size: '12.5GB' },
    copied: { files: 5000, size: '12.5GB' },
    cut: { files: 5000, size: '12.5GB' }
  }

  const fileTypesData = [
    { type: 'Images', downloadFiles: 1000, downloadSize: '2.5GB', uploadFiles: 800, uploadSize: '2.0GB' },
    { type: 'Text', downloadFiles: 500, downloadSize: '1.0GB', uploadFiles: 300, uploadSize: '0.6GB' },
    { type: 'Compressed Files', downloadFiles: 200, downloadSize: '5.0GB', uploadFiles: 150, uploadSize: '3.5GB' },
    { type: 'Office Documents', downloadFiles: 300, downloadSize: '3.0GB', uploadFiles: 200, uploadSize: '2.0GB' },
    { type: 'Other Files', downloadFiles: 400, downloadSize: '1.0GB', uploadFiles: 250, uploadSize: '0.5GB' }
  ]

  // Mock data for dynamic selection menus
  const mockUsers = [
    { id: 'all', name: 'All Users' },
    { id: 'user1', name: 'User 1' },
    { id: 'user2', name: 'User 2' },
    { id: 'user3', name: 'User 3' },
    { id: 'user4', name: 'User 4' },
    { id: 'user5', name: 'User 5' }
  ]

  const mockDevices = [
    { id: 'all', name: 'All Devices' },
    { id: 'device1', name: 'Device 1' },
    { id: 'device2', name: 'Device 2' },
    { id: 'device3', name: 'Device 3' },
    { id: 'device4', name: 'Device 4' },
    { id: 'device5', name: 'Device 5' }
  ]

// State for search terms
  const [userSearch, setUserSearch] = useState('')
  const [deviceSearch, setDeviceSearch] = useState('')
  
  // Refs to manage input focus
  const userInputRef = useRef(null)
  const deviceInputRef = useRef(null)

  // Filter functions
  const filteredUsers = mockUsers.filter(user =>
    user.name.toLowerCase().includes(userSearch.toLowerCase())
  )
  const filteredDevices = mockDevices.filter(device =>
    device.name.toLowerCase().includes(deviceSearch.toLowerCase())
  )

  // Handle input focus and prevent SelectContent from closing
  const handleInputFocus = (ref) => {
    if (ref.current) {
      ref.current.focus()
    }
  }

  // Ensure focus persists after re-render
  useEffect(() => {
    if (userSearch && userInputRef.current) {
      userInputRef.current.focus()
    }
  }, [userSearch])

  useEffect(() => {
    if (deviceSearch && deviceInputRef.current) {
      deviceInputRef.current.focus()
    }
  }, [deviceSearch])

  return (
    <div className='flex'>
      <div className='flex-1 p-4 pt-0'>
        <div className='flex justify-center items-center mb-4 bg-specialbg bg-opacity-25 rounded-t-lg p-1'>
          <div className='flex items-center gap-8'>
            <div className='flex items-center gap-2'>
              <h1 className='text-sm text-title font-semibold'>User :</h1>
              <Select defaultValue='all'>
                <SelectTrigger className='bg-transparent mb-1 text-subtitle border-0 border-b-2 border-gray-400 rounded-none w-32'>
                  <SelectValue placeholder='All Users' />
                </SelectTrigger>
                <SelectContent>
                  <div className='p-2'>
                    <Input
                      placeholder='Search users...'
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                      ref={userInputRef}
                      onBlur={() => handleInputFocus(userInputRef)} // Re-focus on blur
                      className='w-full mb-2 text-subtitle border-b-2 border-gray-400 bg-transparent'
                    />
                  </div>
                  <SelectGroup>
                    <SelectLabel>Users</SelectLabel>
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-results" disabled>
                        No users found
                      </SelectItem>
                    )}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className='flex items-center gap-2'>
              <h1 className='text-sm text-title font-semibold'>Device :</h1>
              <Select defaultValue='all'>
                <SelectTrigger className='bg-transparent text-subtitle border-0 border-b-2 border-gray-400 rounded-none w-32'>
                  <SelectValue placeholder='All Devices' />
                </SelectTrigger>
                <SelectContent>
                  <div className='p-2'>
                    <Input
                      placeholder='Search devices...'
                      value={deviceSearch}
                      onChange={(e) => setDeviceSearch(e.target.value)}
                      ref={deviceInputRef}
                      onBlur={() => handleInputFocus(deviceInputRef)} // Re-focus on blur
                      className='w-full mb-2 text-subtitle border-b-2 border-gray-400 bg-transparent'
                    />
                  </div>
                  <SelectGroup>
                    <SelectLabel>Devices</SelectLabel>
                    {filteredDevices.length > 0 ? (
                      filteredDevices.map((device) => (
                        <SelectItem key={device.id} value={device.id}>
                          {device.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-results" disabled>
                        No devices found
                      </SelectItem>
                    )}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className='flex items-center gap-2'>
              <h1 className='text-sm text-title font-semibold'>From :</h1>
              <Input
                type='date'
                defaultValue='2025-04-07'
                className='w-36 bg-transparent border-0 text-subtitle border-b-2 border-gray-400 rounded-none'
              />
            </div>
            <div className='flex items-center gap-2'>
              <h1 className='text-sm text-title font-semibold'>To :</h1>
              <Input
                type='date'
                defaultValue='2025-04-08'
                className='w-36 bg-transparent text-subtitle border-0 border-b-2 border-gray-400 rounded-none'
              />
            </div>
            <Button
              variant='outline'
              size='xs'
              className='bg-transparent px-3 text-md text-title font-bold border border-blue-700 hover:bg-blue-600'
            >
              <Filter className='h-4 w-4 mr-2' />
              Filter
            </Button>
          </div>
        </div>
        <div className='grid grid-cols-5 gap-4'>
          <div className='col-span-2'>
            <Card className='bg-yellow-100 bg-opacity-65 shadow-none border-none h-full'>
              <CardHeader className='flex justify-center items-center'>
                <CardTitle className='text-lg font-extrabold'>{loginAttempts.length} Login Attempts</CardTitle>
              </CardHeader>
              <CardContent className='justify-center w-full items-center'>
                <table className='w-full text-sm'>
                  <thead className='justify-center items-center'>
                    <tr>
                      <th className='text-center'>Con Type</th>
                      <th className='text-center'>IP Address</th>
                    </tr>
                  </thead>
                </table>
                <div className='overflow-y-auto' style={{ maxHeight: '240px' }}>
                  <table className='w-full text-sm'>
                    <tbody>
                      {loginAttempts.map((item, index) => (
                        <tr
                          key={index}
                          className={index % 2 === 0 ? 'hover:bg-white' : 'hover:bg-yellow-100'}
                        >
                          <td className='p-1 text-center'>{item.conType}</td>
                          <td className='p-1 text-center'>{item.ipAddress}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className='col-span-3'>
            <Card className='bg-yellow-100 bg-opacity-65 shadow-none border-none h-full'>
              <CardHeader className='flex justify-center items-center'>
                <CardTitle className='text-lg font-extrabold'>Filestation Behaviour</CardTitle>
              </CardHeader>
              <CardContent className='flex justify-center items-center'>
                <table className='w-96 text-sm justify-center'>
                  <thead>
                    <tr>
                      <th className='text-start p-2 ps-4'>Action</th>
                      <th className='text-center p-2'>Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filestationBehavior.map((item, index) => (
                      <tr
                        key={index}
                        className={index % 2 === 0 ? 'hover:bg-white' : 'hover:bg-yellow-100'}
                      >
                        <td className='p-1 text-start'>{item.action}</td>
                        <td className='p-1 text-center'>{item.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </div>
        </div>
        <Card className='mt-4 bg-yellow-100 bg-opacity-65 shadow-none border-none'>
          <CardHeader>
            <CardTitle className="flex justify-center text-lg font-extrabold">Total File Transfer</CardTitle>
          </CardHeader>
          <CardContent className='grid grid-cols-5 gap-4'>
            <div className='flex flex-col items-center'>
              <HardDriveUpload className='h-8 w-8 text-specialBlue' />
              <span>Files {fileTransfer.upload.files}</span>
              <span>Size {fileTransfer.upload.size}</span>
            </div>
            <div className='flex flex-col items-center'>
              <HardDriveDownload className='h-8 w-8 text-specialBlue' />
              <span>Files {fileTransfer.download.files}</span>
              <span>Size {fileTransfer.download.size}</span>
            </div>
            <div className='flex flex-col items-center'>
              <Trash2 className='h-8 w-8 text-specialBlue' />
              <span>Files {fileTransfer.deleted.files}</span>
              <span>Size {fileTransfer.deleted.size}</span>
            </div>
            <div className='flex flex-col items-center'>
              <Copy className='h-8 w-8 text-specialBlue' />
              <span>Files {fileTransfer.copied.files}</span>
              <span>Size {fileTransfer.copied.size}</span>
            </div>
            <div className='flex flex-col items-center'>
              <CopyX className='h-8 w-8 text-specialBlue' />
              <span>Files {fileTransfer.cut.files}</span>
              <span>Size {fileTransfer.cut.size}</span>
            </div>
          </CardContent>
        </Card>
        <Card className='mt-4 bg-yellow-100 bg-opacity-65 shadow-none border-none'>
          <CardContent>
            <Table className='border-2 border-specialBlue w-full h-full'>
              <TableHeader>
                <TableRow>
                  <TableHead className='text-center border-2 text-title font-bold border-specialBlue'>File Type</TableHead>
                  <TableHead colSpan={2} className='text-center text-title font-bold'>Download</TableHead>
                  <TableHead colSpan={2} className='text-center text-title font-bold border-l-2 border-specialBlue'>Upload</TableHead>
                </TableRow>
                <TableRow>
                  <TableHead className='text-center p-1'></TableHead>
                  <TableHead className='text-center text-xs border-2 text-title font-bold border-specialBlue'>Number of files</TableHead>
                  <TableHead className='text-center text-xs border-2 text-title font-bold border-specialBlue'>Size of files</TableHead>
                  <TableHead className='text-center text-xs border-2 text-title font-bold border-specialBlue'>Number of files</TableHead>
                  <TableHead className='text-center text-xs border-2 text-title font-bold border-specialBlue'>Size of files</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fileTypesData.map((item, index) => (
                  <TableRow
                    key={index}
                    className={`${index % 2 === 0 ? 'hover:bg-white' : 'hover:bg-yellow-100'}`}
                  >
                    <TableCell className='p-1 text-start border-l-2 border-specialBlue'>{item.type}</TableCell>
                    <TableCell className='p-1 text-center border-l-2 border-specialBlue'>{item.downloadFiles}</TableCell>
                    <TableCell className='p-1 text-center border-l-2 border-specialBlue'>{item.downloadSize}</TableCell>
                    <TableCell className='p-1 text-center border-l-2 border-specialBlue'>{item.uploadFiles}</TableCell>
                    <TableCell className='p-1 text-center border-l-2 border-specialBlue'>{item.uploadSize}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}