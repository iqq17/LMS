"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Video, Users, Clock, BookOpen, GraduationCap } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { COURSES } from "@/lib/constants/courses"
import { Badge } from "@/components/ui/badge"

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

export function ClassroomList() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const router = useRouter()

  const handleJoinSession = (courseId: string) => {
    router.push(`/classroom/${courseId}`)
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="p-8 space-y-8"
    >
      <motion.div variants={item}>
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          <span className="gradient-text">Available Courses</span>
        </h1>
        <p className="text-muted-foreground">
          Join our comprehensive Quranic education programs with expert instructors
        </p>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-3">
        <motion.div variants={item} className="lg:col-span-2 space-y-6">
          {COURSES.map((course) => (
            <Card key={course.id} className="hover-card-effect">
              <CardContent className="p-6">
                <div className="flex items-center gap-6">
                  <div 
                    className="h-24 w-24 rounded-lg bg-cover bg-center"
                    style={{ backgroundImage: `url(${course.image})` }}
                  />
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-lg">{course.title}</h3>
                      <Badge variant={
                        course.level === "Beginner" ? "default" :
                        course.level === "Intermediate" ? "secondary" :
                        course.level === "Advanced" ? "destructive" : "outline"
                      }>
                        {course.level}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{course.description}</p>
                    <div className="flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-primary" />
                        {course.duration}
                      </div>
                      <div className="flex items-center gap-1">
                        <GraduationCap className="h-4 w-4 text-primary" />
                        {course.instructor}
                      </div>
                      {course.prerequisites.length > 0 && (
                        <div className="flex items-center gap-1">
                          <BookOpen className="h-4 w-4 text-primary" />
                          {course.prerequisites.length} Prerequisites
                        </div>
                      )}
                    </div>
                    <div className="flex gap-3 pt-2">
                      <Button 
                        className="flex-1"
                        onClick={() => handleJoinSession(course.id)}
                      >
                        <Video className="h-4 w-4 mr-2" />
                        Join Live Session
                      </Button>
                      <Button variant="outline">
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        <motion.div variants={item} className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">Session Calendar</h3>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border"
              />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="font-semibold">Upcoming Sessions</h3>
              <div className="space-y-3">
                {COURSES.slice(0, 3).map((course) => (
                  <div key={course.id} className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded bg-primary/10 flex items-center justify-center">
                      <Video className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{course.title}</div>
                      <div className="text-xs text-muted-foreground">Today, 3:00 PM</div>
                    </div>
                    <Button size="sm" variant="outline">Join</Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  )
}