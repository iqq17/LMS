import { Metadata } from "next"
import { StudentResources } from "@/components/resources/StudentResources"

export const metadata: Metadata = {
  title: "Learning Resources | Al'Raajih Quran Institute",
  description: "Access your Quran learning materials and resources",
}

export default function ResourcesPage() {
  return <StudentResources />
}