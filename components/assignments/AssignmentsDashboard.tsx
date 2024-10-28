"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Clock, CheckCircle, AlertCircle } from "lucide-react"
import { Progress } from "@/components/ui/progress"

const assignments = [
  {
    id: 1,
    title: "Surah Al-Mulk Memorization",
    description: "Record yourself reciting Surah Al-Mulk with proper Tajweed",
    dueDate: "2024-03-20",
    status: "pending",
    progress: 60,
    type: "memorization"
  },
  {
    id: 2,
    title: "Tajweed Rules Practice",
    description: "Complete the exercises on Idgham and Ikhfa rules",
    dueDate: "2024-03-18",
    status: "completed",
    progress: 100,
    type: "practice"
  },
  {
    id: 3,
    title: "Arabic Vocabulary Quiz",
    description: "Test your understanding of Quranic Arabic vocabulary",
    dueDate: "2024-03-25",
    status: "pending",
    progress: 0,
    type: "assessment"
  }
]

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

export function AssignmentsDashboard() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="p-8 space-y-8"
    >
      <motion.div variants={item}>
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          <span className="gradient-text">Assignments</span>
        </h1>
        <p className="text-muted-foreground">Track and submit your learning assignments.</p>
      </motion.div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          <motion.div variants={container} className="grid gap-6">
            {assignments.map((assignment) => (
              <motion.div key={assignment.id} variants={item}>
                <Card className="hover-card-effect">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-6">
                      <div className={`h-16 w-16 rounded-full flex items-center justify-center ${
                        assignment.status === 'completed' 
                          ? 'bg-green-500/10' 
                          : 'bg-primary/10'
                      }`}>
                        <FileText className={`h-8 w-8 ${
                          assignment.status === 'completed'
                            ? 'text-green-500'
                            : 'text-primary'
                        }`} />
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold">{assignment.title}</h3>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">
                              Due {new Date(assignment.dueDate).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{assignment.description}</p>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Progress</span>
                            <span>{assignment.progress}%</span>
                          </div>
                          <Progress value={assignment.progress} className="h-2" />
                        </div>
                        <div className="flex gap-3 pt-2">
                          <Button>
                            {assignment.status === 'completed' ? 'View Submission' : 'Start Assignment'}
                          </Button>
                          {assignment.status !== 'completed' && (
                            <Button variant="outline">Save Draft</Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </TabsContent>

        <TabsContent value="pending">
          {/* Filter for pending assignments */}
        </TabsContent>

        <TabsContent value="completed">
          {/* Filter for completed assignments */}
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}