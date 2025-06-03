'use client'

import { Card, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { AddFolderModal } from './add-folder'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { useState, useRef, useEffect, useCallback } from 'react'
import HandsontableComponent from './handson-table'
import { FolderPlus, Image } from 'lucide-react'

export default function FolderReportsPage() {
  const currentDate = new Date('2025-05-27T16:25:00+05:30').toLocaleString(
    'en-US',
    {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short',
      hour12: true,
      timeZone: 'Asia/Kolkata'
    }
  )

  // Mock data for folder selection with an "All Folders" option
  const mockFolders = [
    { id: 'all', name: 'All Folders', path: 'all' },
    { id: 'test1', name: 'RsyslogTest/test1', path: '/RsyslogTest/test1' },
    { id: 'test2', name: 'RsyslogTest/test2', path: '/RsyslogTest/test2' },
    { id: 'bmw', name: 'RsyslogTest/bmw', path: '/RsyslogTest/bmw' },
    { id: 'folder4', name: 'Folder 4', path: '/custom/folder4' },
    { id: 'folder5', name: 'Folder 5', path: '/custom/folder5' }
  ]

  // Mock data for Handsontable with folder association
  const allTableData = [
    [
      'Active-Com',
      'Janitha',
      '2025-04-09 08:10',
      'mkdir',
      '/RsyslogTest/test1/...',
      '0.1 MB',
      '192.168.0.34',
      'Event:delete,Path:RsyslogTest/kasun/UI/designs/components/js/',
      'test1' // Associated folder ID
    ],
    [
      'Active-Com',
      'Shaheer',
      '2025-04-09 08:10',
      'mkdir',
      '/RsyslogTest/test1/...',
      '0.1 MB',
      '192.168.0.34',
      'Event:delete,Path:RsyslogTest/...',
      'test1'
    ],
    [
      'Active-Com',
      'Shaheer',
      '2025-04-09 08:10',
      'mkdir',
      '/RsyslogTest/test2/...',
      '0.2 MB',
      '192.168.0.35',
      'Event:delete,Path:RsyslogTest/...',
      'test2'
    ],
    [
      'Office NAS',
      'Ayesha',
      '2025-04-09 08:10',
      'copy',
      '/RsyslogTest/bmw/...',
      '0.1 MB',
      '192.168.0.34',
      'Event:delete,Path:RsyslogTest/...',
      'bmw'
    ],
    [
      'Server-1',
      'Kamal',
      '2025-04-10 09:15',
      'move',
      '/custom/folder4/...',
      '0.3 MB',
      '192.168.0.36',
      'Event:move,Path:/custom/folder4/...',
      'folder4'
    ],
    [
      'Server-2',
      'Nimal',
      '2025-04-11 10:20',
      'delete',
      '/custom/folder5/...',
      '0.5 MB',
      '192.168.0.37',
      'Event:delete,Path:/custom/folder5/...',
      'folder5'
    ]
  ]

  // State for search term
  const [folderSearch, setFolderSearch] = useState('')
  // State for selected folder
  const [selectedFolder, setSelectedFolder] = useState('all')
  // Ref for the input field
  const inputRef = useRef(null)
  // State to track if Select is open
  const [isOpen, setIsOpen] = useState(false)
  // State for filtered table data
  const [filteredTableData, setFilteredTableData] = useState(allTableData)

  // Debounce function to delay filtering
  const debounce = (func, delay) => {
    let timeoutId
    return (...args) => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => func(...args), delay)
    }
  }

  // Handle search input change with debouncing
  const handleSearchChange = useCallback(
    debounce(value => {
      setFolderSearch(value)
    }, 300),
    []
  )

  // Filter folders for the dropdown
  const filteredFolders = mockFolders.filter(folder =>
    folder.name.toLowerCase().includes(folderSearch.toLowerCase())
  )

  // Filter Handsontable data based on selected folder
  useEffect(() => {
    if (selectedFolder === 'all') {
      setFilteredTableData(allTableData)
    } else {
      const filteredData = allTableData.filter(row => row[8] === selectedFolder)
      setFilteredTableData(filteredData)
    }
  }, [selectedFolder])

  // Focus the input field when the Select opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  return (
    <div className='flex'>
      <div className='flex-1 p-4 pt-0'>
        <div className='flex justify-end items-center mb-4 gap-4 bg-specialbg bg-opacity-25 rounded-t-lg px-2'>
          <div className='flex w-full items-end gap-8'>
            <div className='flex w-full items-center gap-2'>
              <Select
                value={selectedFolder}
                onValueChange={value => {
                  setSelectedFolder(value)
                  setFolderSearch('')
                }}
                onOpenChange={open => setIsOpen(open)} // Track open state
              >
                <SelectTrigger className='bg-transparent mb-1 text-subtitle border-0 border-r-2 border-gray-400 rounded-none w-full'>
                  <SelectValue placeholder='Select folder...' />
                </SelectTrigger>
                <SelectContent style={{ zIndex: 1000 }}>
                  <div className='p-2'>
                    <Input
                      ref={inputRef}
                      placeholder='Search folders...'
                      value={folderSearch}
                      onChange={e => {
                        const value = e.target.value
                        setFolderSearch(value) // Update state immediately for input display
                        // Debounced filtering
                      }}
                      className='w-full mb-2 text-subtitle border-gray-400 !bg-white'
                    />
                  </div>
                  <SelectGroup>
                    {filteredFolders.length === 0 ? (
                      <div className='px-2 py-1 text-gray-500 text-sm'>
                        No folders found
                      </div>
                    ) : (
                      filteredFolders.map(folder => (
                        <SelectItem key={folder.id} value={folder.id}>
                          <span className='flex items-center gap-2'>
                            <img
                              src='/images/foldericon.png'
                              alt='Folder Icon'
                              width={18}
                              height={18}
                              className='h-5 w-5'
                            />
                            <span className='text-subtitle'>
                              <span className='font-bold text-subtitle'>{folder.name}</span> ({folder.path})
                            </span>
                          </span>
                        </SelectItem>
                      ))
                    )}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          <AddFolderModal />
        </div>
        <Card className='bg-transparent shadow-none border-none'>
          <CardDescription>
            <HandsontableComponent data={filteredTableData} />
          </CardDescription>
        </Card>
      </div>
    </div>
  )
}