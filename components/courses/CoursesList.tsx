"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { BookOpen, Clock, Users, PlayCircle, GraduationCap, Award } from "lucide-react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const courses = [
  {
    id: "quran-memorization",
    title: "Quran Memorization: Juz Amma",
    description: "Start your journey with the 30th chapter of the Quran",
    progress: 75,
    duration: "12 weeks",
    students: 120,
    image: "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?q=80&w=400&h=250&fit=crop",
    instructor: "Sheikh Ahmad",
    category: "memorization",
    achievements: 3,
    nextLesson: "Surah An-Naba"
  },
  {
    id: "tajweed-fundamentals",
    title: "Tajweed Fundamentals",
    description: "Learn the essential rules of Quranic recitation",
    progress: 45,
    duration: "8 weeks",
    students: 85,
    image: "https://images.unsplash.com/photo-1585036156171-384164a8c675?q=80&w=400&h=250&fit=crop",
    instructor: "Sheikh Mohammed",
    category: "tajweed",
    achievements: 2,
    nextLesson: "Noon Sakinah Rules"
  },
  {
    id: "arabic-understanding",
    title: "Arabic for Quran Understanding",
    description: "Master the language of the Quran",
    progress: 30,
    duration: "16 weeks",
    students: 95,
    image: "https://images.unsplash.com/photo-1579187707643-35646d22b596?q=80&w=400&h=250&fit=crop",
    instructor: "Ustadh Ali",
    category: "arabic",
    achievements: 1,
    nextLesson: "Basic Grammar"
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

export function CoursesList() {
  const router = useRouter()

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="p-8 space-y-8"
    >
      <motion.div variants={item}>
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          <span className="gradient-text">My Courses</span>
        </h1>
        <p className="text-muted-foreground">Continue your learning journey with our expert-led courses.</p>
      </motion.div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All Courses</TabsTrigger>
          <TabsTrigger value="memorization">Memorization</TabsTrigger>
          <TabsTrigger value="tajweed">Tajweed</TabsTrigger>
          <TabsTrigger value="arabic">Arabic</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <motion.div
            variants={container}
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {courses.map((course) => (
              <motion.div key={course.id} variants={item}>
                <Card className="hover-card-effect overflow-hidden">
                  <div className="relative h-48">
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <Button
                      size="icon"
                      variant="secondary"
                      className="absolute right-4 bottom-4"
                      onClick={() => router.push(`/courses/${course.id}`)}
                    >
                      <PlayCircle className="h-5 w-5" />
                    </Button>
                  </div>
                  <CardHeader>
                    <CardTitle className="line-clamp-1">{course.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {course.description}
                    </p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{course.progress}%</span>
                      </div>
                      <Progress value={course.progress} className="h-2" />
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {course.duration}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {course.students}
                      </div>
                      <div className="flex items-center gap-1">
                        <GraduationCap className="h-4 w-4" />
                        {course.instructor}
                      </div>
                      <div className="flex items-center gap-1">
                        <Award className="h-4 w-4" />
                        {course.achievements} badges
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="text-sm font-medium">Next Lesson:</div>
                      <Button 
                        className="w-full"
                        onClick={() => router.push(`/courses/${course.id}`)}
                      >
                        Continue: {course.nextLesson}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </TabsContent>

        {["memorization", "tajweed", "arabic"].map((category) => (
          <TabsContent key={category} value={category}>
            <motion.div
              variants={container}
              className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            >
              {courses
                .filter((course) => course.category === category)
                .map((course) => (
                  <motion.div key={course.id} variants={item}>
                    {/* Same card component as above */}
                  </motion.div>
                ))}
            </motion.div>
          </TabsContent>
        ))}
      </Tabs>
    </motion.div>
  )
}