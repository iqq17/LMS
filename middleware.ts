import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Temporarily bypass all authentication checks
  return NextResponse.next()

  /* Authentication code commented out for development
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req: request, res })

  const {
    data: { session },
    error
  } = await supabase.auth.getSession()

  let userRole = null
  if (session?.user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()
    
    userRole = profile?.role
  }

  const isPreview = request.nextUrl.searchParams.get('preview') === 'true'

  const protectedRoutes = {
    '/teacher': ['teacher'],
    '/teacher/students': ['teacher'],
    '/teacher/courses': ['teacher'],
    '/teacher/grading': ['teacher'],
    '/teacher/reports': ['teacher'],
    '/student': ['student'],
    '/courses': ['student'],
    '/assignments': ['student'],
    '/progress': ['student'],
    '/classroom': ['student', 'teacher']
  }

  const path = request.nextUrl.pathname
  const isProtectedRoute = Object.keys(protectedRoutes).some(route => 
    path.startsWith(route)
  )

  if (isProtectedRoute && !isPreview) {
    if (!session) {
      const redirectUrl = new URL('/auth/login', request.url)
      redirectUrl.searchParams.set('redirect', request.nextUrl.pathname)
      return NextResponse.redirect(redirectUrl)
    }

    const allowedRoles = Object.entries(protectedRoutes).find(([route]) => 
      path.startsWith(route)
    )?.[1]

    if (allowedRoles && !allowedRoles.includes(userRole as string)) {
      return NextResponse.redirect(
        new URL(userRole === 'teacher' ? '/teacher' : '/student', request.url)
      )
    }
  }

  if (session && path.startsWith('/auth/')) {
    return NextResponse.redirect(
      new URL(userRole === 'teacher' ? '/teacher' : '/student', request.url)
    )
  }

  return res
  */
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}