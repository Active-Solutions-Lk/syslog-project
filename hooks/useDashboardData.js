import { useState, useEffect, useCallback, useRef } from 'react'

// Custom hook for log statistics
export const useLogStats = (refreshInterval = 30000) => {
  const [logStats, setLogStats] = useState({
    totalLogs: 0,
    todayLogs: 0,
    loading: true,
    error: null,
    lastUpdated: null
  })

  const [barchartData, setBarchartData] = useState([])
  const intervalRef = useRef(null)

  const fetchLogStats = useCallback(async () => {
    try {
      const response = await fetch('/api/dashboard/log-count')
      const data = await response.json()

      if (response.ok) {
        setLogStats(prev => ({
          ...prev,
          totalLogs: data.totalLogs,
          todayLogs: data.todayLogs,
          loading: false,
          error: null,
          lastUpdated: new Date().toISOString()
        }))
        setBarchartData(data.monthlyData)
      } else {
        throw new Error(data.error || 'Failed to fetch log stats')
      }
    } catch (error) {
      console.error('Error fetching log stats:', error)
      setLogStats(prev => ({
        ...prev,
        loading: false,
        error: error.message
      }))
      setBarchartData([])
    }
  }, [])

  // Manual refresh function
  const refreshLogStats = useCallback(() => {
    setLogStats(prev => ({ ...prev, loading: true }))
    fetchLogStats()
  }, [fetchLogStats])

  // Setup auto-refresh
  useEffect(() => {
    // Initial fetch
    fetchLogStats()

    // Setup interval for auto-refresh
    if (refreshInterval > 0) {
      intervalRef.current = setInterval(fetchLogStats, refreshInterval)
    }

    // Cleanup
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [fetchLogStats, refreshInterval])

  // Pause/Resume auto-refresh
  const pauseAutoRefresh = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const resumeAutoRefresh = useCallback(() => {
    if (!intervalRef.current && refreshInterval > 0) {
      intervalRef.current = setInterval(fetchLogStats, refreshInterval)
    }
  }, [fetchLogStats, refreshInterval])

  return {
    logStats,
    barchartData,
    refreshLogStats,
    pauseAutoRefresh,
    resumeAutoRefresh,
    isLoading: logStats.loading,
    error: logStats.error,
    lastUpdated: logStats.lastUpdated
  }
}

// Custom hook for device data
export const useDeviceData = (refreshInterval = 60000) => {
  const [deviceStats, setDeviceStats] = useState({
    devices: [],
    deviceData: [],
    loading: true,
    error: null,
    lastUpdated: null
  })

  const intervalRef = useRef(null)

  const fetchDeviceData = useCallback(async () => {
    try {
      // Replace with your actual device API endpoint
      const response = await fetch('/api/dashboard/devices')
      const data = await response.json()

      if (response.ok) {
        setDeviceStats(prev => ({
          ...prev,
          devices: data.devices || [],
          deviceData: data.deviceData || [],
          loading: false,
          error: null,
          lastUpdated: new Date().toISOString()
        }))
      } else {
        throw new Error(data.error || 'Failed to fetch device data')
      }
    } catch (error) {
      console.error('Error fetching device data:', error)
      setDeviceStats(prev => ({
        ...prev,
        loading: false,
        error: error.message
      }))
    }
  }, [])

  const refreshDeviceData = useCallback(() => {
    setDeviceStats(prev => ({ ...prev, loading: true }))
    fetchDeviceData()
  }, [fetchDeviceData])

  useEffect(() => {
    fetchDeviceData()

    if (refreshInterval > 0) {
      intervalRef.current = setInterval(fetchDeviceData, refreshInterval)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [fetchDeviceData, refreshInterval])

  return {
    deviceStats,
    refreshDeviceData,
    isLoading: deviceStats.loading,
    error: deviceStats.error,
    lastUpdated: deviceStats.lastUpdated
  }
}

// Custom hook for activity data
export const useActivityData = (refreshInterval = 10000) => {
  const [activityStats, setActivityStats] = useState({
    todayWrites: 0,
    todayReads: 0,
    activeUsers: 0,
    loading: true,
    error: null,
    lastUpdated: null
  })

  const intervalRef = useRef(null)

  const fetchActivityData = useCallback(async () => {
    try {
      const response = await fetch('/api/dashboard/activity')
      const data = await response.json()

      if (response.ok) {
        setActivityStats(prev => ({
          ...prev,
          todayWrites: data.todayWrites || 0,
          todayReads: data.todayReads || 0,
          activeUsers: data.activeUsers || 0,
          loading: false,
          error: null,
          lastUpdated: new Date().toISOString()
        }))
      } else {
        throw new Error(data.error || 'Failed to fetch activity data')
      }
    } catch (error) {
      console.error('Error fetching activity data:', error)
      setActivityStats(prev => ({
        ...prev,
        loading: false,
        error: error.message
      }))
    }
  }, [])

  const refreshActivityData = useCallback(() => {
    setActivityStats(prev => ({ ...prev, loading: true }))
    fetchActivityData()
  }, [fetchActivityData])

  useEffect(() => {
    fetchActivityData()

    if (refreshInterval > 0) {
      intervalRef.current = setInterval(fetchActivityData, refreshInterval)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [fetchActivityData, refreshInterval])

  return {
    activityStats,
    refreshActivityData,
    isLoading: activityStats.loading,
    error: activityStats.error,
    lastUpdated: activityStats.lastUpdated
  }
}