"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { Card } from "@/components/ui/card"

const data = [
  {
    name: "Week 1",
    hours: 12,
    assignments: 8,
    sessions: 5
  },
  {
    name: "Week 2",
    hours: 15,
    assignments: 10,
    sessions: 6
  },
  {
    name: "Week 3",
    hours: 18,
    assignments: 12,
    sessions: 7
  },
  {
    name: "Week 4",
    hours: 16,
    assignments: 9,
    sessions: 6
  }
]

export function Overview() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}`}
        />
        <Tooltip 
          contentStyle={{ 
            background: "hsl(var(--background))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "var(--radius)"
          }}
        />
        <Bar
          dataKey="hours"
          fill="hsl(var(--primary))"
          radius={[4, 4, 0, 0]}
          name="Study Hours"
        />
        <Bar
          dataKey="assignments"
          fill="hsl(var(--secondary))"
          radius={[4, 4, 0, 0]}
          name="Assignments"
        />
        <Bar
          dataKey="sessions"
          fill="hsl(var(--accent))"
          radius={[4, 4, 0, 0]}
          name="Sessions"
        />
      </BarChart>
    </ResponsiveContainer>
  )
}