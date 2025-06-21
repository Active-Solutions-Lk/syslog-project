import { Card, CardContent } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'

export default function FileTypesTable({ fileTypesData }) {
  return (
    <Card className='mt-4 bg-yellow-100 bg-opacity-65 shadow-none border-none'>
      <CardContent>
        <Table className='border-2 border-specialBlue w-full h-full'>
          <TableHeader>
            <TableRow>
              <TableHead className='text-center border-2 text-title font-bold border-specialBlue'>
                File Type
              </TableHead>
              <TableHead
                colSpan={2}
                className='text-center text-title font-bold'
              >
                Download
              </TableHead>
              <TableHead
                colSpan={2}
                className='text-center text-title font-bold border-l-2 border-specialBlue'
              >
                Upload
              </TableHead>
            </TableRow>
            <TableRow>
              <TableHead className='text-center p-1'></TableHead>
              <TableHead className='text-center text-xs border-2 text-title font-bold border-specialBlue'>
                Number of files
              </TableHead>
              <TableHead className='text-center text-xs border-2 text-title font-bold border-specialBlue'>
                Size of files
              </TableHead>
              <TableHead className='text-center text-xs border-2 text-title font-bold border-specialBlue'>
                Number of files
              </TableHead>
              <TableHead className='text-center text-xs border-2 text-title font-bold border-specialBlue'>
                Size of files
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fileTypesData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className='p-1 text-center text-gray-500'
                >
                  No file types found
                </TableCell>
              </TableRow>
            ) : (
              fileTypesData.map((item, index) => (
                <TableRow
                  key={index}
                  className={`${
                    index % 2 === 0
                      ? 'hover:bg-white'
                      : 'hover:bg-yellow-100'
                  }`}
                >
                  <TableCell className='p-1 text-start border-l-2 border-specialBlue'>
                    {item.type}
                  </TableCell>
                  <TableCell className='p-1 text-center border-l-2 border-specialBlue'>
                    {item.downloadFiles}
                  </TableCell>
                  <TableCell className='p-1 text-center border-l-2 border-specialBlue'>
                    {item.downloadSize}
                  </TableCell>
                  <TableCell className='p-1 text-center border-l-2 border-specialBlue'>
                    {item.uploadFiles}
                  </TableCell>
                  <TableCell className='p-1 text-center border-l-2 border-specialBlue'>
                    {item.uploadSize}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}