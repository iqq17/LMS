"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import { motion } from "framer-motion"
import { BookOpen, Video, Award, FileCheck } from "lucide-react"

const activities = [
  {
    id: 1,
    title: "Completed Lesson",
    description: "Surah Al-Baqarah: Verses 1-5",
    time: "2 minutes ago",
    icon: BookOpen,
    color: "text-blue-500"
  },
  {
    id: 2,
    title: "Live Session",
    description: "Attended Tajweed Class with Sheikh Ahmad",
    time: "1 hour ago",
    icon: Video,
    color: "text-green-500"
  },
  {
    id: 3,
    title: "Achievement Unlocked",
    description: "Completed 10 consecutive days of study",
    time: "2 hours ago",
    icon: Award,
    color: "text-yellow-500"
  },
  {
    id: 4,
    title: "Assignment Submitted",
    description: "Tajweed Rules Practice Exercise",
    time: "3 hours ago",
    icon: FileCheck,
    color: "text-purple-500"
  }
]

export function RecentActivity() {
  return (
    <ScrollArea className="h-[350px] pr-4">
      <div className="space-y-4">
        {activities.map((activity, index) => {
          const Icon = activity.icon
          return (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex gap-3 border-b pb-4 last:border-0"
            >
              <div className={`mt-1 rounded-full p-2 bg-background ${activity.color}`}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold">{activity.title}</h4>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {activity.description}
                </p>
              </div>
            </motion.div>
          )
        })}
      </div>
    </ScrollArea>
  )
}