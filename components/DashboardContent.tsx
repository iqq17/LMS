"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Overview } from "@/components/Overview"
import { RecentActivity } from "@/components/RecentActivity"
import { StatsCard } from "@/components/StatsCard"
import { NextLessonCard } from "@/components/NextLessonCard"
import { ProgressOverview } from "@/components/ProgressOverview"
import { useAuth } from "@/hooks/useAuth"
import { useStats } from "@/hooks/useStats"
import { motion } from "framer-motion"
import type { StatTrend } from "@/types"
import { BookOpen, GraduationCap, Clock, Award, Users, Video } from "lucide-react"

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

export function DashboardContent() {
  const { user, profile, isTeacher } = useAuth()
  const stats = useStats()
  const timeOfDay = new Date().getHours()
  
  const greeting = timeOfDay < 12 ? "Good morning" : 
                  timeOfDay < 17 ? "Good afternoon" : 
                  "Good evening"

  const teacherStats = [
    {
      title: "Total Students",
      value: stats.totalStudents.toString(),
      change: `+${Math.floor(stats.totalStudents * 0.1)} this month`,
      icon: Users,
      trend: "up" as StatTrend
    },
    {
      title: "Active Courses",
      value: stats.activeCourses.toString(),
      change: "+1 new course",
      icon: BookOpen,
      trend: "up" as StatTrend
    },
    {
      title: "Teaching Hours",
      value: stats.totalHours.toString(),
      change: `+${Math.floor(stats.totalHours * 0.1)} this month`,
      icon: Clock,
      trend: "up" as StatTrend
    },
    {
      title: "Average Rating",
      value: stats.averageRating.toFixed(1),
      change: "From 32 reviews",
      icon: Award,
      trend: "neutral" as StatTrend
    }
  ]

  const studentStats = [
    {
      title: "Completed Lessons",
      value: stats.completedLessons.toString(),
      change: `+${Math.floor(stats.completedLessons * 0.1)} this week`,
      icon: BookOpen,
      trend: "up" as StatTrend
    },
    {
      title: "Study Hours",
      value: stats.studyHours.toString(),
      change: `+${Math.floor(stats.studyHours * 0.1)} hrs this week`,
      icon: Clock,
      trend: "up" as StatTrend
    },
    {
      title: "Next Session",
      value: stats.nextSession ? new Date(stats.nextSession).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "None",
      change: stats.nextSession ? new Date(stats.nextSession).toLocaleDateString([], { weekday: 'long' }) : "Schedule now",
      icon: Video,
      trend: "neutral" as StatTrend
    },
    {
      title: "Achievements",
      value: stats.achievements.toString(),
      change: "+2 new badges",
      icon: Award,
      trend: "up" as StatTrend
    }
  ]

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="flex-1 space-y-8 p-8 pt-6"
    >
      <motion.div variants={item} className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            {greeting}, <span className="gradient-text">{profile?.first_name || user?.email}</span>
          </h2>
          <p className="text-muted-foreground">
            Here's what's happening with your {isTeacher ? "teaching" : "learning"} journey.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Card className="glass-effect">
            <CardContent className="py-2 px-4">
              <p className="text-sm font-medium text-primary">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      <motion.div variants={item}>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {(isTeacher ? teacherStats : studentStats).map((stat) => (
            <StatsCard key={stat.title} {...stat} />
          ))}
        </div>
      </motion.div>

      <motion.div variants={item}>
        <NextLessonCard />
      </motion.div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <motion.div variants={item} className="col-span-4">
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle>Weekly Overview</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <Overview />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item} className="col-span-3">
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <RecentActivity />
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div variants={item}>
        <Card className="glass-effect">
          <CardHeader>
            <CardTitle>Progress Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <ProgressOverview />
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}