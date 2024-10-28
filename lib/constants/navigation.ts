import { 
  LayoutDashboard, BookOpen, Video, FileText, Users, 
  Calendar, Upload, Settings, HelpCircle, MessageSquare
} from "lucide-react"

export const TEACHER_NAV_ITEMS = [
  {
    title: "Dashboard",
    href: "/teacher/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Students",
    href: "/teacher/students",
    icon: Users,
  },
  {
    title: "Resources",
    href: "/teacher/resources",
    icon: Upload,
  },
  {
    title: "Live Sessions",
    href: "/classroom",
    icon: Video,
  },
  {
    title: "Assignments",
    href: "/teacher/assignments",
    icon: FileText,
  },
  {
    title: "Attendance",
    href: "/teacher/attendance",
    icon: Calendar,
  }
]

export const STUDENT_NAV_ITEMS = [
  {
    title: "Dashboard",
    href: "/student/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "My Courses",
    href: "/courses",
    icon: BookOpen,
  },
  {
    title: "Live Classes",
    href: "/classroom",
    icon: Video,
  },
  {
    title: "Resources",
    href: "/resources",
    icon: Upload,
  },
  {
    title: "Assignments",
    href: "/assignments",
    icon: FileText,
  },
  {
    title: "Community",
    href: "/community",
    icon: MessageSquare,
  }
]

export const COMMON_NAV_ITEMS = [
  {
    title: "Support",
    href: "/support",
    icon: HelpCircle,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  }
]