import { Metadata } from "next"
import { TeacherDashboard } from "@/components/teacher/TeacherDashboard"

export const metadata: Metadata = {
  title: "Teacher Dashboard | Al'Raajih Quran Institute",
  description: "Manage your classes, students, and schedules",
}

export default function TeacherDashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <TeacherDashboard />
    </div>
  )
}