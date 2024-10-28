"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ResourceUpload } from "./ResourceUpload"
import { ResourcesList } from "./ResourcesList"
import { ResourceSearch } from "./ResourceSearch"

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

export function ResourcesManagement() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState<string | null>(null)

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

      <Tabs defaultValue="browse" className="space-y-6">
        <TabsList>
          <TabsTrigger value="browse">Browse Resources</TabsTrigger>
          <TabsTrigger value="upload">Upload Resource</TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="space-y-6">
          <ResourceSearch 
            onSearch={setSearchQuery} 
            onTypeChange={setSelectedType}
          />
          <ResourcesList 
            searchQuery={searchQuery}
            type={selectedType || undefined}
          />
        </TabsContent>

        <TabsContent value="upload">
          <ResourceUpload />
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}