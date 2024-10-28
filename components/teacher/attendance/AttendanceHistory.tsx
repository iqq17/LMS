"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Download, Filter } from "lucide-react"

const attendanceHistory = [
  {
    date: "2024-03-15",
    session: "Tajweed Class",
    students: [
      {
        name: "Ahmad Mohammed",
        avatar: "https://i.pravatar.cc/150?u=ahmad",
        status: "present"
      },
      {
        name: "Sarah Khan",
        avatar: "https://i.pravatar.cc/150?u=sarah",
        status: "absent"
      }
    ],
    totalPresent: 15,
    totalAbsent: 2,
    totalExcused: 1
  }
  // Add more history entries
]

export function AttendanceHistory() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search records..." className="pl-9" />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Records</SelectItem>
            <SelectItem value="present">Present Only</SelectItem>
            <SelectItem value="absent">Absent Only</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>

      <div className="space-y-4">
        {attendanceHistory.map((record, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold">{record.session}</h3>
                  <p className="text-sm text-muted-foreground">
                    {new Date(record.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-4 text-sm">
                  <span className="text-green-500">{record.totalPresent} Present</span>
                  <span className="text-red-500">{record.totalAbsent} Absent</span>
                  <span className="text-blue-500">{record.totalExcused} Excused</span>
                </div>
              </div>

              <div className="space-y-2">
                {record.students.map((student, studentIndex) => (
                  <div 
                    key={studentIndex}
                    className="flex items-center justify-between p-2 rounded-lg border"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={student.avatar} />
                        <AvatarFallback>{student.name[0]}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{student.name}</span>
                    </div>
                    <span className={`text-sm ${
                      student.status === 'present' ? 'text-green-500' :
                      student.status === 'absent' ? 'text-red-500' :
                      'text-blue-500'
                    }`}>
                      {student.status}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}