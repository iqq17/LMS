"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { BookOpen, Video, Award, MessageSquare } from "lucide-react"

const activities = [
  {
    id: 1,
    icon: BookOpen,
    text: "Completed Lesson: Noon Sakinah Rules",
    time: "2 hours ago",
    color: "text-blue-500"
  },
  {
    id: 2,
    icon: Video,
    text: "Attended Live Session with Sheikh Ahmad",
    time: "4 hours ago",
    color: "text-purple-500"
  },
  {
    id: 3,
    icon: Award,
    text: "Earned Achievement: 7-Day Streak",
    time: "Yesterday",
    color: "text-yellow-500"
  },
  {
    id: 4,
    icon: MessageSquare,
    text: "Received feedback on Surah Al-Fatiha recitation",
    time: "Yesterday",
    color: "text-green-500"
  }
]

export function RecentActivity() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-4">
          <div className="relative">
            <div className="absolute top-0 bottom-0 left-[17px] w-[2px] bg-border" />
            <div className="space-y-6">
              {activities.map((activity) => {
                const Icon = activity.icon
                return (
                  <div key={activity.id} className="flex gap-4 relative">
                    <div className={`h-9 w-9 rounded-full bg-background border-2 flex items-center justify-center z-10 ${activity.color}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 pt-1">
                      <p className="text-sm">{activity.text}</p>
                      <span className="text-xs text-muted-foreground">
                        {activity.time}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}