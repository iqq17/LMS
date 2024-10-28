import { Metadata } from "next"
import { VideoPortal } from "@/components/video/VideoPortal"

export const metadata: Metadata = {
  title: "Live Session | Al'Raajih Quran Institute",
  description: "Interactive live Quran learning session",
}

interface VideoPortalPageProps {
  params: {
    sessionId: string
  }
}

export default function VideoPortalPage({ params }: VideoPortalPageProps) {
  return <VideoPortal sessionId={params.sessionId} />
}