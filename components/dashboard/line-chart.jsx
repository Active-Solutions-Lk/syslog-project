import React from 'react'
import {
  CardDescription,
  CardContent,
  CardFooter
} from '@/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart'
import { LineChart, Line, XAxis, CartesianGrid } from 'recharts'
import { TrendingUp } from 'lucide-react'

// Function to generate chartConfig dynamically based on data keys
const generateChartConfig = data => {
  const keys =
    data && data.length > 0
      ? Object.keys(data[0]).filter(key => key !== 'name')
      : []
  const config = {}
  keys.forEach((key, index) => {
    config[key] = {
      label: key.charAt(0).toUpperCase() + key.slice(1), // Capitalize first letter for label
      color: `hsl(var(--chart-${(index % 5) + 1}))` // Cycle through chart-1 to chart-5
    }
  })
  return config
}

const CustomLineChart = ({ chartData }) => {
  const chartConfig = generateChartConfig(chartData)

  // Get data keys excluding 'name' for rendering lines
  const dataKeys =
    chartData && chartData.length > 0
      ? Object.keys(chartData[0]).filter(key => key !== 'name')
      : []

  return (
    <>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 1,
              right: 1
            }}
            height={100}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey='name'
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={value => value.slice(0, 3)}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            {dataKeys.map(key => (
              <Line
                key={key}
                dataKey={key}
                type='monotone'
                stroke={`var(--color-${key})`}
                strokeWidth={2}
                dot={false}
              />
            ))}
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className='flex pb-0 mb-0 justify-center'>
        <CardDescription className='text-sm text-muted-foreground text-center'>
          Activity Last 7 Days
        </CardDescription>
      </CardFooter>
    </>
  )
}

export default CustomLineChart
