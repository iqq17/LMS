"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/lib/supabase/client"
import { Loader2 } from "lucide-react"

interface LoginFormProps {
  role: "student" | "teacher"
}

export function LoginForm({ role }: LoginFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      setLoading(true)

      // Sign in with Supabase
      const { data: { user }, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (signInError) throw signInError

      if (user) {
        // Get user profile to check role
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single()

        if (profileError) throw profileError

        // Verify role matches
        if (profile.role !== role) {
          throw new Error(`Invalid account type. Please use the ${role} login.`)
        }

        toast({
          title: "Success",
          description: "Successfully logged in",
        })

        // Redirect based on role
        router.push(role === "teacher" ? "/teacher" : "/student")
      }
    } catch (error: any) {
      console.error("Login error:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to sign in",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <Button className="w-full" type="submit" disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Signing in...
          </>
        ) : (
          `Sign in as ${role === "teacher" ? "Teacher" : "Student"}`
        )}
      </Button>
      <div className="text-center">
        <Button variant="link" className="text-xs text-muted-foreground">
          Forgot password?
        </Button>
      </div>
    </form>
  )
}