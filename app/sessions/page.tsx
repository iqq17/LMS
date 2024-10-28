import { Metadata } from "next"
import { LiveSessions } from "@/components/sessions/LiveSessions"

export const metadata: Metadata = {
  title: "Live Sessions | Al'Raajih Quran Institute",
  description: "Join live Quran learning sessions with expert instructors",
}

export default function SessionsPage() {
  return <LiveSessions />
}