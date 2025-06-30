'use client'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Clock } from 'lucide-react'
import { useState, useEffect } from 'react'
import { UpdateWorkingTimes } from '../server-side'

export default function WorkingTimeSection({ isLoading, workingTimeData, deviceid }) {

  // console.log('workingTimeData:', workingTimeData?.monFri?.start)
  // Initialize state with workingTimeData or default values
  const [workingTimes, setWorkingTimes] = useState({
    monFri: {
      start: workingTimeData?.monFri?.start || '09:00',
      end: workingTimeData?.monFri?.end || '17:00'
    },
    satSun: {
      start: workingTimeData?.satSun?.start || '10:00',
      end: workingTimeData?.satSun?.end || '15:00'
    }
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)

  //console.log('Initial Working Times:', workingTimes);

  // Update state when workingTimeData changes
  useEffect(() => {
    if (workingTimeData) {
      setWorkingTimes({
        monFri: {
          start: workingTimeData?.monFri?.start || '09:00',
          end: workingTimeData?.monFri?.end || '17:00'
        },
        satSun: {
          start: workingTimeData?.satSun?.start || '10:00',
          end: workingTimeData?.satSun?.end || '15:00'
        }
      })
    }
  }, [workingTimeData])

  // console.log('Initial Working Times:', workingTimes?.monFri?.start)

  // Handle input changes
  const handleInputChange = (e, period, field) => {
    setWorkingTimes(prev => ({
      ...prev,
      [period]: {
        ...prev[period],
        [field]: e.target.value
      }
    }))
  }

  // Handle form submission
  const handleSubmit = async () => {
    setIsSubmitting(true)
    setError(null)
    try {
      //console.log('Submitting Working Times:', { deviceId: deviceid, workingTimes })
      const result = await UpdateWorkingTimes(deviceid, workingTimes)
      //console.log('Update successful:', result)
    } catch (err) {
      console.error('Update failed:', err.message)
      setError('Failed to update working times. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
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
        {isLoading ? (
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
            {error && (
              <p className='text-red-500 text-xs sm:text-sm text-center'>{error}</p>
            )}
            <div className='flex flex-col gap-2'>
              <p className='text-subtitle text-xs sm:text-sm'>Monday - Friday</p>
              <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs sm:text-sm text-subtitle gap-2'>
                <input
                  type='time'
                  value={workingTimes.monFri.start}
                  onChange={(e) => handleInputChange(e, 'monFri', 'start')}
                  className='border p-1 rounded border-subtitle text-subtitle text-xs sm:text-sm w-full sm:w-auto'
                  disabled={isSubmitting}
                />
                <span className='hidden sm:inline'>to</span>
                <input
                  type='time'
                  value={workingTimes.monFri.end}
                  onChange={(e) => handleInputChange(e, 'monFri', 'end')}
                  className='border p-1 rounded border-subtitle text-subtitle text-xs sm:text-sm w-full sm:w-auto'
                  disabled={isSubmitting}
                />
              </div>
            </div>
            <div className='flex flex-col gap-2'>
              <p className='text-subtitle text-xs sm:text-sm'>Saturday - Sunday</p>
              <div className='flex flex-col justify-between sm:flex-row items-start sm:items-center text-xs sm:text-sm text-subtitle gap-2'>
                <input
                  type='time'
                  value={workingTimes.satSun.start}
                  onChange={(e) => handleInputChange(e, 'satSun', 'start')}
                  className='border p-1 rounded border-subtitle text-subtitle text-xs sm:text-sm w-full sm:w-auto'
                  disabled={isSubmitting}
                />
                <span className='hidden sm:inline'>to</span>
                <input
                  type='time'
                  value={workingTimes.satSun.end}
                  onChange={(e) => handleInputChange(e, 'satSun', 'end')}
                  className='border p-1 rounded border-subtitle text-subtitle text-xs sm:text-sm w-full sm:w-auto'
                  disabled={isSubmitting}
                />
              </div>
            </div>
            <div className='text-center mt-4 sm:mt-6'>
              <Button
                variant='outline'
                size='xs'
                onClick={handleSubmit}
                className='bg-transparent border border-specialGreen text-xs sm:text-sm text-subtitle px-4 rounded'
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Apply Changes'}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}