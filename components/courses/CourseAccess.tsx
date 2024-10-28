"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/lib/supabase/client"
import { useAuth } from "@/hooks/useAuth"

interface CourseAccessProps {
  courseId: string
  children: React.ReactNode
}

export function CourseAccess({ courseId, children }: CourseAccessProps) {
  const [hasAccess, setHasAccess] = useState(false)
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    checkAccess()
  }, [courseId, user])

  const checkAccess = async () => {
    try {
      if (!user) {
        router.push("/auth/login")
        return
      }

      const { data, error } = await supabase
        .from("enrollments")
        .select("*")
        .eq("student_id", user.id)
        .eq("course_id", courseId)
        .single()

      if (error && error.code !== "PGRST116") throw error
      
      if (!data) {
        toast({
          title: "Access Denied",
          description: "Please enroll in this course to access the content",
          variant: "destructive",
        })
        router.push(`/courses/enroll/${courseId}`)
        return
      }

      setHasAccess(true)
    } catch (error) {
      console.error("Error checking course access:", error)
      toast({
        title: "Error",
        description: "Failed to verify course access",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!hasAccess) {
    return null
  }

  return <>{children}</>
}