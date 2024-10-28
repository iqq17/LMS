"use client"

import { AuthForm } from "@/components/auth/AuthForm"
import { motion } from "framer-motion"

export default function AuthPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background/95 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-4"
      >
        <AuthForm />
      </motion.div>
    </div>
  )
}