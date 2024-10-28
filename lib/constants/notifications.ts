export const NOTIFICATION_TYPES = {
  COURSE: {
    NEW_ASSIGNMENT: 'new_assignment',
    ASSIGNMENT_GRADED: 'assignment_graded',
    COURSE_STARTED: 'course_started',
    COURSE_COMPLETED: 'course_completed'
  },
  SESSION: {
    UPCOMING_CLASS: 'upcoming_class',
    CLASS_STARTED: 'class_started',
    CLASS_CANCELLED: 'class_cancelled',
    CLASS_RESCHEDULED: 'class_rescheduled'
  },
  ACHIEVEMENT: {
    BADGE_EARNED: 'badge_earned',
    LEVEL_UP: 'level_up',
    MILESTONE_REACHED: 'milestone_reached'
  },
  SYSTEM: {
    MAINTENANCE: 'system_maintenance',
    ACCOUNT_UPDATE: 'account_update',
    PAYMENT_SUCCESS: 'payment_success',
    PAYMENT_FAILED: 'payment_failed'
  }
} as const

export const NOTIFICATION_TEMPLATES = {
  [NOTIFICATION_TYPES.COURSE.NEW_ASSIGNMENT]: {
    title: 'New Assignment: {title}',
    content: 'A new assignment has been posted for {course}. Due date: {dueDate}',
    priority: 'medium'
  },
  [NOTIFICATION_TYPES.SESSION.UPCOMING_CLASS]: {
    title: 'Upcoming Class Reminder',
    content: 'Your {course} class with {teacher} starts in {timeUntil}',
    priority: 'high'
  },
  [NOTIFICATION_TYPES.ACHIEVEMENT.BADGE_EARNED]: {
    title: 'New Achievement Unlocked!',
    content: 'Congratulations! You\'ve earned the {badge} badge',
    priority: 'low'
  }
} as const