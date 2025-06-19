// hooks/useWebSocket.js
import { useState, useEffect, useRef, useCallback } from 'react'

export const useWebSocket = (url, options = {}) => {
  const [socket, setSocket] = useState(null)
  const [lastMessage, setLastMessage] = useState(null)
  const [readyState, setReadyState] = useState('CONNECTING')
  const [connectionError, setConnectionError] = useState(null)
  
  const socketRef = useRef(null)
  const reconnectTimeoutRef = useRef(null)
  const reconnectAttempts = useRef(0)
  
  const {
    reconnectLimit = 5,
    reconnectInterval = 3000,
    onOpen = () => {},
    onClose = () => {},
    onError = () => {},
    onMessage = () => {}
  } = options

  const connect = useCallback(() => {
    try {
      const ws = new WebSocket(url)
      socketRef.current = ws
      
      ws.onopen = (event) => {
        setReadyState('OPEN')
        setConnectionError(null)
        reconnectAttempts.current = 0
        onOpen(event)
      }
      
      ws.onclose = (event) => {
        setReadyState('CLOSED')
        onClose(event)
        
        // Auto-reconnect logic
        if (reconnectAttempts.current < reconnectLimit) {
          reconnectAttempts.current++
          reconnectTimeoutRef.current = setTimeout(() => {
            connect()
          }, reconnectInterval)
        }
      }
      
      ws.onerror = (error) => {
        setReadyState('CLOSED')
        setConnectionError(error)
        onError(error)
      }
      
      ws.onmessage = (event) => {
        const message = JSON.parse(event.data)
        setLastMessage(message)
        onMessage(message)
      }
      
      setSocket(ws)
    } catch (error) {
      setConnectionError(error)
      console.error('WebSocket connection error:', error)
    }
  }, [url, reconnectLimit, reconnectInterval, onOpen, onClose, onError, onMessage])

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
    }
    if (socketRef.current) {
      socketRef.current.close()
    }
  }, [])

  const sendMessage = useCallback((message) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(message))
    } else {
      console.warn('WebSocket is not connected')
    }
  }, [])

  useEffect(() => {
    connect()
    
    return () => {
      disconnect()
    }
  }, [connect, disconnect])

  return {
    socket,
    lastMessage,
    readyState,
    connectionError,
    sendMessage,
    connect,
    disconnect
  }
}

// Hook specifically for dashboard real-time updates
export const useDashboardWebSocket = () => {
  const [dashboardData, setDashboardData] = useState({
    logs: null,
    devices: null,
    activity: null
  })

  const { lastMessage, readyState, sendMessage } = useWebSocket(
    'ws://localhost:3001/dashboard', // Replace with your WebSocket URL
    {
      onMessage: (message) => {
        const { type, data } = message
        
        switch (type) {
          case 'LOG_UPDATE':
            setDashboardData(prev => ({
              ...prev,
              logs: data
            }))
            break
          case 'DEVICE_UPDATE':
            setDashboardData(prev => ({
              ...prev,
              devices: data
            }))
            break
          case 'ACTIVITY_UPDATE':
            setDashboardData(prev => ({
              ...prev,
              activity: data
            }))
            break
          default:
            console.log('Unknown message type:', type)
        }
      },
      onOpen: () => {
        console.log('Dashboard WebSocket connected')
        // Subscribe to updates
        sendMessage({ type: 'SUBSCRIBE', topics: ['logs', 'devices', 'activity'] })
      },
      onError: (error) => {
        console.error('Dashboard WebSocket error:', error)
      }
    }
  )

  return {
    dashboardData,
    isConnected: readyState === 'OPEN',
    lastMessage,
    sendMessage
  }
}