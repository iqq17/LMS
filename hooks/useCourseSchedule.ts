"use client"

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/useAuth'
import { CLASS_TIMES, WEEKDAYS } from '@/lib/constants/courses'

export interface CourseSchedule {
  id: string
  course_id: string
  teacher_id: string
  weekday: number
  start_time: string
  duration: number
  max_students: number
  enrolled_students: number
  teacher: {
    first_name: string
    last_name: string
    avatar_url: string
  }
}

export function useCourseSchedule(courseId?: string) {
  const [schedules, setSchedules] = useState<CourseSchedule[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  useEffect(() => {
    if (!courseId) return

    const fetchSchedules = async () => {
      try {
        setLoading(true)
        setError(null)

        const { data, error: schedulesError } = await supabase
          .from('course_schedules')
          .select(`
            *,
            teacher:profiles!teacher_id(
              first_name,
              last_name,
              avatar_url
            ),
            enrolled_students:course_enrollments(count)
          `)
          .eq('course_id', courseId)

        if (schedulesError) throw schedulesError
        setSchedules(data || [])
      } catch (err: any) {
        console.error('Error fetching schedules:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchSchedules()

    // Subscribe to changes
    const subscription = supabase
      .channel(`schedules_${courseId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'course_schedules',
          filter: `course_id=eq.${courseId}`
        },
        () => fetchSchedules()
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [courseId])

  const createSchedule = async (data: {
    weekday: number
    start_time: string
    duration: number
    max_students: number
  }) => {
    try {
      if (!user) throw new Error('Must be logged in')

      const { error } = await supabase
        .from('course_schedules')
        .insert({
          course_id: courseId,
          teacher_id: user.id,
          ...data
        })

      if (error) throw error
    } catch (err: any) {
      console.error('Error creating schedule:', err)
      throw err
    }
  }

  const updateSchedule = async (
    scheduleId: string,
    data: Partial<Omit<CourseSchedule, 'id' | 'course_id' | 'teacher_id'>>
  ) => {
    try {
      const { error } = await supabase
        .from('course_schedules')
        .update(data)
        .eq('id', scheduleId)

      if (error) throw error
    } catch (err: any) {
      console.error('Error updating schedule:', err)
      throw err
    }
  }

  const deleteSchedule = async (scheduleId: string) => {
    try {
      const { error } = await supabase
        .from('course_schedules')
        .delete()
        .eq('id', scheduleId)

      if (error) throw error
    } catch (err: any) {
      console.error('Error deleting schedule:', err)
      throw err
    }
  }

  return {
    schedules,
    loading,
    error,
    createSchedule,
    updateSchedule,
    deleteSchedule
  }
}