"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { Search, FileText, Video, Headphones, Download, Trash2, Edit } from "lucide-react"
import { supabase } from "@/lib/supabase/client"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Resource {
  id: string
  title: string
  description: string
  type: string
  url: string
  size: number
  created_at: string
}

export function ResourcesList() {
  const [resources, setResources] = useState<Resource[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    fetchResources()
  }, [])

  const fetchResources = async () => {
    try {
      const { data, error } = await supabase
        .from('resources')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setResources(data || [])
    } catch (error) {
      console.error("Error fetching resources:", error)
      toast({
        title: "Error",
        description: "Failed to load resources",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('resources')
        .delete()
        .eq('id', id)

      if (error) throw error

      setResources(resources.filter(r => r.id !== id))
      toast({
        title: "Success",
        description: "Resource deleted successfully"
      })
    } catch (error) {
      console.error("Error deleting resource:", error)
      toast({
        title: "Error",
        description: "Failed to delete resource",
        variant: "destructive"
      })
    }
  }

  const getIconForType = (type: string) => {
    switch (type) {
      case "pdf":
        return FileText
      case "video":
        return Video
      case "audio":
        return Headphones
      default:
        return FileText
    }
  }

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    if (bytes === 0) return '0 Byte'
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)).toString())
    return Math.round((bytes / Math.pow(1024, i))) + ' ' + sizes[i]
  }

  const filteredResources = resources.filter(resource =>
    resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    resource.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search resources..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      <ScrollArea className="h-[calc(100vh-20rem)]">
        <div className="space-y-4">
          {filteredResources.map((resource) => {
            const Icon = getIconForType(resource.type)
            return (
              <Card key={resource.id} className="hover-card-effect">
                <CardContent className="p-6">
                  <div className="flex items-center gap-6">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <h3 className="font-semibold">{resource.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {resource.description}
                      </p>
                      <div className="text-xs text-muted-foreground">
                        {formatFileSize(resource.size)} • Uploaded {new Date(resource.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => window.open(resource.url, '_blank')}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDelete(resource.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}

          {filteredResources.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No resources found
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}