"use client"

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import type { Enrollment } from '@/lib/supabase/types'

export function useEnrollment(courseId: string) {
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkEnrollment()
  }, [courseId])

  const checkEnrollment = async () => {
    try {
      const { data, error } = await supabase
        .from('enrollments')
        .select('*')
        .eq('course_id', courseId)
        .single()

      if (error && error.code !== 'PGRST116') throw error
      setEnrollment(data)
    } catch (error) {
      console.error('Error checking enrollment:', error)
    } finally {
      setLoading(false)
    }
  }

  const enroll = async () => {
    try {
      const { error } = await supabase
        .from('enrollments')
        .insert({
          course_id: courseId
        })

      if (error) throw error
      await checkEnrollment()
    } catch (error) {
      console.error('Error enrolling in course:', error)
      throw error
    }
  }

  return {
    enrollment,
    loading,
    enroll
  }
}