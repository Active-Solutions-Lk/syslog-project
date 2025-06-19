import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from 'recharts'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart'


const CustomBarChart = ({ chartData, chartConfig }) => {
  
  return (
    <>
      <ChartContainer
        className='min-h-[200px] max-h-40 w-full'
        config={chartConfig}
      >
        <BarChart
          accessibilityLayer
          data={chartData}
          margin={{
            top: 20
          }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey='month'
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={value => value.slice(0, 3)}
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
          <Bar dataKey='count' fill='var(--color-desktop)' radius={8}>
            <LabelList
              position='top'
              offset={12}
              className='fill-foreground'
              fontSize={12}
            />
          </Bar>
        </BarChart>
      </ChartContainer>
    </>
  )
}

export default CustomBarChart
