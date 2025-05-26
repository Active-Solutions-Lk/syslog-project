import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Filter } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { useState } from 'react'
import useAlertStore from '@/lib/store'

export function PopOver({ Devices, AlertTypes, Periods }) {
  const { selectedAlertType: storeAlertType, selectedDevice: storeDevice, selectedPeriod: storePeriod, setSelectedAlertType: setStoreAlertType, setSelectedDevice: setStoreDevice, setSelectedPeriod: setStorePeriod } = useAlertStore()

  // Initialize local state with store values, defaulting to 'all' if null
  const [selectedAlertType, setSelectedAlertType] = useState(storeAlertType || 'all')
  const [selectedDevice, setSelectedDevice] = useState(storeDevice || 'all')
  const [selectedPeriod, setSelectedPeriod] = useState(storePeriod || 'all')

  const handleApplyFilter = () => {
    setStoreAlertType(selectedAlertType === 'all' ? null : selectedAlertType)
    setStoreDevice(selectedDevice === 'all' ? null : selectedDevice)
    setStorePeriod(selectedPeriod === 'all' ? null : selectedPeriod)
    console.log('Applied Filters:', { selectedAlertType, selectedDevice, selectedPeriod })
  }

  // Get the label for the preselected alert type
  const getAlertTypeLabel = (type) => {
    if (type === 'all') return 'All'
    return AlertTypes[type]?.label || 'Select a type'
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          size='sm'
          className='border-blue-700 w-full sm:w-auto'
        >
          <Filter className='h-4 w-4 mr-2' />
          Filter
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-80'>
        <div className='grid gap-4'>
          <div className='space-y-2'>
            <h4 className='font-medium leading-none'>Filter</h4>
            <p className='text-sm text-muted-foreground'>
              Select the filters..
            </p>
          </div>
          <div className='grid gap-2'>
            <div className='grid grid-cols-3 items-center gap-4'>
              <Label className='text-title' htmlFor='alertType'>Alert Type</Label>
              <Select id='alertType' value={selectedAlertType} onValueChange={setSelectedAlertType} className='col-span-2 h-8'>
                <SelectTrigger className='w-[180px]'>
                  <SelectValue
                    className='text-title'
                    placeholder='Select a type'
                    // Display the label instead of the raw value
                    children={getAlertTypeLabel(selectedAlertType)}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Alert Types</SelectLabel>
                    <SelectItem value='all'>All</SelectItem>
                    {Object.entries(AlertTypes).map(([key, { label }]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className='grid grid-cols-3 items-center gap-4'>
              <Label className='text-title' htmlFor='device'>Device</Label>
              <Select id='device' value={selectedDevice} onValueChange={setSelectedDevice} className='col-span-2 h-8'>
                <SelectTrigger className='w-[180px]'>
                  <SelectValue
                    className='text-title'
                    placeholder='Select a device'
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Devices</SelectLabel>
                    <SelectItem value='all'>All</SelectItem>
                    {Devices.map((device) => (
                      <SelectItem key={device} value={device}>
                        {device}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className='grid grid-cols-3 items-center gap-4'>
              <Label className='text-title' htmlFor='period'>Period</Label>
              <Select id='period' value={selectedPeriod} onValueChange={setSelectedPeriod} className='col-span-2 h-8'>
                <SelectTrigger className='w-[180px]'>
                  <SelectValue
                    className='text-title'
                    placeholder='Select a Period'
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Periods</SelectLabel>
                    <SelectItem value='all'>All</SelectItem>
                    {Object.entries(Periods).map(([key, { value }]) => (
                      <SelectItem key={key} value={key}>
                        {value}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className='grid grid-cols-3 items-center gap-4'>
              <Button
                variant='outline'
                size='sm'
                className='col-span-2 h-8 bg-blue-700 text-white hover:bg-blue-800'
                onClick={handleApplyFilter}
              >
                Apply Filter
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}