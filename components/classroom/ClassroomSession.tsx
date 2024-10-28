"use client"

import { useState } from "react"
import { useMediaDevices } from "@/hooks/useMediaDevices"
import { PreviewVideo } from "./PreviewVideo"
import { VideoPortal } from "./VideoPortal"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MediaDeviceSelector } from "./MediaDeviceSelector"
import { 
  Mic, MicOff, Video, VideoOff, 
  Settings, X 
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useSession } from "@/hooks/useSession"

interface JoinViewProps {
  onJoin: () => void
  stream: MediaStream | null
  error: { type: string; message: string } | null
  isVideoEnabled: boolean
  isAudioEnabled: boolean
  toggleVideo: () => void
  toggleAudio: () => void
  devices: MediaDeviceInfo[]
  selectedCamera: string
  selectedMicrophone: string
  onCameraChange: (deviceId: string) => void
  onMicrophoneChange: (deviceId: string) => void
}

function JoinView({ 
  onJoin, 
  stream, 
  error,
  isVideoEnabled,
  isAudioEnabled,
  toggleVideo,
  toggleAudio,
  devices,
  selectedCamera,
  selectedMicrophone,
  onCameraChange,
  onMicrophoneChange
}: JoinViewProps) {
  const router = useRouter()

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
                  onClick={toggleVideo}
                >
                  {isVideoEnabled ? (
                    <Video className="h-4 w-4" />
                  ) : (
                    <VideoOff className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <PreviewVideo 
                stream={stream} 
                error={error}
                isLoading={false}
                isMirrored={true}
              />
            </div>

            <div className="space-y-4">
              <MediaDeviceSelector
                devices={devices}
                selectedDevice={selectedCamera}
                onDeviceChange={onCameraChange}
                type="videoinput"
              />

              <MediaDeviceSelector
                devices={devices}
                selectedDevice={selectedMicrophone}
                onDeviceChange={onMicrophoneChange}
                type="audioinput"
              />
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Microphone</span>
              <Button 
                variant="outline" 
                size="sm"
                onClick={toggleAudio}
              >
                {isAudioEnabled ? (
                  <Mic className="h-4 w-4" />
                ) : (
                  <MicOff className="h-4 w-4" />
                )}
              </Button>
            </div>

            {error && (
              <p className="text-sm text-destructive">
                {error.message}
              </p>
            )}

            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => router.back()}
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button 
                className="flex-1"
                onClick={onJoin}
                disabled={!isVideoEnabled && !isAudioEnabled}
              >
                Join Class
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

interface ClassroomSessionProps {
  sessionId: string
}

export function ClassroomSession({ sessionId }: ClassroomSessionProps) {
  const [isJoined, setIsJoined] = useState(false)
  const { 
    stream,
    error,
    isVideoEnabled,
    isAudioEnabled,
    devices,
    selectedCamera,
    selectedMicrophone,
    toggleVideo,
    toggleAudio,
    stopMedia,
    startMedia,
    switchCamera,
    switchMicrophone
  } = useMediaDevices()

  const { session, participants, messages, joinSession, leaveSession } = useSession(sessionId)

  const handleJoin = async () => {
    try {
      // Start media devices if not already started
      if (!stream) {
        await startMedia(isVideoEnabled, isAudioEnabled)
      }

      // Join the session in the backend
      await joinSession()

      setIsJoined(true)
    } catch (error) {
      console.error('Error joining session:', error)
    }
  }

  const handleLeave = async () => {
    try {
      await leaveSession()
      stopMedia()
      setIsJoined(false)
    } catch (error) {
      console.error('Error leaving session:', error)
    }
  }

  if (!isJoined) {
    return (
      <JoinView 
        onJoin={handleJoin}
        stream={stream}
        error={error}
        isVideoEnabled={isVideoEnabled}
        isAudioEnabled={isAudioEnabled}
        toggleVideo={toggleVideo}
        toggleAudio={toggleAudio}
        devices={devices}
        selectedCamera={selectedCamera}
        selectedMicrophone={selectedMicrophone}
        onCameraChange={switchCamera}
        onMicrophoneChange={switchMicrophone}
      />
    )
  }

  return (
    <VideoPortal
      sessionId={sessionId}
      stream={stream}
      isVideoEnabled={isVideoEnabled}
      isAudioEnabled={isAudioEnabled}
      toggleVideo={toggleVideo}
      toggleAudio={toggleAudio}
      onLeave={handleLeave}
      participants={participants}
      messages={messages}
    />
  )
}