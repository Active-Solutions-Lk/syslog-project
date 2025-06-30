'use client'
import { Button } from '@/components/ui/button'
import { TableRow, TableCell } from '@/components/ui/table'
import { useRouter } from 'next/navigation'

export default function DeviceRow({ device }) {
  const router = useRouter()

  const handleEditClick = () => {
    router.push(`/dashboard/settings/devices/${device.id}`)
  }

  return (
    <TableRow className='p-0 m-0 hover:bg-gray-50'>
      <TableCell className='text-start p-2 m-0 text-sm md:text-base'>{device.host_name}</TableCell>
      <TableCell className='text-start p-2 m-0 text-sm md:text-base'>{device.ip}</TableCell>
      <TableCell className='text-start p-2 m-0 text-sm md:text-base'>{device.port}</TableCell>
      <TableCell className='text-start p-2 m-0 text-sm md:text-base'>{device.logCount}</TableCell>
      <TableCell className='text-start p-2 m-0 text-sm md:text-base'>{device.status}</TableCell>
      <TableCell className='text-center p-2 m-0 text-sm md:text-base'>
        <Button
          variant='outline'
          size='xs'
          className='border px-2 border-specialBlue text-xs md:text-base'
          onClick={handleEditClick}
        >
          Settings
        </Button>
      </TableCell>
    </TableRow>
  )
}
