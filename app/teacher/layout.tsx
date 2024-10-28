import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Teacher Portal | Al'Raajih Quran Institute",
  description: "Manage your classes and students",
}

export default function TeacherLayout({
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