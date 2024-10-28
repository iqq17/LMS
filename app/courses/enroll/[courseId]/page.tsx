import { Metadata } from "next"
import { CourseEnrollment } from "@/components/courses/CourseEnrollment"

export const metadata: Metadata = {
  title: "Course Enrollment | Al'Raajih Quran Institute",
  description: "Enroll in a Quran learning course",
}

interface CourseEnrollmentPageProps {
  params: {
    courseId: string
  }
}

export default function CourseEnrollmentPage({ params }: CourseEnrollmentPageProps) {
  return <CourseEnrollment courseId={params.courseId} />
}