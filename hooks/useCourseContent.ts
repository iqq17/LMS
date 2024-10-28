"use client"

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/components/ui/use-toast'

interface CourseContent {
  id: string
  title: string
  description: string
  type: 'video' | 'document' | 'quiz' | 'assignment'
  content: any
  order: number
  isRequired: boolean
  duration?: number
  createdAt: string
  updatedAt: string
}

interface ContentMetadata {
  courseId: string
  moduleId?: string
  type: 'video' | 'document' | 'quiz' | 'assignment'
  title: string
  description: string
  isRequired?: boolean
  duration?: number
}

export function useCourseContent(courseId: string) {
  const [content, setContent] = useState<CourseContent[]>([])
  const [loading, setLoading] = useState(true)
  const { user, isTeacher } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    if (!courseId) return
    fetchContent()

    // Subscribe to content updates
    const subscription = supabase
      .channel('content_updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'course_content',
          filter: `course_id=eq.${courseId}`
        },
        () => fetchContent()
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [courseId])

  const fetchContent = async () => {
    try {
      const { data, error } = await supabase
        .from('course_content')
        .select(`
          *,
          module:modules(
            title,
            description
          )
        `)
        .eq('course_id', courseId)
        .order('order', { ascending: true })

      if (error) throw error
      setContent(data || [])
    } catch (error) {
      console.error('Error fetching course content:', error)
    } finally {
      setLoading(false)
    }
  }

  const addContent = async (metadata: ContentMetadata, file?: File) => {
    try {
      if (!isTeacher) throw new Error('Only teachers can add content')

      let contentUrl = ''
      if (file) {
        // Upload file to storage
        const fileExt = file.name.split('.').pop()
        const fileName = `${courseId}/${Date.now()}.${fileExt}`
        
        const { error: uploadError } = await supabase.storage
          .from('course-content')
          .upload(fileName, file)

        if (uploadError) throw uploadError

        const { data } = supabase.storage
          .from('course-content')
          .getPublicUrl(fileName)

        contentUrl = data.publicUrl
      }

      // Add content record
      const { error } = await supabase
        .from('course_content')
        .insert({
          course_id: courseId,
          module_id: metadata.moduleId,
          type: metadata.type,
          title: metadata.title,
          description: metadata.description,
          content: contentUrl || metadata.content,
          is_required: metadata.isRequired,
          duration: metadata.duration,
          order: (content.length + 1) * 10
        })

      if (error) throw error

      toast({
        title: "Success",
        description: "Content added successfully",
      })
    } catch (error: any) {
      console.error('Error adding content:', error)
      toast({
        title: "Error",
        description: error.message || "Failed to add content",
        variant: "destructive",
      })
    }
  }

  const updateContent = async (
    contentId: string,
    updates: Partial<ContentMetadata>,
    file?: File
  ) => {
    try {
      if (!isTeacher) throw new Error('Only teachers can update content')

      let contentUrl = ''
      if (file) {
        // Upload new file
        const fileExt = file.name.split('.').pop()
        const fileName = `${courseId}/${Date.now()}.${fileExt}`
        
        const { error: uploadError } = await supabase.storage
          .from('course-content')
          .upload(fileName, file)

        if (uploadError) throw uploadError

        const { data } = supabase.storage
          .from('course-content')
          .getPublicUrl(fileName)

        contentUrl = data.publicUrl
      }

      // Update content record
      const { error } = await supabase
        .from('course_content')
        .update({
          ...updates,
          ...(contentUrl && { content: contentUrl }),
          updated_at: new Date().toISOString()
        })
        .eq('id', contentId)

      if (error) throw error

      toast({
        title: "Success",
        description: "Content updated successfully",
      })
    } catch (error: any) {
      console.error('Error updating content:', error)
      toast({
        title: "Error",
        description: error.message || "Failed to update content",
        variant: "destructive",
      })
    }
  }

  const deleteContent = async (contentId: string) => {
    try {
      if (!isTeacher) throw new Error('Only teachers can delete content')

      const { error } = await supabase
        .from('course_content')
        .delete()
        .eq('id', contentId)

      if (error) throw error

      toast({
        title: "Success",
        description: "Content deleted successfully",
      })
    } catch (error: any) {
      console.error('Error deleting content:', error)
      toast({
        title: "Error",
        description: error.message || "Failed to delete content",
        variant: "destructive",
      })
    }
  }

  const reorderContent = async (contentId: string, newOrder: number) => {
    try {
      if (!isTeacher) throw new Error('Only teachers can reorder content')

      const { error } = await supabase
        .from('course_content')
        .update({ order: newOrder })
        .eq('id', contentId)

      if (error) throw error

      toast({
        title: "Success",
        description: "Content reordered successfully",
      })
    } catch (error: any) {
      console.error('Error reordering content:', error)
      toast({
        title: "Error",
        description: error.message || "Failed to reorder content",
        variant: "destructive",
      })
    }
  }

  return {
    content,
    loading,
    addContent,
    updateContent,
    deleteContent,
    reorderContent
  }
}