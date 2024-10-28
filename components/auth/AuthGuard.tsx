"use client"

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'

export function AuthGuard({ children }: { children: React.ReactNode }) {
  // Temporarily bypass authentication checks
  return <>{children}</>

  /* Authentication code commented out for development
  const { user, loading, profile } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!loading) {
      if (!user) {
        const currentPath = encodeURIComponent(pathname)
        router.push(`/auth/login?redirect=${currentPath}`)
      } else if (profile) {
        const teacherRoutes = ['/teacher', '/teacher/']
        const studentRoutes = ['/student', '/courses', '/assignments', '/progress']
        
        const isTeacherRoute = teacherRoutes.some(route => pathname.startsWith(route))
        const isStudentRoute = studentRoutes.some(route => pathname.startsWith(route))

        if (isTeacherRoute && profile.role !== 'teacher') {
          router.push('/student')
        } else if (isStudentRoute && profile.role !== 'student') {
          router.push('/teacher')
        }
      }
    }
  }, [user, loading, profile, pathname, router])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return <>{children}</>
  */
}