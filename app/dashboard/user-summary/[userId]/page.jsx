'use client'

import React, { useEffect, useState } from 'react'
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandGroup
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { useRouter, useSearchParams } from 'next/navigation'
import { File, Filter, User, Check, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import FileCard from './components/file-card'
import { FetchSummary } from './server-side'

export default function UserDetailPage({ params }) {
  const unwrappedParams = React.use(params)
  const { userId } = unwrappedParams
  console.log('User ID from params:', userId)
  const searchParams = useSearchParams()
  const fileType = searchParams.get('fileType')
  const router = useRouter()
  const [selectedUser, setSelectedUser] = useState(Number(userId))
  const [selectedFileType, setSelectedFileType] = useState(fileType || '')
  const [tempSelectedUser, setTempSelectedUser] = useState(Number(userId))
  const [tempSelectedFileType, setTempSelectedFileType] = useState(fileType || '')
  const [userSearch, setUserSearch] = useState('')
  const [fileTypeSearch, setFileTypeSearch] = useState('')
  const [userOpen, setUserOpen] = useState(false)
  const [fileTypeOpen, setFileTypeOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [userSummaryData, setUserSummaryData] = useState([])
  const [fetchingError, setFetchingError] = useState(null)
  const [fetchingLoading, setFetchingLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      setFetchingLoading(true)
      try {
        const receivedData = await FetchSummary(Number(userId))
        console.log('Fetched user summary data:', receivedData)
        setUserSummaryData(receivedData)
        if (!fileType && receivedData.length > 0) {
          const firstUser = receivedData.find(u => u.id === Number(userId))
          if (firstUser && firstUser.fileTypes.length > 0) {
            setSelectedFileType(firstUser.fileTypes[0].type)
            setTempSelectedFileType(firstUser.fileTypes[0].type)
          }
        }
      } catch (error) {
        console.error('Fetch error:', error)
        setFetchingError('Error Fetching Data. Please refresh the page and try again')
      } finally {
        setFetchingLoading(false)
      }
    }
    fetchData()
  }, [userId, fileType])

  useEffect(() => {
    setSelectedUser(Number(userId))
    setTempSelectedUser(Number(userId))
    setUserSearch('')
  }, [userId])

  useEffect(() => {
    if (fileType) {
      setSelectedFileType(fileType)
      setTempSelectedFileType(fileType)
    }
  }, [fileType])

  // Render error state
  if (fetchingError) {
    return <div className="p-4 text-red-500">{fetchingError}</div>
  }

  // Find user
  const user = Array.isArray(userSummaryData)
    ? userSummaryData.find(u => u.id === Number(selectedUser))
    : undefined

  // Render no user found
  if (!fetchingLoading && !user && userSummaryData.length > 0) {
    return <div className="p-4">User not found</div>
  }

  // Render no users available
  if (!fetchingLoading && userSummaryData.length === 0) {
    return <div className="p-4">No users available</div>
  }

  const selectedUserData = userSummaryData.find(u => u.id === Number(selectedUser))
  const selectedFileTypeData = selectedUserData
    ? selectedUserData.fileTypes.find(f => f.type === decodeURIComponent(selectedFileType))
    : null

  console.log('Selected file type data:', selectedFileTypeData)

  const uploads = selectedFileTypeData ? selectedFileTypeData.uploads : []
  const downloads = selectedFileTypeData ? selectedFileTypeData.downloads : []
  const deleted = selectedFileTypeData ? selectedFileTypeData.deleted || [] : []

  const cardConfigs = [
    {
      title: selectedFileType ? `${decodeURIComponent(selectedFileType)} Uploads` : 'Uploads N/A',
      data: fetchingLoading ? [] : uploads
    },
    {
      title: selectedFileType ? `${decodeURIComponent(selectedFileType)} Downloads` : 'Downloads N/A',
      data: fetchingLoading ? [] : downloads
    },
    {
      title: selectedFileType ? `${decodeURIComponent(selectedFileType)} Deleted` : 'Deleted N/A',
      data: fetchingLoading ? [] : deleted
    }
  ]

  const handleUserChange = newUserId => {
    setTempSelectedUser(Number(newUserId))
    setUserOpen(false)
    setUserSearch('')
  }

  const handleFileTypeChange = newFileType => {
    setTempSelectedFileType(newFileType)
    setFileTypeOpen(false)
    setFileTypeSearch('')
  }

  const handleFilter = async () => {
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setSelectedUser(Number(tempSelectedUser))
    setSelectedFileType(tempSelectedFileType)
    const query = tempSelectedFileType ? `?fileType=${encodeURIComponent(tempSelectedFileType)}` : ''
    router.push(`/dashboard/user-summary/${Number(tempSelectedUser)}${query}`)
    setIsLoading(false)
  }

  const filteredUsers = userSummaryData.filter(u =>
    u.name.toLowerCase().includes(userSearch.toLowerCase())
  )
  console.log('Filtered users:', filteredUsers)

  const filteredFileTypes = user ? user.fileTypes.filter(f =>
    f.type.toLowerCase().includes(fileTypeSearch.toLowerCase())
  ) : []

  return (
    <div className='flex-1 p-4 pt-0'>
      <div className='flex justify-between items-center mb-4 gap-4 bg-gray-50/80 rounded-t-lg px-2 py-3'>
        <div className='flex items-center gap-4'>
          <div className='flex items-center gap-2'>
            <div className='text-gray-700 text-xs font-semibold'>User:</div>
            <Popover open={userOpen} onOpenChange={setUserOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant='outline'
                  role='combobox'
                  className='bg-transparent p-0 rounded-none border-0 border-b-2 text-xs border-gray-300 text-gray-700 hover:bg-blue-50 flex items-center w-32 justify-start gap-2'
                >
                  <User className='h-4 w-4 text-blue-600' />
                  <span className='truncate'>
                    {fetchingLoading
                      ? 'Loading User...'
                      : tempSelectedUser
                        ? userSummaryData.find(u => u.id === Number(tempSelectedUser))?.name || 'Select User'
                        : 'Select User'}
                  </span>
                  <ChevronDown className='h-4 w-4 text-gray-500 ml-auto' />
                </Button>
              </PopoverTrigger>
              <PopoverContent className='w-48 p-0'>
                <Command>
                  <CommandInput
                    placeholder='Search user...'
                    value={userSearch}
                    onValueChange={setUserSearch}
                    className='h-9'
                  />
                  <CommandList>
                    <CommandGroup>
                      {fetchingLoading ? (
                        [...Array(3)].map((_, index) => (
                          <CommandItem key={index} className='flex items-center gap-2'>
                            <Skeleton className='h-4 w-4 rounded-full bg-gray-200' />
                            <Skeleton className='h-4 w-32 bg-gray-100' />
                          </CommandItem>
                        ))
                      ) : filteredUsers.length > 0 ? (
                        filteredUsers.map(u => (
                          <CommandItem
                            key={u.id}
                            value={u.id.toString()}
                            onSelect={() => handleUserChange(u.id)}
                            className='flex items-center'
                          >
                            <User className='h-4 w-4 mr-2 ml-1 text-blue-600' />
                            {u.name}
                            {Number(tempSelectedUser) === u.id && (
                              <Check className='ml-auto h-4 w-4 text-green-600' />
                            )}
                          </CommandItem>
                        ))
                      ) : (
                        <CommandItem disabled>No users found</CommandItem>
                      )}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <div className='flex items-center gap-2'>
            <div className='text-gray-700 text-xs font-semibold'>File Type:</div>
            <Popover open={fileTypeOpen} onOpenChange={setFileTypeOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant='outline'
                  role='combobox'
                  className='bg-transparent p-0 rounded-none border-0 border-b-2 text-xs border-gray-300 text-gray-700 hover:bg-blue-50 flex items-center w-32 justify-start gap-2'
                >
                  <File className='h-4 w-4 ml-2 text-blue-600' />
                  <span className='truncate'>
                    {fetchingLoading || !selectedUserData
                      ? 'Loading File Type...'
                      : tempSelectedFileType || 'Select File Type'}
                  </span>
                  <ChevronDown className='h-4 w-4 text-gray-500 ml-auto' />
                </Button>
              </PopoverTrigger>
              <PopoverContent className='w-48 p-0'>
                <Command>
                  <CommandInput
                    placeholder='Search file type...'
                    value={fileTypeSearch}
                    onValueChange={setFileTypeSearch}
                    className='h-9'
                  />
                  <CommandList>
                    <CommandGroup>
                      {fetchingLoading || !selectedUserData ? (
                        [...Array(3)].map((_, index) => (
                          <CommandItem key={index} className='flex items-center gap-2'>
                            <Skeleton className='h-4 w-4 rounded bg-gray-200' />
                            <Skeleton className='h-4 w-24 bg-gray-100' />
                          </CommandItem>
                        ))
                      ) : filteredFileTypes.length > 0 ? (
                        filteredFileTypes.map(f => (
                          <CommandItem
                            key={f.type}
                            value={f.type}
                            onSelect={() => handleFileTypeChange(f.type)}
                            className='flex items-center'
                          >
                            <File className='h-4 w-4 mr-2 ml-1 text-blue-600' />
                            {f.type}
                            {tempSelectedFileType === f.type && (
                              <Check className='ml-auto h-4 w-4 text-green-600' />
                            )}
                          </CommandItem>
                        ))
                      ) : (
                        <CommandItem disabled>No file types found</CommandItem>
                      )}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <div className='flex items-center gap-2'>
          <Button
            size='xs'
            variant='outline'
            className='text-sm font-bold px-4 bg-transparent hover:bg-blue-100 text-gray-700 border-blue-600 border-2'
            onClick={handleFilter}
            disabled={isLoading || fetchingLoading}
          >
            <Filter className='h-4 w-4 mr-2' />
            {isLoading ? 'Filtering...' : 'Filter'}
          </Button>
        </div>
      </div>
      <div className='flex flex-col gap-4 w-full'>
        {cardConfigs.map((config, index) => (
          <FileCard
            key={index}
            title={config.title}
            data={config.data}
            isLoading={fetchingLoading || isLoading}
          />
        ))}
      </div>
    </div>
  )
}