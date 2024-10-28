"use client"

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/components/ui/use-toast'

interface AttendanceRecord {
  id: string
  sessionId: string
  studentId: string
  status: 'present' | 'absent' | 'excused' | 'late'
  notes?: string
  createdAt: string
}

interface AttendanceSummary {
  totalSessions: number
  attendedSessions: number
  attendanceRate: number
  lateSessions: number
  excusedSessions: number
}

export function useAttendanceTracking(sessionId?: string) {
  const [records, setRecords] = useState<AttendanceRecord[]>([])
  const [summary, setSummary] = useState<AttendanceSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const { user, isTeacher } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    if (!user) return
    fetchAttendance()
    if (!isTeacher) fetchSummary()

    // Subscribe to attendance updates
    const subscription = supabase
      .channel('attendance_updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'attendance_records',
          filter: sessionId 
            ? `session_id=eq.${sessionId}`
            : isTeacher 
              ? undefined 
              : `student_id=eq.${user.id}`
        },
        () => {
          fetchAttendance()
          if (!isTeacher) fetchSummary()
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [user, sessionId, isTeacher])

  const fetchAttendance = async () => {
    try {
      let query = supabase
        .from('attendance_records')
        .select(`
          *,
          session:live_sessions(
            title,
            start_time
          ),
          student:profiles(
            first_name,
            last_name,
            avatar_url
          )
        `)

      if (sessionId) {
        query = query.eq('session_id', sessionId)
      } else if (!isTeacher) {
        query = query.eq('student_id', user?.id)
      }

      const { data, error } = await query.order('created_at', { ascending: false })

      if (error) throw error
      setRecords(data || [])
    } catch (error) {
      console.error('Error fetching attendance:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchSummary = async () => {
    try {
      const { data, error } = await supabase
        .from('attendance_records')
        .select('*')
        .eq('student_id', user?.id)

      if (error) throw error

      const total = data.length
      const attended = data.filter(r => r.status === 'present').length
      const late = data.filter(r => r.status === 'late').length
      const excused = data.filter(r => r.status === 'excused').length

      setSummary({
        totalSessions: total,
        attendedSessions: attended,
        attendanceRate: total > 0 ? (attended / total) * 100 : 0,
        lateSessions: late,
        excusedSessions: excused
      })
    } catch (error) {
      console.error('Error fetching attendance summary:', error)
    }
  }

  const markAttendance = async (
    studentId: string,
    status: 'present' | 'absent' | 'excused' | 'late',
    notes?: string
  ) => {
    try {
      if (!sessionId) throw new Error('Session ID is required')

      const { error } = await supabase
        .from('attendance_records')
        .upsert({
          session_id: sessionId,
          student_id: studentId,
          status,
          notes
        })

      if (error) throw error

      toast({
        title: "Success",
        description: "Attendance marked successfully",
      })
    } catch (error: any) {
      console.error('Error marking attendance:', error)
      toast({
        title: "Error",
        description: error.message || "Failed to mark attendance",
        variant: "destructive",
      })
    }
  }

  return {
    records,
    summary,
    loading,
    markAttendance
  }
}