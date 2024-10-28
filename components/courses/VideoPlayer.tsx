"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Play, Pause, Volume2, VolumeX, Maximize2 } from "lucide-react"
import { useState } from "react"

interface VideoPlayerProps {
  lesson: {
    id: string
    title: string
    duration: string
  }
}

export function VideoPlayer({ lesson }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [progress, setProgress] = useState(0)
  const [volume, setVolume] = useState(100)

  return (
    <div className="relative aspect-video bg-black">
      <div className="absolute inset-0 flex items-center justify-center">
        <img 
          src="https://images.unsplash.com/photo-1609599006353-e629aaabfeae?q=80&w=1000&fit=crop" 
          alt="Video thumbnail"
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
        <div className="flex flex-col gap-2">
          <Slider
            defaultValue={[0]}
            max={100}
            step={1}
            value={[progress]}
            onValueChange={([value]) => setProgress(value)}
            className="w-full"
          />
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:text-white hover:bg-white/20"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:text-white hover:bg-white/20"
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

              <span className="text-sm text-white">
                0:00 / {lesson.duration}
              </span>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:text-white hover:bg-white/20"
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}