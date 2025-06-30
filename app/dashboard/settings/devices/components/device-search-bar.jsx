'use client'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'

export default function DeviceSearchBar({ query, setQuery }) {
  return (
    <div className='justify-end flex h-10 items-center border bg-specialbg bg-opacity-25 pr-3 border-subtitle rounded-lg gap-2 md:h-12'>
      <Input
        placeholder='Search Devices'
        value={query}
        onChange={e => setQuery(e.target.value)}
        className='relative h-8 flex bg-transparent border-none items-end text-end border-r-0 justify-end pr-10 ring-0 focus:ring-slate-50 focus:ring-0 md:h-10 md:text-base'
      />
      <Search
        style={{ transform: 'rotate(90deg)' }}
        className='h-4 w-4 md:h-5 md:w-5'
      />
    </div>
  )
}
