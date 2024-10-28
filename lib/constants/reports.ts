export const REPORT_TYPES = {
  STUDENT: {
    PROGRESS: 'student_progress',
    ATTENDANCE: 'student_attendance',
    PERFORMANCE: 'student_performance',
    ACHIEVEMENTS: 'student_achievements'
  },
  CLASS: {
    OVERVIEW: 'class_overview',
    PARTICIPATION: 'class_participation',
    ASSESSMENT: 'class_assessment'
  },
  TEACHER: {
    WORKLOAD: 'teacher_workload',
    EFFECTIVENESS: 'teacher_effectiveness',
    FEEDBACK: 'teacher_feedback'
  },
  ADMIN: {
    ENROLLMENT: 'enrollment_stats',
    RETENTION: 'retention_stats',
    FINANCIAL: 'financial_stats'
  }
} as const

export const REPORT_TEMPLATES = {
  [REPORT_TYPES.STUDENT.PROGRESS]: {
    title: 'Student Progress Report',
    metrics: [
      'course_completion',
      'assignment_grades',
      'attendance_rate',
      'participation_score'
    ],
    charts: [
      'progress_timeline',
      'grade_distribution'
    ]
  },
  [REPORT_TYPES.CLASS.OVERVIEW]: {
    title: 'Class Overview Report',
    metrics: [
      'average_attendance',
      'completion_rate',
      'average_grade',
      'participation_rate'
    ],
    charts: [
      'attendance_trend',
      'performance_distribution'
    ]
  }
} as const

export const REPORT_FREQUENCIES = {
  DAILY: 'daily',
  WEEKLY: 'weekly',
  MONTHLY: 'monthly',
  QUARTERLY: 'quarterly'
} as const