"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { supabase } from '@/lib/supabase/client'
import { Loader2, CheckCircle, XCircle, RefreshCw } from 'lucide-react'

interface ConnectionState {
  status: 'checking' | 'connected' | 'error'
  details?: {
    version?: string
    database?: string
    schema?: string
    [key: string]: any
  }
  error?: string
  lastChecked?: string
}

export function ConnectionStatus() {
  const [state, setState] = useState<ConnectionState>({
    status: 'checking'
  })

  const checkConnection = async () => {
    try {
      setState({ status: 'checking' })

      // First, try a simple query to check connection
      const { data: healthData, error: healthError } = await supabase
        .from('health_check')
        .select('*')
        .limit(1)
        .single()

      if (healthError) {
        console.error('Health check failed:', healthError)
        throw healthError
      }

      // If successful, get additional system info
      const { data: sysInfo, error: sysError } = await supabase
        .rpc('get_system_info')

      if (sysError) {
        console.error('System info check failed:', sysError)
        throw sysError
      }

      setState({
        status: 'connected',
        details: {
          ...healthData?.details,
          ...sysInfo,
          lastCheck: new Date().toISOString()
        },
        lastChecked: new Date().toISOString()
      })
    } catch (error: any) {
      console.error('Connection check failed:', error)
      setState({
        status: 'error',
        error: error.message || 'Failed to connect to database',
        lastChecked: new Date().toISOString()
      })
    }
  }

  useEffect(() => {
    checkConnection()
  }, [])

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Database Connection Status</CardTitle>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={checkConnection}
            disabled={state.status === 'checking'}
          >
            <RefreshCw className={`h-4 w-4 ${state.status === 'checking' ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="flex-1">Connection Status:</div>
            <div className="flex items-center gap-2">
              {state.status === 'checking' ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Checking connection...</span>
                </>
              ) : state.status === 'connected' ? (
                <>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-green-500">Connected</span>
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4 text-red-500" />
                  <span className="text-red-500">Connection Error</span>
                </>
              )}
            </div>
          </div>

          {state.details && (
            <div className="space-y-2 text-sm">
              {Object.entries(state.details).map(([key, value]) => (
                <div key={key} className="flex items-center gap-2">
                  <div className="flex-1 font-medium capitalize">
                    {key.replace(/_/g, ' ')}:
                  </div>
                  <div className="text-muted-foreground">
                    {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                  </div>
                </div>
              ))}
            </div>
          )}

          {state.error && (
            <div className="text-sm text-red-500 bg-red-50 dark:bg-red-950/50 p-3 rounded-md">
              Error: {state.error}
            </div>
          )}

          {state.lastChecked && (
            <div className="text-xs text-muted-foreground">
              Last checked: {new Date(state.lastChecked).toLocaleString()}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}