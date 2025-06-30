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
import { ComboboxDemo } from './combobox'
import { SendData } from '../server-side'

export default function ExtensionPopover ({
  extension,
  trigger,
  deviceId,
  extensionId,
  setSuccess
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [extensionType, setExtensionType] = useState(
    extension ? extension.extension : ''
  )
  const [name, setName] = useState(extension ? extension.name : '')
  const [maxSize, setMaxSize] = useState(
    extension ? extension.maxSize : '80000MB'
  )

  // console.log('
  //   popover',deviceId)

  const [enabled, setEnabled] = useState(
    extension ? Boolean(extension.enabled) : false
  )
  const [category, setCategory] = useState(extension ? extension.category : '')
  const [error, setError] = useState(null)
  const [isSaving, setIsSaving] = useState(false)

  const handleSubmit = async () => {
    // Validate inputs
   
    if (!extensionType || !extensionType.startsWith('.')) {
      setError('Extension must start with a dot (e.g., .png)')
      return
    }
    if (!maxSize || isNaN(parseFloat(maxSize.replace(/[^0-9.]/g, '')))) {
      setError('Max Size must be a valid number (e.g., 500MB)')
      return
    }

    {
      extension ? deviceId : (deviceId = 0);
    }


    // console.log('deviceId', deviceId)

    const newExtension = {
      deviceId,
      extensionId: extensionId ? extensionId : 0,
      extension: extensionType,
      name,
      maxSize,
      enabled,
      category
    }


    setIsSaving(true)
    try {
      await SendData(newExtension)
      setIsOpen(false)
      setError(null)
      setSuccess(true)
      if (!extension) {
        setExtensionType('')
        setName('')
        setMaxSize('80000MB')
        setEnabled(false)
        setCategory('')
      }
    } catch (err) {
      setError(`Failed to save extension: ${err.message}`)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent className='w-80'>
        <div className='grid gap-4'>
          <div className='space-y-2'>
            <h4 className='font-medium leading-none'>
              {extension ? 'Edit Extension' : 'Add Extension'}
            </h4>
            <p className='text-sm text-muted-foreground'>
              Enter the extension details.
            </p>
            {error && <p className='text-sm text-red-500'>{error}</p>}
          </div>
          <div className='grid gap-2'>
            <div className='grid grid-cols-3 items-center gap-4'>
              <label htmlFor='extension' className='text-sm font-medium'>
                Extension
              </label>
              <Input
                id='extension'
                value={extensionType}
                onChange={e => setExtensionType(e.target.value)}
                className='col-span-2 h-8'
                placeholder='e.g., .doc, .png'
              />
            </div>
            <div className='grid grid-cols-3 items-center gap-4'>
              <label htmlFor='category' className='text-sm font-medium'>
                Category
              </label>
              {extension ? (
                <ComboboxDemo
                  id='category'
                  className='col-span-2 h-8'
                  value={category}
                  name={name}
                  status={enabled}
                  setValue={setCategory}
                  placeholder='e.g., Document, Image, Video'
                />
              ) : (
                <Input
                  id='name'
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className='col-span-2 h-8'
                  placeholder='e.g., Document, Image'
                />
              )}
            </div>
            <div className='grid grid-cols-3 items-center gap-4'>
              <label htmlFor='maxSize' className='text-sm font-medium'>
                Max Size
              </label>
              <Input
                id='maxSize'
                value={maxSize}
                onChange={e => setMaxSize(e.target.value)}
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
              onClick={() => {
                setIsOpen(false)
                setError(null)
              }}
            >
              Cancel
            </Button>
            <Button
              size='sm'
              onClick={handleSubmit}
              className='bg-green-500 text-white'
              disabled={isSaving}
            >
              {isSaving ? (
                <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin' />
              ) : (
                'Save'
              )}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
