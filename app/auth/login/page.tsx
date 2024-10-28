import { Metadata } from "next"
import { LoginForm } from "@/components/auth/LoginForm"

export const metadata: Metadata = {
  title: "Login | Al'Raajih Quran Institute",
  description: "Sign in to your Al'Raajih Quran Institute account",
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background/95 backdrop-blur-sm">
      <LoginForm />
    </div>
  )
}