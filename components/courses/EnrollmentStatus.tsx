"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/lib/supabase/client"
import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

interface EnrollmentStatusProps {
  courseId: string
}

export function EnrollmentStatus({ courseId }: EnrollmentStatusProps) {
  const [isEnrolled, setIsEnrolled] = useState(false)
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    checkEnrollmentStatus()
  }, [courseId, user])

  const checkEnrollmentStatus = async () => {
    try {
      if (!user) return

      const { data, error } = await supabase
        .from("enrollments")
        .select("*")
        .eq("student_id", user.id)
        .eq("course_id", courseId)
        .single()

      if (error && error.code !== "PGRST116") throw error
      setIsEnrolled(!!data)
    } catch (error) {
      console.error("Error checking enrollment status:", error)
      toast({
        title: "Error",
        description: "Failed to check enrollment status",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Button disabled>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Checking status...
      </Button>
    )
  }

  if (isEnrolled) {
    return (
      <Button onClick={() => router.push(`/courses/${courseId}`)}>
        Continue Learning
      </Button>
    )
  }

  return (
    <Button onClick={() => router.push(`/courses/enroll/${courseId}`)}>
      Enroll Now
    </Button>
  )
}