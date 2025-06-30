'use client'
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell
} from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import DeviceRow from './device-row'

export default function DeviceTable({ devices, loading, error }) {
  // Skeleton row renderer
  const renderSkeletonRows = () => {
    return Array.from({ length: 3 }).map((_, idx) => (
      <TableRow key={`skeleton-${idx}`}>
        {Array.from({ length: 6 }).map((_, cellIdx) => (
          <TableCell key={cellIdx} className="p-2">
            <Skeleton className="h-4 w-full" />
          </TableCell>
        ))}
      </TableRow>
    ))
  }

  // Error fallback
  if (error) {
    return (
      <div className="p-4 text-red-500 text-center font-semibold">
        Failed to load devices. Please try again later.
      </div>
    )
  }

  return (
    <div className='rounded-lg border-none shadow-none overflow-x-auto'>
      <Table className='min-w-full'>
        <TableHeader>
          <TableRow className='bg-transparent'>
            <TableHead className='text-lg font-bold text-start p-2 m-0 text-title md:text-xl'>Device</TableHead>
            <TableHead className='text-lg font-bold text-start p-2 m-0 text-title md:text-xl'>IP</TableHead>
            <TableHead className='text-lg font-bold text-start p-2 m-0 text-title md:text-xl'>Port</TableHead>
            <TableHead className='text-lg font-bold text-start p-2 m-0 text-title md:text-xl'>Log Count</TableHead>
            <TableHead className='text-lg font-bold text-start p-2 m-0 text-title md:text-xl'>Status</TableHead>
            <TableHead className='text-lg font-bold text-center p-2 m-0 text-title md:text-xl'>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading
            ? renderSkeletonRows()
            : devices.map((device, idx) => (
                <DeviceRow key={idx} device={device} />
              ))}
        </TableBody>
      </Table>
    </div>
  )
}
