"use client"

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Session } from '@/lib/types/course'
import { nanoid } from 'nanoid'

interface SessionParticipant {
  id: string
  user_id: string
  session_id: string
  joined_at: string
  left_at: string | null
}

interface SessionMessage {
  id: string
  user_id: string
  session_id: string
  content: string
  created_at: string
}

export function useSession(courseId: string) {
  const [session, setSession] = useState<Session | null>(null)
  const [participants, setParticipants] = useState<SessionParticipant[]>([])
  const [messages, setMessages] = useState<SessionMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    fetchSession()
    const cleanupSubscriptions = subscribeToUpdates()

    return () => {
      cleanupSubscriptions?.()
    }
  }, [courseId])

  const fetchSession = async () => {
    try {
      // First get the active session for this course
      const { data: sessionData, error: sessionError } = await supabase
        .from('sessions')
        .select('*')
        .eq('course_id', courseId)
        .eq('status', 'live')
        .single()

      if (sessionError) {
        if (sessionError.code === 'PGRST116') {
          // No active session found, create one
          const newSession = {
            id: nanoid(),
            course_id: courseId,
            status: 'live',
            start_time: new Date().toISOString(),
            participants: 0
          }

          const { data: createdSession, error: createError } = await supabase
            .from('sessions')
            .insert(newSession)
            .select()
            .single()

          if (createError) throw createError
          setSession(createdSession)
        } else {
          throw sessionError
        }
      } else {
        setSession(sessionData)
      }

      // Get participants
      if (session?.id) {
        const { data: participantsData, error: participantsError } = await supabase
          .from('session_participants')
          .select('*')
          .eq('session_id', session.id)

        if (participantsError) throw participantsError
        setParticipants(participantsData || [])

        // Get messages
        const { data: messagesData, error: messagesError } = await supabase
          .from('session_messages')
          .select('*')
          .eq('session_id', session.id)
          .order('created_at', { ascending: true })

        if (messagesError) throw messagesError
        setMessages(messagesData || [])
      }
    } catch (err) {
      console.error('Error fetching session data:', err)
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }

  const subscribeToUpdates = () => {
    if (!session?.id) return

    const participantsChannel = supabase.channel(`participants-${session.id}`)
    const messagesChannel = supabase.channel(`messages-${session.id}`)

    participantsChannel
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'session_participants',
          filter: `session_id=eq.${session.id}`
        },
        () => {
          fetchSession()
        }
      )
      .subscribe()

    messagesChannel
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'session_messages',
          filter: `session_id=eq.${session.id}`
        },
        (payload) => {
          setMessages(current => [...current, payload.new as SessionMessage])
        }
      )
      .subscribe()

    return () => {
      participantsChannel.unsubscribe()
      messagesChannel.unsubscribe()
    }
  }

  const joinSession = async () => {
    if (!session?.id) return

    try {
      const { error } = await supabase
        .from('session_participants')
        .insert({
          session_id: session.id,
          joined_at: new Date().toISOString()
        })

      if (error) throw error
      await fetchSession()
    } catch (err) {
      console.error('Error joining session:', err)
      throw err
    }
  }

  const leaveSession = async () => {
    if (!session?.id) return

    try {
      const { error } = await supabase
        .from('session_participants')
        .update({ left_at: new Date().toISOString() })
        .eq('session_id', session.id)
        .is('left_at', null)

      if (error) throw error
      await fetchSession()
    } catch (err) {
      console.error('Error leaving session:', err)
      throw err
    }
  }

  const sendMessage = async (content: string) => {
    if (!session?.id) return

    try {
      const { error } = await supabase
        .from('session_messages')
        .insert({
          session_id: session.id,
          content
        })

      if (error) throw error
    } catch (err) {
      console.error('Error sending message:', err)
      throw err
    }
  }

  return {
    session,
    participants,
    messages,
    loading,
    error,
    joinSession,
    leaveSession,
    sendMessage
  }
}