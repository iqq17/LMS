"use client"

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/components/ui/use-toast'

export interface UserSettings {
  theme: 'light' | 'dark' | 'system'
  language: string
  timezone: string
  notifications: {
    email: boolean
    push: boolean
    sms: boolean
  }
  sessionReminders: number // minutes before session
  emailDigest: 'daily' | 'weekly' | 'never'
}

export function useSettings() {
  const [settings, setSettings] = useState<UserSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    if (!user) return

    const fetchSettings = async () => {
      try {
        const { data, error } = await supabase
          .from('user_settings')
          .select('*')
          .eq('user_id', user.id)
          .single()

        if (error && error.code !== 'PGRST116') throw error

        // If no settings exist, create default settings
        if (!data) {
          const defaultSettings: Partial<UserSettings> = {
            theme: 'system',
            language: 'en',
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            notifications: {
              email: true,
              push: true,
              sms: false
            },
            sessionReminders: 30,
            emailDigest: 'weekly'
          }

          const { data: newSettings, error: createError } = await supabase
            .from('user_settings')
            .insert({
              user_id: user.id,
              ...defaultSettings
            })
            .select()
            .single()

          if (createError) throw createError
          setSettings(newSettings)
        } else {
          setSettings(data)
        }
      } catch (error) {
        console.error('Error fetching settings:', error)
        toast({
          title: "Error",
          description: "Failed to load settings",
          variant: "destructive"
        })
      } finally {
        setLoading(false)
      }
    }

    fetchSettings()
  }, [user])

  const updateSettings = async (newSettings: Partial<UserSettings>) => {
    try {
      const { error } = await supabase
        .from('user_settings')
        .update(newSettings)
        .eq('user_id', user?.id)

      if (error) throw error

      setSettings(prev => prev ? { ...prev, ...newSettings } : null)
      
      toast({
        title: "Success",
        description: "Settings updated successfully"
      })
    } catch (error) {
      console.error('Error updating settings:', error)
      toast({
        title: "Error",
        description: "Failed to update settings",
        variant: "destructive"
      })
      throw error
    }
  }

  return {
    settings,
    loading,
    updateSettings
  }
}