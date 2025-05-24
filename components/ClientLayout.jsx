"use client"

import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import AppNavbar from "@/components/app-navbar"

export default function ClientLayout({ children }) {
  return (
    <SidebarProvider>
      <div className="flex w-full min-h-screen">
        <AppSidebar />
        <div className="flex-1 w-full flex flex-col">
          <AppNavbar />
          <main className="flex-1 p-6 pt-4 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}