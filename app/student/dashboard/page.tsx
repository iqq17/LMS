import { Metadata } from "next"
import { StudentDashboard } from "@/components/student/StudentDashboard"

export const metadata: Metadata = {
  title: "Student Dashboard | Al'Raajih Quran Institute",
  description: "Track your Quranic learning journey",
}

export default function StudentDashboardPage() {
  return <StudentDashboard />
}