"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bell, Calendar, Trophy } from "lucide-react"

const announcements = [
  {
    id: 1,
    title: "New Course Available",
    message: "Advanced Tajweed course starting next week",
    time: "1 hour ago",
    icon: Bell,
    color: "text-blue-500"
  },
  {
    id: 2,
    title: "Upcoming Event",
    message: "Join our Ramadan preparation workshop",
    time: "2 hours ago",
    icon: Calendar,
    color: "text-purple-500"
  },
  {
    id: 3,
    title: "Achievement Unlocked",
    message: "You've completed 10 consecutive lessons!",
    time: "Yesterday",
    icon: Trophy,
    color: "text-yellow-500"
  }
]

export function Announcements() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Announcements</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px]">
          <div className="space-y-4">
            {announcements.map((announcement) => {
              const Icon = announcement.icon
              return (
                <div
                  key={announcement.id}
                  className="p-4 rounded-lg border bg-card hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  <div className="flex gap-3">
                    <div className={`h-8 w-8 rounded-full bg-background border-2 flex items-center justify-center ${announcement.color}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="font-medium">{announcement.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {announcement.message}
                      </p>
                      <span className="text-xs text-muted-foreground">
                        {announcement.time}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}