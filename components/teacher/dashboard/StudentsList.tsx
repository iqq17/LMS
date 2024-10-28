"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

const students = [
  {
    id: 1,
    name: "Ahmad Mohammed",
    level: "Intermediate",
    progress: 75,
    lastActive: "2 hours ago",
    avatar: "https://i.pravatar.cc/150?u=ahmad",
    course: "Tajweed Fundamentals"
  },
  {
    id: 2,
    name: "Sarah Khan",
    level: "Advanced",
    progress: 85,
    lastActive: "1 hour ago",
    avatar: "https://i.pravatar.cc/150?u=sarah",
    course: "Quran Memorization"
  },
  {
    id: 3,
    name: "Omar Rahman",
    level: "Beginner",
    progress: 45,
    lastActive: "3 hours ago",
    avatar: "https://i.pravatar.cc/150?u=omar",
    course: "Arabic Basics"
  }
]

export function StudentsList() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Active Students</CardTitle>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search students..." className="pl-8" />
            </div>
            <Button variant="outline">View All</Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {students.map((student) => (
            <div
              key={student.id}
              className="flex items-center gap-4 p-4 rounded-lg border bg-card hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <Avatar className="h-10 w-10">
                <AvatarImage src={student.avatar} />
                <AvatarFallback>{student.name[0]}</AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-semibold truncate">{student.name}</h4>
                  <span className="text-sm text-muted-foreground">{student.level}</span>
                </div>
                
                <div className="text-sm text-muted-foreground mb-2">
                  {student.course} • Last active {student.lastActive}
                </div>
                
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Course Progress</span>
                    <span>{student.progress}%</span>
                  </div>
                  <Progress value={student.progress} className="h-2" />
                </div>
              </div>
              
              <Button variant="outline" size="sm">View Details</Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}