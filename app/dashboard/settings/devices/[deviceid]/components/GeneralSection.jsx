'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { FileCog } from 'lucide-react'

export default function GeneralSection({ isLoading, generalData }) {
  // Initialize state with generalData values or empty strings
  const [formData, setFormData] = useState({
    name: generalData?.name || '',
    ip: generalData?.ip || '',
    port: generalData?.port || ''
  })

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Form submitted with data:', formData)
  }

  return (
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
        {isLoading ? (
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
          <form onSubmit={handleSubmit} className='space-y-2 mb-2'>
            <div>
              <label className='block text-xs sm:text-sm font-medium text-subtitle'>
                Device Name
              </label>
              <Input
                type='text'
                name='name'
                value={formData.name}
                disabled={true} // Assuming Device Name is not editable
                onChange={handleInputChange}
                className='w-full p-0 border-0 border-b text-xs sm:text-sm text-subtitle font-semibold border-subtitle rounded-none focus:ring-0 focus:border-0'
              />
            </div>
            <div>
              <label className='block text-xs sm:text-sm font-medium text-subtitle'>
                IP Address
              </label>
              <Input
                type='text'
                name='ip'
                value={formData.ip}
                onChange={handleInputChange}
                className='w-full p-0 border-0 border-b text-xs sm:text-sm text-subtitle font-semibold border-subtitle rounded-none focus:ring-0'
                disabled={true} // Assuming IP is not editable
              />
            </div>
            <div>
              <label className='block text-xs sm:text-sm font-medium text-subtitle'>
                Port
              </label>
              <Input
                type='text'
                name='port'
                value={formData.port}
                onChange={handleInputChange}
                disabled={true} // Assuming Port is not editable
                className='w-full p-0 border-0 border-b text-xs sm:text-sm text-subtitle font-semibold border-subtitle rounded-none focus:ring-0'
              />
            </div>
            <div className='text-right mt-2'>
              <Button
                type='submit'
                variant='outline'
                size='xs'
                disabled={true} // Assuming no changes can be applied
                className='bg-transparent border border-specialGreen text-xs sm:text-sm text-subtitle px-4 rounded'
              >
                Apply Changes
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  )
}