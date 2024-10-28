"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Award, Star, TrendingUp } from "lucide-react"
import { motion } from "framer-motion"

interface PerformanceMetricsProps {
  stats: any // Replace with proper type
  loading: boolean
}

export function PerformanceMetrics({ stats, loading }: PerformanceMetricsProps) {
  const metrics = [
    {
      title: "Memorization",
      value: stats?.memorization || 0,
      target: 100,
      icon: Star,
      color: "text-yellow-500"
    },
    {
      title: "Tajweed",
      value: stats?.tajweed || 0,
      target: 100,
      icon: Award,
      color: "text-blue-500"
    },
    {
      title: "Attendance",
      value: stats?.attendance || 0,
      target: 100,
      icon: TrendingUp,
      color: "text-green-500"
    }
  ]

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Performance</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {metrics.map((metric, index) => {
          const Icon = metric.icon
          return (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <Icon className={`h-4 w-4 ${metric.color}`} />
                  <span className="font-medium">{metric.title}</span>
                </div>
                <span className="text-sm">
                  {metric.value}%
                </span>
              </div>
              <Progress value={metric.value} className="h-2" />
              <p className="text-xs text-muted-foreground">
                Target: {metric.target}%
              </p>
            </div>
          )
        })}

        <div className="pt-4 border-t">
          <div className="text-sm font-medium mb-2">Recent Achievements</div>
          <div className="space-y-2">
            {stats?.recentAchievements?.map((achievement: any, index: number) => (
              <div key={index} className="flex items-center gap-2">
                <Award className="h-4 w-4 text-yellow-500" />
                <span className="text-sm">{achievement.title}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}