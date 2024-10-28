import { Metadata } from "next"
import { TeacherCourses } from "@/components/teacher/TeacherCourses"
import { BackButton } from "@/components/navigation/BackButton"

export const metadata: Metadata = {
  title: "Manage Courses | Al'Raajih Quran Institute",
  description: "Create and manage your Quran courses",
}

export default function TeacherCoursesPage() {
  return (
    <div className="p-4">
      <BackButton />
      <TeacherCourses />
    </div>
  )
}