"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Users, MessageSquare, Heart, Share2 } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const discussions = [
  {
    id: 1,
    user: {
      name: "Sarah Ahmed",
      avatar: "https://i.pravatar.cc/150?u=sarah",
      initials: "SA"
    },
    content: "Looking for study partners for Surah Al-Baqarah memorization 🤲",
    likes: 12,
    comments: 5,
    time: "2 hours ago"
  },
  {
    id: 2,
    user: {
      name: "Mohammed Ali",
      avatar: "https://i.pravatar.cc/150?u=mohammed",
      initials: "MA"
    },
    content: "Just completed my Ijazah in Hafs! Happy to help anyone with Tajweed questions.",
    likes: 24,
    comments: 8,
    time: "4 hours ago"
  }
]

const studyGroups = [
  {
    id: 1,
    name: "Tajweed Circle",
    members: 45,
    description: "Weekly Tajweed practice and discussion",
    image: "https://images.unsplash.com/photo-1585036156171-384164a8c675?w=100&h=100&fit=crop"
  },
  {
    id: 2,
    name: "Hifdh Support",
    members: 32,
    description: "Support group for memorization",
    image: "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=100&h=100&fit=crop"
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

export function CommunityHub() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="p-8 space-y-8"
    >
      <motion.div variants={item}>
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          <span className="gradient-text">Community</span>
        </h1>
        <p className="text-muted-foreground">Connect with fellow students and share your journey.</p>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-3">
        <motion.div variants={item} className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex gap-4">
                <Avatar>
                  <AvatarImage src="https://i.pravatar.cc/150?u=user" />
                  <AvatarFallback>UN</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <Input placeholder="Share something with the community..." className="mb-3" />
                  <Button>Post</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {discussions.map((post) => (
            <motion.div key={post.id} variants={item}>
              <Card className="hover-card-effect">
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <Avatar>
                      <AvatarImage src={post.user.avatar} />
                      <AvatarFallback>{post.user.initials}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-2">
                      <div className="flex justify-between">
                        <h3 className="font-semibold">{post.user.name}</h3>
                        <span className="text-sm text-muted-foreground">{post.time}</span>
                      </div>
                      <p>{post.content}</p>
                      <div className="flex gap-6 pt-2">
                        <Button variant="ghost" size="sm" className="gap-2">
                          <Heart className="h-4 w-4" /> {post.likes}
                        </Button>
                        <Button variant="ghost" size="sm" className="gap-2">
                          <MessageSquare className="h-4 w-4" /> {post.comments}
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <motion.div variants={item} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Study Groups</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {studyGroups.map((group) => (
                <div key={group.id} className="flex items-center gap-4">
                  <img
                    src={group.image}
                    alt={group.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold">{group.name}</h4>
                    <p className="text-sm text-muted-foreground">{group.description}</p>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Users className="h-3 w-3" />
                      {group.members} members
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Join</Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  )
}