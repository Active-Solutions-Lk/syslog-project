// =========================================
// LogTypePieChart.jsx
// =========================================

import React from 'react'
import CustomPieChart from '@/components/dashboard/pie-chart'

export default function LogTypePieChart() {
  const PieChartConfig = {
    visitors: {
      label: 'Visitors'
    },
    critical: {
      label: 'Chrome',
      color: '#FF4A4A'
    },
    warning: {
      label: 'Safari',
      color: '#FF8F53'
    },
    info: {
      label: 'Firefox',
      color: '#3D43F0'
    },
    highpriority: {
      label: 'Edge',
      color: '#FE6A46'
    },
    other: {
      label: 'Other',
      color: 'hsl(var(--chart-5))'
    }
  }

  const PieChartData = [
    {
      type: 'Critical',
      count: 100,
      fill: 'var(--color-critical)',
      bg: PieChartConfig.critical.color
    },
    {
      type: 'Warnings',
      count: 100,
      fill: 'var(--color-warning)',
      bg: PieChartConfig.warning.color
    },
    {
      type: 'Highpriority',
      count: 55,
      fill: 'var(--color-highpriority)',
      bg: PieChartConfig.highpriority.color
    },
    {
      type: 'Information',
      count: 70,
      fill: 'var(--color-info)',
      bg: PieChartConfig.info.color
    }
  ]

  return (
    <CustomPieChart
      chartConfig={PieChartConfig}
      chartData={PieChartData}
    />
  )
}