import { Metadata } from "next"
import { TeacherResources } from "@/components/teacher/resources/TeacherResources"
import { BackButton } from "@/components/navigation/BackButton"

export const metadata: Metadata = {
  title: "Manage Resources | Al'Raajih Quran Institute",
  description: "Upload and manage learning resources for your students",
}

export default function TeacherResourcesPage() {
  return (
    <div className="p-4">
      <BackButton />
      <TeacherResources />
    </div>
  )
}