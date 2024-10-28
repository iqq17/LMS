"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/hooks/useAuth"
import { 
  Search, FileText, Video, Headphones, 
  Download, BookOpen, Filter 
} from "lucide-react"

const resources = [
  {
    id: 1,
    title: "Tajweed Rules Guide",
    type: "pdf",
    description: "Comprehensive guide to Quranic pronunciation rules",
    size: "2.4 MB",
    downloadUrl: "#",
    category: "learning"
  },
  {
    id: 2,
    title: "Surah Al-Fatiha Recitation",
    type: "audio",
    description: "Professional recitation with proper Tajweed",
    size: "5.1 MB",
    downloadUrl: "#",
    category: "recitation"
  },
  {
    id: 3,
    title: "Arabic Letters Practice",
    type: "video",
    description: "Detailed tutorial on Arabic letter pronunciation",
    size: "45.2 MB",
    downloadUrl: "#",
    category: "practice"
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

export function ResourcesHub() {
  const [searchQuery, setSearchQuery] = useState("")
  const { isTeacher } = useAuth()

  const getIconForType = (type: string) => {
    switch (type) {
      case "pdf":
        return FileText
      case "video":
        return Video
      case "audio":
        return Headphones
      default:
        return BookOpen
    }
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="p-8 space-y-8"
    >
      <motion.div variants={item}>
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          <span className="gradient-text">Learning Resources</span>
        </h1>
        <p className="text-muted-foreground">
          Access and download learning materials for your Quranic studies
        </p>
      </motion.div>

      <motion.div variants={item} className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search resources..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
        {isTeacher && (
          <Button>
            Upload Resource
          </Button>
        )}
      </motion.div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All Resources</TabsTrigger>
          <TabsTrigger value="learning">Learning Materials</TabsTrigger>
          <TabsTrigger value="recitation">Recitations</TabsTrigger>
          <TabsTrigger value="practice">Practice Materials</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <motion.div variants={container} className="grid gap-6">
            {resources.map((resource) => {
              const Icon = getIconForType(resource.type)
              return (
                <motion.div key={resource.id} variants={item}>
                  <Card className="hover-card-effect">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-6">
                        <div className="h-16 w-16 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Icon className="h-8 w-8 text-primary" />
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold">{resource.title}</h3>
                            <span className="text-sm text-muted-foreground">
                              {resource.size}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {resource.description}
                          </p>
                        </div>
                        <Button variant="outline" size="icon">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </motion.div>
        </TabsContent>

        {/* Similar content for other tabs */}
      </Tabs>
    </motion.div>
  )
}