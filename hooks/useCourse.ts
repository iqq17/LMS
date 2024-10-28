"use client"

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import type { Course, Lesson, Resource } from '@/lib/supabase/types'

export function useCourse(courseId: string) {
  const [course, setCourse] = useState<Course | null>(null)
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [resources, setResources] = useState<Resource[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCourseData()
  }, [courseId])

  const fetchCourseData = async () => {
    try {
      // Fetch course details
      const { data: courseData, error: courseError } = await supabase
        .from('courses')
        .select('*')
        .eq('id', courseId)
        .single()

      if (courseError) throw courseError
      setCourse(courseData)

      // Fetch lessons
      const { data: lessonsData, error: lessonsError } = await supabase
        .from('lessons')
        .select('*')
        .eq('course_id', courseId)
        .order('order_index')

      if (lessonsError) throw lessonsError
      setLessons(lessonsData)

      // Fetch resources
      const { data: resourcesData, error: resourcesError } = await supabase
        .from('resources')
        .select('*')
        .eq('course_id', courseId)

      if (resourcesError) throw resourcesError
      setResources(resourcesData)
    } catch (error) {
      console.error('Error fetching course data:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateProgress = async (lessonId: string, completed: boolean) => {
    try {
      const { error } = await supabase
        .from('lesson_progress')
        .upsert({
          lesson_id: lessonId,
          completed
        })

      if (error) throw error
      await fetchCourseData()
    } catch (error) {
      console.error('Error updating progress:', error)
      throw error
    }
  }

  return {
    course,
    lessons,
    resources,
    loading,
    updateProgress
  }
}