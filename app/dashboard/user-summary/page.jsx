'use client' // ✅ must be the first line in client components

import { useState, useEffect, useCallback } from 'react' // ✅ THIS IS MISSING
import UserSearchHeader from './components/user-search-header'
import UserCard from './components/user-card'
import { getProcessedUserSummaries } from './server-side'

export default function UserSummary () {
  const [users, setUsers] = useState([]) // ✅ declared first
  const [filteredUsers, setFilteredUsers] = useState([]) // ✅ use empty array
  const [userSearch, setUserSearch] = useState('')
  const [cardsToShow, setCardsToShow] = useState(25)
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [fetchingError, setFetchingError] = useState(null)

  useEffect(() => {
    const userSummaries = async () => {
      setLoading(true)
      try {
        setLoading(true)
        const fetchUserSummaries = await getProcessedUserSummaries()
        // console.log('fetchUserSummaries', fetchUserSummaries);
        setUsers(fetchUserSummaries)
        setFilteredUsers(fetchUserSummaries)
        setLoading(true)
      } catch (error) {
        console.error('Bad response', error)
        setFetchingError(
          'Unable to fetch Data, Refreash the page and try again'
        )
        setLoading(false)
      } finally {
        setLoading(false)
      }
    }

    userSummaries()
  }, []) // ✅ Run only once

  const debounce = (func, delay) => {
    let timeoutId
    return (...args) => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => func(...args), delay)
    }
  }

  const handleSearchChange = useCallback(
    debounce(value => setUserSearch(value), 300),
    []
  )

  useEffect(() => {
    const filtered = users.filter(user =>
      user.name.toLowerCase().includes(userSearch.toLowerCase())
    )
    setFilteredUsers(filtered)
  }, [userSearch, users]) // ✅ add `users` to dependency

  return (
    <div className='flex'>
      <div className='flex-1 p-4 pt-0'>
        <UserSearchHeader
          userSearch={userSearch}
          setUserSearch={setUserSearch}
          cardsToShow={cardsToShow}
          setCardsToShow={setCardsToShow}
          isOpen={isOpen}
        />
        <div className='grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4'>
          {filteredUsers.slice(0, cardsToShow).map(user => (
            <UserCard
              key={user.id}
              user={user}
              loading={loading}
              fetchingError={fetchingError}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
