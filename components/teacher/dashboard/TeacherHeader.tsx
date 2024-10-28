"use client"

import { motion } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Bell, Settings, Search } from "lucide-react"
import { Input } from "@/components/ui/input"

interface TeacherHeaderProps {
  teacher?: {
    first_name?: string
    last_name?: string
    avatar_url?: string
  }
}

export function TeacherHeader({ teacher }: TeacherHeaderProps) {
  const getTimeOfDay = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "morning"
    if (hour < 17) return "afternoon"
    return "evening"
  }

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Avatar className="h-12 w-12 border-2 border-primary">
          <AvatarImage src={teacher?.avatar_url} />
          <AvatarFallback>
            {teacher?.first_name?.[0]}{teacher?.last_name?.[0]}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Good {getTimeOfDay()}, <span className="gradient-text">{teacher?.first_name || "Teacher"}</span>
          </h1>
          <p className="text-sm text-muted-foreground">Here's what's happening with your classes today</p>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        {/* Global Search */}
        <div className="relative hidden lg:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search anything..." 
            className="w-[250px] pl-9"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-medium flex items-center justify-center text-primary-foreground">
              3
            </span>
          </Button>
          <Button variant="outline" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}