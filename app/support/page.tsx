import { Metadata } from "next"
import { SupportCenter } from "@/components/support/SupportCenter"
import { BackButton } from "@/components/navigation/BackButton"

export const metadata: Metadata = {
  title: "Support | Al'Raajih Quran Institute",
  description: "Get help and support for your learning journey",
}

export default function SupportPage() {
  return (
    <div className="p-4">
      <BackButton />
      <SupportCenter />
    </div>
  )
}