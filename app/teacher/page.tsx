import { Metadata } from "next"
import { TeacherDashboard } from "@/components/teacher/TeacherDashboard"

export const metadata: Metadata = {
  title: "Teacher Dashboard | Al'Raajih Quran Institute",
  description: "Manage your classes, students, and schedules",
}

// Temporarily bypass auth for preview
const mockTeacherData = {
  user: {
    id: "mock-teacher-id",
    email: "sheikh.ahmad@alraajih.com",
  },
  profile: {
    first_name: "Sheikh",
    last_name: "Ahmad",
    role: "teacher",
    avatar_url: "https://i.pravatar.cc/150?u=sheikh.ahmad"
  }
}

export default function TeacherPage() {
  return (
    <div className="min-h-screen bg-background">
      <TeacherDashboard previewData={mockTeacherData} />
    </div>
  )
}