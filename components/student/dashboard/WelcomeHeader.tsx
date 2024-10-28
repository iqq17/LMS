"use client"

import { motion } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Bell, Settings } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { NotificationsPopover } from "@/components/notifications/NotificationsPopover"

export function WelcomeHeader() {
  const { profile } = useAuth()
  const timeOfDay = new Date().getHours() < 12 ? "morning" : 
                   new Date().getHours() < 17 ? "afternoon" : 
                   "evening"

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Avatar className="h-12 w-12 border-2 border-primary">
          <AvatarImage src={profile?.avatar_url} />
          <AvatarFallback>
            {profile?.first_name?.[0]}{profile?.last_name?.[0]}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Good {timeOfDay}, <span className="gradient-text">{profile?.first_name || "Student"}</span>
          </h1>
          <p className="text-sm text-muted-foreground">Continue your Quranic journey</p>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <NotificationsPopover />
        <Button variant="outline" size="icon">
          <Settings className="h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}