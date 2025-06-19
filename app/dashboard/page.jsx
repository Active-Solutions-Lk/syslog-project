// Main Dashboard Component (page.jsx)
'use client'

import React from 'react'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import GreetingSection from '@/components/dashboard/GreetingSection'
import OverviewSection from '@/components/dashboard/OverviewSection'
import DevicesAndChartsGrid from '@/components/dashboard/DevicesAndChartsGrid'
import TodaysActivitySection from '@/components/dashboard/TodaysActivitySection'

export default function Dashboard() {
  const [logStats, setLogStats] = useState({
    totalLogs: 0,
    todayLogs: 0,
    loading: false
  })

  const [BarchartData, setBarchartData] = useState([])

  // Fetch log statistics and calculate percentage
  useEffect(() => {
    const fetchLogStats = async () => { 
      let loadingStatus = true;
      try {
        const response = await fetch('/api/dashboard/log-count')
        const data = await response.json()

        if (response.ok) {
          loadingStatus = false;
          const maxCapacity = 100000
          const totalLogs = data.totalLogs
          const usagePercentage = totalLogs
            ? ((totalLogs / maxCapacity) * 100).toFixed(1)
            : 0
          setLogStats({
            totalLogs,
            todayLogs: data.todayLogs,
            loading: false,
            usagePercentage,
            progressBarData: {
              value: totalLogs,
              max: maxCapacity
            }
          })
          setBarchartData(data.monthlyData)
        } else {
          console.error('Failed to fetch log stats:', data.error)
          setLogStats(prev => ({ ...prev, loading: false }))
          setBarchartData([])
        }
      } catch (error) {
        console.error('Error fetching log stats:', error)
        setLogStats(prev => ({ ...prev, loading: false }))
        setBarchartData([])
      }
    }
    fetchLogStats()
  }, [])



  // State variables for devices and device data
  const [devices, setDevices] = useState([])
  const [deviceData, setDeviceData] = useState([])
  const [deviceSummary, setDeviceSummary] = useState({ total: 0, active: 0, inactive: 0 })
  const [deviceLoading, setDeviceLoading] = useState(true)
  const [deviceError, setDeviceError] = useState(null)

  // Fetch devices and device data from API
  useEffect(() => {
    const fetchDevicesData = async () => {
      try {
        setDeviceLoading(true)
        setDeviceError(null)
        const response = await fetch('/api/dashboard/devices', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const result = await response.json()

        if (result.success) {
          const { devices, chartData, summary: summaryData } = result.data
          setDevices(devices)
          setDeviceData(chartData)
          setDeviceSummary(summaryData)
        } else {
          setDeviceError(result.error || 'Failed to fetch data')
        }
      } catch (err) {
        setDeviceError(err.message)
      } finally {
        setDeviceLoading(false)
      }
    }

    fetchDevicesData()
  }, [])


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

  // Destructure needed values from logStats, provide fallback for progressBarData
  const { usagePercentage, progressBarData = { value: 0, max: 100000 }, loading } = logStats

  return (
    <div className='flex min-h-screen flex-col'>
      <motion.div
        className='flex-1 p-6 pt-0 overflow-y-auto'
        variants={containerVariants}
        initial='hidden'
        animate='visible'
      >
        <GreetingSection itemVariants={itemVariants} />
        
        <OverviewSection 
          itemVariants={itemVariants}
          usagePercentage={usagePercentage}
          progressBarData={progressBarData}
          BarchartData={BarchartData}
          loading={loading} // Pass loading state
        />
        
        <DevicesAndChartsGrid itemVariants={itemVariants} deviceCount={devices} linechartData = {deviceData} deviceSummary ={deviceSummary} />
        
        <TodaysActivitySection 
          containerVariants={containerVariants}
          itemVariants={itemVariants}
        />
      </motion.div>
    </div>
  )
}