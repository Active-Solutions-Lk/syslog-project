import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { FileDown } from 'lucide-react';
import * as XLSX from 'xlsx';

const FileCard = ({ title, data, isLoading }) => {
  // Function to handle the download of table data as an Excel file
  const handleDownload = () => {
    const headers = ['File Name', 'File Size (GB)', 'Date', 'Time', 'Path'];
    const excelData = data.map(file => ({
      'File Name': file.name,
      'File Size (GB)': file.size,
      'Date': file.date,
      'Time': file.time,
      'Path': file.path,
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData, { header: headers });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const sanitizedTitle = title.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_');
    link.setAttribute('download', `${sanitizedTitle}.xlsx`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <Card className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100">
        <CardHeader className="p-3 px-4 bg-gradient-to-r from-blue-600 to-blue-800 flex flex-row justify-between items-center">
          <Skeleton className="h-6 w-1/2 bg-blue-400/30" />
          <Skeleton className="h-6 w-12 bg-blue-400/30 rounded-full" />
        </CardHeader>
        <CardContent className="p-0">
          <div className="max-h-[240px] overflow-y-auto">
            <Table className="w-full">
              <TableHeader className="bg-gray-50/80 text-lg sticky top-0 z-10">
                <TableRow className="text-md">
                  <TableHead className="p-2 px-4">
                    <Skeleton className="h-5 w-24 bg-gray-200" />
                  </TableHead>
                  <TableHead className="text-start p-2 px-4">
                    <Skeleton className="h-5 w-20 bg-gray-200" />
                  </TableHead>
                  <TableHead className="text-start p-2 px-4">
                    <Skeleton className="h-5 w-16 bg-gray-200" />
                  </TableHead>
                  <TableHead className="text-start p-2 px-4">
                    <Skeleton className="h-5 w-16 bg-gray-200" />
                  </TableHead>
                  <TableHead className="text-start p-2 px-4">
                    <Skeleton className="h-5 w-32 bg-gray-200" />
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...Array(3)].map((_, index) => (
                  <TableRow key={index} className="p-0 px-4">
                    <TableCell className="px-4 py-2">
                      <Skeleton className="h-5 w-36 bg-gray-100" />
                    </TableCell>
                    <TableCell className="text-start px-4 py-2">
                      <Skeleton className="h-5 w-20 bg-gray-100" />
                    </TableCell>
                    <TableCell className="text-start px-4 py-2">
                      <Skeleton className="h-5 w-24 bg-gray-100" />
                    </TableCell>
                    <TableCell className="text-start px-4 py-2">
                      <Skeleton className="h-5 w-16 bg-gray-100" />
                    </TableCell>
                    <TableCell className="text-start px-4 py-2">
                      <Skeleton className="h-5 w-48 bg-gray-100" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100">
      <CardHeader className="p-3 px-4 bg-gradient-to-r from-blue-600 to-blue-800 flex flex-row justify-between items-center">
        <CardTitle className="text-lg text-white font-semibold tracking-tight">
          {title}
        </CardTitle>
        <CardDescription className="flex items-center gap-2">
          <div className="text-sm text-white bg-blue-700/50 rounded-full py-1 px-3 font-medium">
            {data.length}
          </div>
          <button
            onClick={handleDownload}
            disabled={data.length === 0}
            className={`p-1 rounded-full transition-colors duration-200 ${
              data.length === 0
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-blue-700 active:bg-blue-800'
            }`}
            title="Download as Excel"
            aria-label="Download table data as Excel"
          >
            <FileDown className="h-5 w-5 text-white" />
          </button>
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="max-h-[240px] overflow-y-auto">
          <Table className="w-full">
            <TableHeader className="bg-gray-50/80 text-lg sticky top-0 z-10">
              <TableRow className="text-md hover:bg-gray-50">
                <TableHead className="p-2 px-4 font-semibold text-gray-700">File Name</TableHead>
                <TableHead className="text-start p-2 px-4 font-semibold text-gray-700">File Size (GB)</TableHead>
                <TableHead className="text-start p-2 px-4 font-semibold text-gray-700">Date</TableHead>
                <TableHead className="text-start p-2 px-4 font-semibold text-gray-700">Time</TableHead>
                <TableHead className="text-start p-2 px-4 font-semibold text-gray-700">Path</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.length > 0 ? (
                data.map((file, index) => (
                  <TableRow
                    key={index}
                    className="p-0 px-4 hover:bg-gray-50 transition-colors duration-150"
                  >
                    <TableCell className="font-medium px-4 py-2 text-gray-600">
                      {file.name}
                    </TableCell>
                    <TableCell className="text-start font-medium px-4 py-2 text-gray-600">
                      {file.size}
                    </TableCell>
                    <TableCell className="text-start font-medium px-4 py-2 text-gray-600">
                      {file.date}
                    </TableCell>
                    <TableCell className="text-start font-medium px-4 py-2 text-gray-600">
                      {file.time}
                    </TableCell>
                    <TableCell className="text-start font-medium px-4 py-2 text-gray-600">
                      {file.path}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-gray-500 py-4">
                    No {title.toLowerCase().replace(' n/a', '')} data available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default FileCard;