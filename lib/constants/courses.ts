// Add course types and levels
export const COURSE_TYPES = {
  QAAIDAH: 'study-qaaidah',
  TAJWEED: 'tajweed-course',
  ARABIC: 'arabic-course',
  QIRAAT: 'qiraat-al-ashr',
  HIFDH: 'hifdh-course',
  IJAZAH: 'ijazah-program'
} as const

export const COURSE_LEVELS = {
  BEGINNER: 'beginner',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced',
  EXPERT: 'expert'
} as const

export const CLASS_TIMES = [
  '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', 
  '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'
]

export const WEEKDAYS = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
]

export const COURSES = [
  {
    id: "study-qaaidah",
    title: "Study Qaaidah",
    description: "Master the fundamentals of Arabic letters and Quranic reading",
    duration: "12 weeks",
    level: COURSE_LEVELS.BEGINNER,
    prerequisites: [],
    instructor: "Sheikh Ahmad",
    image: "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?q=80&w=400&h=250&fit=crop",
    syllabus: [
      {
        title: "Introduction to Arabic Letters",
        lessons: ["Letter Recognition", "Basic Vowels", "Letter Connections"]
      },
      {
        title: "Basic Pronunciation",
        lessons: ["Articulation Points", "Letter Characteristics", "Practice Exercises"]
      }
    ]
  },
  {
    id: "tajweed-course",
    title: "Tajweed Course",
    description: "Comprehensive theoretical and practical Tajweed training",
    duration: "16 weeks",
    level: COURSE_LEVELS.INTERMEDIATE,
    prerequisites: ["Study Qaaidah"],
    instructor: "Sheikh Mohammed",
    image: "https://images.unsplash.com/photo-1585036156171-384164a8c675?q=80&w=400&h=250&fit=crop",
    syllabus: [
      {
        title: "Noon and Meem Rules",
        lessons: ["Izhaar", "Idghaam", "Ikhfaa", "Iqlaab"]
      },
      {
        title: "Madd Rules",
        lessons: ["Natural Extension", "Connected Extension", "Necessary Extension"]
      }
    ]
  },
  // ... other courses with detailed syllabi
]

export const ASSESSMENT_TYPES = {
  MEMORIZATION: 'memorization',
  TAJWEED: 'tajweed',
  WRITTEN: 'written',
  ORAL: 'oral'
} as const

export const GRADING_SCALES = {
  MEMORIZATION: {
    EXCELLENT: { min: 90, label: 'Excellent', description: 'Perfect or near-perfect memorization' },
    GOOD: { min: 80, label: 'Good', description: 'Strong memorization with minor mistakes' },
    FAIR: { min: 70, label: 'Fair', description: 'Acceptable with some mistakes' },
    NEEDS_IMPROVEMENT: { min: 0, label: 'Needs Improvement', description: 'Significant revision needed' }
  },
  TAJWEED: {
    EXCELLENT: { min: 90, label: 'Excellent', description: 'Perfect application of rules' },
    GOOD: { min: 80, label: 'Good', description: 'Minor tajweed mistakes' },
    FAIR: { min: 70, label: 'Fair', description: 'Some tajweed mistakes' },
    NEEDS_IMPROVEMENT: { min: 0, label: 'Needs Improvement', description: 'Major tajweed mistakes' }
  }
} as const

export const ACHIEVEMENT_TYPES = {
  MEMORIZATION: [
    { id: 'juz-completion', title: 'Juz Completion', points: 100 },
    { id: 'surah-mastery', title: 'Surah Mastery', points: 50 },
    { id: 'perfect-recitation', title: 'Perfect Recitation', points: 25 }
  ],
  ATTENDANCE: [
    { id: 'perfect-attendance', title: 'Perfect Attendance', points: 50 },
    { id: 'consistent-learner', title: '30-Day Streak', points: 30 }
  ],
  PARTICIPATION: [
    { id: 'active-participant', title: 'Active Participant', points: 20 },
    { id: 'helpful-peer', title: 'Helpful Peer', points: 15 }
  ]
} as const