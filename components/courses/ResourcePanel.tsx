"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Download, PlayCircle, FileAudio } from "lucide-react"

const resources = [
  {
    id: 1,
    title: "Lesson Notes - Noon Sakinah Rules",
    type: "pdf",
    size: "2.4 MB",
    icon: FileText
  },
  {
    id: 2,
    title: "Practice Audio - Surah Al-Fatiha",
    type: "audio",
    size: "5.1 MB",
    icon: FileAudio
  },
  {
    id: 3,
    title: "Supplementary Video - Common Mistakes",
    type: "video",
    size: "45.2 MB",
    icon: PlayCircle
  }
]

export function ResourcePanel() {
  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        {resources.map((resource) => {
          const Icon = resource.icon
          return (
            <div
              key={resource.id}
              className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">{resource.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {resource.type.toUpperCase()} • {resource.size}
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="icon">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}