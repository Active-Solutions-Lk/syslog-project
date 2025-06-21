import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export default function LoginAttemptsCard({ loginAttempts, loading, error }) {
  return (
    <Card className='bg-yellow-100 bg-opacity-65 shadow-none border-none h-full'>
      <CardHeader className='flex justify-center items-center'>
        <CardTitle className='text-lg font-extrabold'>
          {loading ? (
            <Skeleton className='h-6 w-24 rounded-full bg-gray-100 bg-opacity-85 ' />
          ) : (
            `${loginAttempts.length} Login Attempts`
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className='justify-center w-full items-center'>
        {error ? (
          <p className='text-center text-red-500'>{error}</p>
        ) : loading ? (
          // Show a few skeleton rows as placeholders
          <div className='space-y-2'>
            {[...Array(5)].map((_, idx) => (
              <div key={idx} className='flex space-x-2'>
                <Skeleton className='h-4 w-1/2 rounded-md' />
                <Skeleton className='h-4 w-1/2 rounded-md' />
              </div>
            ))}
          </div>
        ) : (
          <>
            <table className='w-full text-sm'>
              <thead className='justify-center items-center'>
                <tr>
                  <th className='text-center'>Con Type</th>
                  <th className='text-center'>IP Address</th>
                </tr>
              </thead>
            </table>
            <div className='overflow-y-auto' style={{ maxHeight: '240px' }}>
              <table className='w-full text-sm'>
                <tbody>
                  {loginAttempts.length === 0 ? (
                    <tr>
                      <td colSpan={2} className='p-1 text-center text-gray-500'>
                        No login attempts found
                      </td>
                    </tr>
                  ) : (
                    loginAttempts.map((item, index) => (
                      <tr
                        key={index}
                        className={index % 2 === 0 ? 'hover:bg-white' : 'hover:bg-yellow-100'}
                      >
                        <td className='p-1 text-center'>{item.conType}</td>
                        <td className='p-1 text-center'>{item.ipAddress}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
