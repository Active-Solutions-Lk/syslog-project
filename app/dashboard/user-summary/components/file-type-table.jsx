'use client'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export default function FileTypeTable({ fileTypes, onRowClick }) {
  return (
    <Table className='w-full'>
      <TableHeader className='bg-specialbg bg-opacity-35 text-lg'>
        <TableRow className='text-md '>
          <TableHead className='text-title p-2 px-4'>File Type</TableHead>
          <TableHead className='text-title text-start'>Upload Count</TableHead>
          <TableHead className='text-title text-start'>Download Count</TableHead>
          <TableHead className='text-title text-start'>Delete Count</TableHead>
          <TableHead className='text-title text-start'>Total Size (GB)</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {fileTypes.map((file, index) => (
          <TableRow
            key={index}
            className='p-0 m-0 cursor-pointer hover:bg-gray-100'
            onClick={() => onRowClick(file.type)}
          >
            <TableCell className='font-medium text-md px-4 text-subtitle'>{file.type}</TableCell>
            <TableCell className='text-start font-medium px-4 text-md text-subtitle'>{file.createCount}</TableCell>
            <TableCell className='text-start font-medium px-4 text-md text-subtitle'>{file.readCount}</TableCell>
            <TableCell className='text-start font-medium px-4 text-md text-subtitle'>{file.deleteCount}</TableCell>
            <TableCell className='text-start font-medium px-4 text-md text-subtitle'>{file.totalSize}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
