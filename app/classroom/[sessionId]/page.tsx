import { Metadata } from "next"
import { ClassroomSession } from "@/components/classroom/ClassroomSession"

export const metadata: Metadata = {
  title: "Virtual Classroom | Al'Raajih Quran Institute",
  description: "Join your Quran learning session",
}

interface ClassroomPageProps {
  params: {
    sessionId: string
  }
}

export default function ClassroomPage({ params }: ClassroomPageProps) {
  return <ClassroomSession sessionId={params.sessionId} />
}