// DevicesAndChartsGrid.jsx
// =========================================

import React from 'react'
import { motion, useInView } from 'framer-motion'
import DevicesCard from '@/components/dashboard/DevicesCard'
import LogTypePieChart from '@/components/dashboard/LogTypePieChart'

export default function DevicesAndChartsGrid({ itemVariants , deviceCount, linechartData, deviceSummary }) {
  const devicesCardRef = React.useRef(null)
  const pieChartRef = React.useRef(null)
  const inViewDevicesCard = useInView(devicesCardRef, { once: true })
  const inViewPieChart = useInView(pieChartRef, { once: true })

   const devices = deviceCount;

 // console.log('DevicesAndChartsGrid linechartData', linechartData); 

  return (
    <div className='grid grid-cols-1 gap-8 lg:grid-cols-2'>
      <motion.div
        ref={devicesCardRef}
        initial='hidden'
        animate={inViewDevicesCard ? 'visible' : 'hidden'}
        variants={itemVariants}
      >
        <DevicesCard data={devices} linechartData ={linechartData} deviceSummary ={deviceSummary} />
      </motion.div>

      <motion.div
        ref={pieChartRef}
        initial='hidden'
        animate={inViewPieChart ? 'visible' : 'hidden'}
        variants={itemVariants}
      >
        <div className='relative h-auto w-full'>
          <LogTypePieChart />
        </div>
      </motion.div>
    </div>
  )
}