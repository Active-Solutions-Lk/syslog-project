'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useState, useRef, useEffect, useCallback } from 'react'
import { FolderPlus, Image, User } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useSearchParams } from 'next/navigation' // Import to handle query params if needed

export default function UserSummary() {
  const router = useRouter()
  const searchParams = useSearchParams() // For potential future use with query params

  const users = [
    {
      id: 'shaheer',
      name: 'Shaheer',
      status: 'Active',
      totalFiles: 2766,
      totalSize: '0.03 MB',
      created: 2766,
      deleted: 2766,
      fileTypes: [
        { type: 'Video', createCount: 586, readCount: 0, deleteCount: 219, totalSize: 85744 },
        { type: 'Photo', createCount: 970, readCount: 0, deleteCount: 0, totalSize: 146534 },
        { type: 'Document', createCount: 1156, readCount: 0, deleteCount: 0, totalSize: 595066 },
        { type: 'Other', createCount: 438, readCount: 10, deleteCount: 73, totalSize: 45100 },
      ],
      folderId: 'test1',
    },
    {
      id: 'active',
      name: 'Active',
      status: 'Inactive',
      totalFiles: 20527,
      totalSize: '2.3 GB',
      created: 200,
      deleted: 100,
      fileTypes: [
        { type: 'Video', createCount: 500, readCount: 10, deleteCount: 150, totalSize: 75000 },
        { type: 'Photo', createCount: 800, readCount: 5, deleteCount: 20, totalSize: 120000 },
        { type: 'Document', createCount: 1000, readCount: 0, deleteCount: 30, totalSize: 500000 },
        { type: 'Other', createCount: 400, readCount: 15, deleteCount: 50, totalSize: 30000 },
      ],
      folderId: 'test2',
    },
    {
      id: 'kavishka',
      name: 'Kavishka',
      status: 'Active',
      totalFiles: 1025,
      totalSize: '3.1 GB',
      created: 300,
      deleted: 29,
      fileTypes: [
        { type: 'Video', createCount: 600, readCount: 0, deleteCount: 200, totalSize: 90000 },
        { type: 'Photo', createCount: 900, readCount: 0, deleteCount: 10, totalSize: 130000 },
        { type: 'Document', createCount: 1100, readCount: 0, deleteCount: 15, totalSize: 550000 },
        { type: 'Other', createCount: 450, readCount: 5, deleteCount: 60, totalSize: 35000 },
      ],
      folderId: 'bmw',
    },
    {
      id: 'ayesha',
      name: 'Ayesha',
      status: 'Active',
      totalFiles: 526,
      totalSize: '500 MB',
      created: 100,
      deleted: 30,
      fileTypes: [
        { type: 'Video', createCount: 550, readCount: 0, deleteCount: 180, totalSize: 80000 },
        { type: 'Photo', createCount: 850, readCount: 0, deleteCount: 5, totalSize: 110000 },
        { type: 'Document', createCount: 1050, readCount: 0, deleteCount: 25, totalSize: 480000 },
        { type: 'Other', createCount: 420, readCount: 8, deleteCount: 40, totalSize: 28000 },
      ],
      folderId: 'folder4',
    },
    {
      id: 'janitha',
      name: 'Janitha',
      status: 'Inactive',
      totalFiles: 225,
      totalSize: 'N/A',
      created: 'N/A',
      deleted: 'N/A',
      fileTypes: [
        { type: 'Video', createCount: 500, readCount: 0, deleteCount: 150, totalSize: 70000 },
        { type: 'Photo', createCount: 800, readCount: 0, deleteCount: 10, totalSize: 100000 },
        { type: 'Document', createCount: 900, readCount: 0, deleteCount: 20, totalSize: 450000 },
        { type: 'Other', createCount: 400, readCount: 10, deleteCount: 50, totalSize: 25000 },
      ],
      folderId: 'folder5',
    },
    {
      id: 'kamal',
      name: 'Kamal',
      status: 'Active',
      totalFiles: 2529,
      totalSize: 'N/A',
      created: 'N/A',
      deleted: 'N/A',
      fileTypes: [
        { type: 'Video', createCount: 580, readCount: 0, deleteCount: 210, totalSize: 85000 },
        { type: 'Photo', createCount: 950, readCount: 0, deleteCount: 0, totalSize: 140000 },
        { type: 'Document', createCount: 1150, readCount: 0, deleteCount: 0, totalSize: 590000 },
        { type: 'Other', createCount: 430, readCount: 10, deleteCount: 70, totalSize: 45000 },
      ],
      folderId: 'test1',
    },
  ]

  const [userSearch, setUserSearch] = useState('')
  const [selectedFolder, setSelectedFolder] = useState('all')
  const [cardsToShow, setCardsToShow] = useState(25)
  const inputRef = useRef(null)
  const [isOpen, setIsOpen] = useState(false)
  const [filteredUsers, setFilteredUsers] = useState(users)

  const debounce = (func, delay) => {
    let timeoutId
    return (...args) => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => func(...args), delay)
    }
  }

  const handleSearchChange = useCallback(
    debounce(value => {
      setUserSearch(value)
    }, 300),
    []
  )

  useEffect(() => {
    const filtered = users.filter(user =>
      user.name.toLowerCase().includes(userSearch.toLowerCase())
    )
    setFilteredUsers(filtered)
  }, [userSearch])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const handleRowClick = (userId, fileType) => {
    router.push(`/dashboard/user-summary/${userId}?fileType=${encodeURIComponent(fileType)}`)
  }

  return (
    <div className='flex'>
      <div className='flex-1 p-4 pt-0'>
        <div className='flex justify-end items-center mb-4 gap-4 bg-specialbg bg-opacity-25 rounded-t-lg px-2'>
          <div className='flex w-full items-end gap-8'>
            <div className='flex w-full items-center gap-2'>
              <Input
                ref={inputRef}
                placeholder='Search Users...'
                value={userSearch}
                onChange={e => {
                  const value = e.target.value
                  setUserSearch(value)
                }}
                className='w-full mb-1 text-subtitle rounded-none p-2 border-0 border-r-2 border-gray-400 !bg-transparent'
              />
            </div>
          </div>
          <Select
            value={cardsToShow.toString()}
            onValueChange={value => setCardsToShow(Number(value))}
          >
            <SelectTrigger className='bg-white rounded-lg border text-xs border-specialBlue text-title hover:bg-blue-100 flex items-center w-32'>
              <SelectValue placeholder='Cards to show' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='25'>
                <span className="flex flex-row items-center">
                  <User className='h-4 w-4 mr-2 ml-1 text-specialBlue' />
                  25 Users
                </span>
              </SelectItem>
              <SelectItem value='50'>
                <span className="flex flex-row items-center">
                  <User className='h-4 w-4 mr-2 ml-1 text-specialBlue' />
                  50 Users
                </span>
              </SelectItem>
              <SelectItem value='100'>
                <span className="flex flex-row items-center">
                  <User className='h-4 w-4 mr-2 ml-1 text-specialBlue' />
                  100 Users
                </span>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4'>
          {filteredUsers.slice(0, cardsToShow).map(user => (
            <Card key={user.id} className='bg-white shadow-md rounded-lg'>
              <CardHeader className='p-3 px-4 bg-specialBlue flex flex-row justify-between rounded-t-lg'>
                <CardTitle className='text-lg text-white font-semibold'>
                  {user.name}
                </CardTitle>
                <CardDescription
                  className={`text-sm ${
                    user.status === 'Active'
                      ? 'text-white bg-green-600 rounded-xl px-3 '
                      : 'text-white bg-critical rounded-xl px-3'
                  }`}
                >
                  {user.status}
                </CardDescription>
              </CardHeader>
              <CardContent className='flex flex-col p-0 items-center w-full'>
                <div className='flex items-center justify-between px-8 w-full'>
                  <div className='p-4 justify-between text-center'>
                    <p className='text-xs text-subtitle'>Total Files</p>
                    <p className='text-3xl font-bold text-gray-600'>
                      {user.totalFiles || 'N/A'}
                    </p>
                  </div>
                  <div className='p-4 justify-between text-center'>
                    <p className='text-xs text-subtitle'>Total Size</p>
                    <p className='text-3xl font-bold text-gray-600'>
                      {user.totalSize || 'N/A'}
                    </p>
                  </div>
                  <div className='p-4 justify-between text-center'>
                    <p className='text-xs text-subtitle'>Created Files</p>
                    <p className='text-3xl font-bold text-gray-600'>
                      {user.created || 'N/A'}
                    </p>
                  </div>
                  <div className='p-4 justify-between text-center'>
                    <p className='text-xs text-subtitle'>Deleted Files</p>
                    <p className='text-3xl font-bold text-gray-600'>
                      {user.deleted || 'N/A'}
                    </p>
                  </div>
                </div>
                <div className='flex items-center justify-center w-full mt-4'>
                  <Table className='w-full'>
                    <TableHeader className='bg-specialbg bg-opacity-35 text-lg'>
                      <TableRow className='text-md'>
                        <TableHead className='text-title p-2 px-4'>File Type</TableHead>
                        <TableHead className='text-title text-start'>
                          Create Count
                        </TableHead>
                        <TableHead className='text-title text-start'>
                          Read Count
                        </TableHead>
                        <TableHead className='text-title text-start'>
                          Delete Count
                        </TableHead>
                        <TableHead className='text-title text-start'>
                          Total Size (MB)
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {user.fileTypes.map((file, index) => (
                        <TableRow
                          key={index}
                          className='p-0 m-0 cursor-pointer hover:bg-gray-100'
                          onClick={() => handleRowClick(user.id, file.type)} // Pass file.type
                        >
                          <TableCell className='font-medium text-md text-subtitle'>
                            {file.type}
                          </TableCell>
                          <TableCell className='text-start font-medium text-md text-subtitle'>
                            {file.createCount}
                          </TableCell>
                          <TableCell className='text-start font-medium text-md text-subtitle'>
                            {file.readCount}
                          </TableCell>
                          <TableCell className='text-start font-medium text-md text-subtitle'>
                            {file.deleteCount}
                          </TableCell>
                          <TableCell className='text-start font-medium text-md text-subtitle'>
                            {file.totalSize}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}