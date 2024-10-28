"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { 
  Mic, MicOff, Video, VideoOff, 
  ScreenShare, PhoneOff, Settings,
  Volume2, VolumeX
} from "lucide-react"

interface VideoControlsProps {
  onToggleAudio: () => void
  onToggleVideo: () => void
  onToggleScreenShare: () => void
  onLeaveSession: () => void
  isAudioEnabled: boolean
  isVideoEnabled: boolean
  isScreenSharing: boolean
}

export function VideoControls({
  onToggleAudio,
  onToggleVideo,
  onToggleScreenShare,
  onLeaveSession,
  isAudioEnabled,
  isVideoEnabled,
  isScreenSharing
}: VideoControlsProps) {
  const [volume, setVolume] = useState(100)
  const [isMuted, setIsMuted] = useState(false)

  return (
    <div className="flex items-center justify-center gap-4 p-4 bg-background/95 backdrop-blur-sm border rounded-lg">
      <Button
        variant={isAudioEnabled ? "default" : "destructive"}
        size="icon"
        onClick={onToggleAudio}
      >
        {isAudioEnabled ? (
          <Mic className="h-4 w-4" />
        ) : (
          <MicOff className="h-4 w-4" />
        )}
      </Button>

      <Button
        variant={isVideoEnabled ? "default" : "destructive"}
        size="icon"
        onClick={onToggleVideo}
      >
        {isVideoEnabled ? (
          <Video className="h-4 w-4" />
        ) : (
          <VideoOff className="h-4 w-4" />
        )}
      </Button>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsMuted(!isMuted)}
        >
          {isMuted ? (
            <VolumeX className="h-4 w-4" />
          ) : (
            <Volume2 className="h-4 w-4" />
          )}
        </Button>
        <Slider
          defaultValue={[100]}
          max={100}
          step={1}
          value={[volume]}
          onValueChange={([value]) => setVolume(value)}
          className="w-24"
        />
      </div>

      <Button
        variant={isScreenSharing ? "secondary" : "outline"}
        size="icon"
        onClick={onToggleScreenShare}
      >
        <ScreenShare className="h-4 w-4" />
      </Button>

      <Button variant="outline" size="icon">
        <Settings className="h-4 w-4" />
      </Button>

      <Button variant="destructive" size="icon" onClick={onLeaveSession}>
        <PhoneOff className="h-4 w-4" />
      </Button>
    </div>
  )
}