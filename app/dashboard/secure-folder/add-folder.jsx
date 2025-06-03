import React from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

export function AddFolderModal () {
const [open, setOpen] = React.useState(false);

return (
    <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
            <Button
                className='bg-white rounded-lg border text-xs border-specialBlue text-title hover:bg-blue-100 flex items-center'
                variant='outline'
                size='sm'
            >
                <img
                    src='/images/foldericon.png'
                    alt='Folder Icon'
                    width={18}
                    height={18}
                    className='h-auto w-8'
                />
                Add Folder
            </Button>
        </DialogTrigger>
        <DialogContent className='sm:max-w-[425px] bg-white border-0 rounded-lg shadow-lg'>
            <DialogHeader className='bg-blue-400 text-white p-4 rounded-t-lg'>
                <DialogTitle className='text-lg font-semibold'>
                    Folder Details
                </DialogTitle>
            </DialogHeader>
            <div className=' text-gray-700 flex-1 flex-col gap-2 p-4'>
                <div className='flex-1 flex-col gap-8 '>
                    <Label
                        htmlFor='nickname'
                        className='text-right text-gray-700 font-medium'
                    >
                        Nick Name
                    </Label>
                    <Input
                        id='nickname'
                        defaultValue='Eg: HR Documents'
                        className='border-0 border-b-2 ms-o ps-0 border-gray-400 rounded-none bg-white text-subtitle focus:ring-0 w-full'
                    />
                </div>
                <div className='flex flex-col items-start mt-2 gap-1'>
                    <Label
                        htmlFor='device'
                        className='text-center text-gray-700 font-medium'
                    >
                        Device
                    </Label>
                    <Select defaultValue='office-nas'>
                        <SelectTrigger className='bg-transparent text-subtitle border-0 border-b-2 border-gray-400 rounded-none w-full'>
                            <SelectValue placeholder='Select device' />
                        </SelectTrigger>
                        <SelectContent style={{ zIndex: 1000 }}>
                            <SelectItem value='office-nas'>Office NAS</SelectItem>

                            {/* Add more devices as needed */}
                        </SelectContent>
                    </Select>
                </div>
                <div className='flex-1 flex-col gap-8 mt-2'>
                    <Label
                        htmlFor='path'
                        className='text-right text-gray-700 font-medium'
                    >
                        Path
                    </Label>
                    <Input
                        id='path'
                        defaultValue='Eg : /RsyslogTest/test1'
                        className='border-0 border-b-2 ms-o ps-0 border-gray-400 rounded-none bg-white text-subtitle focus:ring-0 w-full'
                    />
                </div>
            </div>
            <DialogFooter className='bg-gray-100 p-4 rounded-b-lg flex justify-end gap-4'>
                <Button
                    variant='outline'
                    className='bg-transparent border border-critical text-critical hover:bg-red-100 rounded-md px-8 py-2'
                    onClick={() => setOpen(false)}
                >
                    Cancel
                </Button>
                <Button
                    type='submit'
                    className='bg-transparent border border-info text-info hover:bg-blue-100 rounded-md px-8 py-2'
                >
                    Add Folder
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
)
}
