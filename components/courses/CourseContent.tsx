"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { VideoPlayer } from "@/components/courses/VideoPlayer"
import { ResourcePanel } from "@/components/courses/ResourcePanel"
import { CourseProgress } from "@/components/courses/CourseProgress"
import { PlayCircle, FileText, Award, MessageSquare, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

// This would typically come from an API
const getCourseContent = (courseId: string) => ({
  title: courseId === "tajweed-fundamentals" 
    ? "Tajweed Fundamentals"
    : courseId === "quran-memorization"
    ? "Quran Memorization: Juz Amma"
    : "Arabic for Quran Understanding",
  description: "Master the essential rules of Quranic recitation",
  progress: 45,
  currentModule: "Module 2: Noon Sakinah Rules",
  instructor: "Sheikh Ahmad",
  modules: [
    {
      id: 1,
      title: "Introduction to Tajweed",
      lessons: [
        {
          id: "1.1",
          title: "What is Tajweed?",
          duration: "15:30",
          completed: true,
          type: "video"
        },
        {
          id: "1.2",
          title: "Importance of Tajweed",
          duration: "12:45",
          completed: true,
          type: "video"
        }
      ]
    },
    {
      id: 2,
      title: "Noon Sakinah Rules",
      lessons: [
        {
          id: "2.1",
          title: "Understanding Noon Sakinah",
          duration: "20:15",
          completed: false,
          type: "video"
        },
        {
          id: "2.2",
          title: "Practice Session",
          duration: "30:00",
          completed: false,
          type: "practice"
        }
      ]
    }
  ]
})

interface CourseContentProps {
  courseId: string
}

export function CourseContent({ courseId }: CourseContentProps) {
  const router = useRouter()
  const courseContent = getCourseContent(courseId)
  const [activeLesson, setActiveLesson] = useState(courseContent.modules[0].lessons[0])

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="p-8 space-y-8"
    >
      <motion.div variants={item} className="flex items-center justify-between">
        <div className="space-y-1">
          <Button 
            variant="ghost" 
            className="mb-2 -ml-4"
            onClick={() => router.push("/courses")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Courses
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">
            <span className="gradient-text">{courseContent.title}</span>
          </h1>
          <p className="text-muted-foreground">{courseContent.description}</p>
        </div>
        <Button className="gap-2">
          <Award className="h-4 w-4" />
          Get Certificate
        </Button>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-3">
        <motion.div variants={item} className="lg:col-span-2 space-y-6">
          <Card className="overflow-hidden">
            <VideoPlayer lesson={activeLesson} />
          </Card>

          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
              <TabsTrigger value="discussion">Discussion</TabsTrigger>
              <TabsTrigger value="notes">My Notes</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <Card>
                <CardHeader>
                  <CardTitle>About This Lesson</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Learn the fundamental rules of Tajweed with expert guidance from Sheikh Ahmad.
                    This comprehensive course covers all aspects of proper Quranic recitation.
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Course Progress</span>
                      <span>{courseContent.progress}%</span>
                    </div>
                    <Progress value={courseContent.progress} className="h-2" />
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <h3 className="text-2xl font-bold text-primary">3</h3>
                          <p className="text-sm text-muted-foreground">Badges Earned</p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <h3 className="text-2xl font-bold text-primary">8</h3>
                          <p className="text-sm text-muted-foreground">Hours Completed</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="resources">
              <ResourcePanel />
            </TabsContent>

            <TabsContent value="discussion">
              <Card>
                <CardContent className="p-6">
                  <div className="text-center py-8">
                    <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Join the Discussion</h3>
                    <p className="text-muted-foreground mb-4">
                      Connect with fellow students and discuss this lesson.
                    </p>
                    <Button>Start Discussion</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notes">
              <Card>
                <CardContent className="p-6">
                  <textarea
                    className="w-full h-[200px] p-4 rounded-md border bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Take notes for this lesson..."
                  />
                  <div className="flex justify-end mt-4">
                    <Button>Save Notes</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>

        <motion.div variants={item} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Course Content</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <CourseProgress 
                modules={courseContent.modules}
                activeLesson={activeLesson}
                onSelectLesson={setActiveLesson}
              />
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  )
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