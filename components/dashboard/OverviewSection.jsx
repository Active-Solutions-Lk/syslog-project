// OverviewSection.jsx
// =========================================

import React from 'react'
import { motion, useInView } from 'framer-motion'
import { Disc } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import ProgressBar from '@/components/dashboard/progress-bar'
import CustomBarChart from '@/components/dashboard/bar-chart'

export default function OverviewSection ({
  itemVariants,
  usagePercentage,
  progressBarData,
  BarchartData,
  loading,
  logStatsError
}) {
  const overviewTitleRef = React.useRef(null)
  const overviewCardRef = React.useRef(null)
  const inViewOverviewTitle = useInView(overviewTitleRef, true)
  const inViewOverviewCard = useInView(overviewCardRef, true)

  const BarchartConfig = {
    desktop: {
      label: 'This Year',
      color: '#2563eb'
    }
  }

  // Skeleton Loading Component
  const SkeletonLoader = () => (
    <div className='animate-pulse'>
      <div className='h-4 w-24 bg-gray-200 rounded mb-4'></div>
      <Card className='mb-4'>
        <CardHeader className='pb-2'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-1'>
              <div className='h-4 w-4 bg-gray-200 rounded-full'></div>
              <div className='h-4 w-32 bg-gray-200 rounded'></div>
            </div>
            <div className='h-4 w-16 bg-gray-200 rounded'></div>
          </div>
        </CardHeader>
        <CardContent>
          <div className='flex items-start justify-between gap-4'>
            <div className='flex flex-col w-1/4 items-center justify-center'>
              <div className='bg-gray-200 w-10 h-3 rounded-t-lg'></div>
              <div className='flex items-center justify-center border-2 border-gray-200 rounded-lg'>
                <div className='relative h-52 w-32'>
                  <div className='absolute inset-0 flex flex-col items-center justify-center'>
                    <div className='h-6 w-16 bg-gray-200 rounded'></div>
                  </div>
                  <div className='h-full w-full rounded-md border bg-gray-200'></div>
                </div>
              </div>
            </div>
            <div className='w-3/4 space-y-4'>
              <div>
                <div className='h-2 w-full bg-gray-200 rounded'></div>
                <div className='mt-2 flex justify-between'>
                  <div className='h-3 w-8 bg-gray-200 rounded'></div>
                  <div className='h-3 w-8 bg-gray-200 rounded'></div>
                  <div className='h-3 w-8 bg-gray-200 rounded'></div>
                </div>
              </div>
              <div className='h-40 w-full bg-gray-200 rounded'></div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  if (loading) {
    return <SkeletonLoader />
  }

  return (
    <>
      <motion.h6
        ref={overviewTitleRef}
        initial='hidden'
        animate={inViewOverviewTitle ? 'visible' : 'visible'}
        variants={itemVariants}
        className='text-xs pb-4 text-subtitle font-semibold'
      >
        Overview
      </motion.h6>

      <motion.div
        ref={overviewCardRef}
        initial='hidden'
        animate={inViewOverviewCard ? 'visible' : 'visible'}
        variants={itemVariants}
      >
        <Card className='mb-4'>
          <CardHeader className='pb-2'>
            <CardTitle className='flex text-sm items-center justify-start gap-1 font-medium text-subtitle'>
              <Disc className='h-4 w-4 text-primary-customized' />
              <span>Total Log Usage</span>
            </CardTitle>
            <div className='text-right text-sm text-muted-foreground'>
              {usagePercentage}% used
            </div>
          </CardHeader>
          <CardContent>
            {logStatsError && (
              <div className='flex items-center justify-center min-h-[200px]'>
                <div className='p-4 bg-red-100 text-red-700 rounded text-center w-full max-w-md mx-auto'>
                  <strong>Error:</strong> {logStatsError}
                </div>
              </div>
            )}
            {!logStatsError && (
              <div className='flex items-start justify-between gap-4'>
                <div className='flex flex-col w-1/4 items-center justify-center'>
                  <div className='bg-subtitle w-10 h-3 rounded-t-lg'></div>
                  <div className='flex items-center justify-center border-2 border-subtitle rounded-lg'>
                    <div className='relative h-52 w-32'>
                      <div className='absolute inset-0 flex flex-col items-center justify-center text-center'>
                        <span className='text-2xl font-bold text-black'>
                          {usagePercentage} %
                        </span>
                      </div>
                      <div className='h-full w-full rounded-md border relative'>
                        <div
                          className='absolute bottom-0 left-0 w-full bg-blue-500 rounded-b-md'
                          style={{ height: `${usagePercentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='w-3/4'>
                  <div>
                    <ProgressBar
                      value={progressBarData?.value ?? 0}
                      max={progressBarData?.max ?? 100}
                    />
                    <div className='mt-2 flex justify-between text-xs text-gray-600'>
                      <span>0</span>
                      <span>
                        {Math.floor((progressBarData?.max ?? 100) / 2)}
                      </span>
                      <span>{progressBarData?.max ?? 100}</span>
                    </div>
                  </div>
                  <div>
                    <CustomBarChart
                      chartData={BarchartData}
                      chartConfig={BarchartConfig}
                    />
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </>
  )
}
