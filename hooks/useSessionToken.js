'use client';

import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

export function useSessionToken() {
  const [token, setToken] = useState(null);

  useEffect(() => {
    // Check localStorage first
    let sessionToken = localStorage.getItem('sessionToken');
    
    // If not found, check sessionStorage
    if (!sessionToken) {
      sessionToken = sessionStorage.getItem('sessionToken');
    }
    
    // If still not found, check cookies
    if (!sessionToken) {
      sessionToken = Cookies.get('sessionToken') || null;
    }

    setToken(sessionToken);
    //console.log('Retrieved token from storage:', sessionToken);
  }, []);

  return token;
}