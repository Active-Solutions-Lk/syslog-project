'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import useAlertStore from '@/lib/store' // Adjust path if necessary
import { Badge } from '@/components/ui/badge'
import { Label, Pie, PieChart } from 'recharts'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart'
import { OctagonAlert } from 'lucide-react'

const CustomPieChart = ({ chartConfig, chartData }) => {
  const router = useRouter()
  const { setSelectedAlertType, selectedAlertType } = useAlertStore()

  const totalVisitors = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.count, 0)
  }, [chartData])

  const handleSliceClick = (data) => {
    if (data && data.type) {
      setSelectedAlertType(data.type)
      console.log('Pie Chart Filter Applied:', { selectedAlertType: data.type })
      router.push('/dashboard/alerts')
    }
  }

  return (
    <Card className='flex flex-col'>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <CardTitle className='flex items-center text-subtitle gap-2 text-sm font-medium'>
            <div className='flex h-6 w-6 items-center justify-center rounded-md text-critical'>
              <span className='text-xs'>
                <OctagonAlert className='h-4 w-4' />
              </span>
            </div>
            Alerts
          </CardTitle>
          <Badge className='bg-red-100 text-red-600'>25 Active</Badge>
        </div>
      </CardHeader>
      <CardContent className='flex-1 pb-0'>
        <ChartContainer
          config={chartConfig}
          className='mx-auto aspect-square max-h-[400px]'
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey='count'
              nameKey='type'
              innerRadius={90}
              strokeWidth={5}
              onClick={handleSliceClick}
              style={{ cursor: 'pointer' }}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor='middle'
                        dominantBaseline='middle'
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className='fill-foreground text-3xl font-bold'
                        >
                          {totalVisitors.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className='fill-muted-foreground'
                        >
                          Alerts
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className='flex-col gap-2 text-sm'>
        <div className='flex justify-center gap-4 pb-4'>
          {chartData.map((item, idx) => (
            <div key={item.type} className='flex items-center gap-1'>
              <div
                className='h-3 w-3 rounded'
                style={{ backgroundColor: item.bg }}
              ></div>
              <span className='text-xs'>{item.type}</span>
            </div>
          ))}
        </div>
      </CardFooter>
    </Card>
  )
}

export default CustomPieChart