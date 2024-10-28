import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Student Portal | Al'Raajih Quran Institute",
  description: "Access your Quranic learning resources and track your progress",
}

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  )
}