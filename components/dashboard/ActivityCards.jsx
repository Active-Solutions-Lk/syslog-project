import React from 'react'
import { motion } from 'framer-motion'
import { Activity, TrendingUp, Users } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

const ActivityCards = ({ 
  activityCardsRef, 
  inViewActivityCards, 
  containerVariants, 
  itemVariants 
}) => {
  return (
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
              <div className='flex h-12 w-12 items-center  justify-center rounded-full bg-orange-500'>
                <Activity className='h-6 w-6 text-white' />
              </div>
              <h3 className='text-lg font-medium text-subtitle'>
                Today Writes
              </h3>
            </div>
            <div className='text-2xl font-bold text-subtitle'>3450</div>
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
                Today Reads
              </h3>
            </div>
            <div className='text-2xl font-bold text-subtitle'>25</div>
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
            <div className='text-2xl font-bold text-subtitle'>52/200</div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}

export default ActivityCards