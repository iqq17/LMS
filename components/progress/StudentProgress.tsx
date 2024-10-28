"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Award, BookOpen, Clock, Target } from "lucide-react"

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

const achievements = [
  {
    id: 1,
    title: "10-Day Streak",
    description: "Completed lessons for 10 consecutive days",
    icon: Target,
    date: "March 15, 2024"
  },
  {
    id: 2,
    title: "First Juz Complete",
    description: "Successfully memorized Juz Amma",
    icon: Award,
    date: "March 10, 2024"
  },
  {
    id: 3,
    title: "Tajweed Master",
    description: "Completed all basic Tajweed rules",
    icon: BookOpen,
    date: "March 5, 2024"
  }
]

export function StudentProgress() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="p-8 space-y-8"
    >
      <motion.div variants={item}>
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          <span className="gradient-text">My Progress</span>
        </h1>
        <p className="text-muted-foreground">Track your learning journey and achievements.</p>
      </motion.div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <motion.div variants={item}>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Study Hours</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">86.5</div>
                  <p className="text-xs text-muted-foreground">
                    +12.5 hours this month
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <motion.div variants={item}>
            <Card>
              <CardHeader>
                <CardTitle>Course Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Reuse ProgressOverview component */}
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-6">
          <motion.div
            variants={container}
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {achievements.map((achievement) => {
              const Icon = achievement.icon
              return (
                <motion.div key={achievement.id} variants={item}>
                  <Card className="hover-card-effect">
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <div className="space-y-1">
                          <h3 className="font-semibold">{achievement.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {achievement.description}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Earned on {achievement.date}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </motion.div>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Learning Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Add learning analytics visualization here */}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}