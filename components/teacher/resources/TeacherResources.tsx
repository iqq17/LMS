"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ResourceUpload } from "./ResourceUpload"
import { ResourcesList } from "./ResourcesList"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

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

export function TeacherResources() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="p-8 space-y-8"
    >
      <motion.div variants={item}>
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          <span className="gradient-text">Resources Management</span>
        </h1>
        <p className="text-muted-foreground">
          Upload and manage learning materials for your students
        </p>
      </motion.div>

      <Tabs defaultValue="upload" className="space-y-6">
        <TabsList>
          <TabsTrigger value="upload">Upload Resource</TabsTrigger>
          <TabsTrigger value="manage">Manage Resources</TabsTrigger>
        </TabsList>

        <TabsContent value="upload">
          <ResourceUpload />
        </TabsContent>

        <TabsContent value="manage">
          <ResourcesList />
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}