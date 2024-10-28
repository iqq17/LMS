"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Video, Clock, Users } from "lucide-react"
import { useRouter } from "next/navigation"

const events = [
  {
    id: 1,
    title: "Tajweed Class",
    instructor: "Sheikh Ahmad",
    time: "3:00 PM Today",
    participants: 12,
    type: "live"
  },
  {
    id: 2,
    title: "Memorization Session",
    instructor: "Sheikh Mohammed",
    time: "5:00 PM Today",
    participants: 8,
    type: "live"
  }
]

export function UpcomingEvents() {
  const router = useRouter()

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Upcoming Events</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px]">
          <div className="space-y-4">
            {events.map((event) => (
              <div
                key={event.id}
                className="p-4 rounded-lg border bg-card hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Video className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">{event.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      with {event.instructor}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {event.time}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {event.participants} joined
                    </div>
                  </div>
                  <Button 
                    size="sm"
                    onClick={() => router.push(`/classroom/${event.id}`)}
                  >
                    Join
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}