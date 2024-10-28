"use client"

import { Progress } from "@/components/ui/progress"
import { motion } from "framer-motion"

const subjects = [
  {
    name: "Quran Memorization",
    progress: 75,
    total: "18/24 Juz",
  },
  {
    name: "Tajweed Rules",
    progress: 85,
    total: "34/40 Lessons",
  },
  {
    name: "Arabic Language",
    progress: 60,
    total: "12/20 Units",
  },
  {
    name: "Islamic Studies",
    progress: 90,
    total: "9/10 Modules",
  },
]

export function ProgressOverview() {
  return (
    <div className="space-y-6">
      {subjects.map((subject, index) => (
        <motion.div
          key={subject.name}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="space-y-2"
        >
          <div className="flex justify-between text-sm">
            <span className="font-medium">{subject.name}</span>
            <span className="text-muted-foreground">{subject.total}</span>
          </div>
          <Progress value={subject.progress} className="h-2" />
        </motion.div>
      ))}
    </div>
  )
}