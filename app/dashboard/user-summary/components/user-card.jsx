'use client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import FileTypeTable from './file-type-table'
import { useRouter } from 'next/navigation'

export default function UserCard({ user }) {
  const router = useRouter()

  const handleRowClick = (fileType) => {
    router.push(`/dashboard/user-summary/${user.id}?fileType=${encodeURIComponent(fileType)}`)
  }

  return (
    <Card className='bg-white shadow-md rounded-lg'>
      <CardHeader className='p-3 px-4 bg-specialBlue flex flex-row justify-between rounded-t-lg'>
        <CardTitle className='text-lg text-white font-semibold'>{user.name}</CardTitle>
        <CardDescription
          className={`text-sm ${
            user.status === 'Active'
              ? 'text-white bg-green-600 rounded-xl px-3 '
              : 'text-white bg-critical rounded-xl px-3'
          }`}
        >
          {user.status}
        </CardDescription>
      </CardHeader>
      <CardContent className='flex flex-col p-0 items-center w-full'>
        <div className='flex items-center justify-between px-8 w-full'>
          {['Total Files', 'Total Size', 'Created Files', 'Deleted Files'].map((label, idx) => {
            const value = [user.totalFiles, user.totalSize, user.created, user.deleted][idx] || 'N/A'
            return (
              <div key={idx} className='p-4 justify-between text-center'>
                <p className='text-xs text-subtitle'>{label}</p>
                <p className='text-3xl font-bold text-gray-600'>{value}</p>
              </div>
            )
          })}
        </div>
        <div className='flex items-center justify-center w-full mt-4'>
          <FileTypeTable fileTypes={user.fileTypes} onRowClick={handleRowClick} />
        </div>
      </CardContent>
    </Card>
  )
}
