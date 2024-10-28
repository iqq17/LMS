"use client"

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/useAuth'

export interface TeacherStudent {
  id: string
  student: {
    id: string
    first_name: string
    last_name: string
    email: string
    avatar_url: string
  }
  status: 'active' | 'inactive' | 'graduated'
  enrolled_at: string
  notes: string
  courses: {
    id: string
    title: string
    progress: number
  }[]
  attendance: {
    present: number
    absent: number
    excused: number
    late: number
  }
}

export function useTeacherStudents() {
  const [students, setStudents] = useState<TeacherStudent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  useEffect(() => {
    if (!user) return

    const fetchStudents = async () => {
      try {
        setLoading(true)
        setError(null)

        // Get all students assigned to this teacher
        const { data: teacherStudents, error: studentsError } = await supabase
          .from('teacher_students')
          .select(`
            id,
            status,
            enrolled_at,
            notes,
            student:profiles!student_id(
              id,
              first_name,
              last_name,
              email,
              avatar_url
            )
          `)
          .eq('teacher_id', user.id)
          .order('enrolled_at', { ascending: false })

        if (studentsError) throw studentsError

        // Get course enrollments for each student
        const enrichedStudents = await Promise.all(
          teacherStudents.map(async (ts) => {
            // Get courses
            const { data: courses } = await supabase
              .from('enrollments')
              .select(`
                course:courses(
                  id,
                  title
                ),
                progress
              `)
              .eq('student_id', ts.student.id)

            // Get attendance statistics
            const { data: attendance } = await supabase
              .from('attendance')
              .select('status')
              .eq('student_id', ts.student.id)

            const attendanceStats = attendance?.reduce((acc, curr) => {
              acc[curr.status] = (acc[curr.status] || 0) + 1
              return acc
            }, {} as Record<string, number>)

            return {
              ...ts,
              courses: courses?.map(c => ({
                id: c.course.id,
                title: c.course.title,
                progress: c.progress
              })) || [],
              attendance: {
                present: attendanceStats?.present || 0,
                absent: attendanceStats?.absent || 0,
                excused: attendanceStats?.excused || 0,
                late: attendanceStats?.late || 0
              }
            }
          })
        )

        setStudents(enrichedStudents)
      } catch (err: any) {
        console.error('Error fetching teacher students:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchStudents()

    // Subscribe to changes
    const studentsSubscription = supabase
      .channel('teacher_students_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'teacher_students',
          filter: `teacher_id=eq.${user.id}`
        },
        () => fetchStudents()
      )
      .subscribe()

    return () => {
      studentsSubscription.unsubscribe()
    }
  }, [user])

  const addStudent = async (studentId: string, notes?: string) => {
    try {
      const { error } = await supabase
        .from('teacher_students')
        .insert({
          teacher_id: user?.id,
          student_id: studentId,
          notes
        })

      if (error) throw error
    } catch (err: any) {
      console.error('Error adding student:', err)
      throw err
    }
  }

  const updateStudentStatus = async (studentId: string, status: 'active' | 'inactive' | 'graduated') => {
    try {
      const { error } = await supabase
        .from('teacher_students')
        .update({ status })
        .eq('teacher_id', user?.id)
        .eq('student_id', studentId)

      if (error) throw error
    } catch (err: any) {
      console.error('Error updating student status:', err)
      throw err
    }
  }

  const updateStudentNotes = async (studentId: string, notes: string) => {
    try {
      const { error } = await supabase
        .from('teacher_students')
        .update({ notes })
        .eq('teacher_id', user?.id)
        .eq('student_id', studentId)

      if (error) throw error
    } catch (err: any) {
      console.error('Error updating student notes:', err)
      throw err
    }
  }

  return {
    students,
    loading,
    error,
    addStudent,
    updateStudentStatus,
    updateStudentNotes
  }
}