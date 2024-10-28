"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { FileText, Clock } from "lucide-react"
import { useRouter } from "next/navigation"

const assignments = [
  {
    id: 1,
    title: "Surah Al-Mulk Recitation",
    dueDate: "2024-03-20",
    status: "pending",
    type: "recitation"
  },
  {
    id: 2,
    title: "Tajweed Rules Quiz",
    dueDate: "2024-03-18",
    status: "completed",
    type: "quiz"
  },
  {
    id: 3,
    title: "Arabic Vocabulary Practice",
    dueDate: "2024-03-25",
    status: "pending",
    type: "practice"
  }
]

export function AssignmentsList() {
  const router = useRouter()

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/10 text-green-500 hover:bg-green-500/20"
      case "pending":
        return "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20"
      default:
        return "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20"
    }
  }

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Assignments</CardTitle>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => router.push('/assignments')}
        >
          View All
        </Button>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px]">
          <div className="space-y-4">
            {assignments.map((assignment) => (
              <div
                key={assignment.id}
                className="p-4 rounded-lg border bg-card hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-primary" />
                    <div>
                      <h4 className="font-medium">{assignment.title}</h4>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        Due: {new Date(assignment.dueDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <Badge className={getStatusColor(assignment.status)}>
                    {assignment.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}