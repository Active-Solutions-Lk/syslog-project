import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import ClientLayout from "@/components/ClientLayout"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Active NAS Dashboard",
  description: "NAS Management Dashboard",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light">
          <ClientLayout >
            {children}
          </ClientLayout>
        </ThemeProvider>
      </body>
    </html>
  )
}