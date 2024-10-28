import { Metadata } from "next"
import { AssignmentsDashboard } from "@/components/assignments/AssignmentsDashboard"
import { BackButton } from "@/components/navigation/BackButton"

export const metadata: Metadata = {
  title: "Assignments | Al'Raajih Quran Institute",
  description: "Manage and submit your Quran learning assignments",
}

export default function AssignmentsPage() {
  return (
    <div className="p-4">
      <BackButton />
      <AssignmentsDashboard />
    </div>
  )
}