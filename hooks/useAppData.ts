"use client"

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/components/ui/use-toast'

export interface AppData {
  courses: any[]
  sessions: any[]
  assignments: any[]
  resources: any[]
  announcements: any[]
  stats: {
    totalStudents?: number
    totalCourses?: number
    totalHours?: number
    averageRating?: number
    completedLessons?: number
    studyHours?: number
    achievements?: number
    streak?: number
  }
  loading: boolean
  error: string | null
}

export function useAppData() {
  const [data, setData] = useState<AppData>({
    courses: [],
    sessions: [],
    assignments: [],
    resources: [],
    announcements: [],
    stats: {},
    loading: true,
    error: null
  })
  const { user, profile } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    if (!user) return
    fetchData()

    // Set up real-time subscriptions
    const subscriptions = [
      // Courses subscription
      supabase
        .channel('courses_changes')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'courses' },
          () => fetchCourses()
        )
        .subscribe(),

      // Sessions subscription
      supabase
        .channel('sessions_changes')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'live_sessions' },
          () => fetchSessions()
        )
        .subscribe(),

      // Assignments subscription
      supabase
        .channel('assignments_changes')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'assignments' },
          () => fetchAssignments()
        )
        .subscribe(),

      // Resources subscription
      supabase
        .channel('resources_changes')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'resources' },
          () => fetchResources()
        )
        .subscribe(),

      // Announcements subscription
      supabase
        .channel('announcements_changes')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'announcements' },
          () => fetchAnnouncements()
        )
        .subscribe()
    ]

    return () => {
      subscriptions.forEach(subscription => subscription.unsubscribe())
    }
  }, [user])

  const fetchData = async () => {
    try {
      setData(prev => ({ ...prev, loading: true, error: null }))
      await Promise.all([
        fetchCourses(),
        fetchSessions(),
        fetchAssignments(),
        fetchResources(),
        fetchAnnouncements(),
        fetchStats()
      ])
    } catch (error: any) {
      console.error('Error fetching app data:', error)
      setData(prev => ({ 
        ...prev, 
        error: error.message || 'Failed to fetch data',
        loading: false 
      }))
      toast({
        title: "Error",
        description: "Failed to load application data",
        variant: "destructive"
      })
    }
  }

  const fetchCourses = async () => {
    const query = supabase
      .from('courses')
      .select(`
        *,
        instructor:profiles!instructor_id(
          first_name,
          last_name,
          avatar_url
        ),
        enrollments:enrollments(count),
        modules:modules(
          id,
          title,
          lessons:lessons(
            id,
            title,
            type,
            duration
          )
        )
      `)

    if (profile?.role === 'teacher') {
      query.eq('instructor_id', user?.id)
    } else if (profile?.role === 'student') {
      query.eq('status', 'published')
    }

    const { data: courses, error } = await query

    if (error) throw error
    setData(prev => ({ ...prev, courses: courses || [] }))
  }

  const fetchSessions = async () => {
    const query = supabase
      .from('live_sessions')
      .select(`
        *,
        course:courses(title),
        instructor:profiles!instructor_id(
          first_name,
          last_name,
          avatar_url
        ),
        participants:session_participants(
          user:profiles(
            id,
            first_name,
            last_name,
            avatar_url
          )
        )
      `)
      .gte('scheduled_at', new Date().toISOString())
      .order('scheduled_at', { ascending: true })

    if (profile?.role === 'teacher') {
      query.eq('instructor_id', user?.id)
    } else if (profile?.role === 'student') {
      query.eq('status', 'scheduled')
    }

    const { data: sessions, error } = await query

    if (error) throw error
    setData(prev => ({ ...prev, sessions: sessions || [] }))
  }

  const fetchAssignments = async () => {
    const query = supabase
      .from('assignments')
      .select(`
        *,
        course:courses(title),
        submissions:submissions(
          id,
          student:profiles(
            first_name,
            last_name,
            avatar_url
          ),
          status,
          grade,
          submitted_at
        )
      `)

    if (profile?.role === 'teacher') {
      query.eq('instructor_id', user?.id)
    } else if (profile?.role === 'student') {
      query.eq('course_id', 'in', (
        supabase
          .from('enrollments')
          .select('course_id')
          .eq('student_id', user?.id)
      ))
    }

    const { data: assignments, error } = await query

    if (error) throw error
    setData(prev => ({ ...prev, assignments: assignments || [] }))
  }

  const fetchResources = async () => {
    const query = supabase
      .from('resources')
      .select(`
        *,
        course:courses(title),
        created_by:profiles(
          first_name,
          last_name,
          avatar_url
        )
      `)
      .order('created_at', { ascending: false })

    if (profile?.role === 'student') {
      query.eq('course_id', 'in', (
        supabase
          .from('enrollments')
          .select('course_id')
          .eq('student_id', user?.id)
      ))
    }

    const { data: resources, error } = await query

    if (error) throw error
    setData(prev => ({ ...prev, resources: resources || [] }))
  }

  const fetchAnnouncements = async () => {
    const { data: announcements, error } = await supabase
      .from('announcements')
      .select(`
        *,
        author:profiles(
          first_name,
          last_name,
          avatar_url
        )
      `)
      .order('created_at', { ascending: false })
      .limit(10)

    if (error) throw error
    setData(prev => ({ ...prev, announcements: announcements || [] }))
  }

  const fetchStats = async () => {
    try {
      if (profile?.role === 'teacher') {
        const [
          { count: studentsCount },
          { count: coursesCount },
          { data: sessions },
          { data: ratings }
        ] = await Promise.all([
          supabase
            .from('enrollments')
            .select('*', { count: 'exact', head: true })
            .eq('instructor_id', user?.id),
          supabase
            .from('courses')
            .select('*', { count: 'exact', head: true })
            .eq('instructor_id', user?.id),
          supabase
            .from('live_sessions')
            .select('duration')
            .eq('instructor_id', user?.id)
            .eq('status', 'completed'),
          supabase
            .from('feedback')
            .select('rating')
            .eq('instructor_id', user?.id)
        ])

        const totalHours = sessions?.reduce((acc, session) => acc + (session.duration || 0), 0) || 0
        const averageRating = ratings?.length 
          ? ratings.reduce((acc, curr) => acc + curr.rating, 0) / ratings.length
          : 0

        setData(prev => ({
          ...prev,
          stats: {
            totalStudents: studentsCount || 0,
            totalCourses: coursesCount || 0,
            totalHours: Math.round(totalHours / 60),
            averageRating: Number(averageRating.toFixed(1))
          }
        }))
      } else if (profile?.role === 'student') {
        const [
          { data: progress },
          { data: attendance },
          { count: achievementsCount }
        ] = await Promise.all([
          supabase
            .from('lesson_progress')
            .select('*')
            .eq('student_id', user?.id),
          supabase
            .from('session_participants')
            .select('session:live_sessions(duration)')
            .eq('student_id', user?.id)
            .not('left_at', 'is', null),
          supabase
            .from('user_achievements')
            .select('*', { count: 'exact', head: true })
            .eq('student_id', user?.id)
        ])

        const completedLessons = progress?.filter(p => p.completed).length || 0
        const studyHours = attendance?.reduce((acc, curr) => 
          acc + (curr.session?.duration || 0), 0) || 0

        setData(prev => ({
          ...prev,
          stats: {
            completedLessons,
            studyHours: Math.round(studyHours / 60),
            achievements: achievementsCount || 0
          }
        }))
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  return {
    ...data,
    refetch: fetchData
  }
}