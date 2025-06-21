// Main Dashboard Component (page.jsx) - Debug Version
'use client'

import React from 'react'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import GreetingSection from '@/components/dashboard/GreetingSection'
import OverviewSection from '@/components/dashboard/OverviewSection'
import DevicesAndChartsGrid from '@/components/dashboard/DevicesAndChartsGrid'
import TodaysActivitySection from '@/components/dashboard/TodaysActivitySection'

export default function Dashboard () {
  // Fetch log statistics and calculate percentage
  const [logStats, setLogStats] = useState({
    totalLogs: 0,
    todayLogs: 0,
    usagePercentage: 0,
    progressBarData: {
      value: 0,
      max: 100000
    }
  })

  const [logStatsLoading, setLogStatsLoading] = useState(true) // Start with true
  const [BarchartData, setBarchartData] = useState([])
  const [logStatsError, setLogStatsError] = useState(null)

  useEffect(() => {
    const fetchLogStats = async () => {
      setLogStatsLoading(true)
      setLogStatsError(null)
      try {
        const response = await fetch('/api/dashboard/log-count')
        let data
        try {
          data = await response.json()
        } catch (jsonErr) {
          setLogStatsError('Invalid server response. Please try again later.')
          setLogStatsLoading(false)
          return
        }

        if (response.ok) {
          const maxCapacity = 100000  // Should be dynamically display after set-up remote data base
          const totalLogs = data.totalLogs || 0
          const usagePercentage = totalLogs
            ? ((totalLogs / maxCapacity) * 100).toFixed(1)
            : 0

          setLogStats({
            totalLogs,
            todayLogs: data.todayLogs || 0,
            usagePercentage: parseFloat(usagePercentage),
            progressBarData: {
              value: totalLogs,
              max: maxCapacity
            }
          })
          setBarchartData(data.monthlyData || [])
        } else {
          const errorMsg =
            data?.error && typeof data.error === 'string'
              ? data.error
              : 'Unable to fetch log statistics. Please try again later.'
          setLogStatsError(errorMsg)
        }
      } catch (error) {
        let displayError = 'Network error. Please check your connection and try again.'
        if (error && error.message && error.message.includes('fetch')) {
          displayError = 'Server unreachable. Please try again later.'
        }
        setLogStatsError(displayError)
      } finally {
        setLogStatsLoading(false)
      }
    }
    fetchLogStats()
  }, [])

  // State variables for devices and device data
  const [devices, setDevices] = useState([])
  const [deviceData, setDeviceData] = useState([])
  const [deviceSummary, setDeviceSummary] = useState({
    total: 0,
    active: 0,
    inactive: 0
  })
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
            'Content-Type': 'application/json'
          }
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

  // Fetch today's figures for downloads, uploads, user access, and total users
  const [todaysLogStats, setTodaysLogStats] = useState({
    downloads: 0,
    uploads: 0,
    userAccess: 0
  })

  useEffect(() => {
    const fetchTodayFigures = async () => {
      try {
        const response = await fetch('/api/dashboard/today-figures')
        const data = await response.json()
        if (response.ok) {
          setTodaysLogStats({
            downloads: data.downloads || 0,
            uploads: data.uploads || 0,
            userAccess: data.userAccess || 0,
            totalUsers: data.totalUsers || 0
          })
        } else {
          console.error('Failed to fetch today figures:', data.error)
          setTodaysLogStats({ downloads: 0, uploads: 0, userAccess: 0 })
        }
      } catch (error) {
        console.error('Error fetching today figures:', error)
        setTodaysLogStats({ downloads: 0, uploads: 0, userAccess: 0 })
      }
    }
    fetchTodayFigures()
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

  // Destructure needed values from logStats
  const { usagePercentage, progressBarData } = logStats

  //// console.log('Dashboard render - logStatsLoading:', logStatsLoading)
  //// console.log('Dashboard render - logStats:', logStats)
  //// console.log('Dashboard render - BarchartData:', BarchartData)

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
          loading={logStatsLoading}
          logStatsError={logStatsError}
        />

        <DevicesAndChartsGrid
          itemVariants={itemVariants}
          deviceCount={devices}
          linechartData={deviceData}
          deviceSummary={deviceSummary}
        />

        <TodaysActivitySection
          containerVariants={containerVariants}
          itemVariants={itemVariants}
          todaysLogStats={todaysLogStats}
        />
      </motion.div>
    </div>
  )
}