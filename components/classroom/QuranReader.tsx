"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, ChevronLeft, ChevronRight } from "lucide-react"

const surahs = [
  { id: 1, name: "Al-Fatihah", verses: 7 },
  { id: 2, name: "Al-Baqarah", verses: 286 },
  // Add more surahs
]

export function QuranReader() {
  const [selectedSurah, setSelectedSurah] = useState(1)
  const [currentVerse, setCurrentVerse] = useState(1)

  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-center gap-4">
        <Select
          value={selectedSurah.toString()}
          onValueChange={(value) => setSelectedSurah(parseInt(value))}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {surahs.map((surah) => (
              <SelectItem key={surah.id} value={surah.id.toString()}>
                {surah.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => setCurrentVerse(Math.max(1, currentVerse - 1))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm">Verse {currentVerse}</span>
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => {
              const maxVerses = surahs.find(s => s.id === selectedSurah)?.verses || 1
              setCurrentVerse(Math.min(maxVerses, currentVerse + 1))
            }}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="aspect-[4/3] bg-white rounded-lg border p-6">
        <div className="text-right space-y-4 font-arabic">
          <p className="text-2xl leading-loose">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </p>
          <p className="text-2xl leading-loose">
            الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ
          </p>
        </div>
      </div>
    </Card>
  )
}