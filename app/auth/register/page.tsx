import { Metadata } from "next"
import { RegisterForm } from "@/components/auth/RegisterForm"

export const metadata: Metadata = {
  title: "Register | Al'Raajih Quran Institute",
  description: "Create your Al'Raajih Quran Institute account",
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background/95 backdrop-blur-sm">
      <RegisterForm />
    </div>
  )
}