import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')
    const next = requestUrl.searchParams.get('next') || '/'

    if (!code) {
      throw new Error('No code provided')
    }

    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    // Exchange the code for a session
    const { error: authError } = await supabase.auth.exchangeCodeForSession(code)

    if (authError) {
      console.error('Auth error:', authError)
      throw authError
    }

    // Get user profile
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
      // Check if profile exists
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (!profile) {
        // Create profile if it doesn't exist
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            email: user.email,
            role: 'student', // Default role is student
            first_name: user.user_metadata?.first_name || '',
            last_name: user.user_metadata?.last_name || '',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })

        if (insertError) {
          console.error('Profile creation error:', insertError)
        }
      }
    }

    // Redirect to the intended destination or home page
    const redirectUrl = new URL(next, requestUrl.origin)
    return NextResponse.redirect(redirectUrl)
  } catch (error) {
    console.error('Callback error:', error)
    // Redirect to login page with error message
    const errorUrl = new URL('/auth/login', request.url)
    errorUrl.searchParams.set('error', 'Authentication failed')
    return NextResponse.redirect(errorUrl)
  }
}