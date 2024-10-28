"use client"

import { motion } from "framer-motion"
import { WelcomeHeader } from "./dashboard/WelcomeHeader"
import { CurrentCourseCard } from "./dashboard/CurrentCourseCard"
import { UpcomingEvents } from "./dashboard/UpcomingEvents"
import { RecentActivity } from "./dashboard/RecentActivity"
import { PerformanceMetrics } from "./dashboard/PerformanceMetrics"
import { AssignmentsList } from "./dashboard/AssignmentsList"
import { QuickActions } from "./dashboard/QuickActions"
import { Announcements } from "./dashboard/Announcements"
import { useStudentStats } from "@/hooks/useStudentStats"

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

export function StudentDashboard() {
  const { stats, loading } = useStudentStats()

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="p-6 h-[calc(100vh-2rem)] overflow-hidden"
    >
      <div className="max-w-[1800px] mx-auto h-full flex flex-col gap-4">
        {/* Welcome Header */}
        <WelcomeHeader />

        {/* Quick Actions */}
        <motion.div variants={item}>
          <QuickActions />
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-12 gap-4 flex-1 min-h-0">
          {/* Left Column - Current Course & Performance */}
          <motion.div variants={item} className="col-span-3 flex flex-col gap-4">
            <CurrentCourseCard />
            <PerformanceMetrics stats={stats} loading={loading} />
          </motion.div>

          {/* Middle Column - Recent Activity & Assignments */}
          <motion.div variants={item} className="col-span-6 flex flex-col gap-4">
            <RecentActivity />
            <AssignmentsList />
          </motion.div>

          {/* Right Column - Upcoming Events & Announcements */}
          <motion.div variants={item} className="col-span-3 flex flex-col gap-4">
            <UpcomingEvents />
            <Announcements />
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}