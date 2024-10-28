import { Metadata } from "next"
import { ReportsDashboard } from "@/components/teacher/reports/ReportsDashboard"
import { BackButton } from "@/components/navigation/BackButton"

export const metadata: Metadata = {
  title: "Reports | Al'Raajih Quran Institute",
  description: "Generate and view student reports",
}

export default function ReportsPage() {
  return (
    <div className="p-4">
      <BackButton />
      <ReportsDashboard />
    </div>
  )
}