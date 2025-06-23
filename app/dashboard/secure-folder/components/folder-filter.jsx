'use client'

import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { useRef, useState, useEffect } from 'react'

export default function FolderFilter({ folders, selectedFolder, setSelectedFolder }) {
  const [folderSearch, setFolderSearch] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const inputRef = useRef(null)

  const filteredFolders = folders.filter(folder =>
    folder.name.toLowerCase().includes(folderSearch.toLowerCase())
  )

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  return (
    <Select
      value={selectedFolder}
      onValueChange={value => {
        setSelectedFolder(value)
        setFolderSearch('')
      }}
      onOpenChange={open => setIsOpen(open)}
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
            onChange={e => setFolderSearch(e.target.value)}
            className='w-full mb-2 text-subtitle border-gray-400 !bg-white'
          />
        </div>
        <SelectGroup>
          {filteredFolders.length === 0 ? (
            <div className='px-2 py-1 text-gray-500 text-sm'>No folders found</div>
          ) : (
            filteredFolders.map(folder => (
              <SelectItem key={`${folder.id}-${folder.path}`} value={folder.path}>
                <span className='flex items-center gap-2'>
                  <img src='/images/foldericon.png' alt='Folder Icon' width={18} height={18} className='h-5 w-5' />
                  <span className='text-subtitle'>
                    <span className='font-bold'>{folder.name}</span> ({folder.path})
                  </span>
                </span>
              </SelectItem>
            ))
          )}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
