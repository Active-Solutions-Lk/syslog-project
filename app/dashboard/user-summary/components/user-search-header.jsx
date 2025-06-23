'use client'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { User } from 'lucide-react'
import { useRef, useEffect } from 'react'

export default function UserSearchHeader({ userSearch, setUserSearch, cardsToShow, setCardsToShow, isOpen }) {
  const inputRef = useRef(null)

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  return (
    <div className='flex justify-end items-center mb-4 gap-4 bg-specialbg bg-opacity-25 rounded-t-lg px-2'>
      <div className='flex w-full items-end gap-8'>
        <div className='flex w-full items-center gap-2'>
          <Input
            ref={inputRef}
            placeholder='Search Users...'
            value={userSearch}
            onChange={e => setUserSearch(e.target.value)}
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
  )
}
