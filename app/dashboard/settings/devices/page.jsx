'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import DeviceSearchBar from './components/device-search-bar'
import DeviceTable from './components/table'
import { FetchDevices } from './server-side'

export default function DeviceSettings () {
  const [query, setQuery] = useState('')

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
  }

  const [devices, SetDeviceData] = useState([])
  const [loading, SetLoading] = useState(false)
  const [error, SetError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        SetLoading(true)
        const result = await FetchDevices()
        SetDeviceData(result.data)
        // console.log('Fetched devices:', result.data); // Access `.data` from the response
        // Set state with result.data here
      } catch (error) {
        SetError('Unable to fetch data. Refresh the page or try again')
        console.error('Fetch error:', error.message)
      } finally {
        SetLoading(false)
      }
    }

    fetchData()
  }, [])

  const filteredDevices = devices.filter(device =>
    Object.values(device).join(' ').toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className='flex min-h-screen flex-col'>
      <motion.div
        className='flex-1 p-2 pt-0 md:p-4'
        variants={containerVariants}
        initial='hidden'
        animate='visible'
      >
        <motion.div variants={itemVariants} className='mb-5 w-full'>
          <DeviceSearchBar query={query} setQuery={setQuery} />
        </motion.div>
        <motion.div variants={itemVariants}>
          <DeviceTable devices={filteredDevices} loading={loading} error={error} /> 
        </motion.div>
      </motion.div>
    </div>
  )
}
