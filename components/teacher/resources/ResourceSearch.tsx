"use client"

import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter } from "lucide-react"

interface ResourceSearchProps {
  onSearch: (query: string) => void
  onTypeChange: (type: string | null) => void
}

export function ResourceSearch({ onSearch, onTypeChange }: ResourceSearchProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search resources..."
          onChange={(e) => onSearch(e.target.value)}
          className="pl-9"
        />
      </div>
      <Select onValueChange={(value) => onTypeChange(value === "all" ? null : value)}>
        <SelectTrigger className="w-[180px]">
          <Filter className="h-4 w-4 mr-2" />
          <SelectValue placeholder="Filter by type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          <SelectItem value="pdf">PDF Documents</SelectItem>
          <SelectItem value="video">Video Content</SelectItem>
          <SelectItem value="audio">Audio Content</SelectItem>
          <SelectItem value="document">Other Documents</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}