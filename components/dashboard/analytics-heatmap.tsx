"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
const hours = ["6am", "9am", "12pm", "3pm", "6pm", "9pm"]

// Generate heatmap data (activity levels 0-4)
const heatmapData = [
  [1, 2, 3, 4, 3, 2, 1],
  [2, 3, 4, 4, 4, 3, 2],
  [3, 4, 4, 3, 4, 4, 3],
  [2, 3, 4, 4, 4, 3, 2],
  [1, 2, 3, 3, 3, 2, 1],
  [0, 1, 1, 2, 2, 1, 0],
]

const getIntensityColor = (value: number) => {
  const colors = [
    "bg-primary/5",
    "bg-primary/20",
    "bg-primary/40",
    "bg-primary/60",
    "bg-primary/80",
  ]
  return colors[value] || colors[0]
}

export function AnalyticsHeatmap() {
  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-foreground">Activity Heatmap</CardTitle>
        <CardDescription className="text-muted-foreground">
          Collection activity by day and time
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex gap-2">
            <div className="w-12" />
            {days.map((day) => (
              <div key={day} className="flex-1 text-center text-xs text-muted-foreground">
                {day}
              </div>
            ))}
          </div>
          {heatmapData.map((row, rowIndex) => (
            <div key={hours[rowIndex]} className="flex items-center gap-2">
              <div className="w-12 text-xs text-muted-foreground">{hours[rowIndex]}</div>
              {row.map((value, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={`h-8 flex-1 rounded-md ${getIntensityColor(value)} transition-colors hover:ring-1 hover:ring-primary`}
                  title={`${days[colIndex]} ${hours[rowIndex]}: ${value * 25}% activity`}
                />
              ))}
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-end gap-2">
          <span className="text-xs text-muted-foreground">Less</span>
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className={`h-4 w-4 rounded ${getIntensityColor(i)}`} />
          ))}
          <span className="text-xs text-muted-foreground">More</span>
        </div>
      </CardContent>
    </Card>
  )
}
