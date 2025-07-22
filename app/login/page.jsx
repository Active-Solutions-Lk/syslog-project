'use client';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import AuthLayout from '@/components/auth/AuthLayout';
import LoginForm from '@/components/auth/LoginForm';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

function LoginContent() {
  const [session, setSession] = useState(null);
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  useEffect(() => {
    if (error) {
      // console.log('Login error:', error); // Log the error for debugging
      toast.error('Login failed: ' + error); // Show error toast if error exists
    }
  }, [error]); // Run effect when error changes

  return (
    <AuthLayout
      title="Login"
      welcomeHeading="Hello, Welcome!"
      welcomeSubheading="Log in now to manage your device logs more efficiently and stay in full control!"
      sidePosition="left"
    >
      <LoginForm setSession={setSession} />
    </AuthLayout>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}