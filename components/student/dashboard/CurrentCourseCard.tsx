"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { PlayCircle, Clock, Award } from "lucide-react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

export function CurrentCourseCard() {
  const router = useRouter()

  // This would come from your backend
  const currentCourse = {
    id: "tajweed-101",
    title: "Tajweed Fundamentals",
    progress: 65,
    nextLesson: "Noon Sakinah Rules",
    timeSpent: "12h 30m",
    achievements: 3
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Current Course</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">{currentCourse.title}</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Overall Progress</span>
              <span>{currentCourse.progress}%</span>
            </div>
            <Progress value={currentCourse.progress} className="h-2" />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-primary" />
            <span>Time spent: {currentCourse.timeSpent}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Award className="h-4 w-4 text-primary" />
            <span>{currentCourse.achievements} achievements earned</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-sm font-medium">Next Lesson:</div>
          <Button 
            className="w-full"
            onClick={() => router.push(`/courses/${currentCourse.id}`)}
          >
            <PlayCircle className="h-4 w-4 mr-2" />
            Continue: {currentCourse.nextLesson}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}