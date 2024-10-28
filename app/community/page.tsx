import { Metadata } from "next"
import { CommunityHub } from "@/components/community/CommunityHub"
import { BackButton } from "@/components/navigation/BackButton"

export const metadata: Metadata = {
  title: "Community | Al'Raajih Quran Institute",
  description: "Connect with fellow students and participate in study circles",
}

export default function CommunityPage() {
  return (
    <div className="p-4">
      <BackButton />
      <CommunityHub />
    </div>
  )
}