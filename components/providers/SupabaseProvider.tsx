"use client"

import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/lib/supabase/database.types'

type SupabaseContext = {
  supabase: SupabaseClient<Database>
  initialized: boolean
}

const Context = createContext<SupabaseContext | undefined>(undefined)

export default function SupabaseProvider({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
          // Handle auth state changes
        })

        setInitialized(true)

        return () => {
          subscription.unsubscribe()
        }
      } catch (error) {
        console.error('Error initializing auth:', error)
        setInitialized(true) // Still mark as initialized to prevent hanging
      }
    }

    initializeAuth()
  }, [])

  const value = {
    supabase,
    initialized
  }

  // Don't render children until auth is initialized
  if (!initialized) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <Context.Provider value={value}>
      {children}
    </Context.Provider>
  )
}

export const useSupabase = () => {
  const context = useContext(Context)
  if (context === undefined) {
    throw new Error('useSupabase must be used inside SupabaseProvider')
  }
  return context
}