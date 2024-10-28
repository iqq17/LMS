import { Metadata } from "next"
import { StudentProgress } from "@/components/progress/StudentProgress"
import { BackButton } from "@/components/navigation/BackButton"

export const metadata: Metadata = {
  title: "My Progress | Al'Raajih Quran Institute",
  description: "Track your Quran learning progress and achievements",
}

export default function ProgressPage() {
  return (
    <div className="p-4">
      <BackButton />
      <StudentProgress />
    </div>
  )
}