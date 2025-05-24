'use client'

import * as React from 'react'
import useAlertStore from '@/lib/store' // Adjust the import path as needed
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AlertCircle, Filter } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

// Mock data for alerts (replace with API fetch)
const mockAlerts = [
  { id: 1, type: 'Warnings', message: 'Invalid file extension : img', user: 'Janitha', device: 'Office_NAS', date: 'May 5', time: '09:55 AM', status: 'Active' },
  { id: 2, type: 'Critical', message: 'Potential ransomware activated detected', user: 'Sarah', device: 'HR_NAS', date: 'May 6', time: '09:55 AM', status: 'Active' },
  { id: 3, type: 'Information', message: 'Unusual Login Time', user: 'Alex W.', device: 'Finans_NAS', date: 'May 6', time: '03:55 AM', status: 'Active' },
  { id: 4, type: 'Critical', message: 'Excessive permission change attempts', user: 'Minsaf', device: 'Office_NAS', date: 'May 5', time: '09:55 AM', status: 'Suspended' },
]

// Get current date and time
const currentDate = new Date().toLocaleString('en-US', {
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

const AlertsPage = () => {
  const { selectedAlertType } = useAlertStore()

  // Filter alerts based on selectedAlertType
  const filteredAlerts = selectedAlertType
    ? mockAlerts.filter(alert => alert.type === selectedAlertType)
    : mockAlerts

  return (
    <div className='p-6'>
      <Card className='w-full'>
        <CardHeader className='border-b'>
          <CardTitle className='text-lg font-semibold'>Over View</CardTitle>
          <p className='text-sm text-muted-foreground'>{currentDate}</p>
        </CardHeader>
        <CardContent className='p-6'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-6'>
            <div className='flex items-center'>
              <Badge variant='destructive' className='mr-2'>Critical</Badge>
              <span>{mockAlerts.filter(a => a.type === 'Critical').length}</span>
            </div>
            <div className='flex items-center'>
              <Badge variant='destructive' className='mr-2'>High Priority</Badge>
              <span>{mockAlerts.filter(a => a.type === 'High Priority').length}</span>
            </div>
            <div className='flex items-center'>
              <Badge variant='warning' className='mr-2'>Warnings</Badge>
              <span>{mockAlerts.filter(a => a.type === 'Warnings').length}</span>
            </div>
            <div className='flex items-center'>
              <Badge variant='secondary' className='mr-2'>Information</Badge>
              <span>{mockAlerts.filter(a => a.type === 'Information').length}</span>
            </div>
          </div>
          <div className='border-t pt-4'>
            <div className='flex justify-between items-center mb-4'>
              <h3 className='text-md font-medium'>Details</h3>
              <Button variant='outline' size='sm'>
                <Filter className='h-4 w-4 mr-2' />
                Filter
              </Button>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className='w-[50px]'></TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Device</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAlerts.map((alert) => (
                  <TableRow key={alert.id}>
                    <TableCell>
                      {alert.type === 'Critical' && <AlertCircle className='h-4 w-4 text-red-500' />}
                      {alert.type === 'Warnings' && <AlertCircle className='h-4 w-4 text-yellow-500' />}
                      {alert.type === 'Information' && <AlertCircle className='h-4 w-4 text-blue-500' />}
                      {alert.type === 'High Priority' && <AlertCircle className='h-4 w-4 text-orange-500' />}
                    </TableCell>
                    <TableCell>{alert.message}</TableCell>
                    <TableCell>{alert.user}</TableCell>
                    <TableCell>{alert.device}</TableCell>
                    <TableCell>{alert.date}</TableCell>
                    <TableCell>{alert.time}</TableCell>
                    <TableCell>
                      <Badge variant={alert.status === 'Active' ? 'success' : 'destructive'}>
                        {alert.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant='ghost' size='sm'>
                        {alert.status === 'Active' ? 'Active' : 'Suspended'} <span className='ml-1'>›</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default AlertsPage