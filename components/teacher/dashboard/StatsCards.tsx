"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Users, Video, Clock, Award, TrendingUp, TrendingDown } from "lucide-react"
import { useTeacherStats } from "@/hooks/useTeacherStats"
import { Skeleton } from "@/components/ui/skeleton"

export function StatsCards() {
  const { stats, loading } = useTeacherStats()

  const cards = [
    {
      title: "Total Students",
      value: stats.totalStudents.toString(),
      change: `+${Math.floor(stats.totalStudents * 0.1)}`,
      trend: "up",
      period: "this month",
      icon: Users,
      color: "bg-blue-500/10 text-blue-500"
    },
    {
      title: "Today's Sessions",
      value: stats.upcomingSessions.toString(),
      change: stats.upcomingSessions > 0 ? "Next in 2h" : "None today",
      trend: "neutral",
      period: "",
      icon: Video,
      color: "bg-purple-500/10 text-purple-500"
    },
    {
      title: "Teaching Hours",
      value: stats.teachingHours.toString(),
      change: `+${Math.floor(stats.teachingHours * 0.1)}`,
      trend: "up",
      period: "this month",
      icon: Clock,
      color: "bg-green-500/10 text-green-500"
    },
    {
      title: "Average Rating",
      value: stats.averageRating.toFixed(1),
      change: "+0.2",
      trend: "up",
      period: "vs last month",
      icon: Award,
      color: "bg-yellow-500/10 text-yellow-500"
    }
  ]

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <Skeleton className="h-4 w-[100px] mb-2" />
              <Skeleton className="h-8 w-[60px]" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => {
        const Icon = card.icon
        const TrendIcon = card.trend === "up" ? TrendingUp : TrendingDown
        const trendColor = card.trend === "up" ? "text-green-500" : 
                          card.trend === "down" ? "text-red-500" : 
                          "text-muted-foreground"

        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className={`h-8 w-8 rounded-full ${card.color} flex items-center justify-center`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  {card.trend !== "neutral" && (
                    <div className={`flex items-center gap-1 text-xs ${trendColor}`}>
                      <TrendIcon className="h-3 w-3" />
                      {card.change}
                    </div>
                  )}
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{card.value}</h2>
                  <p className="text-sm text-muted-foreground">{card.title}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )
      })}
    </div>
  )
}