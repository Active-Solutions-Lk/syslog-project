// app/components/Loading.jsx
'use client';
import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export default function Loading() {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Show loading when navigating to protected routes
    if (pathname.startsWith('/')) {
      setIsLoading(true);
    }

    // Hide loading when navigation completes (pathname or searchParams change)
    setIsLoading(false);

    // Optional: Add a timeout to hide loading after a maximum duration
    const timer = setTimeout(() => setIsLoading(false), 5000); // 5 seconds max
    return () => clearTimeout(timer);
  }, [pathname, searchParams]);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
      <div className="flex flex-col items-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
        <p className="text-white text-lg font-semibold">Getting things ready...</p>
      </div>
    </div>
  );
}