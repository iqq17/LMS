"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Mic, MicOff, Video, VideoOff, MessageSquare, Users, 
  Settings, Share2, Hand, PenTool, Download, FileText, 
  BookOpen, X 
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Whiteboard } from "../classroom/Whiteboard"
import { QuranReader } from "../classroom/QuranReader"
import { useState } from "react"
import type { SessionParticipant, SessionMessage } from "@/lib/supabase/types"

interface VideoPortalProps {
  sessionId: string
  stream: MediaStream | null
  isVideoEnabled: boolean
  isAudioEnabled: boolean
  toggleVideo: () => void
  toggleAudio: () => void
  onLeave: () => void
  participants: SessionParticipant[]
  messages: SessionMessage[]
}

export function VideoPortal({
  sessionId,
  stream,
  isVideoEnabled,
  isAudioEnabled,
  toggleVideo,
  toggleAudio,
  onLeave,
  participants,
  messages
}: VideoPortalProps) {
  const [activeTab, setActiveTab] = useState("main")
  const [isHandRaised, setIsHandRaised] = useState(false)
  const localVideoRef = useRef<HTMLVideoElement>(null)

  // Set up local video stream
  useEffect(() => {
    if (localVideoRef.current && stream) {
      localVideoRef.current.srcObject = stream
    }
  }, [stream])

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
              <Button 
                variant="destructive" 
                size="sm"
                onClick={onLeave}
              >
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
                {participants.find(p => p.role === 'teacher') ? (
                  <video
                    ref={localVideoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-white">Waiting for teacher to join...</p>
                  </div>
                )}
              </div>

              {/* Student Videos */}
              <div className="grid grid-cols-4 gap-4">
                {participants
                  .filter(p => p.role === 'student')
                  .map((participant) => (
                    <div 
                      key={participant.id} 
                      className="aspect-video bg-black rounded-lg relative overflow-hidden"
                    >
                      {/* This would be replaced with actual participant video streams */}
                      <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                        <div className="text-white text-sm">
                          {participant.profile.first_name} {participant.profile.last_name}
                        </div>
                      </div>
                    </div>
                  ))
                }
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
              onClick={toggleAudio}
            >
              {isAudioEnabled ? (
                <Mic className="h-4 w-4" />
              ) : (
                <MicOff className="h-4 w-4" />
              )}
            </Button>
            <Button 
              variant="outline" 
              size="icon"
              onClick={toggleVideo}
            >
              {isVideoEnabled ? (
                <Video className="h-4 w-4" />
              ) : (
                <VideoOff className="h-4 w-4" />
              )}
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
            
            {/* Chat Tab */}
            <TabsContent value="chat" className="p-0">
              <ScrollArea className="h-[calc(100vh-12rem)]">
                <div className="p-4 space-y-4">
                  {messages.map((msg) => (
                    <div key={msg.id} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">
                          {msg.sender.first_name} {msg.sender.last_name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(msg.created_at).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-sm">{msg.content}</p>
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

            {/* Participants Tab */}
            <TabsContent value="participants" className="p-0">
              <ScrollArea className="h-[calc(100vh-12rem)]">
                <div className="p-4 space-y-4">
                  {participants.map((participant) => (
                    <div key={participant.id} className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={participant.profile.avatar_url} />
                        <AvatarFallback>
                          {participant.profile.first_name[0]}
                          {participant.profile.last_name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="font-medium">
                          {participant.profile.first_name} {participant.profile.last_name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {participant.profile.role}
                        </div>
                      </div>
                      {participant.profile.role === "student" && isHandRaised && (
                        <Hand className="h-4 w-4 text-primary" />
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>

            {/* Resources Tab */}
            <TabsContent value="resources" className="p-0">
              <ScrollArea className="h-[calc(100vh-12rem)]">
                <div className="p-4 space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <BookOpen className="h-5 w-5 text-primary" />
                      <div>
                        <div className="font-medium">Today's Lesson</div>
                        <div className="text-sm text-muted-foreground">
                          Tajweed Rules PDF
                        </div>
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