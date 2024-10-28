"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GenerateReport } from "./GenerateReport"
import { ReportHistory } from "./ReportHistory"

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

export function ReportsDashboard() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="p-8 space-y-8"
    >
      <motion.div variants={item}>
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          <span className="gradient-text">Reports</span>
        </h1>
        <p className="text-muted-foreground">Generate and manage student reports</p>
      </motion.div>

      <Tabs defaultValue="generate" className="space-y-6">
        <TabsList>
          <TabsTrigger value="generate">Generate Report</TabsTrigger>
          <TabsTrigger value="history">Report History</TabsTrigger>
        </TabsList>

        <TabsContent value="generate">
          <div className="grid gap-6 md:grid-cols-2">
            <GenerateReport />
            
            <Card>
              <CardHeader>
                <CardTitle>Report Preview</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Add report preview component */}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history">
          <ReportHistory />
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}