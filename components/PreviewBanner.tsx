"use client"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { useRouter, useSearchParams } from "next/navigation"
import { AlertCircle } from "lucide-react"
import { motion } from "framer-motion"

export function PreviewBanner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const isPreview = searchParams.get('preview') === 'true'

  if (!isPreview) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Alert variant="default" className="fixed top-4 left-4 right-4 z-50 max-w-2xl mx-auto border-primary/50 bg-primary/5 backdrop-blur-sm">
        <AlertCircle className="h-4 w-4 text-primary" />
        <AlertDescription className="flex items-center justify-between text-primary">
          <span>You are viewing the preview version. Sign in to access all features.</span>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => router.push("/auth/login")}
              className="border-primary/50 hover:bg-primary/10"
            >
              Sign In
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => router.push("/auth/register")}
              className="border-primary/50 hover:bg-primary/10"
            >
              Register
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    </motion.div>
  )
}