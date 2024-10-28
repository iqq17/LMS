"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ResourceUploader } from "./ResourceUploader"
import { ResourceList } from "./ResourceList"

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

export function ResourceManagement() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      <motion.div variants={item}>
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          <span className="gradient-text">Resource Management</span>
        </h1>
        <p className="text-muted-foreground">Upload and manage learning resources</p>
      </motion.div>

      <Tabs defaultValue="upload" className="space-y-6">
        <TabsList>
          <TabsTrigger value="upload">Upload Resource</TabsTrigger>
          <TabsTrigger value="manage">Manage Resources</TabsTrigger>
        </TabsList>

        <TabsContent value="upload">
          <div className="grid gap-6 md:grid-cols-2">
            <ResourceUploader />
          </div>
        </TabsContent>

        <TabsContent value="manage">
          <ResourceList />
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}