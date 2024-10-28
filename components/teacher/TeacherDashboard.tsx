"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { TeacherHeader } from "./dashboard/TeacherHeader"
import { StatsCards } from "./dashboard/StatsCards"
import { UpcomingSessions } from "./dashboard/UpcomingSessions"
import { RecentActivities } from "./dashboard/RecentActivities"
import { QuickActions } from "./dashboard/QuickActions"
import { TeacherCalendar } from "./dashboard/TeacherCalendar"
import { StudentOverview } from "./dashboard/StudentOverview"

interface TeacherDashboardProps {
  previewData?: any
}

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

export function TeacherDashboard({ previewData }: TeacherDashboardProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())

  return (
    <div className="h-screen bg-background">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="h-full p-4 flex flex-col gap-4 max-w-[1800px] mx-auto"
      >
        {/* Header Section */}
        <motion.div variants={item}>
          <TeacherHeader teacher={previewData?.profile} />
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={item}>
          <QuickActions />
        </motion.div>

        {/* Stats Overview */}
        <motion.div variants={item}>
          <StatsCards />
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-12 gap-4 flex-1 min-h-0">
          {/* Left Column - Calendar & Activities */}
          <motion.div variants={item} className="col-span-3 flex flex-col gap-4">
            <div className="h-[60%]">
              <TeacherCalendar 
                selectedDate={selectedDate}
                onDateSelect={setSelectedDate}
              />
            </div>
            <div className="h-[40%]">
              <RecentActivities />
            </div>
          </motion.div>

          {/* Middle Column - Upcoming Sessions */}
          <motion.div variants={item} className="col-span-6">
            <UpcomingSessions />
          </motion.div>

          {/* Right Column - Student Overview */}
          <motion.div variants={item} className="col-span-3">
            <StudentOverview />
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}