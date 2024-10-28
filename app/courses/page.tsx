import { Metadata } from "next"
import { CoursesList } from "@/components/courses/CoursesList"
import { mockStudentData } from "@/lib/preview-data"
import { BackButton } from "@/components/navigation/BackButton"

export const metadata: Metadata = {
  title: "My Courses | Al'Raajih Quran Institute",
  description: "Access your enrolled Quran courses and learning materials",
}

export default function CoursesPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="p-4">
        <BackButton />
        <CoursesList previewData={mockStudentData} />
      </div>
    </div>
  )
}