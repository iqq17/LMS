"use client"

import { useRef, useEffect } from "react"
import { Loader2 } from "lucide-react"

interface PreviewVideoError {
  type: string
  message: string
}

interface PreviewVideoProps {
  stream: MediaStream | null
  error: PreviewVideoError | null
  isLoading: boolean
  isMirrored?: boolean
}

export function PreviewVideo({ 
  stream, 
  error, 
  isLoading,
  isMirrored = true 
}: PreviewVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream
    }
  }, [stream])

  if (error) {
    return (
      <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
        <p className="text-sm text-muted-foreground px-4 text-center">{error.message}</p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="aspect-video bg-muted rounded-lg overflow-hidden">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className={`w-full h-full object-cover ${isMirrored ? 'mirror' : ''}`}
      />
    </div>
  )
}