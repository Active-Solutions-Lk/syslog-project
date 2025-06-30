'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { Switch } from '@/components/ui/switch'
import { Trash, Pencil } from 'lucide-react'
import ExtensionPopover from './pop-over'
import { NewExtension } from '../server-side'

export default function ExtensionTable ({ device, deviceId, setSuccess }) {

  // console.log('deviceId extebale', deviceId);
  const [extensions, setExtensions] = useState([])
  const [isUpdating, setIsUpdating] = useState(false)
  const [updatingIndex, setUpdatingIndex] = useState(null)

  useEffect(() => {
    if (
      !isUpdating &&
      device &&
      JSON.stringify(device) !== JSON.stringify(extensions)
    ) {
    // console.log(`Updating extensions from device:`, device)
      setExtensions(device || [])
    }
  }, [device, isUpdating])

  const handleToggle = async (index, checked) => {
    const updated = [...extensions]
    if (updated[index].enabled === checked) {
    // // console.log(
    //     `No change for Extension ID: ${index + 1}, already ${
    //       checked ? 'Enabled' : 'Disabled'
    //     }`
    //   )
      return
    }

    updated[index].enabled = checked;
    setIsUpdating(true)
    setUpdatingIndex(index)
    setExtensions(updated)
    const extensionData = {
      deviceId,
      extensionId: index + 1,
      extension: updated[index].extension,
      status: checked ? 'Enabled' : 'Disabled',
      index : updated[index]
    }
  // // console.log(
  //     `Device ID: ${deviceId}, Extension ID: ${index + 1}, Extension: ${
  //       updated[index].extension
  //     }, Status: ${checked ? 'Enabled' : 'Disabled'}`
  //   )
  // console.log(`Updated extensions state:`, updated)

    try {
    // console.log(`Calling NewExtension with data:`, extensionData)
      await NewExtension(extensionData)
    } catch (error) {
      console.error(
        `Error in NewExtension for Extension ID: ${index + 1}`,
        error
      )
      updated[index].enabled = !checked
      setExtensions([...updated])
    } finally {
      setIsUpdating(false)
      setUpdatingIndex(null)
    }
  }

  return (
    <div className='overflow-x-auto'>
      <div className='max-h-64 overflow-y-auto'>
        <Table className='w-full'>
          <TableHeader>
            <TableRow>
              <TableHead className='p-2 py-1 text-xs sm:text-sm'>
                Extension
              </TableHead>
              <TableHead className='p-2 py-1 text-xs sm:text-sm'>
                Category
              </TableHead>
              <TableHead className='p-2 py-1 text-xs sm:text-sm'>
                Max Size
              </TableHead>
              <TableHead className='p-2 py-1 text-xs sm:text-sm text-center'>
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {extensions?.length > 0 ? (
              extensions.map((ext, index) => (
              // console.log('index', index),
              // console.log('ext', ext),

                <TableRow key={index} className='border-none'>
                  <TableCell className='p-2 py-1 text-xs sm:text-sm'>
                    {ext.extension}
                  </TableCell>
                  <TableCell className='p-2 py-1 text-xs sm:text-sm'>
                    {ext.name || '—'}
                  </TableCell>
                  <TableCell className='p-2 py-1 text-xs sm:text-sm'>
                    {ext.maxSize}
                  </TableCell>
                  <TableCell className='p-2 py-1 text-center flex justify-center items-center gap-1'>
                    {updatingIndex === index ? (
                      <div className='w-10 h-5 bg-gray-500 animate-pulse rounded-full scale-75 sm:scale-100' />
                    ) : (
                      <Switch
                        checked={ext.enabled}
                        onCheckedChange={checked => handleToggle(index, checked)}
                        className='scale-75 sm:scale-100'
                        aria-label={`Toggle ${ext.extension} enabled`}
                      />
                    )}
                    <Button
                      variant='outline'
                      size='sm'
                      className='border-none bg-transparent text-critical hover:bg-transparent hover:text-critical p-0'
                    >
                      {/* Optional delete or icon */}
                    </Button>
                    <ExtensionPopover
                      extension={ext}
                      deviceId={deviceId}
                      extensionId={index + 1}
                      setSuccess={setSuccess}
                      trigger={
                        <Button
                          variant='outline'
                          size='sm'
                          className='border-none bg-transparent text-specialBlue hover:bg-transparent hover:text-specialBlue p-0'
                        >
                          <Pencil className='h-3 w-3 sm:h-4 sm:w-4' />
                        </Button>
                      }
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className='text-center text-xs sm:text-sm'
                >
                  No extensions available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}