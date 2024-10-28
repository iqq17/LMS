"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Crown, PlayCircle, Users, Clock, BookOpen, GraduationCap, Book, Award } from "lucide-react"
import { useRouter } from "next/navigation"

const premiumCourses = [
  {
    id: "study-qaaidah",
    title: "Study Qaaidah",
    description: "Master the fundamentals of Arabic letters and Quranic reading",
    instructor: "Sheikh Ahmad",
    duration: "8 weeks",
    students: 120,
    level: "Beginner",
    image: "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?q=80&w=400&h=250&fit=crop",
    features: [
      "Interactive letter recognition",
      "Pronunciation practice",
      "One-on-one guidance",
      "Progress assessments"
    ]
  },
  {
    id: "tajweed-course",
    title: "Tajweed Course",
    description: "Comprehensive theoretical and practical Tajweed training",
    instructor: "Sheikh Mohammed",
    duration: "16 weeks",
    students: 85,
    level: "Intermediate",
    image: "https://images.unsplash.com/photo-1585036156171-384164a8c675?q=80&w=400&h=250&fit=crop",
    features: [
      "Theoretical foundations",
      "Practical application",
      "Weekly live sessions",
      "Recording analysis"
    ]
  },
  {
    id: "arabic-course",
    title: "Arabic Course",
    description: "Learn Quranic Arabic for better understanding",
    instructor: "Ustadh Ali",
    duration: "24 weeks",
    students: 65,
    level: "All Levels",
    image: "https://images.unsplash.com/photo-1579187707643-35646d22b596?q=80&w=400&h=250&fit=crop",
    features: [
      "Grammar fundamentals",
      "Vocabulary building",
      "Conversation practice",
      "Quranic context"
    ]
  },
  {
    id: "qiraat-al-ashr",
    title: "Qiraa'aat Al-Ashr",
    description: "Master the ten authentic modes of Quranic recitation",
    instructor: "Sheikh Yusuf",
    duration: "48 weeks",
    students: 30,
    level: "Advanced",
    image: "https://images.unsplash.com/photo-1584286595398-a59511d7a38c?q=80&w=400&h=250&fit=crop",
    features: [
      "All ten readings",
      "Expert guidance",
      "Historical context",
      "Certification path"
    ]
  },
  {
    id: "hifdh-course",
    title: "Hifdh Course",
    description: "Structured Quran memorization program with expert guidance",
    instructor: "Sheikh Hassan",
    duration: "Flexible",
    students: 150,
    level: "All Levels",
    image: "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?q=80&w=400&h=250&fit=crop",
    features: [
      "Personalized pace",
      "Memory techniques",
      "Regular revision",
      "Progress tracking"
    ]
  },
  {
    id: "ijaazah-program",
    title: "Ijaazah Program",
    description: "Earn your Ijaazah in Quran recitation and teaching",
    instructor: "Sheikh Abdul Rahman",
    duration: "2-3 years",
    students: 25,
    level: "Expert",
    image: "https://images.unsplash.com/photo-1585036156171-384164a8c675?q=80&w=400&h=250&fit=crop",
    features: [
      "Complete Quran study",
      "Chain of narration",
      "Teaching certification",
      "Global recognition"
    ]
  }
]

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

export function PremiumCourses() {
  const router = useRouter()

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="p-8 space-y-8"
    >
      <motion.div variants={item}>
        <div className="flex items-center gap-2 mb-2">
          <Crown className="h-6 w-6 text-yellow-500" />
          <h1 className="text-3xl font-bold tracking-tight">
            <span className="gradient-text">Premium Courses</span>
          </h1>
        </div>
        <p className="text-muted-foreground">
          Transform your Quranic journey with our comprehensive premium courses.
        </p>
      </motion.div>

      <motion.div
        variants={container}
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
      >
        {premiumCourses.map((course) => (
          <motion.div key={course.id} variants={item}>
            <Card className="hover-card-effect overflow-hidden">
              <div className="relative h-48">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <Badge
                  variant="secondary"
                  className="absolute top-4 right-4 bg-yellow-500/90 text-white border-0"
                >
                  Premium
                </Badge>
              </div>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{course.title}</span>
                  <Badge variant="outline">{course.level}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {course.description}
                </p>

                <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {course.duration}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {course.students} enrolled
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Course Features:</h4>
                  <ul className="space-y-1">
                    {course.features.map((feature, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                        <Crown className="h-3 w-3 text-yellow-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex gap-3">
                  <Button 
                    className="flex-1"
                    onClick={() => router.push(`/courses/${course.id}`)}
                  >
                    <PlayCircle className="h-4 w-4 mr-2" />
                    Start Course
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => router.push(`/video-portal/preview-${course.id}`)}
                  >
                    Preview
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  )
}