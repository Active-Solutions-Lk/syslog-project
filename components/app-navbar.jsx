'use client';

import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Bell, ChevronDown } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { useSession } from '@/context/SessionContext';

const AppNavbar = () => {
  const { sessionToken, adminDetails, isLoading } = useSession();
  const router = useRouter();

  const handleLogout = () => {
    // Clear session token from storage
    localStorage.removeItem('sessionToken');
    sessionStorage.removeItem('sessionToken');
    document.cookie = 'sessionToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'; // Clear cookie
    // Redirect to login page
    router.push('/login');
  };

  return (
    <header className="flex items-center justify-between sticky top-0 z-10 bg-white/80 backdrop-blur border-none p-1">
      <div>
        <div className="flex items-center gap-2">
          <SidebarTrigger />
          <h3 className="text-md text-secondary text-subtitle font-semibold">Dashboard</h3>
        </div>
        <div className="text-xs ps-9 text-muted-foreground">
          {format(new Date(), 'EEEE, MMMM dd, yyyy h:mm a')}
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Button className="text-primary-customized" variant="ghost" size="icon">
          <Bell className="h-6 w-6" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-3 cursor-pointer">
              <Avatar className="h-8 w-8 bg-blue-100 text-primary-customized">
                <AvatarFallback>{adminDetails?.name ? adminDetails.name[0] : 'AS'}</AvatarFallback>
                <AvatarImage src="/images/dp.png" alt="User" className="h-8 w-8 rounded-full" />
              </Avatar>
              <span className="font-medium text-subtitle text-sm">
                {isLoading ? 'Loading...' : adminDetails ? adminDetails.name : 'Loading...'}
              </span>
              <ChevronDown className="h-4 w-4" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {isLoading ? (
              <DropdownMenuItem>Loading...</DropdownMenuItem>
            ) : adminDetails ? (
              <>
                <DropdownMenuItem className="flex flex-col items-start">
                  <span className="font-medium">Name</span>
                  <span className="text-sm text-muted-foreground">{adminDetails.name}</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex flex-col items-start">
                  <span className="font-medium">Email</span>
                  <span className="text-sm text-muted-foreground">{adminDetails.email}</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex flex-col items-start">
                  <span className="font-medium">Company</span>
                  <span className="text-sm text-muted-foreground">{adminDetails.company}</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex flex-col items-start">
                  <span className="font-medium">Created At</span>
                  <span className="text-sm text-muted-foreground">
                    {format(new Date(adminDetails.created_at), 'MMMM dd, yyyy')}
                  </span>
                </DropdownMenuItem>
              </>
            ) : (
              <DropdownMenuItem>No account data available</DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-red-600">
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default AppNavbar;