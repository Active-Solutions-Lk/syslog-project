import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Trash2,
  HardDriveUpload,
  HardDriveDownload,
  Copy,
  CopyX
} from 'lucide-react'

export default function FileTransferCard ({ fileTransfer }) {
  // console.log('fileTransfer from component', fileTransfer)

  return (
    <Card className='mt-4 bg-yellow-100 bg-opacity-65 shadow-none border-none'>
      <CardHeader>
        <CardTitle className='flex justify-center text-lg font-extrabold'>
          Total File Transfer
        </CardTitle>
      </CardHeader>
      <CardContent className='grid grid-cols-5 gap-4'>
        <div className='flex flex-col items-center'>
          <HardDriveUpload className='h-8 w-8 text-specialBlue' />
          <span>Files {fileTransfer.upload?.files ?? 0}</span>
          <span>Size {fileTransfer.upload?.size ?? '0GB'}</span>
        </div>
        <div className='flex flex-col items-center'>
          <HardDriveDownload className='h-8 w-8 text-specialBlue' />
          <span>Files {fileTransfer.download?.files ?? 0}</span>
          <span>Size {fileTransfer.download?.size ?? '0GB'}</span>
        </div>
        <div className='flex flex-col items-center'>
          <Trash2 className='h-8 w-8 text-specialBlue' />
          <span>Files {fileTransfer.delete?.files ?? 0}</span>
          <span>Size {fileTransfer.delete?.size ?? '0GB'}</span>
        </div>
        <div className='flex flex-col items-center'>
          <Copy className='h-8 w-8 text-specialBlue' />
          <span>Files {fileTransfer.copy?.files ?? 0}</span>
          <span>Size {fileTransfer.copy?.size ?? '0GB'}</span>
        </div>
        <div className='flex flex-col items-center'>
          <CopyX className='h-8 w-8 text-specialBlue' />
          <span>Files {fileTransfer.cut?.files ?? 0}</span>
          <span>Size {fileTransfer.cut?.size ?? '0GB'}</span>
        </div>
      </CardContent>
    </Card>
  )
}
