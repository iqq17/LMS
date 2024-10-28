"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Clock, Users, Video } from "lucide-react"

interface TeacherCalendarProps {
  selectedDate: Date
  onDateSelect: (date: Date | undefined) => void
}

export function TeacherCalendar({ selectedDate, onDateSelect }: TeacherCalendarProps) {
  // Example session data - in production, this would come from your backend
  const sessionDates = [
    new Date(2024, 2, 15),
    new Date(2024, 2, 18),
    new Date(2024, 2, 20)
  ]

  // Example sessions for the selected date
  const todaysSessions = [
    {
      id: 1,
      time: "10:00 AM",
      title: "Tajweed Fundamentals",
      students: 5,
      duration: "60 min"
    },
    {
      id: 2,
      time: "2:00 PM",
      title: "Quran Memorization",
      students: 1,
      duration: "45 min"
    }
  ]

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle>Teaching Schedule</CardTitle>
          <Badge variant="outline" className="bg-primary/10 text-primary">
            {todaysSessions.length} Today
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="px-4 pb-2">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={onDateSelect}
            className="rounded-md border"
            modifiers={{
              booked: sessionDates
            }}
            modifiersStyles={{
              booked: {
                fontWeight: "bold",
                backgroundColor: "hsl(var(--primary))",
                color: "white",
                borderRadius: "0.375rem"
              }
            }}
          />
        </div>
      </CardContent>
    </Card>
  )
}