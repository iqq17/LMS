"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useTeacherStudents } from "@/hooks/useTeacherStudents"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export function StudentOverview() {
  const { students, loading, error } = useTeacherStudents()
  const router = useRouter()

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "online":
        return "bg-green-500"
      case "in session":
        return "bg-blue-500"
      case "inactive":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  if (loading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Student Overview</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="px-6 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-3 rounded-lg border">
                <div className="flex items-center gap-3 mb-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-[150px]" />
                    <Skeleton className="h-3 w-[100px]" />
                  </div>
                </div>
                <Skeleton className="h-2 w-full mt-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="h-full">
        <CardContent className="p-6">
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">{error}</p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Student Overview</CardTitle>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => router.push('/teacher/students')}
        >
          View All
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[calc(100vh-20rem)]">
          <div className="px-6 space-y-4">
            {students.map((student) => (
              <div
                key={student.id}
                className="p-3 rounded-lg border bg-card hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer"
                onClick={() => router.push(`/teacher/student/${student.student.id}`)}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="relative">
                    <Avatar>
                      <AvatarImage src={student.student.avatar_url} />
                      <AvatarFallback>
                        {student.student.first_name[0]}
                        {student.student.last_name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <span 
                      className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background ${getStatusColor(student.status)}`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium truncate">
                        {student.student.first_name} {student.student.last_name}
                      </p>
                      <Badge variant="secondary" className="ml-2">
                        {student.status}
                      </Badge>
                    </div>
                    {student.courses[0] && (
                      <p className="text-sm text-muted-foreground">
                        Current: {student.courses[0].title}
                      </p>
                    )}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Overall Progress</span>
                    <span>
                      {student.courses.reduce((acc, course) => acc + course.progress, 0) / 
                       student.courses.length || 0}%
                    </span>
                  </div>
                  <Progress 
                    value={
                      student.courses.reduce((acc, course) => acc + course.progress, 0) / 
                      student.courses.length || 0
                    } 
                    className="h-2" 
                  />
                </div>
                {student.attendance && (
                  <div className="mt-2 flex gap-2 text-xs text-muted-foreground">
                    <span>{student.attendance.present} Present</span>
                    <span>•</span>
                    <span>{student.attendance.absent} Absent</span>
                    <span>•</span>
                    <span>{student.attendance.late} Late</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}