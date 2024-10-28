import { Metadata } from "next"
import { NewStudentForm } from "@/components/teacher/NewStudentForm"
import { BackButton } from "@/components/navigation/BackButton"

export const metadata: Metadata = {
  title: "Add New Student | Al'Raajih Quran Institute",
  description: "Add a new student to your teaching roster",
}

export default function NewStudentPage() {
  return (
    <div className="p-4">
      <BackButton fallbackPath="/teacher/students" />
      <NewStudentForm />
    </div>
  )
}