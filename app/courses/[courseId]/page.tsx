import { Metadata } from "next"
import { CourseContent } from "@/components/courses/CourseContent"

export const metadata: Metadata = {
  title: "Course Content | Al'Raajih Quran Institute",
  description: "Premium Quran learning experience with expert instruction",
}

interface CoursePageProps {
  params: {
    courseId: string
  }
}

export default function CoursePage({ params }: CoursePageProps) {
  return <CourseContent courseId={params.courseId} />
}