"use client"

import { useEffect, useRef, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Pencil, Eraser, Square, Circle, 
  Type, Image as ImageIcon, Undo2, Redo2,
  Download, Trash2
} from "lucide-react"

interface Point {
  x: number
  y: number
}

export function Whiteboard() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const contextRef = useRef<CanvasRenderingContext2D | null>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [tool, setTool] = useState<string>("pencil")
  const [color, setColor] = useState("#000000")
  const [brushSize, setBrushSize] = useState(2)
  const [history, setHistory] = useState<ImageData[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Set canvas size
    canvas.width = 800
    canvas.height = 600

    // Get context
    const context = canvas.getContext("2d")
    if (!context) return

    // Set initial styles
    context.strokeStyle = color
    context.lineWidth = brushSize
    context.lineCap = "round"
    context.lineJoin = "round"
    contextRef.current = context

    // Save initial state
    const initialState = context.getImageData(0, 0, canvas.width, canvas.height)
    setHistory([initialState])
    setHistoryIndex(0)
  }, [])

  useEffect(() => {
    if (!contextRef.current) return
    contextRef.current.strokeStyle = color
    contextRef.current.lineWidth = brushSize
  }, [color, brushSize])

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas || !contextRef.current) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    contextRef.current.beginPath()
    contextRef.current.moveTo(x, y)
    setIsDrawing(true)
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !contextRef.current || !canvasRef.current) return

    const rect = canvasRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    if (tool === "eraser") {
      contextRef.current.strokeStyle = "#ffffff"
    } else {
      contextRef.current.strokeStyle = color
    }

    contextRef.current.lineTo(x, y)
    contextRef.current.stroke()
  }

  const stopDrawing = () => {
    if (!contextRef.current || !canvasRef.current) return

    contextRef.current.closePath()
    setIsDrawing(false)

    // Save state to history
    const imageData = contextRef.current.getImageData(
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    )
    
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push(imageData)
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
  }

  const addShape = (type: "rect" | "circle") => {
    if (!contextRef.current || !canvasRef.current) return

    const context = contextRef.current
    const centerX = canvasRef.current.width / 2
    const centerY = canvasRef.current.height / 2

    context.beginPath()
    if (type === "rect") {
      context.rect(centerX - 50, centerY - 50, 100, 100)
    } else {
      context.arc(centerX, centerY, 50, 0, Math.PI * 2)
    }
    context.strokeStyle = color
    context.stroke()

    // Save state
    const imageData = context.getImageData(
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    )
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push(imageData)
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
  }

  const addText = () => {
    if (!contextRef.current || !canvasRef.current) return

    const text = prompt("Enter text:", "")
    if (!text) return

    const context = contextRef.current
    context.font = "20px Arial"
    context.fillStyle = color
    context.fillText(
      text,
      canvasRef.current.width / 2 - 50,
      canvasRef.current.height / 2
    )

    // Save state
    const imageData = context.getImageData(
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    )
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push(imageData)
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
  }

  const clearCanvas = () => {
    if (!contextRef.current || !canvasRef.current) return

    contextRef.current.clearRect(
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    )

    // Save state
    const imageData = contextRef.current.getImageData(
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    )
    const newHistory = [imageData]
    setHistory(newHistory)
    setHistoryIndex(0)
  }

  const undo = () => {
    if (historyIndex <= 0 || !contextRef.current || !canvasRef.current) return

    const newIndex = historyIndex - 1
    contextRef.current.putImageData(history[newIndex], 0, 0)
    setHistoryIndex(newIndex)
  }

  const redo = () => {
    if (
      historyIndex >= history.length - 1 ||
      !contextRef.current ||
      !canvasRef.current
    )
      return

    const newIndex = historyIndex + 1
    contextRef.current.putImageData(history[newIndex], 0, 0)
    setHistoryIndex(newIndex)
  }

  const downloadCanvas = () => {
    if (!canvasRef.current) return

    const link = document.createElement("a")
    link.download = "whiteboard.png"
    link.href = canvasRef.current.toDataURL()
    link.click()
  }

  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button 
            variant={tool === "pencil" ? "default" : "outline"} 
            size="icon"
            onClick={() => setTool("pencil")}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button 
            variant={tool === "eraser" ? "default" : "outline"} 
            size="icon"
            onClick={() => setTool("eraser")}
          >
            <Eraser className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => addShape("rect")}
          >
            <Square className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => addShape("circle")}
          >
            <Circle className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon"
            onClick={addText}
          >
            <Type className="h-4 w-4" />
          </Button>
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-8 h-8 rounded-md cursor-pointer"
          />
          <input
            type="range"
            min="1"
            max="20"
            value={brushSize}
            onChange={(e) => setBrushSize(parseInt(e.target.value))}
            className="w-24"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="icon"
            onClick={undo}
            disabled={historyIndex <= 0}
          >
            <Undo2 className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon"
            onClick={redo}
            disabled={historyIndex >= history.length - 1}
          >
            <Redo2 className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon"
            onClick={downloadCanvas}
          >
            <Download className="h-4 w-4" />
          </Button>
          <Button 
            variant="destructive" 
            size="icon"
            onClick={clearCanvas}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        className="border rounded-lg bg-white cursor-crosshair w-full"
        style={{ touchAction: "none" }}
      />
    </Card>
  )
}