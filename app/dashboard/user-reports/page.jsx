'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
import { Upload, Download, Trash2, X, Plus } from 'lucide-react'

export default function UserReportsPage () {
  const currentDate = new Date('2025-05-26T12:21:00+05:30').toLocaleString(
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
    { conType: 'FTM-2', ipAddress: '192.168.0.1' }
  ]

  const filestationBehavior = [
    { action: 'Action', count: 12 },
    { action: 'Rename', count: 15 },
    { action: 'Write', count: 5 },
    { action: 'Permission Change', count: 23 }
  ]

  const fileTransfer = {
    upload: { files: 5000, size: '12.5GB' },
    download: { files: 5000, size: '12.5GB' },
    deleted: { files: 5000, size: '12.5GB' },
    corrupted: { files: 5000, size: '12.5GB' }
  }

  const fileTypes = [
    'Images',
    'Text',
    'Compressed Files',
    'Office Documents',
    'Other Files'
  ]

  return (
    <div className='flex'>
      <div className='flex-1 p-4'>
        <div className='flex justify-between items-center mb-4'>
          <div className='flex items-center gap-2'>
            <Select defaultValue='all'>
              <SelectTrigger className='w-[100px]'>
                <SelectValue placeholder='All Users' />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Users</SelectLabel>
                  <SelectItem value='all'>All Users</SelectItem>
                  <SelectItem value='user1'>User 1</SelectItem>
                  <SelectItem value='user2'>User 2</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <Select defaultValue='all'>
              <SelectTrigger className='w-[100px]'>
                <SelectValue placeholder='All Devices' />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Devices</SelectLabel>
                  <SelectItem value='all'>All Devices</SelectItem>
                  <SelectItem value='device1'>Device 1</SelectItem>
                  <SelectItem value='device2'>Device 2</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <input
              type='date'
              defaultValue='2025-05-07'
              className='border rounded p-1 text-sm'
            />
            <span className='text-sm'>to</span>
            <input
              type='date'
              defaultValue='2025-05-08'
              className='border rounded p-1 text-sm'
            />
            <Button
              variant='outline'
              size='sm'
              className='bg-blue-500 text-white'
            >
              Filter
            </Button>
          </div>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <Card className='bg-yellow-50'>
            <CardHeader>
              <CardTitle>6 Login Attempts</CardTitle>
            </CardHeader>
            <CardContent>
              <table className='w-full text-sm'>
                <thead>
                  <tr>
                    <th className='text-left p-2'>Con Type</th>
                    <th className='text-left p-2'>IP Address</th>
                  </tr>
                </thead>
                <tbody>
                  {loginAttempts.map((item, index) => (
                    <tr
                      key={index}
                      className={index % 2 === 0 ? 'bg-white' : 'bg-yellow-100'}
                    >
                      <td className='p-2'>{item.conType}</td>
                      <td className='p-2'>{item.ipAddress}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
          <Card className='bg-yellow-50'>
            <CardHeader>
              <CardTitle>Filestation Behaviour</CardTitle>
            </CardHeader>
            <CardContent>
              <table className='w-full text-sm'>
                <thead>
                  <tr>
                    <th className='text-left p-2'>Action</th>
                    <th className='text-left p-2'>Count</th>
                  </tr>
                </thead>
                <tbody>
                  {filestationBehavior.map((item, index) => (
                    <tr
                      key={index}
                      className={index % 2 === 0 ? 'bg-white' : 'bg-yellow-100'}
                    >
                      <td className='p-2'>{item.action}</td>
                      <td className='p-2'>{item.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
        <Card className='mt-4 bg-yellow-50'>
          <CardHeader>
            <CardTitle>Total File Transfer</CardTitle>
          </CardHeader>
          <CardContent className='grid grid-cols-4 gap-4'>
            <div className='flex flex-col items-center'>
              <Upload className='h-8 w-8 text-blue-500' />
              <span>Files {fileTransfer.upload.files}</span>
              <span>Size {fileTransfer.upload.size}</span>
            </div>
            <div className='flex flex-col items-center'>
              <Download className='h-8 w-8 text-blue-500' />
              <span>Files {fileTransfer.download.files}</span>
              <span>Size {fileTransfer.download.size}</span>
            </div>
            <div className='flex flex-col items-center'>
              <Trash2 className='h-8 w-8 text-blue-500' />
              <span>Files {fileTransfer.deleted.files}</span>
              <span>Size {fileTransfer.deleted.size}</span>
            </div>
            <div className='flex flex-col items-center'>
              <X className='h-8 w-8 text-blue-500' />
              <span>Files {fileTransfer.corrupted.files}</span>
              <span>Size {fileTransfer.corrupted.size}</span>
            </div>
          </CardContent>
        </Card>
        <Card className='mt-4 bg-yellow-50'>
          <CardHeader>
            <CardTitle>File Type</CardTitle>
          </CardHeader>
          <CardContent>
            <table className='w-full text-sm'>
              <thead>
                <tr>
                  <th className='text-left p-2'>File Type</th>
                  <th className='text-left p-2'>Download</th>
                  <th className='text-left p-2'>Size of Files</th>
                  <th className='text-left p-2'>Upload</th>
                  <th className='text-left p-2'>Size of Files</th>
                </tr>
              </thead>
              <tbody>
                {fileTypes.map((type, index) => (
                  <tr
                    key={index}
                    className={index % 2 === 0 ? 'bg-white' : 'bg-yellow-100'}
                  >
                    <td className='p-2'>{type}</td>
                    <td className='p-2'></td>
                    <td className='p-2'></td>
                    <td className='p-2'></td>
                    <td className='p-2'></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
