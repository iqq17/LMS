"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { TEACHER_NAV_ITEMS, STUDENT_NAV_ITEMS, COMMON_NAV_ITEMS } from "@/lib/constants/navigation"

export function MainNav() {
  const pathname = usePathname()
  const router = useRouter()
  const { isTeacher } = useAuth()

  const navItems = [...(isTeacher ? TEACHER_NAV_ITEMS : STUDENT_NAV_ITEMS), ...COMMON_NAV_ITEMS]

  const handleNavigation = (href: string) => {
    router.push(href)
  }

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === href
    }
    return pathname.startsWith(href)
  }

  return (
    <ScrollArea className="flex-1 py-2">
      <div className="space-y-1 px-2">
        {navItems.map((item) => (
          <Button
            key={item.href}
            variant={isActive(item.href) ? "secondary" : "ghost"}
            className={cn(
              "w-full justify-start gap-2",
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
  )
}