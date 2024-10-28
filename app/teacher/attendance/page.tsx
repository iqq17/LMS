import { Metadata } from "next"
import { AttendanceManagement } from "@/components/teacher/attendance/AttendanceManagement"
import { BackButton } from "@/components/navigation/BackButton"

export const metadata: Metadata = {
  title: "Attendance Management | Al'Raajih Quran Institute",
  description: "Track and manage student attendance",
}

export default function AttendancePage() {
  return (
    <div className="p-4">
      <BackButton />
      <AttendanceManagement />
    </div>
  )
}