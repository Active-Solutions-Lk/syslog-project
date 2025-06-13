import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import ClientLayout from "@/components/ClientLayout"


export const metadata = {
  title: "Active NAS Dashboard",
  description: "NAS Management Dashboard",
}

export default function RootLayout({ children }) {
  return (
        <ThemeProvider attribute="class" defaultTheme="light">
          <ClientLayout >
            {children}
          </ClientLayout>
        </ThemeProvider>
  )
}