"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { Upload, Loader2 } from "lucide-react"
import { useDropzone } from "react-dropzone"
import { supabase } from "@/lib/supabase/client"

export function ResourceUpload() {
  const [uploading, setUploading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "pdf",
    category: "learning"
  })
  const { toast } = useToast()

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({
    maxFiles: 1,
    accept: {
      'application/pdf': ['.pdf'],
      'video/mp4': ['.mp4'],
      'audio/mpeg': ['.mp3'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    }
  })

  const handleUpload = async () => {
    if (!acceptedFiles[0]) {
      toast({
        title: "Error",
        description: "Please select a file to upload",
        variant: "destructive"
      })
      return
    }

    try {
      setUploading(true)

      // Upload file to storage
      const file = acceptedFiles[0]
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}.${fileExt}`
      const filePath = `resources/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('resources')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('resources')
        .getPublicUrl(filePath)

      // Create resource record
      const { error: dbError } = await supabase
        .from('resources')
        .insert({
          ...formData,
          url: publicUrl,
          size: file.size,
          file_name: file.name
        })

      if (dbError) throw dbError

      toast({
        title: "Success",
        description: "Resource uploaded successfully"
      })

      // Reset form
      setFormData({
        title: "",
        description: "",
        type: "pdf",
        category: "learning"
      })
      acceptedFiles.length = 0

    } catch (error: any) {
      console.error("Upload error:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to upload resource",
        variant: "destructive"
      })
    } finally {
      setUploading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload New Resource</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Title</Label>
          <Input
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Resource title"
          />
        </div>

        <div className="space-y-2">
          <Label>Description</Label>
          <Textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Resource description"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Type</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => setFormData({ ...formData, type: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pdf">PDF Document</SelectItem>
                <SelectItem value="video">Video</SelectItem>
                <SelectItem value="audio">Audio</SelectItem>
                <SelectItem value="document">Document</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Category</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData({ ...formData, category: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="learning">Learning Material</SelectItem>
                <SelectItem value="practice">Practice Material</SelectItem>
                <SelectItem value="assessment">Assessment</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div 
          {...getRootProps()} 
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            isDragActive ? "border-primary bg-primary/5" : "border-border"
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            {acceptedFiles[0]?.name || "Drag & drop a file here, or click to select"}
          </p>
        </div>

        <Button 
          className="w-full" 
          onClick={handleUpload}
          disabled={uploading || !acceptedFiles[0]}
        >
          {uploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Upload Resource
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}