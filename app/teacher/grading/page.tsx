import { Metadata } from "next"
import { GradingDashboard } from "@/components/teacher/GradingDashboard"
import { BackButton } from "@/components/navigation/BackButton"

export const metadata: Metadata = {
  title: "Grading | Al'Raajih Quran Institute",
  description: "Grade student assignments and track progress",
}

export default function GradingPage() {
  return (
    <div className="p-4">
      <BackButton />
      <GradingDashboard />
    </div>
  )
}