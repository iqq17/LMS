"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AttendanceSheet } from "./AttendanceSheet"
import { AttendanceHistory } from "./AttendanceHistory"
import { useState } from "react"

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

export function AttendanceManagement() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      <motion.div variants={item}>
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          <span className="gradient-text">Attendance Management</span>
        </h1>
        <p className="text-muted-foreground">Track and manage student attendance</p>
      </motion.div>

      <Tabs defaultValue="take" className="space-y-6">
        <TabsList>
          <TabsTrigger value="take">Take Attendance</TabsTrigger>
          <TabsTrigger value="history">Attendance History</TabsTrigger>
        </TabsList>

        <TabsContent value="take">
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Select Date</CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  className="rounded-md border"
                />
              </CardContent>
            </Card>

            <div className="md:col-span-2">
              <AttendanceSheet sessionId="current-session" />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="history">
          <AttendanceHistory />
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}