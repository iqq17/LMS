"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { 
  Mic, MicOff, Video, VideoOff, MessageSquare, Users, Settings, 
  Share2, Hand, PenTool, Download, FileText, BookOpen, X
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Whiteboard } from "./Whiteboard"
import { QuranReader } from "./QuranReader"

interface ClassroomProps {
  sessionId: string
}

export function Classroom({ sessionId }: ClassroomProps) {
  const [isJoined, setIsJoined] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [isVideoOn, setIsVideoOn] = useState(false)
  const [isHandRaised, setIsHandRaised] = useState(false)
  const [activeTab, setActiveTab] = useState("main")
  const [messages, setMessages] = useState([
    { id: 1, user: "Sheikh Ahmad", message: "As-salaam-alaikum everyone", time: "2:30 PM" },
    { id: 2, user: "Student", message: "Wa-alaikum-salaam Sheikh", time: "2:31 PM" }
  ])

  const participants = [
    { id: 1, name: "Sheikh Ahmad", role: "Teacher", avatar: "https://i.pravatar.cc/150?u=sheikh" },
    { id: 2, name: "Abdullah", role: "Student", avatar: "https://i.pravatar.cc/150?u=abdullah" },
    { id: 3, name: "Sarah", role: "Student", avatar: "https://i.pravatar.cc/150?u=sarah" }
  ]

  if (!isJoined) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold gradient-text">Join Classroom</h2>
              <p className="text-muted-foreground">Tajweed Class with Sheikh Ahmad</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Camera</span>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setIsVideoOn(!isVideoOn)}
                  >
                    {isVideoOn ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
                  </Button>
                </div>
                {isVideoOn && (
                  <div className="aspect-video bg-black rounded-lg relative overflow-hidden">
                    <img 
                      src="https://i.pravatar.cc/150?u=user" 
                      alt="Camera Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Microphone</span>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setIsMuted(!isMuted)}
                >
                  {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </Button>
              </div>

              <Button 
                className="w-full"
                onClick={() => setIsJoined(true)}
              >
                Join Class
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="h-screen bg-background">
      <div className="grid h-full lg:grid-cols-4">
        <div className="lg:col-span-3 p-4 space-y-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold gradient-text">Tajweed Class</h1>
              <p className="text-muted-foreground">with Sheikh Ahmad</p>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant={isHandRaised ? "secondary" : "outline"}
                size="sm"
                onClick={() => setIsHandRaised(!isHandRaised)}
              >
                <Hand className="h-4 w-4 mr-2" />
                Raise Hand
              </Button>
              <Button variant="destructive" size="sm">
                <X className="h-4 w-4 mr-2" />
                Leave Class
              </Button>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="main">Main View</TabsTrigger>
              <TabsTrigger value="whiteboard">Whiteboard</TabsTrigger>
              <TabsTrigger value="quran">Quran Reader</TabsTrigger>
            </TabsList>

            <TabsContent value="main" className="space-y-4">
              {/* Teacher's Video */}
              <div className="aspect-video bg-black rounded-lg relative overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1609599006353-e629aaabfeae?q=80&w=1920&h=1080&fit=crop" 
                  alt="Teacher"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                  <div className="flex items-center gap-2">
                    <Avatar>
                      <AvatarImage src="https://i.pravatar.cc/150?u=sheikh" />
                      <AvatarFallback>SA</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="text-white font-medium">Sheikh Ahmad</div>
                      <div className="text-white/60 text-sm">Speaking</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Student Videos */}
              <div className="grid grid-cols-4 gap-4">
                {participants.filter(p => p.role === "Student").map((participant) => (
                  <div key={participant.id} className="aspect-video bg-black rounded-lg relative overflow-hidden">
                    <img 
                      src={participant.avatar}
                      alt={participant.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                      <div className="text-white text-sm">{participant.name}</div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="whiteboard">
              <Whiteboard />
            </TabsContent>

            <TabsContent value="quran">
              <QuranReader />
            </TabsContent>
          </Tabs>

          {/* Control Bar */}
          <div className="flex items-center justify-center gap-4 p-4 bg-background border rounded-lg">
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => setIsMuted(!isMuted)}
            >
              {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => setIsVideoOn(!isVideoOn)}
            >
              {isVideoOn ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
            </Button>
            <Button variant="outline" size="icon">
              <Share2 className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Sidebar */}
        <Card className="h-full rounded-none">
          <Tabs defaultValue="chat">
            <TabsList className="w-full">
              <TabsTrigger value="chat" className="flex-1">
                <MessageSquare className="h-4 w-4 mr-2" />
                Chat
              </TabsTrigger>
              <TabsTrigger value="participants" className="flex-1">
                <Users className="h-4 w-4 mr-2" />
                Participants
              </TabsTrigger>
              <TabsTrigger value="resources" className="flex-1">
                <FileText className="h-4 w-4 mr-2" />
                Resources
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="chat" className="p-0">
              <ScrollArea className="h-[calc(100vh-12rem)]">
                <div className="p-4 space-y-4">
                  {messages.map((msg) => (
                    <div key={msg.id} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{msg.user}</span>
                        <span className="text-xs text-muted-foreground">{msg.time}</span>
                      </div>
                      <p className="text-sm">{msg.message}</p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <Input placeholder="Type a message..." />
                  <Button>Send</Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="participants" className="p-0">
              <ScrollArea className="h-[calc(100vh-12rem)]">
                <div className="p-4 space-y-4">
                  {participants.map((participant) => (
                    <div key={participant.id} className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={participant.avatar} />
                        <AvatarFallback>{participant.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="font-medium">{participant.name}</div>
                        <div className="text-sm text-muted-foreground">{participant.role}</div>
                      </div>
                      {participant.role === "Student" && isHandRaised && (
                        <Hand className="h-4 w-4 text-primary" />
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="resources" className="p-0">
              <ScrollArea className="h-[calc(100vh-12rem)]">
                <div className="p-4 space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <BookOpen className="h-5 w-5 text-primary" />
                      <div>
                        <div className="font-medium">Today's Lesson</div>
                        <div className="text-sm text-muted-foreground">Tajweed Rules PDF</div>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  )
}