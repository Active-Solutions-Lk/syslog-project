'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useSessionToken } from '@/hooks/useSessionToken';

// Create the Session Context
const SessionContext = createContext(null);

// Session Provider Component
export function SessionProvider({ children }) {
  const sessionToken = useSessionToken();
  const [adminDetails, setAdminDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (sessionToken) {
      const fetchSessionDetails = async () => {
        try {
          const response = await fetch('/api/auth/session', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ sessionToken }),
          });

          if (!response.ok) {
            throw new Error('Failed to fetch session details');
          }

          const data = await response.json();
          //console.log('Session and Admin Details:', data.admin);
          setAdminDetails(data.admin);
        } catch (error) {
          console.error('Error fetching session details:', error.message);
          setAdminDetails(null);
        } finally {
          setIsLoading(false);
        }
      };

      fetchSessionDetails();
    } else {
      //console.log('No session token available');
      setAdminDetails(null);
      setIsLoading(false);
    }
  }, [sessionToken]);

  // Value provided to the context
  const value = {
    sessionToken,
    adminDetails,
    isLoading,
  };

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

// Custom hook to use the Session Context
export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
}