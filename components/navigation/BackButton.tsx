"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useRouter, usePathname } from "next/navigation"

interface BackButtonProps {
  label?: string
  className?: string
  fallbackPath?: string
}

export function BackButton({ 
  label = "Back", 
  className = "",
  fallbackPath
}: BackButtonProps) {
  const router = useRouter()
  const pathname = usePathname()

  const handleBack = () => {
    if (pathname.startsWith('/teacher')) {
      if (pathname === '/teacher/students' || 
          pathname === '/teacher/courses' ||
          pathname === '/teacher/grading' ||
          pathname === '/teacher/reports' ||
          pathname === '/teacher/resources') {
        router.push('/teacher')
      } else {
        router.back()
      }
    } else if (pathname.startsWith('/student')) {
      if (pathname === '/student/dashboard') {
        router.push('/')
      } else {
        router.push('/student/dashboard')
      }
    } else if (fallbackPath) {
      router.push(fallbackPath)
    } else {
      router.back()
    }
  }

  return (
    <Button 
      variant="ghost" 
      className={`gap-2 mb-4 ${className}`}
      onClick={handleBack}
    >
      <ArrowLeft className="h-4 w-4" />
      {label}
    </Button>
  )
}