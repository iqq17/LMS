import { Metadata } from "next"
import { PremiumCourses } from "@/components/premium/PremiumCourses"

export const metadata: Metadata = {
  title: "Premium Courses | Al'Raajih Quran Institute",
  description: "Access exclusive premium Quran learning content",
}

export default function PremiumPage() {
  return <PremiumCourses />
}