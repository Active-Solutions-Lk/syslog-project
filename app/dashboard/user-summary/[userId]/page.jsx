'use client'

import React from 'react'
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandGroup,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useRouter, useSearchParams } from 'next/navigation'
import { File, Filter, User, Check, ChevronDown } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import users from '@/lib/mockdata'
import FileCard from './file-card'

export default function UserDetailPage({ params }) {
  const unwrappedParams = React.use(params)
  const { userId } = unwrappedParams // Extract userId from the dynamic route
  const searchParams = useSearchParams() // Get query parameters
  const fileType = searchParams.get('fileType') // Extract fileType from query
  const router = useRouter()
  const user = Array.isArray(users) ? users.find(u => u.id === userId) : undefined // Add fallback in case users is undefined
  const [selectedUser, setSelectedUser] = useState(userId)
  const [selectedFileType, setSelectedFileType] = useState(fileType || '')
  const [tempSelectedUser, setTempSelectedUser] = useState(userId)
  const [tempSelectedFileType, setTempSelectedFileType] = useState(fileType || '')
  const [userSearch, setUserSearch] = useState('')
  const [fileTypeSearch, setFileTypeSearch] = useState('')
  const [userOpen, setUserOpen] = useState(false)
  const [fileTypeOpen, setFileTypeOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setSelectedUser(userId)
    setTempSelectedUser(userId)
  }, [userId])

  useEffect(() => {
    setSelectedFileType(fileType || '')
    setTempSelectedFileType(fileType || '')
  }, [fileType])

  if (!user) {
    return <div>User not found</div>
  }

  // Get the selected file type data based on the final selected user and file type
  const selectedUserData = Array.isArray(users) ? users.find(u => u.id === selectedUser) : undefined
  const selectedFileTypeData = selectedUserData
    ? selectedUserData.fileTypes.find(f => f.type === decodeURIComponent(selectedFileType))
    : null

  // Get uploads, downloads, and deleted for the selected file type
  const uploads = selectedFileTypeData ? selectedFileTypeData.uploads : []
  const downloads = selectedFileTypeData ? selectedFileTypeData.downloads : []
  const deleted = selectedFileTypeData ? selectedFileTypeData.deleted || [] : []

  // Define card configurations
  const cardConfigs = [
    {
      title: selectedFileType ? `${decodeURIComponent(selectedFileType)} Uploads` : 'Uploads N/A',
      data: uploads,
    },
    {
      title: selectedFileType ? `${decodeURIComponent(selectedFileType)} Downloads` : 'Downloads N/A',
      data: downloads,
    },
    {
      title: selectedFileType ? `${decodeURIComponent(selectedFileType)} Deleted` : 'Deleted N/A',
      data: deleted,
    },
  ]

  // Handle user selection change (temporary)
  const handleUserChange = (newUserId) => {
    setTempSelectedUser(newUserId)
    setUserOpen(false)
    setUserSearch('')
  }

  // Handle file type selection change (temporary)
  const handleFileTypeChange = (newFileType) => {
    setTempSelectedFileType(newFileType)
    setFileTypeOpen(false)
    setFileTypeSearch('')
  }

  // Handle filter button click
  const handleFilter = async () => {
    setIsLoading(true)
    // Simulate a delay to mimic fetching data (e.g., 1 second)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setSelectedUser(tempSelectedUser)
    setSelectedFileType(tempSelectedFileType)
    // Update URL with the selected values
    const query = tempSelectedFileType ? `?fileType=${encodeURIComponent(tempSelectedFileType)}` : ''
    router.push(`/dashboard/user-summary/${tempSelectedUser}${query}`)
    setIsLoading(false)
  }

  // Filter users based on search input
  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(userSearch.toLowerCase())
  )

  // Filter file types based on search input
  const filteredFileTypes = user.fileTypes.filter(f =>
    f.type.toLowerCase().includes(fileTypeSearch.toLowerCase())
  )

  return (
    <div className="flex-1 p-4 pt-0">
      {/* Filter Section */}
      <div className="flex justify-between items-center mb-4 gap-4 bg-specialbg bg-opacity-25 rounded-t-lg px-2">
        <div className="flex items-center gap-2">
          {/* User Searchable Dropdown */}
          <div className="flex items-center gap-2">
            <div className="text-title ps-2 text-xs font-semibold">User :</div>
            <Popover open={userOpen} onOpenChange={setUserOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className="bg-transparent p-0 rounded-none border-0 border-b-2 text-xs border-title text-title hover:bg-blue-100 flex items-center w-32 justify-start gap-2"
                >
                  <User className="h-4 w-4 text-specialBlue" />
                  <span className="truncate">
                    {tempSelectedUser ? users.find(u => u.id === tempSelectedUser)?.name : 'Select User'}
                  </span>
                  <ChevronDown className="h-4 w-4 text-subtitle ml-auto" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-48 p-0">
                <Command>
                  <CommandInput
                    placeholder="Search user..."
                    value={userSearch}
                    onValueChange={setUserSearch}
                    className="h-9"
                  />
                  <CommandList>
                    <CommandGroup>
                      {filteredUsers.length > 0 ? (
                        filteredUsers.map(u => (
                          <CommandItem
                            key={u.id}
                            value={u.id}
                            onSelect={() => handleUserChange(u.id)}
                            className="flex items-center"
                          >
                            <User className="h-4 w-4 mr-2 ml-1 text-specialBlue" />
                            {u.name}
                            {tempSelectedUser === u.id && (
                              <Check className="ml-auto h-4 w-4 text-green-600" />
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

          {/* File Type Searchable Dropdown */}
          <div className="flex items-center gap-2">
            <div className="text-title ps-2 text-xs font-semibold">File Type :</div>
            <Popover open={fileTypeOpen} onOpenChange={setFileTypeOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className="bg-transparent p-0 rounded-none border-0 border-b-2 text-xs border-title text-title hover:bg-blue-100 flex items-center w-32 justify-start gap-2"
                >
                  <File className="h-4 w-4 ml-2 text-specialBlue" />
                  <span className="truncate">
                    {tempSelectedFileType || 'Select File Type'}
                  </span>
                  <ChevronDown className="h-4 w-4 text-subtitle ml-auto" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-48 p-0">
                <Command>
                  <CommandInput
                    placeholder="Search file type..."
                    value={fileTypeSearch}
                    onValueChange={setFileTypeSearch}
                    className="h-9"
                  />
                  <CommandList>
                    <CommandGroup>
                      {filteredFileTypes.length > 0 ? (
                        filteredFileTypes.map(f => (
                          <CommandItem
                            key={f.type}
                            value={f.type}
                            onSelect={() => handleFileTypeChange(f.type)}
                            className="flex items-center"
                          >
                            <File className="h-4 w-4 mr-2 ml-1 text-specialBlue" />
                            {f.type}
                            {tempSelectedFileType === f.type && (
                              <Check className="ml-auto h-4 w-4 text-green-600" />
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
        <div className="flex items-center gap-2">
          <Button
            size="xs"
            variant="outline"
            className="text-sm font-bold px-4 bg-transparent hover:bg-blue-100 text-title border-specialBlue border-2"
            onClick={handleFilter}
            disabled={isLoading}
          >
            <Filter className="h-4 w-4 mr-2" />
            {isLoading ? 'Filtering...' : 'Filter'}
          </Button>
        </div>
      </div>
      <div className="flex flex-col gap-4 w-full">
        {/* Render Cards Using Loop */}
        {cardConfigs.map((config, index) => (
          <FileCard key={index} title={config.title} data={config.data} isLoading={isLoading} />
        ))}
      </div>
    </div>
  )
}