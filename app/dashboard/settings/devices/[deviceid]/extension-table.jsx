'use client'

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

export default function ExtensionTable ({ device, onSaveExtension }) {
  return (
    <div className='overflow-x-auto'>
      <div className='max-h-64 overflow-y-auto'>
        <Table className='w-full'>
          <TableHeader>
            <TableRow className='bg-specialbg py-2 bg-opacity-25'>
              <TableHead className='text-left ps-2 text-xs sm:text-sm font-medium text-gray-700'>
                Extension
              </TableHead>
              <TableHead className='text-left ps-2 text-xs sm:text-sm font-medium text-gray-700'>
                Max Size
              </TableHead>
              <TableHead className='text-center ps-2 text-xs sm:text-sm font-medium text-gray-700'>
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {device?.extensions?.map((ext, index) => (
              <TableRow key={index} className='border-none'>
                <TableCell className='p-2 py-1 text-xs sm:text-sm'>{ext.name}</TableCell>
                <TableCell className='p-2 py-1 text-xs sm:text-sm'>{ext.maxSize}</TableCell>
                <TableCell className='p-2 py-1 text-center flex justify-center items-center gap-1'>
                  <Switch checked={ext.enabled} className='scale-75 sm:scale-100' />
                  <Button
                    variant='outline'
                    size='sm'
                    className='border-none bg-transparent text-critical hover:bg-transparent hover:text-critical p-0'
                  >
                    <Trash className='h-3 w-3 sm:h-4 sm:w-4' />
                  </Button>
                  <ExtensionPopover
                    extension={ext}
                    onSave={onSaveExtension}
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
            )) || <TableRow><TableCell colSpan={3} className='text-center text-xs sm:text-sm'>No extensions available</TableCell></TableRow>}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}