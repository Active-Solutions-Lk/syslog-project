"use client"

import { motion } from "framer-motion"
import { Bell, ChevronDown, Search } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

export default function DeviceSettings() {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  }

  // Sample data for devices
  const devices = [
    {
      name: "Shaheer NAS",
      ip: "192.168.0.53",
      port: "5000",
      logCount: "3620",
      status: "Active",
    },
    {
      name: "Shaheer NAS",
      ip: "192.168.0.53",
      port: "5000",
      logCount: "3620",
      status: "Deactive",
    },
    {
      name: "Active Com",
      ip: "192.168.0.39",
      port: "514",
      logCount: "20",
      status: "Active",
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between border-b p-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold">Dashboard</h1>
            <span className="text-muted-foreground">&gt;</span>
            <h1 className="text-xl font-semibold">Settings</h1>
            <span className="text-muted-foreground">&gt;</span>
            <h1 className="text-xl font-semibold">Device</h1>
          </div>
          <div className="text-sm text-muted-foreground">Monday 2023-04-09</div>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8 bg-blue-100 text-blue-600">
              <AvatarFallback>AS</AvatarFallback>
            </Avatar>
            <span className="font-medium">Ahamed Shaheer</span>
            <ChevronDown className="h-4 w-4" />
          </div>
        </div>
      </header>

      <motion.div className="flex-1 p-6" variants={containerVariants} initial="hidden" animate="visible">
        <motion.div variants={itemVariants} className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search Devices" className="pl-10 pr-10" />
            <Button size="sm" className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full">
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="rounded-lg border shadow-sm">
          <div className="grid grid-cols-5 gap-4 border-b bg-muted/40 p-4 font-medium">
            <div>Device</div>
            <div>IP</div>
            <div>Port</div>
            <div>Log Count</div>
            <div>Status</div>
            <div>Actions</div>
          </div>
          {devices.map((device, index) => (
            <div key={index} className="grid grid-cols-5 gap-4 border-b p-4 last:border-0">
              <div>{device.name}</div>
              <div>{device.ip}</div>
              <div>{device.port}</div>
              <div>{device.logCount}</div>
              <div>
                <Badge
                  className={device.status === "Active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
                >
                  {device.status}
                </Badge>
              </div>
              <div>
                <Button variant="outline" size="sm">
                  Settings
                </Button>
              </div>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  )
}
