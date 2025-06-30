'use client'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Database } from 'lucide-react'

export default function OverviewSection({ isLoading, overviewData }) {
  return (
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
        {isLoading ? (
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
              <div className='flex items-center justify-center border-2 border-subtitle rounded-lg relative'>
                <div className='relative h-24 sm:h-32 w-16 sm:w-20 flex items-end'>
                  <div className='h-full w-full rounded-md border relative flex items-end'>
                    {/* Percentage Bar */}
                    <div
                      className='absolute bottom-0 left-0 w-full bg-blue-500 rounded-b-md flex items-center justify-center'
                      style={{
                        height: `${overviewData.percentage}%`,
                        transition: 'height 0.5s'
                      }}
                    />
                    {/* Percentage Centered */}
                    <span
                      className='absolute inset-0 flex items-center justify-center text-lg sm:text-xl font-bold z-50 text-title'
                      style={{ lineHeight: '1.2' }}
                    >
                      {overviewData.percentage}%
                    </span>
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
                  readOnly={true}
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
  )
}
