"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/components/ui/use-toast"
import { Search, Save, UserCheck, UserX, Clock, AlertCircle } from "lucide-react"
import { useAttendance } from "@/hooks/useAttendance"
import { useTeacherStudents } from "@/hooks/useTeacherStudents"

interface AttendanceSheetProps {
  sessionId: string
}

export function AttendanceSheet({ sessionId }: AttendanceSheetProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [saving, setSaving] = useState(false)
  const { attendance, loading, markBulkAttendance } = useAttendance(sessionId)
  const { students } = useTeacherStudents()
  const { toast } = useToast()

  const [attendanceState, setAttendanceState] = useState<Record<string, {
    status: 'present' | 'absent' | 'excused' | 'late'
    notes?: string
  }>>({})

  // Initialize attendance state from existing records
  useState(() => {
    const initialState: Record<string, any> = {}
    attendance.forEach(record => {
      initialState[record.student.id] = {
        status: record.status,
        notes: record.notes
      }
    })
    setAttendanceState(initialState)
  })

  const handleStatusChange = (studentId: string, status: 'present' | 'absent' | 'excused' | 'late') => {
    setAttendanceState(prev => ({
      ...prev,
      [studentId]: { ...prev[studentId], status }
    }))
  }

  const handleNotesChange = (studentId: string, notes: string) => {
    setAttendanceState(prev => ({
      ...prev,
      [studentId]: { ...prev[studentId], notes }
    }))
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      
      const records = Object.entries(attendanceState).map(([studentId, data]) => ({
        studentId,
        status: data.status,
        notes: data.notes
      }))

      await markBulkAttendance(records)

      toast({
        title: "Success",
        description: "Attendance saved successfully",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save attendance",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const filteredStudents = students.filter(student => 
    `${student.student.first_name} ${student.student.last_name}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  )

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'present':
        return <UserCheck className="h-4 w-4 text-green-500" />
      case 'absent':
        return <UserX className="h-4 w-4 text-red-500" />
      case 'late':
        return <Clock className="h-4 w-4 text-yellow-500" />
      case 'excused':
        return <AlertCircle className="h-4 w-4 text-blue-500" />
      default:
        return null
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Attendance Sheet</CardTitle>
        <Button onClick={handleSave} disabled={saving}>
          <Save className="h-4 w-4 mr-2" />
          {saving ? "Saving..." : "Save Attendance"}
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search students..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <div className="space-y-2">
            {filteredStudents.map((student) => (
              <div
                key={student.student.id}
                className="flex items-center gap-4 p-4 rounded-lg border bg-card hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <Avatar>
                  <AvatarImage src={student.student.avatar_url} />
                  <AvatarFallback>
                    {student.student.first_name[0]}
                    {student.student.last_name[0]}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <div className="font-medium">
                    {student.student.first_name} {student.student.last_name}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <Select
                    value={attendanceState[student.student.id]?.status || ""}
                    onValueChange={(value: any) => handleStatusChange(student.student.id, value)}
                  >
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="present">Present</SelectItem>
                      <SelectItem value="absent">Absent</SelectItem>
                      <SelectItem value="late">Late</SelectItem>
                      <SelectItem value="excused">Excused</SelectItem>
                    </SelectContent>
                  </Select>

                  <Input
                    placeholder="Notes"
                    value={attendanceState[student.student.id]?.notes || ""}
                    onChange={(e) => handleNotesChange(student.student.id, e.target.value)}
                    className="w-[200px]"
                  />

                  {getStatusIcon(attendanceState[student.student.id]?.status)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}