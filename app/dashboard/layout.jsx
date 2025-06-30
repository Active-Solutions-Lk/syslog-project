'use client';

import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { SessionProvider } from '@/context/SessionContext';
import ClientLayout from '@/components/ClientLayout';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function RootLayout({ children }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <SessionProvider>
        <ClientLayout>
          <Suspense
            fallback={
              <div className="flex flex-col space-y-3 p-4">
                <Skeleton className="h-12 w-full rounded-md" />
                <Skeleton className="h-12 w-full rounded-md" />
                <Skeleton className="h-12 w-full rounded-md" />
              </div>
            }
          >
            {children}
          </Suspense>
        </ClientLayout>
      </SessionProvider>
    </ThemeProvider>
  );
}