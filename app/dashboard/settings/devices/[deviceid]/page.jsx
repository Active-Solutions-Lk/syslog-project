'use client'

import { useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import ExtensionTable from './extension-table'
import {
  Clock,
  Database,
  FileCog,
  FileType,
  RefreshCw,
  Trash
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import ExtensionPopover from './pop-over'

export default function DeviceEdit () {
  const params = useParams()
  const { deviceId } = params

  // Loading states for each section
  const [isOverviewLoading, setIsOverviewLoading] = useState(true)
  const [isWorkingTimeLoading, setIsWorkingTimeLoading] = useState(true)
  const [isGeneralLoading, setIsGeneralLoading] = useState(true)
  const [isExtensionsLoading, setIsExtensionsLoading] = useState(true)

  // Data states for each section
  const [overviewData, setOverviewData] = useState(null)
  const [workingTimeData, setWorkingTimeData] = useState(null)
  const [generalData, setGeneralData] = useState(null)
  const [extensionsData, setExtensionsData] = useState(null)

  // Mock data
  const mockDevices = {
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
        { name: 'img', maxSize: '200MB', enabled: false },
        { name: 'txt', maxSize: '100MB', enabled: true },
        { name: 'log', maxSize: '100MB', enabled: true },
        { name: 'json', maxSize: '100MB', enabled: true }
      ]
    }
  }

  // Mock fetch functions with random delays
  const getRandomDelay = () => Math.floor(Math.random() * 2000) + 1000 // 1-3 seconds

  const fetchOverviewData = async () => {
    return new Promise(resolve => {
      setTimeout(() => {
        const device = mockDevices[deviceId] || mockDevices['device-003']
        resolve({
          logCount: device.logCount,
          percentage: (
            (device.logCount.used / device.logCount.allocated) *
            100
          ).toFixed(1)
        })
      }, getRandomDelay())
    })
  }

  const fetchWorkingTimeData = async () => {
    return new Promise(resolve => {
      setTimeout(() => {
        const device = mockDevices[deviceId] || mockDevices['device-003']
        resolve(device.workingTime)
      }, getRandomDelay())
    })
  }

  const fetchGeneralData = async () => {
    return new Promise(resolve => {
      setTimeout(() => {
        const device = mockDevices[deviceId] || mockDevices['device-003']
        resolve({
          name: device.name,
          ip: device.ip,
          port: device.port
        })
      }, getRandomDelay())
    })
  }

  const fetchExtensionsData = async () => {
    return new Promise(resolve => {
      setTimeout(() => {
        const device = mockDevices[deviceId] || mockDevices['device-003']
        resolve(device.extensions)
      }, getRandomDelay())
    })
  }

  // Fetch data for all sections
  const fetchAllData = async () => {
    setIsOverviewLoading(true)
    setIsWorkingTimeLoading(true)
    setIsGeneralLoading(true)
    setIsExtensionsLoading(true)

    const [overview, workingTime, general, extensions] = await Promise.all([
      fetchOverviewData(),
      fetchWorkingTimeData(),
      fetchGeneralData(),
      fetchExtensionsData()
    ])

    setOverviewData(overview)
    setWorkingTimeData(workingTime)
    setGeneralData(general)
    setExtensionsData(extensions)

    setIsOverviewLoading(false)
    setIsWorkingTimeLoading(false)
    setIsGeneralLoading(false)
    setIsExtensionsLoading(false)
  }

  // Initial data fetch
  useEffect(() => {
    fetchAllData()
  }, [deviceId])

  const handleSaveExtension = (newExtension, originalExtension) => {
    setExtensionsData(prevExtensions => {
      if (originalExtension) {
        return prevExtensions.map(ext =>
          ext.name === originalExtension.name ? newExtension : ext
        )
      } else {
        return [...prevExtensions, newExtension]
      }
    })
  }

  const handleRefresh = () => {
    fetchAllData()
  }

  return (
    <div className='p-0 sm:p-0 md:p-0 mx-auto w-full'>
      {/* Filter section */}
      <Card className='rounded-t-lg rounded-0 shadow-none p-0 bg-specialbg bg-opacity-25 mb-3'>
        <CardHeader className='flex flex-row shadow-none border-none items-center justify-between p-1 sm:p-2'>
          <CardTitle className='text-lg sm:text-xl font-bold text-title'>
            {generalData?.name || <Skeleton className='h-6 w-32' />}
          </CardTitle>
          <div className='flex space-x-2 justify-center items-center'>
            <Button
              variant='destructive'
              size='sm'
              className='border-none bg-transparent hover:bg-transparent'
              onClick={handleRefresh}
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
        </CardHeader>
      </Card>
      <div className='flex flex-col md:flex-row items-center gap-4 md:gap-6 mb-4'>
        {/* Overview Section */}
        <Card className='w-full md:w-3/5 shadow-md pt-0 mt-0 mb-4'>
          <CardHeader>
            <div className='flex items-center justify-start gap-2'>
              <Database className='h-4 w-4 text-specialBlue' />
              <CardTitle className='text-xs sm:text-sm font-semibold text-subtitle'>
                Overview
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {isOverviewLoading ? (
              <div className='flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 w-full'>
                <div className='flex flex-col w-full sm:w-1/4 items-center justify-center'>
                  <Skeleton className='w-10 h-3 rounded-t-lg' />
                  <Skeleton className='h-24 sm:h-32 w-16 sm:w-20 rounded-lg' />
                </div>
                <div className='flex flex-col justify-start items-start w-full sm:w-auto space-y-2'>
                  <Skeleton className='h-8 w-full sm:w-48' />
                  <Skeleton className='h-8 w-full sm:w-48' />
                  <Skeleton className='h-8 w-full sm:w-48' />
                  <Skeleton className='h-6 w-24 ml-auto' />
                </div>
              </div>
            ) : (
              <div className='flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 w-full'>
                <div className='flex flex-col w-full sm:w-1/4 items-center justify-center'>
                  <div className='bg-subtitle w-10 h-3 rounded-t-lg'></div>
                  <div className='flex items-center justify-center border-2 border-subtitle rounded-lg'>
                    <div className='relative h-24 sm:h-32 w-16 sm:w-20 flex items-end'>
                      <div className='h-full w-full rounded-md border relative flex items-end'>
                        <div
                          className='absolute bottom-0 left-0 w-full bg-blue-500 rounded-b-md flex items-center justify-center'
                          style={{
                            height: `${overviewData.percentage}%`,
                            transition: 'height 0.5s'
                          }}
                        >
                          <span
                            className='text-lg sm:text-xl font-bold text-title w-full text-center'
                            style={{ lineHeight: '1.2' }}
                          >
                            {overviewData.percentage}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='flex flex-col justify-center items-start w-full sm:w-auto'>
                  <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-2 mb-2'>
                    <p className='text-subtitle text-xs sm:text-sm'>
                      Allocated Log Count:
                    </p>
                    <Input
                      type='number'
                      className='text-subtitle w-full sm:w-48 h-8 sm:h-10 font-semibold border-0 rounded-none p-0 pl-1 border-b border-title'
                      value={overviewData.logCount.allocated}
                    />
                  </div>
                  <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-2 mb-2'>
                    <p className='text-subtitle text-xs sm:text-sm'>
                      Used Log Count:
                    </p>
                    <Input
                      type='number'
                      className='text-subtitle w-full sm:w-48 font-semibold border-0 rounded-none p-0 pl-1 border-b border-title'
                      value={overviewData.logCount.used}
                      disabled
                    />
                  </div>
                  <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-2 mb-2'>
                    <p className='text-subtitle text-xs sm:text-sm'>
                      Available Log Count:
                    </p>
                    <Input
                      type='number'
                      className='text-subtitle w-full sm:w-48 font-semibold border-0 rounded-none p-0 pl-1 border-b border-title'
                      value={overviewData.logCount.available}
                      disabled
                    />
                  </div>
                  <div className='text-end justify-end w-full my-5 items-end'>
                    <Button
                      variant='outline'
                      size='xs'
                      className='bg-transparent border border-specialBlue text-xs sm:text-sm text-subtitle px-4 rounded'
                    >
                      Apply Changes
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        {/* Working Time Section */}
        <Card className='text-start w-full md:w-2/5 shadow-md py-2 mb-4'>
          <CardHeader>
            <div className='flex items-center justify-start gap-2'>
              <Clock className='h-4 w-4 text-specialGreen' />
              <CardTitle className='text-xs sm:text-sm font-semibold text-subtitle'>
                Working Time
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {isWorkingTimeLoading ? (
              <div className='flex flex-col mb-3 gap-2'>
                <Skeleton className='h-4 w-32' />
                <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2'>
                  <Skeleton className='h-8 w-full sm:w-24' />
                  <Skeleton className='h-8 w-full sm:w-24' />
                </div>
                <Skeleton className='h-4 w-32' />
                <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2'>
                  <Skeleton className='h-8 w-full sm:w-24' />
                  <Skeleton className='h-8 w-full sm:w-24' />
                </div>
                <Skeleton className='h-6 w-24 mx-auto mt-4' />
              </div>
            ) : (
              <div className='flex flex-col mb-3 gap-2'>
                <div className='flex flex-col gap-2'>
                  <p className='text-subtitle text-xs sm:text-sm'>
                    Monday - Friday
                  </p>
                  <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs sm:text-sm text-subtitle gap-2'>
                    <input
                      type='time'
                      defaultValue={workingTimeData.monFri.start}
                      className='border p-1 rounded border-subtitle text-subtitle text-xs sm:text-sm w-full sm:w-auto'
                    />
                    <span className='hidden sm:inline'>to</span>
                    <input
                      type='time'
                      defaultValue={workingTimeData.monFri.end}
                      className='border p-1 rounded border-subtitle text-subtitle text-xs sm:text-sm w-full sm:w-auto'
                    />
                  </div>
                </div>
                <div className='flex flex-col gap-2'>
                  <p className='text-subtitle text-xs sm:text-sm'>
                    Saturday - Sunday
                  </p>
                  <div className='flex flex-col justify-between sm:flex-row items-start sm:items-center text-xs sm:text-sm text-subtitle gap-2'>
                    <input
                      type='time'
                      defaultValue={workingTimeData.satSun.start}
                      className='border p-1 rounded border-subtitle text-subtitle text-xs sm:text-sm w-full sm:w-auto'
                    />
                    <span className='hidden sm:inline'>to</span>
                    <input
                      type='time'
                      defaultValue={workingTimeData.satSun.end}
                      className='border p-1 rounded border-subtitle text-subtitle text-xs sm:text-sm w-full sm:w-auto'
                    />
                  </div>
                </div>
                <div className='text-center mt-4 sm:mt-6'>
                  <Button
                    variant='outline'
                    size='xs'
                    className='bg-transparent border border-specialGreen text-xs sm:text-sm text-subtitle px-4 rounded'
                  >
                    Apply Changes
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <div className='flex flex-col md:flex-row items-start gap-4 md:gap-6 mb-4'>
        <Card className='w-full md:w-2/5 shadow-md mb-4'>
          <CardHeader>
            <div className='flex items-center justify-start gap-2'>
              <FileCog className='h-4 w-4 text-specialGreen' />
              <CardTitle className='text-xs sm:text-sm font-semibold text-subtitle'>
                General
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className='pt-4 sm:pt-6'>
            {isGeneralLoading ? (
              <div className='space-y-2 mb-2'>
                <Skeleton className='h-4 w-24' />
                <Skeleton className='h-8 w-full' />
                <Skeleton className='h-4 w-24' />
                <Skeleton className='h-8 w-full' />
                <Skeleton className='h-4 w-24' />
                <Skeleton className='h-8 w-full' />
                <Skeleton className='h-6 w-24 ml-auto' />
              </div>
            ) : (
              <div className='space-y-2 mb-2'>
                <div>
                  <label className='block text-xs sm:text-sm font-medium text-subtitle'>
                    Device Name
                  </label>
                  <Input
                    type='text'
                    defaultValue={generalData.name}
                    className='w-full p-0 border-0 border-b text-xs sm:text-sm text-subtitle font-semibold border-subtitle rounded-none focus:ring-0 focus:border-0'
                  />
                </div>
                <div>
                  <label className='block text-xs sm:text-sm font-medium text-subtitle'>
                    IP Address
                  </label>
                  <Input
                    type='text'
                    defaultValue={generalData.ip}
                    className='w-full p-0 border-0 border-b text-xs sm:text-sm text-subtitle font-semibold border-subtitle rounded-none focus:ring-0'
                  />
                </div>
                <div>
                  <label className='block text-xs sm:text-sm font-medium text-subtitle'>
                    Port
                  </label>
                  <Input
                    type='text'
                    defaultValue={generalData.port}
                    className='w-full p-0 border-0 border-b text-xs sm:text-sm text-subtitle font-semibold border-subtitle rounded-none focus:ring-0'
                  />
                </div>
                <div className='text-right mt-2'>
                  <Button
                    variant='outline'
                    size='xs'
                    className='bg-transparent border border-specialGreen text-xs sm:text-sm text-subtitle px-4 rounded'
                  >
                    Apply Changes
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        <Card className='w-full md:w-3/5 shadow-md mb-4'>
          <CardHeader>
            <div className='flex justify-between items-center'>
              <div className='flex items-center gap-2'>
                <FileType className='h-4 w-4 text-specialBlue' />
                <CardTitle className='text-xs sm:text-sm text-subtitle'>
                  Extensions
                </CardTitle>
              </div>
              <ExtensionPopover
                extension={null}
                onSave={handleSaveExtension}
                trigger={
                  <Button
                    variant='outline'
                    size='xs'
                    className='border-specialBlue px-3 text-xs sm:text-sm text-subtitle'
                  >
                    + Extension
                  </Button>
                }
              />
            </div>
          </CardHeader>
          <CardContent>
            {isExtensionsLoading ? (
              <div className='space-y-2'>
                <Skeleton className='h-8 w-full' />
                <Skeleton className='h-8 w-full' />
                <Skeleton className='h-8 w-full' />
              </div>
            ) : (
              <ExtensionTable
                device={{ extensions: extensionsData }}
                onSaveExtension={handleSaveExtension}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
