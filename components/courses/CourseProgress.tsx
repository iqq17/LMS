"use client"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { PlayCircle, CheckCircle, FileText } from "lucide-react"
import { cn } from "@/lib/utils"

interface Module {
  id: number
  title: string
  lessons: Lesson[]
}

interface Lesson {
  id: string
  title: string
  duration: string
  completed: boolean
  type: "video" | "practice"
}

interface CourseProgressProps {
  modules: Module[]
  activeLesson: Lesson
  onSelectLesson: (lesson: Lesson) => void
}

export function CourseProgress({
  modules,
  activeLesson,
  onSelectLesson
}: CourseProgressProps) {
  return (
    <ScrollArea className="h-[calc(100vh-20rem)]">
      <div className="space-y-6 p-6">
        {modules.map((module) => (
          <div key={module.id} className="space-y-2">
            <h3 className="font-semibold text-sm text-muted-foreground">
              {module.title}
            </h3>
            <div className="space-y-2">
              {module.lessons.map((lesson) => (
                <Button
                  key={lesson.id}
                  variant={activeLesson.id === lesson.id ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-2",
                    activeLesson.id === lesson.id && "bg-secondary"
                  )}
                  onClick={() => onSelectLesson(lesson)}
                >
                  {lesson.completed ? (
                    <CheckCircle className="h-4 w-4 text-primary" />
                  ) : lesson.type === "video" ? (
                    <PlayCircle className="h-4 w-4" />
                  ) : (
                    <FileText className="h-4 w-4" />
                  )}
                  <div className="flex-1 text-left">
                    <div className="text-sm">{lesson.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {lesson.duration}
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}