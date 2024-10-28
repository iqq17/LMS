"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Video, Users, Clock } from "lucide-react"
import { useRouter } from "next/navigation"

const sessions = [
  {
    id: "session-1",
    title: "Tajweed Fundamentals",
    time: "10:00 AM - 11:00 AM",
    students: [
      { name: "Ahmad M.", avatar: "https://i.pravatar.cc/150?u=ahmad" },
      { name: "Sarah K.", avatar: "https://i.pravatar.cc/150?u=sarah" },
      { name: "Omar R.", avatar: "https://i.pravatar.cc/150?u=omar" }
    ],
    type: "Group Session",
    status: "upcoming"
  },
  {
    id: "session-2",
    title: "Quran Memorization",
    time: "2:00 PM - 3:00 PM",
    students: [
      { name: "Fatima H.", avatar: "https://i.pravatar.cc/150?u=fatima" }
    ],
    type: "One-on-One",
    status: "upcoming"
  }
]

export function UpcomingSessions() {
  const router = useRouter()

  const handleJoinSession = (sessionId: string) => {
    router.push(`/classroom/${sessionId}`)
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Today's Sessions</CardTitle>
          <Button variant="outline" size="sm" onClick={() => router.push('/teacher/sessions')}>
            View Schedule
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[calc(100vh-20rem)]">
          <div className="px-6 space-y-4">
            {sessions.map((session) => (
              <div
                key={session.id}
                className="p-4 rounded-lg border bg-card hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Video className="h-6 w-6 text-primary" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold truncate">{session.title}</h3>
                      <span className="text-sm text-muted-foreground">{session.type}</span>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {session.time}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {session.students.length}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex -space-x-2">
                      {session.students.map((student, i) => (
                        <Avatar key={i} className="border-2 border-background w-8 h-8">
                          <AvatarImage src={student.avatar} />
                          <AvatarFallback>{student.name[0]}</AvatarFallback>
                        </Avatar>
                      ))}
                    </div>
                    <Button onClick={() => handleJoinSession(session.id)}>
                      Join
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}