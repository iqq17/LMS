"use client"

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/useAuth'

export function useStats() {
  const { user, isTeacher } = useAuth()
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeCourses: 0,
    totalHours: 0,
    averageRating: 0,
    completedLessons: 0,
    studyHours: 0,
    nextSession: null,
    achievements: 0
  })

  useEffect(() => {
    if (!user) return

    const fetchStats = async () => {
      try {
        if (isTeacher) {
          // Get teacher stats
          const { data: students } = await supabase
            .from('enrollments')
            .select('student_id', { count: 'exact', distinct: true })
            .eq('course_id', 'in', (
              supabase
                .from('courses')
                .select('id')
                .eq('instructor_id', user.id)
            ))

          const { data: courses } = await supabase
            .from('courses')
            .select('*', { count: 'exact' })
            .eq('instructor_id', user.id)

          // Calculate teaching hours from sessions
          const { data: sessions } = await supabase
            .from('live_sessions')
            .select('duration')
            .eq('instructor_id', user.id)

          const totalHours = sessions?.reduce((acc, session) => acc + (session.duration || 0), 0) || 0

          setStats({
            ...stats,
            totalStudents: students?.length || 0,
            activeCourses: courses?.length || 0,
            totalHours: Math.round(totalHours / 60), // Convert minutes to hours
            averageRating: 4.9 // This would come from a ratings table
          })
        } else {
          // Get student stats
          const { data: lessons } = await supabase
            .from('lesson_progress')
            .select('*', { count: 'exact' })
            .eq('student_id', user.id)
            .eq('completed', true)

          const { data: nextSession } = await supabase
            .from('live_sessions')
            .select('*')
            .eq('status', 'scheduled')
            .order('scheduled_at', { ascending: true })
            .limit(1)
            .single()

          const { data: achievements } = await supabase
            .from('achievements')
            .select('*', { count: 'exact' })
            .eq('student_id', user.id)

          setStats({
            ...stats,
            completedLessons: lessons?.length || 0,
            studyHours: 45, // This would be calculated from session attendance
            nextSession: nextSession?.scheduled_at || null,
            achievements: achievements?.length || 0
          })
        }
      } catch (error) {
        console.error('Error fetching stats:', error)
      }
    }

    fetchStats()

    // Subscribe to real-time updates
    const subscription = supabase
      .channel('stats_changes')
      .on('*', () => fetchStats())
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [user, isTeacher])

  return stats
}