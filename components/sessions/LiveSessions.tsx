"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Video, Users, Clock } from "lucide-react"
import { useState } from "react"

const sessions = [
  {
    id: 1,
    title: "Advanced Tajweed Rules",
    instructor: "Sheikh Ahmad",
    time: "3:00 PM - 4:30 PM",
    date: new Date(),
    participants: 12,
    status: "upcoming"
  },
  {
    id: 2,
    title: "Quran Memorization Circle",
    instructor: "Sheikh Mohammed",
    time: "5:00 PM - 6:30 PM",
    date: new Date(),
    participants: 8,
    status: "upcoming"
  }
]

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

export function LiveSessions() {
  const [date, setDate] = useState<Date | undefined>(new Date())

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="p-8 space-y-8"
    >
      <motion.div variants={item}>
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          <span className="gradient-text">Live Sessions</span>
        </h1>
        <p className="text-muted-foreground">Join interactive Quran learning sessions with our expert instructors.</p>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-3">
        <motion.div variants={item} className="lg:col-span-2 space-y-6">
          {sessions.map((session) => (
            <Card key={session.id} className="hover-card-effect">
              <CardContent className="p-6">
                <div className="flex items-center gap-6">
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <Video className="h-8 w-8 text-primary" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <h3 className="font-semibold">{session.title}</h3>
                    <p className="text-sm text-muted-foreground">with {session.instructor}</p>
                    <div className="flex gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {session.time}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {session.participants} joined
                      </div>
                    </div>
                  </div>
                  <Button>Join Now</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        <motion.div variants={item}>
          <Card>
            <CardHeader>
              <CardTitle>Session Calendar</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border"
              />
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  )
}