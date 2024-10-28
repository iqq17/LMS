"use client"

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/components/ui/use-toast'

interface Progress {
  courseId: string
  lessonId: string
  status: 'not_started' | 'in_progress' | 'completed'
  progress: number
  lastAccessed: string
  completedAt: string | null
}

interface ProgressSummary {
  courseId: string
  courseTitle: string
  overallProgress: number
  completedLessons: number
  totalLessons: number
  lastAccessed: string
  currentStreak: number
  longestStreak: number
}

export function useProgress() {
  const [progress, setProgress] = useState<Progress[]>([])
  const [summary, setSummary] = useState<ProgressSummary[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    if (!user) return
    fetchProgress()
    fetchSummary()

    // Subscribe to progress updates
    const subscription = supabase
      .channel('progress_updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'progress_tracking',
          filter: `student_id=eq.${user.id}`
        },
        () => {
          fetchProgress()
          fetchSummary()
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [user])

  const fetchProgress = async () => {
    try {
      const { data, error } = await supabase
        .from('progress_tracking')
        .select('*')
        .eq('student_id', user?.id)

      if (error) throw error
      setProgress(data || [])
    } catch (error) {
      console.error('Error fetching progress:', error)
    }
  }

  const fetchSummary = async () => {
    try {
      const { data, error } = await supabase
        .rpc('get_student_progress_summary', {
          p_student_id: user?.id
        })

      if (error) throw error
      setSummary(data || [])
    } catch (error) {
      console.error('Error fetching progress summary:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateProgress = async (
    courseId: string,
    lessonId: string,
    progressValue: number
  ) => {
    try {
      const { error } = await supabase.rpc('update_progress', {
        p_student_id: user?.id,
        p_course_id: courseId,
        p_lesson_id: lessonId,
        p_progress: progressValue
      })

      if (error) throw error

      toast({
        title: "Progress Updated",
        description: progressValue >= 90 
          ? "Congratulations on completing the lesson!" 
          : "Progress saved successfully",
      })
    } catch (error: any) {
      console.error('Error updating progress:', error)
      toast({
        title: "Error",
        description: "Failed to update progress",
        variant: "destructive",
      })
    }
  }

  return {
    progress,
    summary,
    loading,
    updateProgress
  }
}