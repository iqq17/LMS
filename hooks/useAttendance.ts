"use client"

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/useAuth'

export interface AttendanceRecord {
  id: string
  student: {
    id: string
    first_name: string
    last_name: string
    avatar_url: string
  }
  status: 'present' | 'absent' | 'excused' | 'late'
  notes: string
  created_at: string
}

export function useAttendance(sessionId: string) {
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  useEffect(() => {
    if (!user || !sessionId) return

    const fetchAttendance = async () => {
      try {
        setLoading(true)
        setError(null)

        const { data, error: attendanceError } = await supabase
          .from('attendance')
          .select(`
            id,
            status,
            notes,
            created_at,
            student:profiles!student_id(
              id,
              first_name,
              last_name,
              avatar_url
            )
          `)
          .eq('session_id', sessionId)
          .order('created_at', { ascending: true })

        if (attendanceError) throw attendanceError
        setAttendance(data || [])
      } catch (err: any) {
        console.error('Error fetching attendance:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchAttendance()

    // Subscribe to attendance changes
    const attendanceSubscription = supabase
      .channel(`attendance_${sessionId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'attendance',
          filter: `session_id=eq.${sessionId}`
        },
        () => fetchAttendance()
      )
      .subscribe()

    return () => {
      attendanceSubscription.unsubscribe()
    }
  }, [user, sessionId])

  const markAttendance = async (
    studentId: string, 
    status: 'present' | 'absent' | 'excused' | 'late',
    notes?: string
  ) => {
    try {
      const { error } = await supabase
        .from('attendance')
        .upsert({
          session_id: sessionId,
          student_id: studentId,
          status,
          notes,
          marked_by: user?.id
        })

      if (error) throw error
    } catch (err: any) {
      console.error('Error marking attendance:', err)
      throw err
    }
  }

  const markBulkAttendance = async (
    records: { 
      studentId: string
      status: 'present' | 'absent' | 'excused' | 'late'
      notes?: string 
    }[]
  ) => {
    try {
      const { error } = await supabase
        .from('attendance')
        .upsert(
          records.map(record => ({
            session_id: sessionId,
            student_id: record.studentId,
            status: record.status,
            notes: record.notes,
            marked_by: user?.id
          }))
        )

      if (error) throw error
    } catch (err: any) {
      console.error('Error marking bulk attendance:', err)
      throw err
    }
  }

  return {
    attendance,
    loading,
    error,
    markAttendance,
    markBulkAttendance
  }
}