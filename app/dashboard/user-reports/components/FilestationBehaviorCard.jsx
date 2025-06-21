import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export default function FilestationBehaviorCard({ filestationBehavior, loading, error }) {
  return (
    <Card className='bg-yellow-100 bg-opacity-65 shadow-none border-none h-full'>
      <CardHeader className='flex justify-center items-center'>
        <CardTitle className='text-lg font-extrabold'>
        Filestation Behaviour
        </CardTitle>
      </CardHeader>

      <CardContent className='flex justify-center items-center'>
        {error ? (
          <p className='text-center text-red-500'>{error}</p>
        ) : (
          <table className='w-96 text-sm justify-center'>
            <thead>
              <tr>
                <th className='text-start p-2 ps-4'>Action</th>
                <th className='text-center p-2'>Count</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <tr key={idx}>
                    <td className='p-2 ps-4'>
                      <Skeleton className='h-4 w-2/3 rounded-md' />
                    </td>
                    <td className='p-2 text-center'>
                      <Skeleton className='h-4 w-12 rounded-md mx-auto' />
                    </td>
                  </tr>
                ))
              ) : filestationBehavior.length === 0 ? (
                <tr>
                  <td colSpan={2} className='p-1 text-center text-gray-500'>
                    No filestation actions found
                  </td>
                </tr>
              ) : (
                filestationBehavior.map((item, index) => (
                  <tr
                    key={index}
                    className={index % 2 === 0 ? 'hover:bg-white' : 'hover:bg-yellow-100'}
                  >
                    <td className='p-1 text-start'>{item.action}</td>
                    <td className='p-1 text-center'>{item.count}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </CardContent>
    </Card>
  )
}
