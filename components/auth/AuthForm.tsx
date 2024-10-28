"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, School, Eye, EyeOff } from "lucide-react"
import { signIn, AuthError } from "@/lib/auth"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

interface AuthFormState {
  email: string
  password: string
  showPassword: boolean
  role: "student" | "teacher"
  loading: boolean
  error: string | null
}

const testCredentials = {
  student: {
    email: "abdullah@example.com",
    password: "password123"
  },
  teacher: {
    email: "sheikh.ahmad@alraajih.com",
    password: "password123"
  }
}

export function AuthForm() {
  const [formState, setFormState] = useState<AuthFormState>({
    email: "",
    password: "",
    showPassword: false,
    role: "student",
    loading: false,
    error: null
  })

  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  const updateFormState = (updates: Partial<AuthFormState>) => {
    setFormState(prev => ({ ...prev, ...updates }))
  }

  const clearError = () => {
    updateFormState({ error: null })
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()

    const { email, password, role } = formState

    try {
      updateFormState({ loading: true })

      const { user, profile, session } = await signIn(email, password)

      if (!session) {
        throw new AuthError('Session creation failed')
      }

      if (profile.role !== role) {
        throw new AuthError(
          `This account is registered as a ${profile.role}. Please select the correct role.`,
          'ROLE_MISMATCH'
        )
      }

      const redirect = searchParams.get("redirect") || `/${role}`

      toast({
        title: "Welcome back!",
        description: `Successfully signed in as ${profile.first_name}`,
      })

      router.push(redirect)
      router.refresh()

    } catch (error) {
      console.error('Sign in error:', error)
      
      const message = error instanceof AuthError 
        ? error.message
        : 'An unexpected error occurred. Please try again.'

      updateFormState({ error: message })
      
      toast({
        title: "Authentication Error",
        description: message,
        variant: "destructive",
      })
    } finally {
      updateFormState({ loading: false })
    }
  }

  const handlePreview = () => {
    const { role } = formState
    const credentials = testCredentials[role]
    updateFormState({ 
      email: credentials.email,
      password: credentials.password 
    })
    router.push(`/${role}?preview=true`)
  }

  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="space-y-1">
        <div className="flex items-center gap-2 mb-2">
          <School className="h-6 w-6 text-primary" />
          <CardTitle className="text-2xl gradient-text">Welcome Back</CardTitle>
        </div>
        <CardDescription>
          Choose your role and sign in to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs 
          value={formState.role} 
          onValueChange={(value: "student" | "teacher") => {
            clearError()
            updateFormState({ role: value })
          }}
        >
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="student">Student</TabsTrigger>
            <TabsTrigger value="teacher">Teacher</TabsTrigger>
          </TabsList>

          <form onSubmit={handleLogin} className="space-y-4">
            <AnimatePresence mode="wait">
              {formState.error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-3 rounded-md bg-destructive/15 text-destructive text-sm"
                >
                  {formState.error}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={formState.email}
                onChange={(e) => {
                  clearError()
                  updateFormState({ email: e.target.value })
                }}
                required
                className="bg-background"
                disabled={formState.loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={formState.showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formState.password}
                  onChange={(e) => {
                    clearError()
                    updateFormState({ password: e.target.value })
                  }}
                  required
                  className="bg-background pr-10"
                  disabled={formState.loading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => updateFormState({ showPassword: !formState.showPassword })}
                  disabled={formState.loading}
                >
                  {formState.showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <Link 
                  href="/auth/forgot-password" 
                  className="text-sm text-primary hover:underline"
                >
                  Forgot password?
                </Link>
                <Link 
                  href="/auth/register" 
                  className="text-sm text-primary hover:underline"
                >
                  Create account
                </Link>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={formState.loading}
            >
              {formState.loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or
                </span>
              </div>
            </div>

            <Button 
              type="button" 
              variant="outline" 
              className="w-full"
              onClick={handlePreview}
              disabled={formState.loading}
            >
              Preview {formState.role === "teacher" ? "Teacher" : "Student"} Dashboard
            </Button>
          </form>
        </Tabs>
      </CardContent>
    </Card>
  )
}