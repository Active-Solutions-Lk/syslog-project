//DeviceCard
import React from 'react'
import { Server } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'
import CustomLineChart from '@/components/dashboard/line-chart'

export default function DevicesCard({ data, linechartData, deviceSummary }) {  
  const devices = data || [];
  const deviceData = linechartData || [];
  const summary = deviceSummary || null;
  
  // Calculate online/offline counts from the actual device data
  const onlineDevices = devices.filter(device => device.active).length;
  const totalDevices = devices.length;
  
  // Use summary data if available, otherwise calculate from devices array
  const activeCount = summary?.active ?? onlineDevices;
  const totalCount = summary?.total ?? totalDevices;

//  // console.log('DeviceCard data:', {
//     devices,
//     linechartData,
//     summary,
//     calculatedOnline: onlineDevices,
//     calculatedTotal: totalDevices
//   });

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2 text-sm text-subtitle font-medium'>
          <div className='flex h-6 w-6 items-center justify-center rounded-md bg-transparent'>
            <Server className='h-4 w-4 text-green-700' />
          </div>
          Devices
        </CardTitle>
      </CardHeader>
      <CardContent>
        <TooltipProvider>
          <div className='flex flex-wrap gap-2'>
            {devices.map(device => (
              <Tooltip key={device.id}>
                <TooltipTrigger asChild>
                  <Button
                    className={`flex h-10 w-10 items-center justify-center rounded-full ${
                      device.active ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-300 hover:bg-gray-400'
                    } text-white transition-colors`}
                  >
                    {device.id}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="font-medium">{device.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {device.active ? 'Online' : 'Offline'}
                  </p>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </TooltipProvider>
        
        {/* Dynamic online/offline count with tooltip */}
        <TooltipProvider>
          <Tooltip>
             <TooltipTrigger asChild>
              <div className='mt-4 text-center w-full justify-center items-center text-sm text-muted-foreground cursor-help inline-block'>
                <span className="font-medium text-green-600">{activeCount}</span> of{' '}
                <span className="font-medium">{totalCount}</span> online 
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <span>
                At least single log received during last 1 hr used as online.
              </span>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        {/* Optional: Show breakdown */}
        {summary && (
          <div className='mt-2 flex justify-center gap-4 text-xs text-muted-foreground'>
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Active: {summary.active}
            </span>
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
              Inactive: {summary.inactive}
            </span>
          </div>
        )}
        
        <div className='mt-4'>
          <CustomLineChart chartData={deviceData} />
        </div>
      </CardContent>
    </Card>
  )
}