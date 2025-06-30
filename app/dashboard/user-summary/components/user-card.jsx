'use client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import FileTypeTable from './file-type-table'
import { useRouter } from 'next/navigation'

export default function UserCard({ user, fetchingError, loading }) {
  const router = useRouter()

  const handleRowClick = (fileType) => {
    router.push(`/dashboard/user-summary/${user.id}?fileType=${encodeURIComponent(fileType)}`)
  }

  // console.log('loading', loading)
  // Loading state with skeleton
  if (loading) {
    return (
      <Card className='bg-white shadow-md rounded-lg'>
        <CardHeader className='p-3 px-4 bg-specialBlue flex flex-row justify-between rounded-t-lg'>
          <Skeleton className='h-6 w-32 bg-white/20' />
          <Skeleton className='h-6 w-16 bg-white/20 rounded-xl' />
        </CardHeader>
        <CardContent className='flex flex-col p-0 items-center w-full'>
          <div className='flex items-center justify-between px-8 w-full'>
            {Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className='p-4 justify-between text-center'>
                <Skeleton className='h-3 w-16 mb-2' />
                <Skeleton className='h-8 w-12' />
              </div>
            ))}
          </div>
          <div className='flex items-center justify-center w-full mt-4 p-4'>
            <div className='w-full space-y-2'>
              <Skeleton className='h-8 w-full' />
              {Array.from({ length: 3 }).map((_, idx) => (
                <Skeleton key={idx} className='h-6 w-full' />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Error state
  if (fetchingError) {
    return (
      <Card className='bg-white shadow-md rounded-lg'>
        <CardHeader className='p-3 px-4 bg-specialBlue flex flex-row justify-between rounded-t-lg'>
          <CardTitle className='text-lg text-white font-semibold'>User Data</CardTitle>
          <CardDescription className='text-sm text-white bg-red-600 rounded-xl px-3'>
            Error
          </CardDescription>
        </CardHeader>
        <CardContent className='flex flex-col items-center justify-center p-8 min-h-[200px]'>
          <Alert variant="destructive" className='max-w-md'>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className='text-center'>
              {fetchingError.message || 'Failed to load user data. Please try again.'}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  // Normal state with data
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