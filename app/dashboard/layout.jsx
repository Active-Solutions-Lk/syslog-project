// Solution 1: Using useState with useEffect for loading state
'use client';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { SessionProvider } from '@/context/SessionContext';
import ClientLayout from '@/components/ClientLayout';
import { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

// Loading Spinner Component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="flex flex-col items-center space-y-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <p className="text-gray-600 animate-pulse">Loading...</p>
    </div>
  </div>
);

// Enhanced Loading Skeleton
const LoadingSkeleton = () => (
  <div className="flex flex-col space-y-3 p-4 min-h-screen">
    <div className="animate-pulse">
      <Skeleton className="h-16 w-full rounded-md mb-4" />
      <Skeleton className="h-12 w-3/4 rounded-md mb-3" />
      <Skeleton className="h-12 w-1/2 rounded-md mb-3" />
      <Skeleton className="h-32 w-full rounded-md mb-4" />
      <div className="grid grid-cols-2 gap-4">
        <Skeleton className="h-24 rounded-md" />
        <Skeleton className="h-24 rounded-md" />
      </div>
    </div>
  </div>
);

export default function RootLayout({ children }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time or wait for critical resources
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000); // Adjust timing as needed

    return () => clearTimeout(timer);
  }, []);

  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <SessionProvider>
        <ClientLayout>
          {isLoading ? (
            <LoadingSkeleton /> // or <LoadingSpinner />
          ) : (
            children
          )}
        </ClientLayout>
      </SessionProvider>
    </ThemeProvider>
  );
}