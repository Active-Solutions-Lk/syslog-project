'use client'

import { useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { RefreshCw, Trash } from 'lucide-react'

// Server-side
import { fetchDeviceData } from './server-side'

// Sections
import OverviewSection from './components/OverviewSection'
import WorkingTimeSection from './components/WorkingTimeSection'
import GeneralSection from './components/GeneralSection'
import ExtensionsSection from './components/ExtensionsSection'

export default function DeviceEdit() {
  const params = useParams()
  const { deviceid: deviceId } = params
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [deviceData, setDeviceData] = useState(null)

  const fetchAllData = async () => {
    setIsLoading(true)
    setError(null)
    try {
      // Validate deviceId
      if (!deviceId || typeof deviceId !== 'string') {
        throw new Error('Device ID is missing or invalid')

      }
      // Parse 'device-001' to 1
      const numericDeviceId = parseInt(deviceId.replace('device-', ''))
      if (isNaN(numericDeviceId)) {
        throw new Error(`Invalid deviceId format: ${deviceId}`)
      }
      const data = await fetchDeviceData(numericDeviceId)
      if (!data) {
        throw new Error('No device data returned')
      }

      // console.log('data',data)
      // Calculate percentage for OverviewSection
      const percentage = ((data.logCount.used / data.logCount.allocated) * 100).toFixed(1)
      setDeviceData({ ...data, percentage })
    } catch (err) {
      console.error('Fetch Data Error:', err)
      setError(`Failed to load device data: ${err.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchAllData()
  }, [deviceId])

  const handleSaveExtension = (newExtension, originalExtension) => {
    setDeviceData(prevData => {
      if (!prevData) return prevData
      const updatedExtensions = originalExtension
        ? prevData.extensions.map(ext =>
            ext.name === originalExtension.name ? newExtension : ext
          )
        : [...prevData.extensions, newExtension]
      return { ...prevData, extensions: updatedExtensions }
    })
  }

  const handleRefresh = () => {
    fetchAllData()
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>
  }

  // console.log('deviceData',deviceData);

  return (
    <div className='p-0 sm:p-0 md:p-0 mx-auto w-full'>
      {/* Header */}
      <Card className='rounded-t-lg rounded-0 shadow-none p-0 bg-specialbg bg-opacity-25 mb-3'>
        <CardHeader className='flex flex-row shadow-none border-none items-center justify-between p-1 sm:p-2'>
          <CardTitle className='text-lg sm:text-xl font-bold text-title'>
            {deviceData?.name || <Skeleton className='h-6 w-32' />}
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

      {/* Sections */}
      <div className='flex flex-col md:flex-row items-center gap-4 md:gap-6 mb-4'>
        <OverviewSection isLoading={isLoading} overviewData={deviceData ? { logCount: deviceData.logCount, percentage: deviceData.percentage } : null} />
        <WorkingTimeSection isLoading={isLoading} workingTimeData={deviceData?.workingTime} deviceid ={deviceId} />
      </div>

      <div className='flex flex-col md:flex-row items-start gap-4 md:gap-6 mb-4'>
        <GeneralSection isLoading={isLoading} generalData={deviceData ? { name: deviceData.name, ip: deviceData.ip, port: deviceData.port } : null} />
        <ExtensionsSection
          isLoading={isLoading}
          extensionsData={deviceData?.extensions}
          handleSaveExtension={handleSaveExtension}
          deviceId = {deviceId}
        />
      </div>
    </div>
  )
}