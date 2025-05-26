import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion'
import {
  BadgeAlert,
  CalendarDays,
  Clock5,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

export function DetailCard({ data }) {
  return (
    <Accordion type='single' collapsible className='w-full'>
      {data.map((alert) => (
        <AccordionItem
          key={alert.id}
          value={`item-${alert.id}`}
          className={`border-l-8 ${alert.type === 'Critical' ? 'border-critical' : alert.type === 'Warnings' ? 'border-warning' : alert.type === 'Information' ? 'border-info' : 'border-highpriority'} mb-2`}
        >
          <AccordionTrigger>
            <div className='flex w-full items-center justify-between gap-3 sm:gap-5'>
              <div
                className={`rounded-full p-2 sm:p-3 ${alert.type === 'Critical' ? 'bg-critical' : alert.type === 'Warnings' ? 'bg-warning' : alert.type === 'Information' ? 'bg-info' : 'bg-highpriority'} bg-opacity-35 flex-shrink-0`}
              >
                <BadgeAlert
                  className={`h-4 w-4 sm:h-5 sm:w-5 ${alert.type === 'Critical' ? 'text-critical' : alert.type === 'Warnings' ? 'text-warning' : alert.type === 'Information' ? 'text-info' : 'text-highpriority'}`}
                />
              </div>
              <div className='ml-2 sm:ml-3 flex-1 flex flex-col items-start justify-center gap-2 sm:gap-3'>
                <div className='flex items-center gap-2'>
                  <h3 className='text-sm sm:text-base text-title'>{alert.message}</h3>
                </div>
                <div className='flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm'>
                  <div className='flex flex-wrap items-center gap-2 sm:gap-4'>
                    <div className='flex items-center gap-1'>
                      <h3 className='text-title font-medium'>User:</h3>
                      <span className='text-muted-foreground'>{alert.user}</span>
                    </div>
                    <div className='flex items-center gap-1'>
                      <h3 className='text-title font-medium'>Device:</h3>
                      <span className='text-muted-foreground'>{alert.device}</span>
                    </div>
                    <div className='flex items-center gap-1'>
                      <CalendarDays className='h-3 w-3 sm:h-4 sm:w-4' />
                      <span className='text-muted-foreground'>{alert.date}</span>
                    </div>
                    <div className='flex items-center gap-1'>
                      <Clock5 className='h-3 w-3 sm:h-4 sm:w-4' />
                      <span className='text-muted-foreground'>{alert.time}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className='ml-auto mr-2 sm:mr-4 flex-shrink-0'>
               <span
                  className={`inline-block rounded-xl px-4 py-1 text-title text-xs font-semibold ${alert.status === 'Active' ? 'bg-specialGreen bg-opacity-75 text-title' : 'bg-red-500 bg-opacity-75 text-white'}`}
                >
                  {alert.status}
                </span>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className='bg-specialbg bg-opacity-25'>
            <div className='flex flex-col items-start gap-2 sm:gap-3 p-3 sm:p-4'>
              <div className='flex flex-col sm:flex-row items-start justify-between w-full gap-2 sm:gap-3'>
                <div className='flex flex-col items-start justify-start gap-1'>
                  <h5 className='text-subtitle font-bold text-xs sm:text-sm'>Log Type</h5>
                  <h3 className='text-title text-sm sm:text-base'>{alert.type}</h3>
                </div>
                <div className='flex flex-col items-start justify-start gap-1'>
                  <h5 className='text-subtitle font-bold text-xs sm:text-sm'>Device</h5>
                  <h3 className='text-title text-sm sm:text-base'>{alert.device}</h3>
                </div>
                <div className='flex flex-col items-start justify-start gap-1'>
                  <h5 className='text-subtitle font-bold text-xs sm:text-sm'>Created_at</h5>
                  <h3 className='text-title text-sm sm:text-base'>{`${alert.date}, ${new Date().getFullYear()} ${alert.time}`}</h3>
                </div>
              </div>
              <div className='flex flex-col items-start justify-start gap-1 w-full'>
                <h5 className='text-subtitle font-bold text-xs sm:text-sm'>Details</h5>
                <h3 className='text-title text-sm sm:text-base'>
                  {alert.message.includes('Invalid file extension') ? 'User attempted to upload file with unrecognized format.' :
                   alert.message.includes('Potential ransomware') ? 'Suspicious activity detected, potentially indicating ransomware.' :
                   alert.message.includes('Unusual Login Time') ? 'User logged in at an unusual time, potentially indicating unauthorized access.' :
                   'Excessive permission changes detected, indicating potential security risk.'}
                </h3>
              </div>
              <div className='flex items-center gap-2'>
                <Button
                  variant='secondary'
                  size='xs'
                  className={`rounded-md px-4 sm:px-6 text-xs sm:text-sm bg-white text-title border ${alert.type === 'Critical' ? 'border-critical' : alert.type === 'Warnings' ? 'border-warning' : alert.type === 'Information' ? 'border-info' : 'border-highpriority'} border-opacity-75 hover:bg-opacity-40 ${alert.type === 'Critical' ? 'hover:bg-critical' : alert.type === 'Warnings' ? 'hover:bg-warning' : alert.type === 'Information' ? 'hover:bg-info' : 'hover:bg-highpriority'}`}
                >
                  Dismiss
                </Button>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}