"use client"

import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  },
  db: {
    schema: 'public'
  },
  global: {
    headers: {
      'x-application-name': 'alraajih-institute'
    }
  }
})

// Helper function to check connection
export async function checkSupabaseConnection() {
  try {
    const { data, error } = await supabase
      .from('health_check')
      .select('*')
      .limit(1)
      .single()

    if (error) throw error
    return { connected: true, data }
  } catch (error) {
    console.error('Supabase connection error:', error)
    return { connected: false, error }
  }
}