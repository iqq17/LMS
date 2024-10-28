"use client"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { AlertCircle } from "lucide-react"

export function PreviewBanner() {
  const router = useRouter()

  return (
    <Alert variant="default" className="fixed top-4 left-4 right-4 z-50 max-w-2xl mx-auto">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription className="flex items-center justify-between">
        <span>You are viewing the preview version. Sign in to access all features.</span>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => router.push("/auth")}
        >
          Sign In
        </Button>
      </AlertDescription>
    </Alert>
  )
}