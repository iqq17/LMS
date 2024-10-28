import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') || '/'

  if (code) {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
    
    try {
      // Exchange code for session
      const { data: { user }, error: authError } = await supabase.auth.exchangeCodeForSession(code)
      
      if (authError) throw authError

      if (user) {
        // Get user profile to determine redirect
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()

        // Redirect based on user role
        const redirectUrl = new URL(
          profile?.role === 'teacher' ? '/teacher' : '/student',
          requestUrl.origin
        )
        
        return NextResponse.redirect(redirectUrl)
      }
    } catch (error) {
      console.error('Auth callback error:', error)
      
      // Redirect to login with error
      const errorUrl = new URL('/auth/login', requestUrl.origin)
      errorUrl.searchParams.set('error', 'Authentication failed')
      return NextResponse.redirect(errorUrl)
    }
  }

  // Fallback redirect
  return NextResponse.redirect(new URL('/auth/login', requestUrl.origin))
}