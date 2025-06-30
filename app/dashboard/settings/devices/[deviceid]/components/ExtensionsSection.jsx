'use client'

import {useState, useEffect} from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { FileType } from 'lucide-react'
import ExtensionPopover from './pop-over'
import ExtensionTable from './extension-table'
import {fetchFileTypes} from '../server-side'

export default function ExtensionsSection ({
  isLoading,
  extensionsData,
  handleSaveExtension,
  deviceId
}) {
 
  const [success, setSuccess] = useState(false);

  // console.log('success', success);

  const [fetchedData, setFetchedData] = useState([]);

  // console.log('deviceId', deviceId );


useEffect(() => {
  const fetchTableData = async () => {
    try {
      const response = await fetchFileTypes();
      const merged = mergeExtensions(response, extensionsData);
      setFetchedData(merged);
    } catch (error) {
      console.error('Unable to fetch data:', error);
    }
  };

  fetchTableData();

  if (success) {
    setSuccess(false); // Reset success after fetching
  }
}, [extensionsData, success]); // Add success as dependency




const mergeExtensions = (response, extensionsData) => {
  const safeExtensionsData = Array.isArray(extensionsData) ? extensionsData : [];
  return response.map(item => {
    const match = safeExtensionsData.find(ext => ext.name === item.extension)
    // console.log('match', match)
    return {
      ...item,
      enabled: match ? match.enabled : false,
      maxSize: match ? match.maxSize : '00MB',
      category: match ? match.category : null
    }
  })
}


  return (
    <Card className='w-full md:w-3/5 shadow-md mb-4'>
      <CardHeader>
        <div className='flex justify-between items-center'>
          <div className='flex items-center gap-2'>
            <FileType className='h-4 w-4 text-specialBlue' />
            <CardTitle className='text-xs sm:text-sm text-subtitle'>
              Extensions
            </CardTitle>
          </div>
          <ExtensionPopover
            extension={null}
            setSuccess={setSuccess}
            trigger={
              <Button
                variant='outline'
                size='xs'
                className='border-specialBlue px-3 text-xs sm:text-sm text-subtitle'
              >
                + Extension
              </Button>
            }
          />
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className='space-y-2'>
            <Skeleton className='h-8 w-full' />
            <Skeleton className='h-8 w-full' />
            <Skeleton className='h-8 w-full' />
          </div>
        ) : (
          <ExtensionTable
            device={fetchedData}
            onSaveExtension={handleSaveExtension}
            deviceId={deviceId}
            setSuccess={setSuccess}
          />
        )}
      </CardContent>
    </Card>
  )
}
