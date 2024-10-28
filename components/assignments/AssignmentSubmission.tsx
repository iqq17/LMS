"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { useDropzone } from "react-dropzone"
import { Upload, File, X, Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabase/client"

interface AssignmentSubmissionProps {
  assignmentId: string
  onSubmit: () => void
}

export function AssignmentSubmission({ 
  assignmentId, 
  onSubmit 
}: AssignmentSubmissionProps) {
  const [content, setContent] = useState("")
  const [files, setFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const { toast } = useToast()

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      setFiles([...files, ...acceptedFiles])
    }
  })

  const handleSubmit = async () => {
    try {
      setUploading(true)

      // Upload files to storage
      const uploadedUrls = await Promise.all(
        files.map(async (file) => {
          const fileName = `${assignmentId}/${Date.now()}-${file.name}`
          const { error: uploadError } = await supabase.storage
            .from("submissions")
            .upload(fileName, file)

          if (uploadError) throw uploadError

          const { data } = supabase.storage
            .from("submissions")
            .getPublicUrl(fileName)

          return data.publicUrl
        })
      )

      // Create submission record
      const { error } = await supabase
        .from("submissions")
        .insert({
          assignment_id: assignmentId,
          content,
          files: uploadedUrls
        })

      if (error) throw error

      toast({
        title: "Success",
        description: "Assignment submitted successfully",
      })

      onSubmit()
    } catch (error) {
      console.error("Error submitting assignment:", error)
      toast({
        title: "Error",
        description: "Failed to submit assignment",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Submit Assignment</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder="Write your submission..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[200px]"
        />

        <div
          {...getRootProps()}
          className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors"
        >
          <input {...getInputProps()} />
          <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Drag & drop files here, or click to select files
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
          onClick={handleSubmit}
          disabled={uploading}
        >
          {uploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            "Submit Assignment"
          )}
        </Button>
      </CardContent>
    </Card>
  )
}