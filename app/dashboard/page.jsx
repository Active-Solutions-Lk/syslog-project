'use client'

import React from 'react'
import { motion, useInView } from 'framer-motion'
import { Activity, Bell, ChevronDown, Disc, HandHeart, HandIcon, HeartPulse, Server, TrendingUp, Users } from 'lucide-react'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { SidebarTrigger } from '@/components/ui/sidebar'
import Image from 'next/image'
import ProgressBar from '@/components/dashboard/progress-bar'
import CustomLineChart from '@/components/dashboard/line-chart'
import CustomBarChart from '@/components/dashboard/bar-chart'
import CustomPieChart from '@/components/dashboard/pie-chart'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'

export default function Dashboard() {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  }

  const BarchartConfig = {
    desktop: {
      label: 'This Year',
      color: '#2563eb'
    }
  }

  const PieChartConfig = {
    visitors: {
      label: "Visitors",
    },
    critical: {
      label: "Chrome",
      color: "#FF4A4A",
    },
    warning: {
      label: "Safari",
      color: "#FF8F53",
    },
    info: {
      label: "Firefox",
      color: "#3D43F0",
    },
    highpriority: {
      label: "Edge",
      color: "#FE6A46",
    },
    other: {
      label: "Other",
      color: "hsl(var(--chart-5))",
    },
  }

  const PieChartData = [
    { type: "Critical", count: 100, fill: "var(--color-critical)", bg: PieChartConfig.critical.color },
    { type: "Warning", count: 100, fill: "var(--color-warning)", bg: PieChartConfig.warning.color },
    { type: "Highpriority", count: 55, fill: "var(--color-highpriority)", bg: PieChartConfig.highpriority.color },
    { type: "Info", count: 70, fill: "var(--color-info)", bg: PieChartConfig.info.color }
  ]

  const progressBarData = {
    value: 8000,
    max: 20000
  }

  const BarchartData = [
    { month: 'January', desktop: 186, mobile: 80 },
    { month: 'February', desktop: 305, mobile: 200 },
    { month: 'March', desktop: 237, mobile: 120 },
    { month: 'April', desktop: 73, mobile: 190 },
    { month: 'May', desktop: 209, mobile: 130 }
  ]

  const deviceData = [
    {
      name: 'Mon',
      ShaheerNas: 85,
      OfficeNas: 72,
      HRNAS: 90,
      device4: 0,
      device5: 45
    },
    {
      name: 'Tue',
      ShaheerNas: 83,
      OfficeNas: 78,
      HRNAS: 92,
      device4: 0,
      device5: 62
    },
    {
      name: 'Wed',
      ShaheerNas: 86,
      OfficeNas: 80,
      device3: 91,
      device4: 20,
      device5: 73
    },
    {
      name: 'Thu',
      ShaheerNas: 89,
      OfficeNas: 87,
      device3: 94,
      device4: 68,
      device5: 81
    },
    {
      name: 'Fri',
      ShaheerNas: 87,
      OfficeNas: 82,
      device3: 90,
      device4: 74,
      device5: 0
    },
    {
      name: 'Sat',
      ShaheerNas: 84,
      OfficeNas: 76,
      device3: 88,
      device4: 79,
      device5: 0
    },
    {
      name: 'Sun',
      ShaheerNas: 82,
      OfficeNas: 71,
      device3: 86,
      device4: 82,
      device5: 25
    }
  ]

  const devices = [
    { id: 'D1', active: true, name: 'ShaheerNas' },
    { id: 'D2', active: true, name: 'OfficeNas' },
    { id: 'D3', active: true, name: 'HRNas' },
    { id: 'D4', active: false, name: 'Inactive Device' },
    { id: 'D5', active: false, name: 'Inactive Device' },
    { id: 'D6', active: false, name: 'Inactive Device' },
    { id: 'D7', active: false, name: 'Inactive Device' },
    { id: 'D8', active: false, name: 'Inactive Device' },
    { id: 'D9', active: false, name: 'Inactive Device' },
    { id: 'D10', active: false, name: 'Inactive Device' },
    { id: 'D11', active: false, name: 'Inactive Device' },
    { id: 'D12', active: false, name: 'Inactive Device' }
  ]

  // Refs for useInView hook
  const greetingRef = React.useRef(null)
  const overviewTitleRef = React.useRef(null)
  const overviewCardRef = React.useRef(null)
  const devicesCardRef = React.useRef(null)
  const pieChartRef = React.useRef(null)
  const activityTitleRef = React.useRef(null)
  const activityCardsRef = React.useRef(null)

  // useInView hooks to detect when elements are in view
  const inViewGreeting = useInView(greetingRef, { once: true })
  const inViewOverviewTitle = useInView(overviewTitleRef, { once: true })
  const inViewOverviewCard = useInView(overviewCardRef, { once: true })
  const inViewDevicesCard = useInView(devicesCardRef, { once: true })
  const inViewPieChart = useInView(pieChartRef, { once: true })
  const inViewActivityTitle = useInView(activityTitleRef, { once: true })
  const inViewActivityCards = useInView(activityCardsRef, { once: true })

  return (
    <div className='flex min-h-screen flex-col'>
      <motion.div
        className='flex-1 p-6 pt-4 overflow-y-auto'
        variants={containerVariants}
        initial='hidden'
        animate='visible'
      >
        {/* Greeting Section */}
        <motion.div
          ref={greetingRef}
          initial='hidden'
          animate={inViewGreeting ? 'visible' : 'hidden'}
          variants={itemVariants}
          className='mb-3 rounded-lg h-25 bg-specialbg bg-opacity-50 p-2 relative'
        >
          <div className='flex items-center justify-between ps-4'>
            <div>
              <h1 className='text-xl font-bold text-gray-800'>Hi, Shaheer</h1>
              <p className='text-sm text-gray-600 mt-1'>
                Ready to see what's happening on your devices?
              </p>
            </div>
            <div className='absolute top-0 right-0 justify-start -translate-x-1/4 -translate-y-1/4'>
              <Image
                src='/images/dashboardpc.png'
                alt='Dashboard'
                width={120}
                height={120}
                className='h-20 w-20 md:h-32 md:w-32 rounded-lg object-cover justify-start'
              />
            </div>
          </div>
        </motion.div>

        {/* Overview Title */}
        <motion.h6
          ref={overviewTitleRef}
          initial='hidden'
          animate={inViewOverviewTitle ? 'visible' : 'hidden'}
          variants={itemVariants}
          className='text-xs pb-4 text-subtitle font-semibold'
        >
          Overview
        </motion.h6>

        {/* Overview Card */}
        <motion.div
          ref={overviewCardRef}
          initial='hidden'
          animate={inViewOverviewCard ? 'visible' : 'hidden'}
          variants={itemVariants}
        >
          <Card className='mb-4'>
            <CardHeader className='pb-2'>
              <CardTitle className='flex text-sm items-center justify-start gap-1 font-medium text-subtitle'>
                <Disc className='h-4 w-4 text-primary-customized' />
                <span>Total Log Usage</span>
              </CardTitle>
              <div className='text-right text-sm text-muted-foreground'>
                34.5% used
              </div>
            </CardHeader>
            <CardContent>
              <div className='flex items-start justify-between gap-4'>
                <div className='flex flex-col w-1/4 items-center justify-center'>
                  <div className='bg-subtitle w-10 h-3 rounded-t-lg'></div>
                  <div className='flex items-center justify-center border-2 border-subtitle rounded-lg'>
                    <div className='relative h-52 w-32'>
                      <div className='absolute inset-0 flex flex-col items-center justify-center text-center'>
                        <span className='text-2xl font-bold text-black'>
                          34.5%
                        </span>
                      </div>
                      <div className='h-full w-full rounded-md border relative'>
                        <div className='absolute bottom-0 left-0 w-full h-[34.5%] bg-blue-500 rounded-b-md'></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='w-3/4'>
                  <div>
                    <ProgressBar value={progressBarData.value} max={progressBarData.max} />
                    <div className='mt-2 flex justify-between text-xs text-gray-600'>
                      <span>0</span>
                      <span>{Math.floor(progressBarData.max / 2)}</span>
                      <span>{progressBarData.max}</span>
                    </div>
                  </div>
                  <div>
                    <CustomBarChart chartData={BarchartData} chartConfig={BarchartConfig} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Grid Layout */}
        <div className='grid grid-cols-1 gap-8 lg:grid-cols-2'>
          {/* Devices Card */}
          <motion.div
            ref={devicesCardRef}
            initial='hidden'
            animate={inViewDevicesCard ? 'visible' : 'hidden'}
            variants={itemVariants}
          >
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2 text-sm text-subtitle font-medium'>
                  <div className='flex h-6 w-6 items-center justify-center rounded-md bg-transparent'>
                    <Server className='h-4 w-4 text-green-700' />
                  </div>
                  Devices
                </CardTitle>
              </CardHeader>
              <CardContent>
                <TooltipProvider>
                  <div className='flex flex-wrap gap-2'>
                    {devices.map(device => (
                      <Tooltip key={device.id}>
                        <TooltipTrigger asChild>
                          <Button
                            className={`flex h-10 w-10 items-center justify-center rounded-full ${
                              device.active ? 'bg-green-500' : 'bg-gray-300'
                            } text-white`}
                          >
                            {device.id}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{device.name}</p>
                        </TooltipContent>
                      </Tooltip>
                    ))}
                  </div>
                </TooltipProvider>
                <div className='mt-4 text-center text-sm text-muted-foreground'>
                  3 of 5 online
                </div>
                <div className='mt-4'>
                  <CustomLineChart chartData={deviceData} />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Pie Chart */}
          <motion.div
            ref={pieChartRef}
            initial='hidden'
            animate={inViewPieChart ? 'visible' : 'hidden'}
            variants={itemVariants}
          >
            <div className='relative h-auto w-full'>
              <CustomPieChart chartConfig={PieChartConfig} chartData={PieChartData} />
            </div>
          </motion.div>
        </div>

        {/* Today's Activity Title */}
        <motion.h2
          ref={activityTitleRef}
          initial='hidden'
          animate={inViewActivityTitle ? 'visible' : 'hidden'}
          variants={itemVariants}
          className='mb-6 mt-8 text-xs text-subtitle font-semibold'
        >
          Today's Activity
        </motion.h2>

        {/* Activity Cards */}
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
                  <h3 className='text-lg font-medium text-subtitle'>Today Writes</h3>
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
                  <h3 className='text-lg font-medium text-subtitle'>Today Reads</h3>
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
                  <h3 className='text-lg font-medium text-subtitle'>Access Users</h3>
                </div>
                <div className='text-2xl font-bold text-subtitle'>52/200</div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  )
}