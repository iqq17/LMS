"use client"

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useSupabase } from '@/components/providers/SupabaseProvider'
import { Button } from '@/components/ui/button'

export default function DebugPage() {
  const { supabase, initialized } = useSupabase()
  const [status, setStatus] = useState<'checking' | 'connected' | 'error'>('checking')
  const [error, setError] = useState<string | null>(null)
  const [connectionInfo, setConnectionInfo] = useState<any>(null)

  const checkConnection = async () => {
    try {
      setStatus('checking')
      setError(null)

      // Test auth status
      const { data: { session }, error: authError } = await supabase.auth.getSession()
      if (authError) throw authError

      // Test basic query
      const { data, error: queryError } = await supabase
        .from('profiles')
        .select('count')
        .single()

      if (queryError) throw queryError

      setConnectionInfo({
        auth: session ? 'authenticated' : 'not authenticated',
        database: 'connected',
        timestamp: new Date().toISOString()
      })
      setStatus('connected')
    } catch (err: any) {
      console.error('Connection check failed:', err)
      setStatus('error')
      setError(err.message || 'Failed to connect to Supabase')
    }
  }

  useEffect(() => {
    if (initialized) {
      checkConnection()
    }
  }, [initialized])

  if (!initialized) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <Card>
        <CardHeader>
          <CardTitle>Supabase Connection Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className={`h-3 w-3 rounded-full ${
                status === 'connected' ? 'bg-green-500' :
                status === 'error' ? 'bg-red-500' :
                'bg-yellow-500'
              }`} />
              <span className="font-medium">
                {status === 'connected' ? 'Connected' :
                 status === 'error' ? 'Connection Error' :
                 'Checking Connection...'}
              </span>
            </div>

            {error && (
              <div className="text-sm text-red-500">
                Error: {error}
              </div>
            )}

            {connectionInfo && (
              <pre className="p-4 bg-muted rounded-lg text-sm overflow-auto">
                {JSON.stringify(connectionInfo, null, 2)}
              </pre>
            )}

            <Button onClick={checkConnection}>
              Check Connection Again
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}