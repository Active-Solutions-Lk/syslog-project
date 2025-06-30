'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import FolderFilter from './components/folder-filter'
import HandsontableComponent from './components/folder-table'
import { AddFolderModal } from './components/add-folder-modal'
import { fetchSecureFolders, FetchAllLogs } from './server-side'

export default function FolderReportsPage () {
  const [folders, setFolders] = useState([])
  const [selectedFolder, setSelectedFolder] = useState('all')
  const [filteredTableData, setFilteredTableData] = useState([])
  const [fetchFolderLoading, setFetchFolderLoading] = useState(false)
  const [fetchFolderError, setFetchFolderError] = useState(null)
  // const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getFolders = async () => {
      setFetchFolderLoading(true)
      try {
        const foldersData = await fetchSecureFolders()
        setFolders(foldersData)
        // console.log('foldersData', foldersData)
      } catch (error) {
        setFetchFolderError(error.message)
      } finally {
        setFetchFolderLoading(false)
      }
    }
    getFolders()
  }, [])

  const [fetchLogsLoading, setFetchLogsLoading] = useState(false)
  const [fetchLogsError, setFetchLogEror] = useState(null)
  const [fetchedLogs, setFetchedLogs] = useState([])

  useEffect(() => {
    setFetchLogsLoading(true)
    const getLogs = async () => {
      try {
        const allLogs = await FetchAllLogs()
        // console.log('allLogs', allLogs)
        setFetchedLogs(allLogs)
      } catch (error) {
        setFetchLogEror(error.message)
      } finally {
        setFetchLogsLoading(false)
      }
    }
    getLogs()
  }, [])

  useEffect(() => {
    if (selectedFolder === 'all') {
      setFilteredTableData(fetchedLogs)
    } else {
      setFilteredTableData(
        fetchedLogs.filter(row =>
          String(row[4])
            .toLowerCase()
            .includes(String(selectedFolder).toLowerCase())
        )
      )
      // console.log('selected Folder', selectedFolder)
    }
  }, [selectedFolder, fetchedLogs]) // 👈 Add `fetchedLogs` here

  return (
    <div className='flex'>
      <div className='flex-1 p-4 pt-0'>
        <div className='flex justify-end items-center mb-4 gap-4 bg-specialbg bg-opacity-25 rounded-t-lg px-2'>
          <div className='flex w-full items-end gap-8'>
            <div className='flex w-full items-center gap-2'>
              <FolderFilter
                folders={folders}
                selectedFolder={selectedFolder}
                fetchFolderLoading={fetchFolderLoading}
                fetchFolderError={fetchFolderError}
                setSelectedFolder={setSelectedFolder}
              />
            </div>
          </div>
          <AddFolderModal />
        </div>
        <HandsontableComponent
          data={filteredTableData}
          fetchLogsLoading={fetchLogsLoading}
          fetchLogsError={fetchLogsError}
        />
      </div>
    </div>
  )
}
