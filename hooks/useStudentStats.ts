"use client"

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/useAuth'

export interface StudentStats {
  completedLessons: number
  totalLessons: number
  studyHours: number
  averageScore: number
  nextSession: {
    id: string
    title: string
    scheduledAt: string
  } | null
  achievements: number
  streak: number
  recentProgress: {
    date: string
    progress: number
  }[]
  memorization: number
  tajweed: number
  attendance: number
}

export function useStudentStats() {
  const [stats, setStats] = useState<StudentStats>({
    completedLessons: 0,
    totalLessons: 0,
    studyHours: 0,
    averageScore: 0,
    nextSession: null,
    achievements: 0,
    streak: 0,
    recentProgress: [],
    memorization: 75,
    tajweed: 85,
    attendance: 90
  })
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    if (!user) return

    const fetchStats = async () => {
      try {
        // Get lesson progress
        const { data: lessonProgress } = await supabase
          .from('lesson_progress')
          .select('*')
          .eq('student_id', user.id)

        const completedLessons = lessonProgress?.filter(l => l.completed).length || 0
        const totalLessons = lessonProgress?.length || 0

        // Get study hours from session attendance
        const { data: attendance } = await supabase
          .from('session_participants')
          .select(`
            session:live_sessions(
              duration
            )
          `)
          .eq('student_id', user.id)
          .not('left_at', 'is', null)

        const studyHours = attendance?.reduce((acc, curr) => {
          return acc + (curr.session?.duration || 0)
        }, 0) || 0

        // Get next scheduled session
        const { data: nextSession } = await supabase
          .from('live_sessions')
          .select('id, title, scheduled_at')
          .eq('status', 'scheduled')
          .gt('scheduled_at', new Date().toISOString())
          .order('scheduled_at', { ascending: true })
          .limit(1)
          .single()

        // Get achievements
        const { count: achievementsCount } = await supabase
          .from('user_achievements')
          .select('*', { count: 'exact', head: true })
          .eq('student_id', user.id)

        // Get recent progress
        const { data: progressHistory } = await supabase
          .from('progress_history')
          .select('date, progress')
          .eq('student_id', user.id)
          .order('date', { ascending: false })
          .limit(7)

        setStats({
          completedLessons,
          totalLessons,
          studyHours: Math.round(studyHours / 60), // Convert to hours
          averageScore: 85, // Example score
          nextSession: nextSession ? {
            id: nextSession.id,
            title: nextSession.title,
            scheduledAt: nextSession.scheduled_at
          } : null,
          achievements: achievementsCount || 0,
          streak: 7, // Example streak
          recentProgress: progressHistory?.map(p => ({
            date: p.date,
            progress: p.progress
          })) || [],
          memorization: 75, // Example metrics
          tajweed: 85,
          attendance: 90
        })
      } catch (error) {
        console.error('Error fetching student stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()

    // Subscribe to relevant changes
    const subscriptions = [
      supabase
        .channel('lesson_progress')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'lesson_progress' }, fetchStats)
        .subscribe(),
      supabase
        .channel('sessions')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'live_sessions' }, fetchStats)
        .subscribe(),
      supabase
        .channel('achievements')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'user_achievements' }, fetchStats)
        .subscribe()
    ]

    return () => {
      subscriptions.forEach(subscription => subscription.unsubscribe())
    }
  }, [user])

  return { stats, loading }
}