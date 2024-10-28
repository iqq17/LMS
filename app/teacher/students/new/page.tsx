import { Metadata } from "next"
import { NewStudentForm } from "@/components/teacher/NewStudentForm"

export const metadata: Metadata = {
  title: "Add New Student | Al'Raajih Quran Institute",
  description: "Add a new student to your teaching roster",
}

export default function NewStudentPage() {
  return <NewStudentForm />
}