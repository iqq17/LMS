"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePicker } from "@/components/ui/date-picker"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"
import { Download, Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabase/client"

export function GenerateReport() {
  const [loading, setLoading] = useState(false)
  const [reportType, setReportType] = useState("progress")
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [selectedStudents, setSelectedStudents] = useState<string[]>([])
  const { toast } = useToast()

  const handleGenerateReport = async () => {
    try {
      setLoading(true)

      // Fetch data based on report type
      const { data, error } = await supabase
        .from(reportType === "progress" ? "lesson_progress" : "submissions")
        .select(`
          *,
          student:profiles(
            first_name,
            last_name,
            email
          )
        `)
        .in("student_id", selectedStudents)
        .gte("created_at", startDate?.toISOString())
        .lte("created_at", endDate?.toISOString())

      if (error) throw error

      // Generate CSV
      const csv = generateCSV(data)
      
      // Download file
      const blob = new Blob([csv], { type: "text/csv" })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${reportType}-report-${new Date().toISOString()}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast({
        title: "Success",
        description: "Report generated successfully",
      })
    } catch (error: any) {
      console.error("Error generating report:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to generate report",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const generateCSV = (data: any[]) => {
    // Implementation of CSV generation based on report type
    // This is a simplified example
    const headers = Object.keys(data[0]).join(",")
    const rows = data.map(row => Object.values(row).join(",")).join("\n")
    return `${headers}\n${rows}`
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Generate Report</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Report Type</Label>
          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="progress">Progress Report</SelectItem>
              <SelectItem value="attendance">Attendance Report</SelectItem>
              <SelectItem value="assignments">Assignments Report</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Start Date</Label>
            <DatePicker date={startDate} onDateChange={setStartDate} />
          </div>
          <div className="space-y-2">
            <Label>End Date</Label>
            <DatePicker date={endDate} onDateChange={setEndDate} />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Select Students</Label>
          <div className="border rounded-lg p-4 space-y-2">
            {/* This would be populated from your database */}
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="all"
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedStudents(["student1", "student2"]) // All student IDs
                  } else {
                    setSelectedStudents([])
                  }
                }}
              />
              <label htmlFor="all" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Select All
              </label>
            </div>
            {/* Individual student checkboxes would go here */}
          </div>
        </div>

        <Button 
          className="w-full" 
          onClick={handleGenerateReport}
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating Report...
            </>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              Generate Report
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}