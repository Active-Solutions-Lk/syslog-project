import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { FileDown } from 'lucide-react'
import * as XLSX from 'xlsx'

const FileCard = ({ title, data, isLoading }) => {
  // Function to handle the download of table data as an Excel file
  const handleDownload = () => {
    // Define the headers for the Excel sheet
    const headers = ['File Name', 'File Size (MB)', 'Date', 'Time', 'Path']

    // Map the data to an array of objects matching the headers
    const excelData = data.map(file => ({
      'File Name': file.name,
      'File Size (MB)': file.size,
      'Date': file.date,
      'Time': file.time,
      'Path': file.path,
    }))

    // Create a worksheet from the data
    const worksheet = XLSX.utils.json_to_sheet(excelData, { header: headers })

    // Create a new workbook and append the worksheet
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')

    // Generate the Excel file as a binary string
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })

    // Create a Blob from the buffer
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })

    // Create a downloadable link
    const url = window.URL.createObjectURL(blob)

    // Create a temporary anchor element to trigger the download
    const link = document.createElement('a')
    link.href = url

    // Generate a sanitized file name based on the title (e.g., "Video Uploads" -> "Video_Uploads.xlsx")
    const sanitizedTitle = title.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_')
    link.setAttribute('download', `${sanitizedTitle}.xlsx`)

    // Append the link to the DOM, click it, and remove it
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    // Release the object URL
    window.URL.revokeObjectURL(url)
  }

  if (isLoading) {
    return (
      <Card className="bg-white shadow-md rounded-lg">
        <CardHeader className="p-2 px-4 bg-specialBlue flex flex-row justify-between rounded-t-lg">
          <CardTitle className="text-lg text-white font-semibold">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 w-full">
          <div className="w-full h-[240px] flex items-center justify-center">
            <span className="text-subtitle">Loading...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-white shadow-md rounded-lg">
      <CardHeader className="p-2 px-4 bg-specialBlue flex flex-row justify-between rounded-t-lg">
        <CardTitle className="text-lg text-white font-semibold">
          {title}
        </CardTitle>
        <CardDescription className="flex items-center gap-2">
          <div className="text-sm text-white bg-subtitle rounded-xl py-1 px-4">
            {data.length}
          </div>
          <button
            onClick={handleDownload}
            disabled={data.length === 0}
            className={`p-1 rounded ${data.length === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'}`}
            title="Download as Excel"
          >
            <FileDown className="h-6 w-6 text-white" />
          </button>
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0 w-full">
        <div className="w-full">
          <div className="max-h-[240px] overflow-y-auto w-full">
            <Table className="w-full">
              <TableHeader className="bg-specialbg bg-opacity-35 text-lg">
                <TableRow className="text-md">
                  <TableHead className="text-title p-2 px-4 sticky top-0 bg-specialbg bg-opacity-35 z-10">File Name</TableHead>
                  <TableHead className="text-title text-start sticky top-0 bg-specialbg bg-opacity-35 z-10">File Size (MB)</TableHead>
                  <TableHead className="text-title text-start sticky top-0 bg-specialbg bg-opacity-35 z-10">Date</TableHead>
                  <TableHead className="text-title text-start sticky top-0 bg-specialbg bg-opacity-35 z-10">Time</TableHead>
                  <TableHead className="text-title text-start sticky top-0 bg-specialbg bg-opacity-35 z-10">Path</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.length > 0 ? (
                  data.map((file, index) => (
                    <TableRow key={index} className="p-0 m-0">
                      <TableCell className="font-medium text-md text-subtitle">
                        {file.name}
                      </TableCell>
                      <TableCell className="text-start font-medium text-md text-subtitle">
                        {file.size}
                      </TableCell>
                      <TableCell className="text-start font-medium text-md text-subtitle">
                        {file.date}
                      </TableCell>
                      <TableCell className="text-start font-medium text-md text-subtitle">
                        {file.time}
                      </TableCell>
                      <TableCell className="text-start font-medium text-md text-subtitle">
                        {file.path}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-subtitle">
                      No {title.toLowerCase().replace(' n/a', '')} data available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default FileCard