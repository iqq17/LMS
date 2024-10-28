"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { useDropzone } from "react-dropzone"
import { Upload, File, X, Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabase/client"

interface ResourceUploaderProps {
  onSuccess?: () => void
}

export function ResourceUploader({ onSuccess }: ResourceUploaderProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [type, setType] = useState<string>("")
  const [files, setFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const { toast } = useToast()

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      setFiles([...files, ...acceptedFiles])
    },
    maxFiles: 1
  })

  const handleUpload = async () => {
    try {
      if (!files.length || !title || !type) {
        toast({
          title: "Missing Fields",
          description: "Please fill in all required fields and select a file",
          variant: "destructive",
        })
        return
      }

      setUploading(true)
      const file = files[0]
      const fileExt = file.name.split(".").pop()
      const fileName = `${Date.now()}.${fileExt}`
      const filePath = `resources/${fileName}`

      // Upload file to storage
      const { error: uploadError } = await supabase.storage
        .from("resources")
        .upload(filePath, file)

      if (uploadError) throw uploadError

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from("resources")
        .getPublicUrl(filePath)

      // Save resource metadata
      const { error: dbError } = await supabase
        .from("resources")
        .insert({
          title,
          description,
          type,
          url: publicUrl,
          size: file.size,
          file_type: fileExt
        })

      if (dbError) throw dbError

      toast({
        title: "Success",
        description: "Resource uploaded successfully",
      })

      onSuccess?.()
    } catch (error: any) {
      console.error("Error uploading resource:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to upload resource",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-6 py-4">
      <div className="space-y-4">
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
          <Select value={type} onValueChange={setType}>
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="document">Document</SelectItem>
              <SelectItem value="video">Video</SelectItem>
              <SelectItem value="audio">Audio</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div
          {...getRootProps()}
          className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors"
        >
          <input {...getInputProps()} />
          <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Drag & drop a file here, or click to select
          </p>
        </div>

        {files.length > 0 && (
          <div className="space-y-2">
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 border rounded-lg"
              >
                <div className="flex items-center gap-2">
                  <File className="h-4 w-4 text-primary" />
                  <span className="text-sm">{file.name}</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setFiles(files.filter((_, i) => i !== index))
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

        <Button 
          className="w-full" 
          onClick={handleUpload}
          disabled={uploading}
        >
          {uploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            "Upload Resource"
          )}
        </Button>
      </div>
    </div>
  )
}