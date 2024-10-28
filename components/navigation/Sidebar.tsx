"use client"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { School } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { TEACHER_NAV_ITEMS, STUDENT_NAV_ITEMS, COMMON_NAV_ITEMS } from "@/lib/constants/navigation"
import { cn } from "@/lib/utils"

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const isTeacher = pathname?.startsWith('/teacher')

  const navItems = [...(isTeacher ? TEACHER_NAV_ITEMS : STUDENT_NAV_ITEMS), ...COMMON_NAV_ITEMS]

  const handleNavigation = (href: string) => {
    router.push(href)
  }

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === href
    }
    return pathname?.startsWith(href)
  }

  return (
    <div className="fixed inset-y-0 left-0 w-64 border-r bg-background/60 backdrop-blur-lg z-50">
      <div className="flex h-full flex-col">
        {/* Logo & Brand */}
        <div className="border-b">
          <div className="flex h-16 items-center gap-2 px-4">
            <School className="h-6 w-6 text-primary" />
            <div className="font-semibold">
              Al&apos;Raajih Institute
            </div>
          </div>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 py-2">
          <div className="space-y-1 px-2">
            {navItems.map((item) => (
              <Button
                key={item.href}
                variant={isActive(item.href) ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start gap-2 transition-colors hover:bg-accent",
                  isActive(item.href) && "bg-secondary"
                )}
                disabled={item.disabled}
                onClick={() => handleNavigation(item.href)}
              >
                <item.icon className="h-4 w-4" />
                {item.title}
              </Button>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}