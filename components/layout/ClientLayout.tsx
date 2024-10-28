"use client"

import { Toaster } from "@/components/ui/toaster"
import { Sidebar } from "@/components/Sidebar"

interface ClientLayoutProps {
  children: React.ReactNode
}

export function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <>
      <div className="relative flex min-h-screen">
        <Sidebar />
        <main className="flex-1">
          <div className="fixed inset-0 islamic-pattern opacity-5" />
          <div className="relative">
            {children}
          </div>
        </main>
      </div>
      <Toaster />
    </>
  )
}