"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LucideIcon } from "lucide-react"
import { motion } from "framer-motion"
import type { StatTrend } from "@/types"

interface StatsCardProps {
  title: string
  value: string
  change: string
  icon: LucideIcon
  trend: StatTrend
}

export function StatsCard({ title, value, change, icon: Icon, trend }: StatsCardProps) {
  const trendColor = trend === "up" ? "text-green-500" : trend === "down" ? "text-red-500" : "text-gray-500"

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="hover-card-effect"
    >
      <Card className="glass-effect">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <motion.div
            whileHover={{ scale: 1.2, rotate: 5 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Icon className="h-4 w-4 text-primary" />
          </motion.div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{value}</div>
          <p className={`text-xs ${trendColor} flex items-center gap-1 mt-1`}>
            {change}
            {trend === "up" && "↑"}
            {trend === "down" && "↓"}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  )
}