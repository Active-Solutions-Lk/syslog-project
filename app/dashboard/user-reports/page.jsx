'use client'
import { useState, useEffect } from 'react'
import { fetchUsers, fetchDevices, fetchLogMirrorData } from './server-side'
import FilterSection from './components/FilterSection'
import LoginAttemptsCard from './components/LoginAttemptsCard'
import FilestationBehaviorCard from './components/FilestationBehaviorCard'
import FileTransferCard from './components/FileTransferCard'
import FileTypesTable from './components/FileTypesTable'

export default function UserReportsPage() {
  // Dynamic data states
  const [loginAttempts, setLoginAttempts] = useState([])
  const [filestationBehavior, setFilestationBehavior] = useState([])
  const [fileTransfer, setFileTransfer] = useState({
    upload: { files: 0, size: '0GB' },
    download: { files: 0, size: '0GB' },
    deleted: { files: 0, size: '0GB' },
    copied: { files: 0, size: '0GB' },
    cut: { files: 0, size: '0GB' }
  })
  const [fileTypesData, setFileTypesData] = useState([])

  // Per-section loading states
  const [loadingLoginAttempts, setLoadingLoginAttempts] = useState(false)
  const [loadingFilestationBehavior, setLoadingFilestationBehavior] = useState(false)
  const [loadingFileTransfer, setLoadingFileTransfer] = useState(false)
  const [loadingFileTypesData, setLoadingFileTypesData] = useState(false)

  // Per-section error states
  const [errorLoginAttempts, setErrorLoginAttempts] = useState(null)
  const [errorFilestationBehavior, setErrorFilestationBehavior] = useState(null)
  const [errorFileTransfer, setErrorFileTransfer] = useState(null)
  const [errorFileTypesData, setErrorFileTypesData] = useState(null)

  // Users data
  const [users, setUsers] = useState([])
  const [fetchUserLoading, setFetchUserLoading] = useState(true)
  const [fetchUserError, setFetchUserError] = useState(null)

  // Devices data
  const [devices, setDevices] = useState([])
  const [fetchDeviceLoading, setFetchDeviceLoading] = useState(true)
  const [fetchDeviceError, setFetchDeviceError] = useState(null)

  // Selected values for combobox
  const [selectedUser, setSelectedUser] = useState('all')
  const [selectedDevice, setSelectedDevice] = useState('all')

  // Date input values
  const today = new Date()
  const formatDate = (date) => date.toISOString().slice(0, 10)
  const [fromDate, setFromDate] = useState(formatDate(today))
  const [toDate, setToDate] = useState(formatDate(today))

  // Fetch users on mount
  useEffect(() => {
    const getUsers = async () => {
      setFetchUserLoading(true)
      setFetchUserError(null)
      try {
        const usersData = await fetchUsers()
        setUsers(usersData)
      } catch (error) {
        setFetchUserError(error.message)
      } finally {
        setFetchUserLoading(false)
      }
    }
    getUsers()
  }, [])

  // Fetch devices on mount
  useEffect(() => {
    const getDevices = async () => {
      setFetchDeviceLoading(true)
      setFetchDeviceError(null)
      try {
        const devicesData = await fetchDevices()
        setDevices(devicesData)
      } catch (error) {
        setFetchDeviceError(error.message)
      } finally {
        setFetchDeviceLoading(false)
      }
    }
    getDevices()
  }, [])

  // Fetch initial log data on mount
  useEffect(() => {
    const getInitialLogData = async () => {
      setErrorLoginAttempts(null)
      setErrorFilestationBehavior(null)
      setErrorFileTransfer(null)
      setErrorFileTypesData(null)

      setLoadingLoginAttempts(true)
      setLoadingFilestationBehavior(true)
      setLoadingFileTransfer(true)
      setLoadingFileTypesData(true)

      try {
        const filterData = {
          userId: null,
          deviceId: null,
          fromDate,
          toDate
        }
        const {
          loginAttempts,
          filestationBehavior,
          fileTransfer,
          fileTypesData
        } = await fetchLogMirrorData(filterData)

        setLoginAttempts(loginAttempts)
        setFilestationBehavior(filestationBehavior)
        setFileTransfer(fileTransfer)
        setFileTypesData(fileTypesData)
      } catch (error) {
        setErrorLoginAttempts(error.message)
        setErrorFilestationBehavior(error.message)
        setErrorFileTransfer(error.message)
        setErrorFileTypesData(error.message)
      } finally {
        setLoadingLoginAttempts(false)
        setLoadingFilestationBehavior(false)
        setLoadingFileTransfer(false)
        setLoadingFileTypesData(false)
      }
    }
    getInitialLogData()
  }, [])

  const handleFilterClick = async () => {
    setErrorLoginAttempts(null)
    setErrorFilestationBehavior(null)
    setErrorFileTransfer(null)
    setErrorFileTypesData(null)

    setLoadingLoginAttempts(true)
    setLoadingFilestationBehavior(true)
    setLoadingFileTransfer(true)
    setLoadingFileTypesData(true)

    const filterData = {
      userId: selectedUser === 'all' ? null : selectedUser,
      deviceId: selectedDevice === 'all' ? null : selectedDevice,
      fromDate,
      toDate
    }

    try {
      const {
        loginAttempts,
        filestationBehavior,
        fileTransfer,
        fileTypesData
      } = await fetchLogMirrorData(filterData)

      setLoginAttempts(loginAttempts)
      setFilestationBehavior(filestationBehavior)
      setFileTransfer(fileTransfer)
      setFileTypesData(fileTypesData)
    } catch (error) {
      setErrorLoginAttempts(error.message)
      setErrorFilestationBehavior(error.message)
      setErrorFileTransfer(error.message)
      setErrorFileTypesData(error.message)
    } finally {
      setLoadingLoginAttempts(false)
      setLoadingFilestationBehavior(false)
      setLoadingFileTransfer(false)
      setLoadingFileTypesData(false)
    }
  }

  return (
    <div className='flex'>
      <div className='flex-1 p-4 pt-0'>
        <FilterSection
          users={users}
          devices={devices}
          selectedUser={selectedUser}
          selectedDevice={selectedDevice}
          fromDate={fromDate}
          toDate={toDate}
          fetchUserLoading={fetchUserLoading}
          fetchDeviceLoading={fetchDeviceLoading}
          fetchUserError={fetchUserError}
          fetchDeviceError={fetchDeviceError}
          setSelectedUser={setSelectedUser}
          setSelectedDevice={setSelectedDevice}
          setFromDate={setFromDate}
          setToDate={setToDate}
          onFilterClick={handleFilterClick}
        />

        <div className='grid grid-cols-5 gap-4'>
          <div className='col-span-2'>
            <LoginAttemptsCard
              loginAttempts={loginAttempts}
              loading={loadingLoginAttempts}
              error={errorLoginAttempts}
            />
          </div>
          <div className='col-span-3'>
            <FilestationBehaviorCard
              filestationBehavior={filestationBehavior}
              loading={loadingFilestationBehavior}
              error={errorFilestationBehavior}
            />
          </div>
        </div>

        <FileTransferCard
          fileTransfer={fileTransfer}
          loading={loadingFileTransfer}
          error={errorFileTransfer}
        />

        <FileTypesTable
          fileTypesData={fileTypesData}
          loading={loadingFileTypesData}
          error={errorFileTypesData}
        />
      </div>
    </div>
  )
}
