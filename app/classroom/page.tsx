import { Metadata } from "next"
import { ClassroomList } from "@/components/classroom/ClassroomList"
import { BackButton } from "@/components/navigation/BackButton"

export const metadata: Metadata = {
  title: "Classroom | Al'Raajih Quran Institute",
  description: "Join your virtual Quran learning sessions",
}

export default function ClassroomPage() {
  return (
    <div className="p-4">
      <BackButton />
      <ClassroomList />
    </div>
  )
}