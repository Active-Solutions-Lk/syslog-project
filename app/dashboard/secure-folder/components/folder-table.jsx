'use client';

import { useRef, useEffect, Suspense, lazy } from 'react';
import { registerAllModules } from 'handsontable/registry';
import 'handsontable/dist/handsontable.full.min.css';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

// Register all Handsontable modules
registerAllModules();

// Lazy-load HotTable
const HotTable = lazy(() => import('@handsontable/react'));

const HandsontableComponent = ({ data, fetchLogsLoading, fetchLogsError }) => {
  const hotRef = useRef(null);
  const headers = ['Host Name', 'User', 'Date', 'Event', 'Path', 'Size', 'IP', 'Message'];

  useEffect(() => {
    if (hotRef.current) {
      const hot = hotRef.current.hotInstance;
      const customBordersPlugin = hot.getPlugin('customBorders');
      customBordersPlugin.clearBorders(); // Clear all custom borders
    }
  }, []);

  // Custom renderer to add title attribute for hover tooltip
  const customRenderer = (instance, td, row, col, prop, value, cellProperties) => {
    td.innerText = value; // Set the cell content
    td.title = value; // Set the title attribute for hover tooltip
    return td;
  };

  // Remove the folder ID column from display
  const displayData = data ? data.map(row => row.slice(0, -1)) : [];

  // Get the current screen height and set table height accordingly
  const tableHeight = typeof window !== 'undefined' ? window.innerHeight - 200 : 600; // 200px offset for header/footer

  // Display error if fetchLogsError exists
  if (fetchLogsError) {
    return (
      <Alert variant="destructive" className="m-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{fetchLogsError.message || 'Failed to load data. Please try again.'}</AlertDescription>
      </Alert>
    );
  }

  // Display loading skeleton if fetchLogsLoading is true
  if (fetchLogsLoading) {
    return (
      <div className="flex flex-col space-y-3 p-4">
        <Skeleton className="h-12 w-full rounded-md" />
        <Skeleton className="h-12 w-full rounded-md" />
        <Skeleton className="h-12 w-full rounded-md" />
        <Skeleton className="h-[400px] w-full rounded-md" />
      </div>
    );
  }

  return (
    <>
      <Suspense
        fallback={
          <div className="flex flex-col space-y-3 p-4">
            <Skeleton className="h-12 w-full rounded-md" />
            <Skeleton className="h-12 w-full rounded-md" />
            <Skeleton className="h-[400px] w-full rounded-md" />
          </div>
        }
      >
        <HotTable
          ref={hotRef}
          data={displayData}
          colHeaders={headers}
          filters={true}
          dropdownMenu={{
            items: {
              filter_by_condition: {
                name: 'Filter by condition',
              },
              filter_operators: {
                name: 'Filter operators',
                hidden: true,
              },
              filter_by_value: {
                name: 'Filter by value',
              },
              filter_action_bar: {
                name: 'Filter action bar',
              },
            },
          }}
          rowHeaders={false}
          width="100%"
          height={tableHeight}
          stretchH="all"
          licenseKey="non-commercial-and-evaluation"
          customBorders={true}
          cells={(row, col) => ({
            renderer: customRenderer, // Apply the custom renderer to all cells
          })}
        />
      </Suspense>
      <style jsx global>{`
        .handsontable .htCore td,
        .handsontable .htCore th {
          border: none !important;
          background-color: transparent !important;
          z-index: 1 !important; /* Ensure cells are above the grid background */
        }
        .handsontable .htCore th {
          font-weight: bold;
          text-align: start;
        }
        .handsontable .htCore td {
          white-space: nowrap; /* Prevent text wrapping */
          overflow: hidden; /* Hide overflowed text */
          text-overflow: ellipsis; /* Show ellipsis for overflowed text */
          max-width: 150px; /* Set a maximum width for columns */
        }
        .handsontable th .ht__menu--icon::before {
          content: '⬇';
          font-size: 12px;
          color: #333;
          margin-left: 4px;
          vertical-align: middle;
        }
        .handsontable .htFiltersMenu {
          min-width: 200px;
        }
        .handsontable .htFiltersMenu .htFiltersMenuLabel {
          padding: 8px;
          font-weight: bold;
        }
        .handsontable .htFiltersMenu .htFiltersMenuCondition .wtHider {
          padding: 4px;
        }
        .handsontable .htFiltersMenu .wtHolder input {
          width: 100%;
          padding: 4px;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
      `}</style>
    </>
  );
};

export default HandsontableComponent;