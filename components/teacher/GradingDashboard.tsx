"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, CheckCircle, Clock } from "lucide-react"

const assignments = [
  {
    id: 1,
    student: "Ahmad Mohammed",
    title: "Surah Al-Mulk Recitation",
    type: "Memorization",
    submittedAt: "2024-03-15",
    status: "pending"
  },
  {
    id: 2,
    student: "Sarah Khan",
    title: "Tajweed Rules Practice",
    type: "Practice",
    submittedAt: "2024-03-14",
    status: "pending"
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

export function GradingDashboard() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="p-8 space-y-8"
    >
      <motion.div variants={item}>
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          <span className="gradient-text">Assignment Grading</span>
        </h1>
        <p className="text-muted-foreground">Review and grade student submissions.</p>
      </motion.div>

      <Tabs defaultValue="pending" className="space-y-6">
        <TabsList>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="graded">Graded</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-6">
          {assignments.map(assignment => (
            <motion.div key={assignment.id} variants={item}>
              <Card className="hover-card-effect">
                <CardContent className="p-6">
                  <div className="flex items-center gap-6">
                    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                      <FileText className="h-8 w-8 text-primary" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">{assignment.title}</h3>
                          <p className="text-sm text-muted-foreground">by {assignment.student}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">{assignment.type}</div>
                          <div className="text-sm text-muted-foreground">
                            Submitted {new Date(assignment.submittedAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button>Grade Assignment</Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Grade Assignment</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <div className="space-y-2">
                                <Label>Score</Label>
                                <Select>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select score" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="excellent">Excellent (A)</SelectItem>
                                    <SelectItem value="good">Good (B)</SelectItem>
                                    <SelectItem value="fair">Fair (C)</SelectItem>
                                    <SelectItem value="needs-improvement">Needs Improvement (D)</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-2">
                                <Label>Feedback</Label>
                                <Textarea placeholder="Provide detailed feedback..." />
                              </div>
                            </div>
                            <div className="flex justify-end gap-3">
                              <Button variant="outline">Save Draft</Button>
                              <Button>Submit Grade</Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button variant="outline">View Submission</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </TabsContent>

        <TabsContent value="graded">
          {/* Similar structure for graded assignments */}
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}