"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Video, Clock, Users } from "lucide-react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"

export function NextLessonCard() {
  const router = useRouter()
  const sessionId = "next-session-1" // This would typically come from your data

  const handleJoinSession = () => {
    router.push(`/classroom/${sessionId}`)
  }

  return (
    <Card className="hover-card-effect overflow-hidden">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6 items-center">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring" }}
            className="relative"
          >
            <div className="w-48 h-48 rounded-2xl overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1609599006353-e629aaabfeae?q=80&w=200&h=200&fit=crop" 
                alt="Quran Session"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-2xl" />
          </motion.div>

          <div className="flex-1 space-y-4">
            <div>
              <h3 className="text-2xl font-bold gradient-text">Next Live Session</h3>
              <p className="text-muted-foreground">Advanced Tajweed Rules: Al-Madd</p>
            </div>

            <div className="flex gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                <span className="text-sm">Today, 3:00 PM</span>
              </div>
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4 text-primary" />
                <span className="text-sm">Live Session</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />
                <span className="text-sm">12 Students</span>
              </div>
            </div>

            <div className="flex gap-3">
              <Button onClick={handleJoinSession}>
                Join Session
              </Button>
              <Button variant="outline" onClick={() => router.push(`/classroom/${sessionId}/details`)}>
                View Details
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}