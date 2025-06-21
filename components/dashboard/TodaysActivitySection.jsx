import React from 'react'
import { motion, useInView } from 'framer-motion'
import { Activity, TrendingUp, Users } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

export default function TodaysActivitySection({ containerVariants, itemVariants, todaysLogStats }) {
  const activityTitleRef = React.useRef(null)
  const activityCardsRef = React.useRef(null)
  const inViewActivityTitle = useInView(activityTitleRef, { once: true })
  const inViewActivityCards = useInView(activityCardsRef, { once: true })

  // console.log('TodaysActivitySection todaysLogStats:', todaysLogStats)
  // Fallbacks in case todaysLogStats is undefined or missing keys
  const uploads = todaysLogStats?.uploads ?? 0
  const downloads = todaysLogStats?.downloads ?? 0
  const accessUsers = todaysLogStats?.accessUsers ?? 0
  const totalUsers = todaysLogStats?.totalUsers ?? 0

  return (
    <>
      <motion.h2
        ref={activityTitleRef}
        initial='hidden'
        animate={inViewActivityTitle ? 'visible' : 'hidden'}
        variants={itemVariants}
        className='mb-6 mt-8 text-xs text-subtitle font-semibold'
      >
        Today's Activity
      </motion.h2>

      <motion.div
        ref={activityCardsRef}
        initial='hidden'
        animate={inViewActivityCards ? 'visible' : 'hidden'}
        variants={containerVariants}
        className='space-y-4'
      >
        <motion.div variants={itemVariants}>
          <Card>
            <CardContent className='flex items-center justify-between p-4'>
              <div className='flex items-center gap-4'>
                <div className='flex h-12 w-12 items-center justify-center rounded-full bg-orange-500'>
                  <Activity className='h-6 w-6 text-white' />
                </div>
                <h3 className='text-lg font-medium text-subtitle'>
                  Today Uploads
                </h3>
              </div>
              <div className='text-2xl font-bold text-subtitle'>{uploads}</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card>
            <CardContent className='flex items-center justify-between p-4'>
              <div className='flex items-center gap-4'>
                <div className='flex h-12 w-12 items-center justify-center rounded-full bg-red-500'>
                  <TrendingUp className='h-6 w-6 text-white' />
                </div>
                <h3 className='text-lg font-medium text-subtitle'>
                  Today Downloads
                </h3>
              </div>
              <div className='text-2xl font-bold text-subtitle'>{downloads}</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card>
            <CardContent className='flex items-center justify-between p-4'>
              <div className='flex items-center gap-4'>
                <div className='flex h-12 w-12 items-center justify-center rounded-full bg-green-500'>
                  <Users className='h-6 w-6 text-white' />
                </div>
                <h3 className='text-lg font-medium text-subtitle'>
                  Access Users
                </h3>
              </div>
              <div className='text-2xl font-bold text-subtitle'>
                {accessUsers}/{totalUsers}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </>
  )
}