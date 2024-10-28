"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Search, GraduationCap, BookOpen, Award, Plus } from "lucide-react"
import { supabase } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import type { Profile } from "@/lib/supabase/types"

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

export function StudentManagement() {
  const [students, setStudents] = useState<Profile[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchStudents()
  }, [])

  const fetchStudents = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("role", "student")

      if (error) throw error
      setStudents(data || [])
    } catch (error) {
      console.error("Error fetching students:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredStudents = students.filter(student =>
    `${student.first_name} ${student.last_name}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  )

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="p-8 space-y-8"
    >
      <motion.div variants={item}>
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          <span className="gradient-text">Student Management</span>
        </h1>
        <p className="text-muted-foreground">Track and manage your students' progress.</p>
      </motion.div>

      <motion.div variants={item} className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search students..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button onClick={() => router.push("/teacher/student/new")}>
          <Plus className="h-4 w-4 mr-2" />
          Add Student
        </Button>
      </motion.div>

      <motion.div variants={container} className="grid gap-6">
        {loading ? (
          <Card className="p-8">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          </Card>
        ) : filteredStudents.length === 0 ? (
          <Card className="p-8">
            <div className="text-center text-muted-foreground">
              No students found. Add your first student to get started.
            </div>
          </Card>
        ) : (
          filteredStudents.map((student) => (
            <motion.div key={student.id} variants={item}>
              <Card className="hover-card-effect">
                <CardContent className="p-6">
                  <div className="flex items-center gap-6">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={student.avatar_url || ""} />
                      <AvatarFallback>
                        {student.first_name?.[0]}{student.last_name?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <h3 className="font-semibold">
                        {student.first_name} {student.last_name}
                      </h3>
                      <div className="text-sm text-muted-foreground">
                        Enrolled in 3 courses
                      </div>
                      <div className="grid grid-cols-3 gap-4 mt-4">
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-primary" />
                          <div className="text-sm">
                            <div className="font-medium">Progress</div>
                            <div className="text-muted-foreground">75%</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <GraduationCap className="h-4 w-4 text-primary" />
                          <div className="text-sm">
                            <div className="font-medium">Level</div>
                            <div className="text-muted-foreground">
                              {student.level || "Not set"}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Award className="h-4 w-4 text-primary" />
                          <div className="text-sm">
                            <div className="font-medium">Achievements</div>
                            <div className="text-muted-foreground">12 badges</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Button onClick={() => router.push(`/teacher/student/${student.id}`)}>
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </motion.div>
    </motion.div>
  )
}