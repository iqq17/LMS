import { Metadata } from "next"
import { StudentManagement } from "@/components/teacher/StudentManagement"
import { BackButton } from "@/components/navigation/BackButton"

export const metadata: Metadata = {
  title: "Student Management | Al'Raajih Quran Institute",
  description: "Manage your students and track their progress",
}

export default function StudentManagementPage() {
  return (
    <div className="p-4">
      <BackButton />
      <StudentManagement />
    </div>
  )
}