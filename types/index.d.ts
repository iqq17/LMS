export type StatTrend = "up" | "down" | "neutral"

export interface Stat {
  title: string
  value: string
  change: string
  icon: LucideIcon
  trend: StatTrend
}

export interface NavItem {
  title: string
  href: string
  icon: LucideIcon
  disabled?: boolean
  external?: boolean
}

export interface Session {
  id: string
  title: string
  instructor: string
  time: string
  date: Date
  participants: number
  status: "upcoming" | "live" | "completed"
}

export interface Message {
  id: number
  user: string
  content: string
  timestamp: Date
}

export interface Participant {
  id: string
  name: string
  role: "teacher" | "student"
  avatar: string
  status?: "online" | "offline" | "busy"
}