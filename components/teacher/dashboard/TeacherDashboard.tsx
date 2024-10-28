"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { TeacherHeader } from "./TeacherHeader"
import { StatsCards } from "./StatsCards"
import { UpcomingSessions } from "./UpcomingSessions"
import { RecentActivities } from "./RecentActivities"
import { QuickActions } from "./QuickActions"
import { TeacherCalendar } from "./TeacherCalendar"
import { StudentOverview } from "./StudentOverview"

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
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="p-6 h-[calc(100vh-2rem)] overflow-hidden"
    >
      <div className="max-w-[1800px] mx-auto h-full flex flex-col gap-4">
        {/* Header Section */}
        <TeacherHeader teacher={previewData?.profile} />

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
          {/* Left Column - Calendar & Sessions */}
          <motion.div variants={item} className="col-span-3 flex flex-col gap-4">
            <TeacherCalendar 
              selectedDate={selectedDate}
              onDateSelect={setSelectedDate}
            />
            <RecentActivities />
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
      </div>
    </motion.div>
  )
}