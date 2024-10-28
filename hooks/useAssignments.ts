"use client"

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import type { Assignment, Submission } from '@/lib/supabase/types'

export function useAssignments(courseId: string) {
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAssignments()
  }, [courseId])

  const fetchAssignments = async () => {
    try {
      const { data: assignmentsData, error: assignmentsError } = await supabase
        .from('assignments')
        .select('*')
        .eq('course_id', courseId)

      if (assignmentsError) throw assignmentsError
      setAssignments(assignmentsData)

      const { data: submissionsData, error: submissionsError } = await supabase
        .from('submissions')
        .select('*')
        .eq('assignment_id', assignmentsData[0]?.id)

      if (submissionsError) throw submissionsError
      setSubmissions(submissionsData)
    } catch (error) {
      console.error('Error fetching assignments:', error)
    } finally {
      setLoading(false)
    }
  }

  const createAssignment = async (data: Partial<Assignment>) => {
    try {
      const { error } = await supabase
        .from('assignments')
        .insert({
          ...data,
          course_id: courseId
        })

      if (error) throw error
      await fetchAssignments()
    } catch (error) {
      console.error('Error creating assignment:', error)
      throw error
    }
  }

  const submitAssignment = async (assignmentId: string, data: Partial<Submission>) => {
    try {
      const { error } = await supabase
        .from('submissions')
        .insert({
          ...data,
          assignment_id: assignmentId
        })

      if (error) throw error
      await fetchAssignments()
    } catch (error) {
      console.error('Error submitting assignment:', error)
      throw error
    }
  }

  const gradeSubmission = async (submissionId: string, grade: string, feedback: string) => {
    try {
      const { error } = await supabase
        .from('submissions')
        .update({
          grade,
          feedback,
          graded_at: new Date().toISOString()
        })
        .eq('id', submissionId)

      if (error) throw error
      await fetchAssignments()
    } catch (error) {
      console.error('Error grading submission:', error)
      throw error
    }
  }

  return {
    assignments,
    submissions,
    loading,
    createAssignment,
    submitAssignment,
    gradeSubmission
  }
}