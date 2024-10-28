"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

interface MediaDeviceSelectorProps {
  devices: MediaDeviceInfo[]
  selectedDevice: string
  onDeviceChange: (deviceId: string) => void
  type: "videoinput" | "audioinput"
}

export function MediaDeviceSelector({
  devices,
  selectedDevice,
  onDeviceChange,
  type
}: MediaDeviceSelectorProps) {
  const filteredDevices = devices.filter(device => device.kind === type)

  return (
    <div className="space-y-2">
      <Label>{type === "videoinput" ? "Camera" : "Microphone"}</Label>
      <Select value={selectedDevice} onValueChange={onDeviceChange}>
        <SelectTrigger>
          <SelectValue placeholder={`Select ${type === "videoinput" ? "camera" : "microphone"}`} />
        </SelectTrigger>
        <SelectContent>
          {filteredDevices.map(device => (
            <SelectItem key={device.deviceId} value={device.deviceId}>
              {device.label || `${type === "videoinput" ? "Camera" : "Microphone"} ${device.deviceId.slice(0, 5)}`}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}