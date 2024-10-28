export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          first_name: string | null
          last_name: string | null
          avatar_url: string | null
          role: 'student' | 'teacher' | 'admin'
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id: string
          first_name?: string | null
          last_name?: string | null
          avatar_url?: string | null
          role?: 'student' | 'teacher' | 'admin'
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          first_name?: string | null
          last_name?: string | null
          avatar_url?: string | null
          role?: 'student' | 'teacher' | 'admin'
          created_at?: string
          updated_at?: string | null
        }
      }
      live_sessions: {
        Row: {
          id: string
          title: string
          instructor_id: string
          scheduled_at: string
          duration: number
          status: 'scheduled' | 'live' | 'completed'
          created_at: string
        }
      }
      session_participants: {
        Row: {
          id: string
          session_id: string
          user_id: string
          joined_at: string
          left_at: string | null
        }
      }
      session_messages: {
        Row: {
          id: string
          session_id: string
          user_id: string
          content: string
          created_at: string
        }
      }
    }
  }
}

export type Profile = Database['public']['Tables']['profiles']['Row']
export type LiveSession = Database['public']['Tables']['live_sessions']['Row']
export type SessionParticipant = Database['public']['Tables']['session_participants']['Row']
export type SessionMessage = Database['public']['Tables']['session_messages']['Row']