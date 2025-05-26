'use client'

import * as React from 'react'
import useAlertStore from '@/lib/store' // Use default import, adjust path if necessary (e.g., '../../lib/store')
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DetailCard } from '@/components/alerts/detail-cards' // Adjust the import path as needed
import { PopOver } from '@/components/alerts/pop-over' // Adjust the import path as needed

// Mock data for alerts (replace with API fetch)
const mockAlerts = [
  { id: 1, type: 'Warnings', message: 'Invalid file extension : img', user: 'Janitha', device: 'Office_NAS', date: 'May 5', time: '09:55 AM', status: 'Active' },
  { id: 2, type: 'Critical', message: 'Potential ransomware activated detected', user: 'Sarah', device: 'HR_NAS', date: 'May 6', time: '09:55 AM', status: 'Active' },
  { id: 3, type: 'Information', message: 'Unusual Login Time', user: 'Alex W.', device: 'Finans_NAS', date: 'May 6', time: '03:55 AM', status: 'Active' },
  { id: 4, type: 'Critical', message: 'Excessive permission change attempts', user: 'Minsaf', device: 'Office_NAS', date: 'May 5', time: '09:55 AM', status: 'Suspended' },
]

// Get current date and time (updated to May 26, 2025, 11:26 AM +0530)
const currentDate = new Date('2025-05-26T11:26:00+05:30').toLocaleString('en-US', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  timeZoneName: 'short',
  hour12: true,
  timeZone: 'Asia/Kolkata',
})

const AlertTypes = {
  information: { label: 'Information', color: 'bg-info' },
  warnings: { label: 'Warnings', color: 'bg-warning' },
  critical: { label: 'Critical', color: 'bg-critical' },
  highPriority: { label: 'High Priority', color: 'bg-highpriority' }
}

const Periods = {
  today: { label: 'Today', value: 'today' },
  yesterday: { label: 'Yesterday', value: 'yesterday' },
  last7Days: { label: 'Last 7 Days', value: 'last7Days' },
  last30Days: { label: 'Last 30 Days', value: 'last30Days' }
}

// Helper functions to determine date ranges (moved above filteredAlerts)
const isYesterday = (dateStr) => {
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(today.getDate() - 1)
  return dateStr === yesterday.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

const isWithinLast7Days = (dateStr) => {
  const today = new Date()
  const alertDate = new Date(dateStr + ', ' + new Date().getFullYear())
  const diffTime = Math.abs(today - alertDate)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays <= 7
}

const isWithinLast30Days = (dateStr) => {
  const today = new Date()
  const alertDate = new Date(dateStr + ', ' + new Date().getFullYear())
  const diffTime = Math.abs(today - alertDate)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays <= 30
}

const AlertsPage = () => {
  const { selectedAlertType, selectedDevice, selectedPeriod } = useAlertStore() || { selectedAlertType: null, selectedDevice: null, selectedPeriod: null }

  // Filter alerts based on selected filters
  const filteredAlerts = mockAlerts.filter(alert => {
    const normalizedAlertType = alert.type.toLowerCase()
    const normalizedSelectedAlertType = selectedAlertType ? selectedAlertType.toLowerCase() : null
    const matchesAlertType = !normalizedSelectedAlertType || normalizedAlertType === normalizedSelectedAlertType
    const matchesDevice = !selectedDevice || alert.device === selectedDevice
    const matchesPeriod = !selectedPeriod || (selectedPeriod === 'today' && alert.date === new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) ||
      selectedPeriod === 'yesterday' && isYesterday(alert.date) ||
      selectedPeriod === 'last7Days' && isWithinLast7Days(alert.date) ||
      selectedPeriod === 'last30Days' && isWithinLast30Days(alert.date))

    return matchesAlertType && matchesDevice && matchesPeriod
  })

  // Get unique devices from mockAlerts as an array
  const allDevices = Array.from(new Set(mockAlerts.map(alert => alert.device)))

  return (
    <div className=''>
      <Card className='w-full border-none shadow-none'>
        <CardHeader className='rounded-t-lg bg-specialbg mb-2 bg-opacity-25'>
          <CardTitle className='text-sm sm:text-base text-subtitle font-semibold'>Alerts</CardTitle>
        </CardHeader>
        <CardContent className='p-2 '>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6'>
            <div className='flex flex-col items-start justify-start bg-white p-2 sm:p-3 ps-4 sm:ps-5 border-start border-x-8 border-critical rounded-xl shadow-md text-title'>
              <h1 variant='destructive' className='mr-2 text-lg sm:text-xl'>Critical</h1>
              <span className='font-extrabold text-3xl sm:text-4xl'>{mockAlerts.filter(a => a.type === 'Critical').length}</span>
            </div>
            <div className='flex flex-col items-start justify-start bg-white p-2 sm:p-3 ps-4 sm:ps-5 border-start border-x-8 border-warning rounded-xl shadow-md text-title'>
              <h1 variant='destructive' className='mr-2 text-lg sm:text-xl'>Warnings</h1>
              <span className='font-extrabold text-3xl sm:text-4xl'>{mockAlerts.filter(a => a.type === 'Warnings').length}</span>
            </div>
            <div className='flex flex-col items-start justify-start bg-white p-2 sm:p-3 ps-4 sm:ps-5 border-start border-x-8 border-highpriority rounded-xl shadow-md text-title'>
              <h1 variant='destructive' className='mr-2 text-lg sm:text-xl'>High Priority</h1>
              <span className='font-extrabold text-3xl sm:text-4xl'>{mockAlerts.filter(a => a.type === 'High Priority').length}</span>
            </div>
            <div className='flex flex-col items-start justify-start bg-white p-2 sm:p-3 ps-4 sm:ps-5 border-start border-x-8 border-info rounded-xl shadow-md text-title'>
              <h1 variant='destructive' className='mr-2 text-lg sm:text-xl'>Information</h1>
              <span className='font-extrabold text-3xl sm:text-4xl'>{mockAlerts.filter(a => a.type === 'Information').length}</span>
            </div>
          </div>
          <div className='pt-4'>
            <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2'>
              <h3 className='text-sm sm:text-md text-subtitle font-medium'>Details</h3>
              <PopOver Devices={allDevices} AlertTypes={AlertTypes} Periods={Periods} />
            </div>
            <DetailCard data={filteredAlerts} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default AlertsPage