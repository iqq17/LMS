"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  PlayCircle, Video, FileText, BookOpen
} from "lucide-react"
import { useRouter } from "next/navigation"

export function QuickActions() {
  const router = useRouter()

  const actions = [
    {
      icon: PlayCircle,
      label: "Continue Learning",
      description: "Resume your last lesson",
      onClick: () => router.push("/courses"),
      variant: "default" as const
    },
    {
      icon: Video,
      label: "Join Live Class",
      description: "Next class in 30 min",
      onClick: () => router.push("/classroom"),
      variant: "secondary" as const
    },
    {
      icon: FileText,
      label: "Assignments",
      description: "2 due soon",
      onClick: () => router.push("/assignments"),
      variant: "outline" as const
    },
    {
      icon: BookOpen,
      label: "Resources",
      description: "Access learning materials",
      onClick: () => router.push("/resources"),
      variant: "outline" as const
    }
  ]

  return (
    <Card className="p-4">
      <div className="grid gap-4 md:grid-cols-4">
        {actions.map((action, index) => (
          <Button
            key={index}
            variant={action.variant}
            className="h-auto py-4 flex-col gap-2"
            onClick={action.onClick}
          >
            <action.icon className="h-6 w-6" />
            <div className="space-y-1">
              <div className="font-semibold">{action.label}</div>
              <div className="text-xs opacity-90">{action.description}</div>
            </div>
          </Button>
        ))}
      </div>
    </Card>
  )
}