"use client"

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/components/ui/use-toast'

export interface LiveSessionState {
  id: string
  status: 'connecting' | 'connected' | 'disconnected'
  isRecording: boolean
  isSharingScreen: boolean
  handRaised: boolean
  participants: any[]
  messages: any[]
  breakoutRooms: any[]
}

export function useLiveSession(sessionId: string) {
  const [state, setState] = useState<LiveSessionState>({
    id: sessionId,
    status: 'connecting',
    isRecording: false,
    isSharingScreen: false,
    handRaised: false,
    participants: [],
    messages: [],
    breakoutRooms: []
  })
  const { user, isTeacher } = useAuth()
  const { toast } = useToast()

  // WebRTC state management would go here
  // This is a simplified version focusing on the database interactions

  const startRecording = useCallback(async () => {
    try {
      const { data, error } = await supabase.rpc('start_recording', {
        p_session_id: sessionId
      })

      if (error) throw error

      setState(prev => ({ ...prev, isRecording: true }))
      toast({
        title: "Recording Started",
        description: "The session is now being recorded"
      })
    } catch (error) {
      console.error('Error starting recording:', error)
      toast({
        title: "Error",
        description: "Failed to start recording",
        variant: "destructive"
      })
    }
  }, [sessionId])

  const createBreakoutRoom = useCallback(async (name: string, maxParticipants: number) => {
    try {
      const { data, error } = await supabase.rpc('create_breakout_room', {
        p_session_id: sessionId,
        p_name: name,
        p_max_participants: maxParticipants,
        p_duration: 15 // 15 minutes default
      })

      if (error) throw error

      setState(prev => ({
        ...prev,
        breakoutRooms: [...prev.breakoutRooms, data]
      }))
    } catch (error) {
      console.error('Error creating breakout room:', error)
      toast({
        title: "Error",
        description: "Failed to create breakout room",
        variant: "destructive"
      })
    }
  }, [sessionId])

  const toggleHandRaise = useCallback(async (reason?: string) => {
    try {
      if (!state.handRaised) {
        const { error } = await supabase.rpc('handle_hand_raise', {
          p_session_id: sessionId,
          p_user_id: user?.id,
          p_reason: reason
        })

        if (error) throw error
      } else {
        // Lower hand
        const { error } = await supabase
          .from('hand_raises')
          .update({ status: 'resolved', resolved_at: new Date().toISOString() })
          .eq('session_id', sessionId)
          .eq('user_id', user?.id)
          .eq('status', 'pending')

        if (error) throw error
      }

      setState(prev => ({ ...prev, handRaised: !prev.handRaised }))
    } catch (error) {
      console.error('Error toggling hand raise:', error)
      toast({
        title: "Error",
        description: "Failed to update hand raise status",
        variant: "destructive"
      })
    }
  }, [sessionId, state.handRaised, user?.id])

  const moderateMessage = useCallback(async (messageId: string, action: string, reason: string) => {
    try {
      const { error } = await supabase.rpc('moderate_chat_message', {
        p_message_id: messageId,
        p_moderator_id: user?.id,
        p_action: action,
        p_reason: reason
      })

      if (error) throw error

      toast({
        title: "Message Moderated",
        description: `Message has been ${action}ed`
      })
    } catch (error) {
      console.error('Error moderating message:', error)
      toast({
        title: "Error",
        description: "Failed to moderate message",
        variant: "destructive"
      })
    }
  }, [user?.id])

  // Subscribe to session updates
  useEffect(() => {
    if (!sessionId) return

    const subscriptions = [
      // Participants
      supabase
        .channel(`session_participants_${sessionId}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'session_participants',
            filter: `session_id=eq.${sessionId}`
          },
          (payload) => {
            setState(prev => ({
              ...prev,
              participants: [...prev.participants, payload.new]
            }))
          }
        )
        .subscribe(),

      // Messages
      supabase
        .channel(`session_messages_${sessionId}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'session_messages',
            filter: `session_id=eq.${sessionId}`
          },
          (payload) => {
            setState(prev => ({
              ...prev,
              messages: [...prev.messages, payload.new]
            }))
          }
        )
        .subscribe(),

      // Hand raises
      supabase
        .channel(`hand_raises_${sessionId}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'hand_raises',
            filter: `session_id=eq.${sessionId}`
          },
          (payload) => {
            if (isTeacher) {
              toast({
                title: "Hand Raised",
                description: `A student has raised their hand`
              })
            }
          }
        )
        .subscribe()
    ]

    return () => {
      subscriptions.forEach(subscription => subscription.unsubscribe())
    }
  }, [sessionId, isTeacher])

  return {
    ...state,
    startRecording,
    createBreakoutRoom,
    toggleHandRaise,
    moderateMessage
  }
}