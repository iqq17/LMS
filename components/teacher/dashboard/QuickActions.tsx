"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Video, Users, FileText, Calendar,
  GraduationCap, UserCheck, PlayCircle, Plus, BookOpen 
} from "lucide-react"
import { NewSessionDialog } from "./NewSessionDialog"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { AttendanceSheet } from "../attendance/AttendanceSheet"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export function QuickActions() {
  const [showNewSession, setShowNewSession] = useState(false)
  const [showAttendance, setShowAttendance] = useState(false)
  const router = useRouter()

  // Active session - in a real app, this would come from your backend
  const activeSession = {
    id: "session-1",
    title: "Tajweed Class",
    students: 12,
    status: "live"
  }

  const primaryActions = [
    {
      icon: PlayCircle,
      label: activeSession ? "Join Active Class" : "No Active Class",
      description: activeSession ? `${activeSession.students} students waiting` : "Start a new session",
      onClick: () => activeSession && router.push(`/classroom/${activeSession.id}`),
      variant: "default" as const,
      disabled: !activeSession
    },
    {
      icon: UserCheck,
      label: "Take Attendance",
      description: "Mark attendance for current session",
      onClick: () => setShowAttendance(true),
      variant: "secondary" as const
    }
  ]

  const secondaryActions = [
    {
      icon: Video,
      label: "New Session",
      onClick: () => setShowNewSession(true),
      variant: "outline" as const
    },
    {
      icon: Users,
      label: "Students",
      href: "/teacher/students",
      variant: "outline" as const
    },
    {
      icon: BookOpen,
      label: "Resources",
      href: "/teacher/resources",
      variant: "outline" as const
    },
    {
      icon: FileText,
      label: "Assignments",
      href: "/teacher/assignments",
      variant: "outline" as const
    },
    {
      icon: Calendar,
      label: "Attendance",
      href: "/teacher/attendance",
      variant: "outline" as const
    }
  ]

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2">
        {/* Primary Actions */}
        <Card className="p-4">
          <div className="grid gap-4 md:grid-cols-2">
            {primaryActions.map((action, index) => (
              <Button
                key={index}
                variant={action.variant}
                className="h-auto py-4 flex-col gap-2"
                onClick={action.onClick}
                disabled={action.disabled}
              >
                <action.icon className="h-6 w-6" />
                <div className="space-y-1">
                  <div className="font-semibold">{action.label}</div>
                  <div className="text-xs opacity-90">{action.description}</div>
                </div>
              </Button>
            ))}
          </div>
        </Card>

        {/* Secondary Actions */}
        <Card className="p-4">
          <div className="grid grid-cols-5 gap-2">
            {secondaryActions.map((action, index) => (
              <Button
                key={index}
                variant={action.variant}
                className="h-auto py-4 flex-col gap-2"
                onClick={action.onClick}
                asChild={!action.onClick}
              >
                {action.onClick ? (
                  <>
                    <action.icon className="h-5 w-5" />
                    <span className="text-xs font-medium">{action.label}</span>
                  </>
                ) : (
                  <a href={action.href} className="flex flex-col items-center gap-2">
                    <action.icon className="h-5 w-5" />
                    <span className="text-xs font-medium">{action.label}</span>
                  </a>
                )}
              </Button>
            ))}
          </div>
        </Card>
      </div>

      {/* Dialogs */}
      <NewSessionDialog 
        open={showNewSession} 
        onOpenChange={setShowNewSession}
      />

      <Dialog open={showAttendance} onOpenChange={setShowAttendance}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Take Attendance</DialogTitle>
          </DialogHeader>
          <AttendanceSheet sessionId={activeSession?.id || ""} />
        </DialogContent>
      </Dialog>
    </>
  )
}