//fileSection

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { Filter } from 'lucide-react'

export default function FilterSection({
  users,
  devices,
  selectedUser,
  selectedDevice,
  fromDate,
  toDate,
  fetchUserLoading,
  fetchDeviceLoading,
  fetchUserError,
  fetchDeviceError,
  fetchLogLoading,
  setSelectedUser,
  setSelectedDevice,
  setFromDate,
  setToDate,
  onFilterClick
}) {
  return (
    <div className='flex justify-center items-center mb-4 bg-specialbg bg-opacity-25 rounded-t-lg p-1'>
      <div className='flex items-center gap-8'>
        <div className='flex items-center gap-2'>
          <h1 className='text-sm text-title font-semibold'>User :</h1>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant='outline'
                className='bg-transparent mb-1 text-subtitle border-0 border-b-2 border-gray-400 rounded-none w-32 justify-start'
                disabled={fetchUserLoading}
              >
                {fetchUserLoading
                  ? 'Loading...'
                  : selectedUser === 'all'
                  ? 'All Users'
                  : users.find(user => user.id === selectedUser)?.name ||
                    'All Users'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className='w-48 p-0'>
              <Command>
                <CommandInput
                  placeholder='Search users...'
                  className='h-9'
                />
                <CommandList>
                  <CommandEmpty>
                    {fetchUserError || 'No users found'}
                  </CommandEmpty>
                  <CommandGroup heading='Users'>
                    <CommandItem
                      value='all'
                      onSelect={() => setSelectedUser('all')}
                      className={selectedUser === 'all' ? 'bg-accent' : ''}
                    >
                      All Users
                    </CommandItem>
                    {users.map(user => (
                      <CommandItem
                        key={user.id}
                        value={user.name}
                        onSelect={() => setSelectedUser(user.id)}
                        className={
                          selectedUser === user.id ? 'bg-accent' : ''
                        }
                      >
                        {user.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
        <div className='flex items-center gap-2'>
          <h1 className='text-sm text-title font-semibold'>Device :</h1>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant='outline'
                className='bg-transparent text-subtitle border-0 border-b-2 border-gray-400 rounded-none w-32 justify-start'
                disabled={fetchDeviceLoading}
              >
                {fetchDeviceLoading
                  ? 'Loading...'
                  : selectedDevice === 'all'
                  ? 'All Devices'
                  : devices.find(device => device.id === selectedDevice)
                      ?.host_name || 'All Devices'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className='w-48 p-0'>
              <Command>
                <CommandInput
                  placeholder='Search devices...'
                  className='h-9'
                />
                <CommandList>
                  <CommandEmpty>
                    {fetchDeviceError || 'No devices found'}
                  </CommandEmpty>
                  <CommandGroup heading='Devices'>
                    <CommandItem
                      value='all'
                      onSelect={() => setSelectedDevice('all')}
                      className={
                        selectedDevice === 'all' ? 'bg-accent' : ''
                      }
                    >
                      All Devices
                    </CommandItem>
                    {devices.map(device => (
                      <CommandItem
                        key={device.id}
                        value={device.host_name}
                        onSelect={() => setSelectedDevice(device.id)}
                        className={
                          selectedDevice === device.id ? 'bg-accent' : ''
                        }
                      >
                        {device.host_name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
        <div className='flex items-center gap-2'>
          <h1 className='text-sm text-title font-semibold'>From :</h1>
          <Input
            type='date'
            value={fromDate}
            onChange={e => setFromDate(e.target.value)}
            className='w-36 bg-transparent border-0 text-subtitle border-b-2 border-gray-400 rounded-none'
          />
        </div>
        <div className='flex items-center gap-2'>
          <h1 className='text-sm text-title font-semibold'>To :</h1>
          <Input
            type='date'
            value={toDate}
            onChange={e => setToDate(e.target.value)}
            className='w-36 bg-transparent text-subtitle border-0 border-b-2 border-gray-400 rounded-none'
          />
        </div>
        <Button
          variant='outline'
          size='xs'
          className='bg-transparent px-3 text-md text-title font-bold border border-blue-700 hover:bg-blue-600'
          onClick={onFilterClick}
          disabled={fetchLogLoading}
        >
          <Filter className='h-4 w-4 mr-2' />
          Filter
        </Button>
      </div>
    </div>
  )
}