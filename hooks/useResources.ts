"use client"

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import type { Resource } from '@/lib/supabase/types'

export function useResources(courseId: string) {
  const [resources, setResources] = useState<Resource[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchResources()
  }, [courseId])

  const fetchResources = async () => {
    try {
      const { data, error } = await supabase
        .from('resources')
        .select('*')
        .eq('course_id', courseId)
        .order('created_at', { ascending: false })

      if (error) throw error
      setResources(data)
    } catch (error) {
      console.error('Error fetching resources:', error)
    } finally {
      setLoading(false)
    }
  }

  const uploadResource = async (
    file: File,
    data: Omit<Resource, 'id' | 'url' | 'created_at' | 'created_by'>
  ) => {
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `${courseId}/${fileName}`

      // Upload file to storage
      const { error: uploadError } = await supabase.storage
        .from('resources')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('resources')
        .getPublicUrl(filePath)

      // Save resource metadata
      const { error: dbError } = await supabase
        .from('resources')
        .insert({
          ...data,
          url: publicUrl,
          course_id: courseId
        })

      if (dbError) throw dbError

      await fetchResources()
    } catch (error) {
      console.error('Error uploading resource:', error)
      throw error
    }
  }

  const deleteResource = async (id: string) => {
    try {
      const { error } = await supabase
        .from('resources')
        .delete()
        .eq('id', id)

      if (error) throw error
      await fetchResources()
    } catch (error) {
      console.error('Error deleting resource:', error)
      throw error
    }
  }

  return {
    resources,
    loading,
    uploadResource,
    deleteResource
  }
}