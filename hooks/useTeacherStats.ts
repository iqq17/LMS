"use client"

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/useAuth'

export interface TeacherStats {
  totalStudents: number
  activeCourses: number
  teachingHours: number
  averageRating: number
  upcomingSessions: number
  completedSessions: number
  pendingGrading: number
  studentProgress: {
    improved: number
    needsAttention: number
  }
}

export function useTeacherStats() {
  const [stats, setStats] = useState<TeacherStats>({
    totalStudents: 0,
    activeCourses: 0,
    teachingHours: 0,
    averageRating: 0,
    upcomingSessions: 0,
    completedSessions: 0,
    pendingGrading: 0,
    studentProgress: {
      improved: 0,
      needsAttention: 0
    }
  })
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    if (!user) return

    const fetchStats = async () => {
      try {
        // Get total students
        const { count: studentsCount } = await supabase
          .from('enrollments')
          .select('*', { count: 'exact', head: true })
          .eq('instructor_id', user.id)

        // Get active courses
        const { count: coursesCount } = await supabase
          .from('courses')
          .select('*', { count: 'exact', head: true })
          .eq('instructor_id', user.id)
          .eq('status', 'active')

        // Get teaching hours from completed sessions
        const { data: sessions } = await supabase
          .from('live_sessions')
          .select('duration')
          .eq('instructor_id', user.id)
          .eq('status', 'completed')

        const totalHours = sessions?.reduce((acc, session) => acc + session.duration, 0) || 0

        // Get upcoming sessions
        const { count: upcomingCount } = await supabase
          .from('live_sessions')
          .select('*', { count: 'exact', head: true })
          .eq('instructor_id', user.id)
          .eq('status', 'scheduled')
          .gte('scheduled_at', new Date().toISOString())

        // Get pending assignments
        const { count: pendingCount } = await supabase
          .from('submissions')
          .select('*', { count: 'exact', head: true })
          .eq('instructor_id', user.id)
          .is('graded_at', null)

        // Get average rating
        const { data: ratings } = await supabase
          .from('feedback')
          .select('rating')
          .eq('instructor_id', user.id)

        const averageRating = ratings?.length 
          ? ratings.reduce((acc, curr) => acc + curr.rating, 0) / ratings.length
          : 0

        setStats({
          totalStudents: studentsCount || 0,
          activeCourses: coursesCount || 0,
          teachingHours: Math.round(totalHours / 60), // Convert to hours
          averageRating: Number(averageRating.toFixed(1)),
          upcomingSessions: upcomingCount || 0,
          completedSessions: sessions?.length || 0,
          pendingGrading: pendingCount || 0,
          studentProgress: {
            improved: 0, // Calculate from progress history
            needsAttention: 0 // Calculate from progress thresholds
          }
        })
      } catch (error) {
        console.error('Error fetching teacher stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()

    // Subscribe to relevant changes
    const subscriptions = [
      supabase
        .channel('enrollments')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'enrollments' }, fetchStats)
        .subscribe(),
      supabase
        .channel('sessions')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'live_sessions' }, fetchStats)
        .subscribe(),
      supabase
        .channel('submissions')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'submissions' }, fetchStats)
        .subscribe()
    ]

    return () => {
      subscriptions.forEach(subscription => subscription.unsubscribe())
    }
  }, [user])

  return { stats, loading }
}