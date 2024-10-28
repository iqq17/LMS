export interface Course {
  id: string
  title: string
  description: string
  instructor_id: string
  level: 'beginner' | 'intermediate' | 'advanced'
  duration: string
  status: 'active' | 'scheduled' | 'completed'
  max_students: number
  current_students: number
  schedule: {
    day: string
    time: string
  }[]
  syllabus: any
  created_at: string
  updated_at: string
}

export interface Session {
  id: string
  course_id: string
  instructor_id: string
  title: string
  description: string
  start_time: string
  end_time: string
  status: 'scheduled' | 'live' | 'completed'
  participants: number
  recording_url?: string
  created_at: string
  updated_at: string
}

export const COURSE_TYPES = {
  QAAIDAH: 'study-qaaidah',
  TAJWEED: 'tajweed-course',
  ARABIC: 'arabic-course',
  QIRAAT: 'qiraat-al-ashr',
  HIFDH: 'hifdh-course',
  IJAZAH: 'ijazah-program'
} as const

export type CourseType = typeof COURSE_TYPES[keyof typeof COURSE_TYPES]