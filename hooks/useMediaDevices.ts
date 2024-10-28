"use client"

import { useState, useEffect, useCallback } from "react"

interface MediaDevicesError {
  type: string
  message: string
}

interface MediaDeviceSettings {
  video: {
    width: number
    height: number
    frameRate: number
    facingMode: string
  }
  audio: {
    echoCancellation: boolean
    noiseSuppression: boolean
    autoGainControl: boolean
    sampleRate: number
    channelCount: number
  }
}

export function useMediaDevices() {
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [error, setError] = useState<MediaDevicesError | null>(null)
  const [isVideoEnabled, setIsVideoEnabled] = useState(true)
  const [isAudioEnabled, setIsAudioEnabled] = useState(true)
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([])
  const [selectedCamera, setSelectedCamera] = useState<string>("")
  const [selectedMicrophone, setSelectedMicrophone] = useState<string>("")

  // High-quality media settings
  const defaultSettings: MediaDeviceSettings = {
    video: {
      width: 1920,
      height: 1080,
      frameRate: 30,
      facingMode: "user"
    },
    audio: {
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: true,
      sampleRate: 48000,
      channelCount: 2
    }
  }

  // Fetch available devices
  const getDevices = useCallback(async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices()
      setDevices(devices)

      // Set default devices if not already set
      const defaultCamera = devices.find(d => d.kind === "videoinput")
      const defaultMic = devices.find(d => d.kind === "audioinput")

      if (defaultCamera && !selectedCamera) {
        setSelectedCamera(defaultCamera.deviceId)
      }
      if (defaultMic && !selectedMicrophone) {
        setSelectedMicrophone(defaultMic.deviceId)
      }
    } catch (err: any) {
      console.error("Error getting devices:", err)
      setError({
        type: "DeviceEnumeration",
        message: "Unable to access media devices"
      })
    }
  }, [selectedCamera, selectedMicrophone])

  // Initialize devices on mount
  useEffect(() => {
    getDevices()

    // Listen for device changes
    navigator.mediaDevices.addEventListener("devicechange", getDevices)
    return () => {
      navigator.mediaDevices.removeEventListener("devicechange", getDevices)
    }
  }, [getDevices])

  const startMedia = useCallback(async (video: boolean = true, audio: boolean = true) => {
    try {
      // Stop any existing streams
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
      }

      // Request permissions first
      await navigator.mediaDevices.getUserMedia({
        video: video && {
          deviceId: selectedCamera,
          ...defaultSettings.video
        },
        audio: audio && {
          deviceId: selectedMicrophone,
          ...defaultSettings.audio
        }
      })

      // Get high-quality stream after permissions granted
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: video && {
          deviceId: selectedCamera,
          width: { ideal: defaultSettings.video.width },
          height: { ideal: defaultSettings.video.height },
          frameRate: { ideal: defaultSettings.video.frameRate },
          facingMode: defaultSettings.video.facingMode
        },
        audio: audio && {
          deviceId: selectedMicrophone,
          echoCancellation: defaultSettings.audio.echoCancellation,
          noiseSuppression: defaultSettings.audio.noiseSuppression,
          autoGainControl: defaultSettings.audio.autoGainControl,
          sampleRate: defaultSettings.audio.sampleRate,
          channelCount: defaultSettings.audio.channelCount
        }
      })

      setStream(mediaStream)
      setError(null)

      // Set initial states based on tracks
      const videoTrack = mediaStream.getVideoTracks()[0]
      const audioTrack = mediaStream.getAudioTracks()[0]

      if (videoTrack) {
        setIsVideoEnabled(videoTrack.enabled)
        // Apply video constraints
        try {
          await videoTrack.applyConstraints({
            width: { ideal: defaultSettings.video.width },
            height: { ideal: defaultSettings.video.height },
            frameRate: { ideal: defaultSettings.video.frameRate }
          })
        } catch (err) {
          console.warn("Could not apply ideal video constraints:", err)
        }
      }

      if (audioTrack) {
        setIsAudioEnabled(audioTrack.enabled)
      }

    } catch (err: any) {
      console.error("Media device error:", err)
      setError({
        type: err.name,
        message: err.name === "NotAllowedError" 
          ? "Please allow access to camera and microphone"
          : err.message
      })
    }
  }, [stream, selectedCamera, selectedMicrophone])

  const stopMedia = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
    }
  }, [stream])

  const toggleVideo = useCallback(async () => {
    if (stream) {
      const videoTrack = stream.getVideoTracks()[0]
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled
        setIsVideoEnabled(videoTrack.enabled)
      } else if (!videoTrack && !isVideoEnabled) {
        await startMedia(true, isAudioEnabled)
        setIsVideoEnabled(true)
      }
    } else {
      await startMedia(true, isAudioEnabled)
      setIsVideoEnabled(true)
    }
  }, [stream, isVideoEnabled, isAudioEnabled, startMedia])

  const toggleAudio = useCallback(async () => {
    if (stream) {
      const audioTrack = stream.getAudioTracks()[0]
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled
        setIsAudioEnabled(audioTrack.enabled)
      } else if (!audioTrack && !isAudioEnabled) {
        await startMedia(isVideoEnabled, true)
        setIsAudioEnabled(true)
      }
    } else {
      await startMedia(isVideoEnabled, true)
      setIsAudioEnabled(true)
    }
  }, [stream, isVideoEnabled, isAudioEnabled, startMedia])

  const switchCamera = useCallback(async (deviceId: string) => {
    setSelectedCamera(deviceId)
    if (stream && isVideoEnabled) {
      await startMedia(true, isAudioEnabled)
    }
  }, [stream, isVideoEnabled, isAudioEnabled, startMedia])

  const switchMicrophone = useCallback(async (deviceId: string) => {
    setSelectedMicrophone(deviceId)
    if (stream && isAudioEnabled) {
      await startMedia(isVideoEnabled, true)
    }
  }, [stream, isVideoEnabled, isAudioEnabled, startMedia])

  useEffect(() => {
    return () => {
      stopMedia()
    }
  }, [stopMedia])

  return {
    stream,
    error,
    isVideoEnabled,
    isAudioEnabled,
    devices,
    selectedCamera,
    selectedMicrophone,
    startMedia,
    stopMedia,
    toggleVideo,
    toggleAudio,
    switchCamera,
    switchMicrophone
  }
}