"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/lib/supabase/client"
import { useAuth } from "@/hooks/useAuth"
import { CheckCircle, Clock, Users, BookOpen } from "lucide-react"
import type { Course } from "@/lib/supabase/types"

interface CourseEnrollmentProps {
  courseId: string
}

export function CourseEnrollment({ courseId }: CourseEnrollmentProps) {
  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
  const [enrolling, setEnrolling] = useState(false)
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    fetchCourse()
  }, [courseId])

  const fetchCourse = async () => {
    try {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .eq("id", courseId)
        .single()

      if (error) throw error
      setCourse(data)
    } catch (error) {
      console.error("Error fetching course:", error)
      toast({
        title: "Error",
        description: "Failed to load course details",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleEnroll = async () => {
    try {
      setEnrolling(true)
      
      // Check if already enrolled
      const { data: existingEnrollment, error: checkError } = await supabase
        .from("enrollments")
        .select("*")
        .eq("student_id", user?.id)
        .eq("course_id", courseId)
        .single()

      if (checkError && checkError.code !== "PGRST116") throw checkError
      if (existingEnrollment) {
        toast({
          title: "Already Enrolled",
          description: "You are already enrolled in this course",
        })
        return
      }

      // Create enrollment
      const { error: enrollError } = await supabase
        .from("enrollments")
        .insert({
          student_id: user?.id,
          course_id: courseId,
          progress: 0,
        })

      if (enrollError) throw enrollError

      toast({
        title: "Success",
        description: "Successfully enrolled in the course",
      })

      router.push(`/courses/${courseId}`)
    } catch (error) {
      console.error("Error enrolling in course:", error)
      toast({
        title: "Error",
        description: "Failed to enroll in course",
        variant: "destructive",
      })
    } finally {
      setEnrolling(false)
    }
  }

  if (loading || !course) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 max-w-4xl mx-auto space-y-8"
    >
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          <span className="gradient-text">Course Enrollment</span>
        </h1>
        <p className="text-muted-foreground">Review course details and enroll.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{course.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-muted-foreground">{course.description}</p>

          <div className="grid grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              <span className="text-sm">{course.duration}</span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-primary" />
              <span className="text-sm">{course.level}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              <span className="text-sm">25 enrolled</span>
            </div>
          </div>

          <div className="space-y-4 border-t pt-6">
            <h3 className="font-semibold">What You'll Learn</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-primary" />
                <span className="text-sm">Proper Quranic recitation techniques</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-primary" />
                <span className="text-sm">Essential Tajweed rules</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-primary" />
                <span className="text-sm">Memorization strategies</span>
              </li>
            </ul>
          </div>

          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button onClick={handleEnroll} disabled={enrolling}>
              {enrolling ? "Enrolling..." : "Enroll Now"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}