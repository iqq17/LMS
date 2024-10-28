"use client"

import { createClient } from '@supabase/supabase-js'

// Validate environment variables
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL')
}
if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY')
}

export class ConnectionError extends Error {
  constructor(message: string, public code?: string) {
    super(message)
    this.name = 'ConnectionError'
  }
}

export async function checkSupabaseConnection() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )

  try {
    // First check auth service
    const { data: authData, error: authError } = await supabase.auth.getSession()
    
    if (authError) {
      throw new ConnectionError(
        'Failed to connect to auth service',
        authError.message
      )
    }

    // Then check database with a public table/view that doesn't require auth
    const { data, error } = await supabase
      .from('public_health_check')
      .select('status')
      .single()

    if (error) {
      // If table doesn't exist, check general connection
      if (error.code === '42P01') {
        const { data: versionData, error: versionError } = await supabase
          .rpc('version')

        if (versionError) {
          throw new ConnectionError(
            'Failed to connect to database',
            versionError.code
          )
        }

        return {
          connected: true,
          timestamp: new Date().toISOString(),
          version: versionData
        }
      }

      throw new ConnectionError(
        'Failed to check database status',
        error.code
      )
    }

    return {
      connected: true,
      timestamp: new Date().toISOString(),
      status: data?.status
    }
  } catch (error) {
    console.error('Supabase connection error:', error)
    throw error instanceof ConnectionError 
      ? error 
      : new ConnectionError(
          'Unable to establish connection to Supabase',
          (error as any)?.code
        )
  }
}