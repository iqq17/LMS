export const ACHIEVEMENTS = {
  MEMORIZATION: {
    JUZ_COMPLETION: {
      id: 'juz-completion',
      title: 'Juz Completion',
      description: 'Complete memorization of a full Juz',
      points: 100,
      icon: '📖',
      requirements: {
        type: 'memorization',
        target: 'juz',
        count: 1
      }
    },
    SURAH_MASTERY: {
      id: 'surah-mastery',
      title: 'Surah Mastery',
      description: 'Perfect recitation of a complete Surah',
      points: 50,
      icon: '⭐',
      requirements: {
        type: 'recitation',
        quality: 'perfect',
        count: 1
      }
    }
  },
  ATTENDANCE: {
    PERFECT_MONTH: {
      id: 'perfect-month',
      title: 'Perfect Month',
      description: 'Attend all scheduled classes for a month',
      points: 75,
      icon: '📅',
      requirements: {
        type: 'attendance',
        streak: 30,
        status: 'present'
      }
    }
  },
  ACADEMIC: {
    TAJWEED_MASTER: {
      id: 'tajweed-master',
      title: 'Tajweed Master',
      description: 'Score 90%+ on 5 consecutive Tajweed assessments',
      points: 150,
      icon: '🎯',
      requirements: {
        type: 'assessment',
        category: 'tajweed',
        minScore: 90,
        streak: 5
      }
    }
  },
  COMMUNITY: {
    HELPFUL_PEER: {
      id: 'helpful-peer',
      title: 'Helpful Peer',
      description: 'Receive 10 positive peer reviews',
      points: 50,
      icon: '🤝',
      requirements: {
        type: 'peer_review',
        positive: true,
        count: 10
      }
    }
  }
} as const

export const ACHIEVEMENT_LEVELS = {
  BRONZE: {
    name: 'Bronze',
    minPoints: 0,
    maxPoints: 499,
    icon: '🥉'
  },
  SILVER: {
    name: 'Silver',
    minPoints: 500,
    maxPoints: 999,
    icon: '🥈'
  },
  GOLD: {
    name: 'Gold',
    minPoints: 1000,
    maxPoints: 1999,
    icon: '🥇'
  },
  PLATINUM: {
    name: 'Platinum',
    minPoints: 2000,
    maxPoints: Infinity,
    icon: '👑'
  }
} as const