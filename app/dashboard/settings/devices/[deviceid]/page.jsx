'use client'

import { useParams } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Clock, Database, FileCog, FileType, RefreshCw, Trash } from 'lucide-react'
import { Input } from '@/components/ui/input'

export default function DeviceEdit () {
  const params = useParams()
  const { deviceId } = params

  // Mock data based on deviceId (simplified for this example)
  const devices = {
    'device-001': {
      name: 'Shaheer NAS',
      ip: '192.168.0.53',
      port: '5000',
      logCount: {
        allocated: 25000,
        used: 20000,
        available: 5000
      },
      status: 'Active',
      workingTime: {
        monFri: { start: '08:00 AM', end: '05:00 PM' },
        satSun: { start: '08:00 AM', end: '12:30 PM' }
      },
      extensions: [
        { name: 'Doc', maxSize: '500MB', enabled: true },
        { name: 'XLS', maxSize: '500MB', enabled: true },
        { name: 'XLSX', maxSize: '200MB', enabled: false },
        { name: 'img', maxSize: '200MB', enabled: false }
      ]
    },
    'device-002': {
      name: 'Shaheer NAS',
      ip: '192.168.0.53',
      port: '5000',
      logCount: {
        allocated: 25000,
        used: 20000,
        available: 5000
      },
      status: 'Deactive',
      workingTime: {
        monFri: { start: '08:00 AM', end: '05:00 PM' },
        satSun: { start: '08:00 AM', end: '12:30 PM' }
      },
      extensions: [
        { name: 'Doc', maxSize: '500MB', enabled: true },
        { name: 'XLS', maxSize: '500MB', enabled: false },
        { name: 'XLSX', maxSize: '200MB', enabled: false },
        { name: 'img', maxSize: '200MB', enabled: true }
      ]
    },
    'device-003': {
      name: 'Active Com',
      ip: '192.168.0.39',
      port: '514',
      logCount: {
        allocated: 25000,
        used: 20000,
        available: 5000
      },
      status: 'Active',
      workingTime: {
        monFri: { start: '08:00 AM', end: '05:00 PM' },
        satSun: { start: '08:00 AM', end: '12:30 PM' }
      },
      extensions: [
        { name: 'Doc', maxSize: '500MB', enabled: true },
        { name: 'XLS', maxSize: '500MB', enabled: true },
        { name: 'XLSX', maxSize: '200MB', enabled: false },
        { name: 'img', maxSize: '200MB', enabled: false }
      ]
    }
  }

  const device = devices[deviceId] || devices['device-003'] // Default to "Active Com" if deviceId not found

  return (
    <div className='p-2 pt-0 mx-auto'>
      {/* Filter section */}
      <div className='flex items-center justify-between rounded-t-lg bg-specialbg bg-opacity-25 mb-6'>
        <h1 className='text-lg font-bold p-2 text-title'>Edit Device</h1>
        <div className='flex space-x-2 justify-center items-center'>
          <Button
            variant='destructive'
            size='sm'
            className='border-none bg-transparent hover:bg-transparent'
          >
            <RefreshCw className='h-4 w-4 mr-1 text-title' />
          </Button>
          <Switch id='status' size='sm' className='p-0 m-0' />
          <Button
            variant='destructive'
            size='sm'
            className='border-none bg-transparent hover:bg-transparent'
          >
            <Trash className='h-4 w-4 mr-1 text-critical' />
          </Button>
        </div>
      </div>
      <div className='flex items-center gap-5 justify-between mb-1'>
        {/* Overview Section */}
        <div className='bg-white p-4 rounded-lg w-3/5 shadow-md mb-1'>
          <div className='flex items-center justify-start gap-2 mb-4'>
            <Database className='h-4 w-4 text-specialBlue ' />
            <h2 className='text-xs font-semibold text-subtitle'>Over View</h2>
          </div>
          <div className='flex items-center justify-center gap-5 w-full '>
            <div className='flex items-center justify-center space-x-4 w-full'>
              <div className='flex flex-col w-1/4 items-center justify-center'>
                <div className='bg-subtitle w-10 h-3 rounded-t-lg'></div>
                <div className='flex items-center justify-center border-2 border-subtitle rounded-lg'>
                  <div className='relative h-32 w-20'>
                    <div className='absolute inset-0 flex flex-col items-center justify-center text-center'>
                      <span className='text-xl font-bold text-black'>
                        34.5%
                      </span>
                    </div>
                    <div className='h-full w-full rounded-md border relative'>
                      <div className='absolute bottom-0 left-0 w-full h-[34.5%] bg-blue-500 rounded-b-md'></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='flex flex-col justify-start items-start'>
                <div className='flex items-center justify-between w-full gap-2 mb-2'>
                  <p className='text-subtitle text-sm'>
                    Allocated Log Count :{' '}
                  </p>
                  <Input
                    type='number'
                    className='text-subtitle w-52 h-10 justify-end font-semibold border-0 rounded-none p-0 pl-1 border-b border-title'
                    value={device.logCount.allocated}
                  />
                </div>
                <div className='flex items-center w-full justify-between gap-2 mb-2'>
                  <p className='text-subtitle text-sm'>Used Log Count : </p>
                  <Input
                    type='number'
                    className='text-subtitle w-52 font-semibold border-0 rounded-none p-0 pl-1 border-b border-title'
                    value={device.logCount.used}
                    disabled
                  />
                </div>
                <div className='flex items-center justify-between w-full gap-2 mb-2'>
                  <p className='text-subtitle text-sm'>
                    Available Log Count :{' '}
                  </p>
                  <Input
                    type='number'
                    className='text-subtitle w-52 font-semibold border-0 rounded-none p-0 pl-1 border-b border-title'
                    value={device.logCount.available}
                    disabled
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Working Time Section */}
        <div className='text-start bg-white p-4 rounded-lg w-2/5 shadow-md mb-6'>
          <div className='flex items-center justify-start gap-2 mb-4'>
            <Clock className='h-4 w-4 text-specialGreen' />
            <p className='text-subtitle font-semibold text-xs'>Working Time</p>
          </div>
          <div className='flex flex-col gap-2'>
            <div className='flex flex-col gap-2'>
              <p className='text-subtitle text-sm'>Monday - Friday</p>
              <div className='flex items-center text-sm text-subtitle justify-between'>
                <input
                  type='time'
                  defaultValue={device.workingTime.monFri.start}
                  className='border p-1 rounded border-subtitle text-subtitle text-sm'
                />
                to
                <input
                  type='time'
                  defaultValue={device.workingTime.monFri.end}
                  className='border p-1 rounded border-subtitle text-subtitle text-sm'
                />
              </div>
            </div>
            <div className='flex flex-col gap-2'>
              <p className='text-subtitle text-sm'>Saturday - Sunday</p>
              <div className='flex items-center text-sm text-subtitle justify-between'>
                <input
                  type='time'
                  defaultValue={device.workingTime.satSun.start}
                  className='border p-1 rounded border-subtitle text-subtitle text-sm'
                />
                to
                <input
                  type='time'
                  defaultValue={device.workingTime.satSun.end}
                  className='border p-1 rounded border-subtitle text-subtitle text-sm'
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='flex items-center justify-between gap-3 mb-6'>
        {/* General Section */}
        <div className='bg-white p-2 py-11 w-2/5 rounded-lg shadow-md mb-6'>
          <div className='flex items-center justify-start gap-2 mb-4'>
            <FileCog className='h-4 w-4 text-specialGreen ' />
            <h2 className='text-sm font-semibold text-subtitle'>General</h2>
          </div>
          <div className='space-y-2'>
            <div>
              <label className='block text-xs font-medium text-subtitle'>
                Device Name
              </label>
              <Input
                type='text'
                defaultValue={device.name}
                className='w-full p-0 border-0 border-b  text-sm text-subtitle font-semibold border-subtitle rounded-none focus:ring-0 focus:border-0 '
              />
            </div>
            <div>
              <label className='block text-xs font-medium text-subtitle'>
                IP Address
              </label>
              <Input
                type='text'
                defaultValue={device.ip}
                className='w-full p-0 border-0 border-b text-sm  text-subtitle font-semibold border-subtitle rounded-none focus-ring-0'
              />
            </div>
            <div>
              <label className='block text-xs font-medium text-subtitle'>
                Port
              </label>
              <Input
                type='text'
                defaultValue={device.port}
                className='w-full p-0 border-0 border-b text-sm  text-subtitle font-semibold border-subtitle rounded-none focus-ring-0'
              />
            </div>
            <div>
                <Button
                    variant='outline'
                    size='sm'
                    className='border-subtitle text-subtitle mt-2 w-full'
                >
                    Apply Changes
                </Button>
          </div>
        </div>
        {/* Extensions Section */}
        <div className='bg-white p-4 w-3/5 rounded-lg shadow-md mb-6'>
          <div className='flex justify-between items-center mb-4'>
            <div className='flex items-center gap-2'>
              <FileType className='h-4 w-4 text-specialBlue' />
              <h2 className='text-xs text-subtitle'>Extensions</h2>
            </div>
            <Button variant='outline' size='xs' className='border-specialBlue  px-3 text-subtitle'>
              + Extension
            </Button>
          </div>
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead>
                <tr className='bg-muted/40'>
                  <th className='p-2 text-left text-sm font-medium text-gray-700'>
                    Extension
                  </th>
                  <th className='p-2 text-left text-sm font-medium text-gray-700'>
                    Max Size
                  </th>
                  <th className='p-2 text-center text-sm font-medium text-gray-700'>
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {device.extensions.map((ext, index) => (
                  <tr key={index} className='border-t'>
                    <td className='p-2'>{ext.name}</td>
                    <td className='p-2'>{ext.maxSize}</td>
                    <td className='p-2 text-center'>
                      <Switch checked={ext.enabled} className='mr-2' />
                      <Button
                        variant='outline'
                        size='sm'
                        className='border-subtitle text-red-500'
                      >
                        <svg
                          className='h-4 w-4'
                          fill='none'
                          stroke='currentColor'
                          viewBox='0 0 24 24'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth='2'
                            d='M19 7l-7 7m0 0l-7-7m7 7v10'
                          />
                        </svg>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Apply Changes Button */}
      <div className='text-right'>
        <Button className='bg-green-500 text-white px-4 py-2 rounded'>
          Apply Changes
        </Button>
      </div>
    </div>
  )
}
