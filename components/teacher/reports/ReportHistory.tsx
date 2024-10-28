"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Download, Eye } from "lucide-react"

const reports = [
  {
    id: 1,
    title: "March Progress Report",
    type: "Progress",
    generated: "2024-03-15",
    students: 12,
    size: "245 KB"
  },
  {
    id: 2,
    title: "February Attendance Report",
    type: "Attendance",
    generated: "2024-02-28",
    students: 15,
    size: "180 KB"
  }
]

export function ReportHistory() {
  return (
    <div className="space-y-4">
      {reports.map((report) => (
        <Card key={report.id} className="hover-card-effect">
          <CardContent className="p-6">
            <div className="flex items-center gap-6">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{report.title}</h3>
                  <span className="text-sm text-muted-foreground">{report.size}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div>
                    {report.type} • {report.students} students
                  </div>
                  <div>Generated on {new Date(report.generated).toLocaleDateString()}</div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="icon">
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}