"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from '@/lib/supabase'
import { Upload, Loader2 } from 'lucide-react'

interface ResourceUploadProps {
  courseId: string
}

export function ResourceUpload({ courseId }: ResourceUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [type, setType] = useState<'pdf' | 'video' | 'audio' | 'document'>('pdf')
  const { toast } = useToast()

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true)
      const file = event.target.files?.[0]
      if (!file) return

      // Upload file to Supabase Storage
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `${courseId}/${fileName}`

      const { error: uploadError, data } = await supabase.storage
        .from('resources')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('resources')
        .getPublicUrl(filePath)

      // Save resource metadata to database
      const { error: dbError } = await supabase
        .from('resources')
        .insert({
          title,
          description,
          url: publicUrl,
          type,
          course_id: courseId
        })

      if (dbError) throw dbError

      toast({
        title: "Success",
        description: "Resource uploaded successfully",
      })

      // Reset form
      setTitle('')
      setDescription('')
      setType('pdf')
    } catch (error) {
      console.error('Error uploading resource:', error)
      toast({
        title: "Error",
        description: "Failed to upload resource",
        variant: "destructive"
      })
    } finally {
      setUploading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Resource</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Title</Label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Resource title"
          />
        </div>

        <div className="space-y-2">
          <Label>Description</Label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Resource description"
          />
        </div>

        <div className="space-y-2">
          <Label>Type</Label>
          <Select value={type} onValueChange={(value: any) => setType(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pdf">PDF</SelectItem>
              <SelectItem value="video">Video</SelectItem>
              <SelectItem value="audio">Audio</SelectItem>
              <SelectItem value="document">Document</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>File</Label>
          <Input
            type="file"
            onChange={handleFileUpload}
            disabled={uploading}
            accept={
              type === 'pdf' ? '.pdf' :
              type === 'video' ? '.mp4,.webm' :
              type === 'audio' ? '.mp3,.wav' :
              '.doc,.docx,.pdf'
            }
          />
        </div>

        <Button disabled={uploading} className="w-full">
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