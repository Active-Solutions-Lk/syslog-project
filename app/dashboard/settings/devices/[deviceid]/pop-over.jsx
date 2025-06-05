'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'

export default function ExtensionPopover ({ extension, trigger, onSave }) {
  const [isOpen, setIsOpen] = useState(false)
  const [name, setName] = useState(extension ? extension.name : '')
  const [maxSize, setMaxSize] = useState(extension ? extension.maxSize : '')
  const [enabled, setEnabled] = useState(extension ? extension.enabled : false)

  const handleSubmit = () => {
    const newExtension = { name, maxSize, enabled }
    onSave(newExtension, extension)
    setIsOpen(false)
    if (!extension) {
      setName('')
      setMaxSize('')
      setEnabled(false)
    }
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        {trigger}
      </PopoverTrigger>
      <PopoverContent className='w-80'>
        <div className='grid gap-4'>
          <div className='space-y-2'>
            <h4 className='font-medium leading-none'>
              {extension ? 'Edit Extension' : 'Add Extension'}
            </h4>
            <p className='text-sm text-muted-foreground'>
              Enter the extension details.
            </p>
          </div>
          <div className='grid gap-2'>
            <div className='grid grid-cols-3 items-center gap-4'>
              <label htmlFor='name' className='text-sm font-medium'>
                Name
              </label>
              <Input
                id='name'
                value={name}
                onChange={(e) => setName(e.target.value)}
                className='col-span-2 h-8'
                placeholder='e.g., Doc'
              />
            </div>
            <div className='grid grid-cols-3 items-center gap-4'>
              <label htmlFor='maxSize' className='text-sm font-medium'>
                Max Size
              </label>
              <Input
                id='maxSize'
                value={maxSize}
                onChange={(e) => setMaxSize(e.target.value)}
                className='col-span-2 h-8'
                placeholder='e.g., 500MB'
              />
            </div>
            <div className='grid grid-cols-3 items-center gap-4'>
              <label htmlFor='enabled' className='text-sm font-medium'>
                Enabled
              </label>
              <Switch
                id='enabled'
                checked={enabled}
                onCheckedChange={setEnabled}
                className='col-span-2'
              />
            </div>
          </div>
          <div className='flex justify-end gap-2'>
            <Button
              variant='outline'
              size='sm'
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button
              size='sm'
              onClick={handleSubmit}
              className='bg-green-500 text-white'
            >
              Save
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}