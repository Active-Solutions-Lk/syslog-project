import { HotTable } from '@handsontable/react';
import { registerAllModules } from 'handsontable/registry';
import 'handsontable/dist/handsontable.full.min.css';
import { useRef, useEffect } from 'react';

// Register all Handsontable modules
registerAllModules();

const HandsontableComponent = ({ data }) => {
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

  return (
    <>
      <HotTable
        ref={hotRef}
        data={data}
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
        height="auto"
        stretchH="all"
        licenseKey="non-commercial-and-evaluation"
        customBorders={true}
        cells={(row, col) => ({
          renderer: customRenderer, // Apply the custom renderer to all cells
        })}
      />
      <style jsx global>{`
        .handsontable .htCore td,
        .handsontable .htCore th {
          border: none !important;
          background-color: transparent !important;
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