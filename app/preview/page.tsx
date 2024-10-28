"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { GraduationCap, BookOpen } from "lucide-react"

export default function PreviewPage() {
  const router = useRouter()

  const teacherPages = [
    { title: "Teacher Dashboard", path: "/teacher" },
    { title: "Manage Students", path: "/teacher/students" },
    { title: "Manage Courses", path: "/teacher/courses" },
    { title: "Grading", path: "/teacher/grading" },
    { title: "Teaching Resources", path: "/teacher/resources" },
  ]

  const studentPages = [
    { title: "Student Dashboard", path: "/student" },
    { title: "My Courses", path: "/courses" },
    { title: "Virtual Classroom", path: "/classroom" },
    { title: "Assignments", path: "/assignments" },
    { title: "My Progress", path: "/progress" },
    { title: "Learning Resources", path: "/resources" },
    { title: "Community", path: "/community" },
    { title: "Support", path: "/support" },
    { title: "Settings", path: "/settings" }
  ]

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold mb-8">
          <span className="gradient-text">LMS Preview</span>
        </h1>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Teacher Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <GraduationCap className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Teacher Interface</h2>
            </div>
            <div className="grid gap-3">
              {teacherPages.map((page) => (
                <Card key={page.path} className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{page.title}</h3>
                    <Button onClick={() => router.push(`${page.path}?preview=true`)}>
                      View
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Student Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Student Interface</h2>
            </div>
            <div className="grid gap-3">
              {studentPages.map((page) => (
                <Card key={page.path} className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{page.title}</h3>
                    <Button onClick={() => router.push(`${page.path}?preview=true`)}>
                      View
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <Button variant="outline" onClick={() => router.push("/")}>
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  )
}