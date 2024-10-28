"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { 
  Search, MessageSquare, FileText, HelpCircle, 
  ChevronRight, Mail, Phone, Video 
} from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

const faqs = [
  {
    question: "How do I join a live session?",
    answer: "Click on the 'Classroom' tab in the sidebar, find your scheduled session, and click 'Join Now'. Make sure to test your audio and video before joining."
  },
  {
    question: "What if I miss a session?",
    answer: "Don't worry! All sessions are recorded and available in your course materials. You can watch them at your convenience and still complete the assignments."
  },
  {
    question: "How can I track my progress?",
    answer: "Visit the 'Progress' section to view detailed analytics of your learning journey, including completed lessons, assignments, and assessment scores."
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

export function SupportCenter() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="p-8 space-y-8"
    >
      <motion.div variants={item}>
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          <span className="gradient-text">Support Center</span>
        </h1>
        <p className="text-muted-foreground">Get help and support for your learning journey.</p>
      </motion.div>

      <div className="max-w-2xl mx-auto">
        <motion.div variants={item}>
          <div className="relative mb-8">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search for help..." 
              className="pl-9"
            />
          </div>
        </motion.div>

        <Tabs defaultValue="faq" className="space-y-6">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="faq">FAQs</TabsTrigger>
            <TabsTrigger value="contact">Contact Us</TabsTrigger>
            <TabsTrigger value="ticket">Submit Ticket</TabsTrigger>
          </TabsList>

          <TabsContent value="faq">
            <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ScrollArea className="h-[400px] pr-4">
                  {faqs.map((faq, index) => (
                    <motion.div
                      key={index}
                      variants={item}
                      className="p-4 rounded-lg border mb-4 last:mb-0 hover:bg-accent transition-colors"
                    >
                      <div className="font-medium mb-2 flex items-center justify-between">
                        {faq.question}
                        <ChevronRight className="h-4 w-4" />
                      </div>
                      <p className="text-sm text-muted-foreground">{faq.answer}</p>
                    </motion.div>
                  ))}
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contact">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Mail className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium">Email Support</h3>
                          <p className="text-sm text-muted-foreground">
                            support@alraajih.com
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Phone className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium">Phone Support</h3>
                          <p className="text-sm text-muted-foreground">
                            +1 (234) 567-8900
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Video className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">Schedule a Support Call</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Book a video call with our support team
                        </p>
                        <Button>Schedule Call</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ticket">
            <Card>
              <CardHeader>
                <CardTitle>Submit Support Ticket</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Subject</label>
                  <Input placeholder="Brief description of your issue" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <select className="w-full rounded-md border border-input bg-background px-3 py-2">
                    <option>Technical Issue</option>
                    <option>Billing Question</option>
                    <option>Course Content</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <Textarea 
                    placeholder="Please provide details about your issue..."
                    className="min-h-[150px]"
                  />
                </div>
                <div className="flex justify-end">
                  <Button>Submit Ticket</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </motion.div>
  )
}