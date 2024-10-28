"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/lib/supabase/client"
import { Search, Download, Trash2, FileText, Video, Music, Image, FilePresentation } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface Resource {
  id: string
  title: string
  description: string
  type: string
  category: string
  url: string
  file_name: string
  file_size: number
  file_type: string
  created_at: string
}

export function ResourceList() {
  const [resources, setResources] = useState<Resource[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState("all")
  const [deleteId, setDeleteId] = useState<string | null>(null)
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
      console.error('Error fetching resources:', error)
      toast({
        title: "Error",
        description: "Failed to load resources",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return

    try {
      const resource = resources.find(r => r.id === deleteId)
      if (!resource) return

      // Delete from storage
      const filePath = new URL(resource.url).pathname.split('/').pop()
      if (filePath) {
        const { error: storageError } = await supabase.storage
          .from('resources')
          .remove([`resources/${resource.category}/${filePath}`])

        if (storageError) throw storageError
      }

      // Delete from database
      const { error: dbError } = await supabase
        .from('resources')
        .delete()
        .eq('id', deleteId)

      if (dbError) throw dbError

      setResources(resources.filter(r => r.id !== deleteId))
      toast({
        title: "Success",
        description: "Resource deleted successfully",
      })
    } catch (error) {
      console.error('Error deleting resource:', error)
      toast({
        title: "Error",
        description: "Failed to delete resource",
        variant: "destructive",
      })
    } finally {
      setDeleteId(null)
    }
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'document':
        return FileText
      case 'video':
        return Video
      case 'audio':
        return Music
      case 'presentation':
        return FilePresentation
      case 'image':
        return Image
      default:
        return FileText
    }
  }

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = selectedType === 'all' || resource.type === selectedType
    return matchesSearch && matchesType
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search resources..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="document">Documents</SelectItem>
            <SelectItem value="video">Videos</SelectItem>
            <SelectItem value="audio">Audio</SelectItem>
            <SelectItem value="presentation">Presentations</SelectItem>
            <SelectItem value="image">Images</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        {filteredResources.map((resource) => {
          const Icon = getIcon(resource.type)
          return (
            <Card key={resource.id}>
              <CardContent className="p-6">
                <div className="flex items-center gap-6">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">{resource.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {resource.description}
                    </p>
                    <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                      <span>{resource.category}</span>
                      <span>•</span>
                      <span>{(resource.file_size / 1024 / 1024).toFixed(2)} MB</span>
                      <span>•</span>
                      <span>{new Date(resource.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" asChild>
                      <a href={resource.url} download={resource.file_name}>
                        <Download className="h-4 w-4" />
                      </a>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => setDeleteId(resource.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Resource</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this resource? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}