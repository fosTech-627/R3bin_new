"use client"

import { Progress } from "@/components/ui/progress"

import { Trash2, MapPin, Clock, AlertTriangle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const bins = [
  {
    id: "BIN-001",
    location: "Building A - Floor 1",
    type: "Plastic",
    fillLevel: 78,
    status: "warning",
    lastCollection: "2 hours ago",
  },
  {
    id: "BIN-002",
    location: "Building A - Floor 2",
    type: "Metal",
    fillLevel: 45,
    status: "normal",
    lastCollection: "4 hours ago",
  },
  {
    id: "BIN-003",
    location: "Building B - Lobby",
    type: "Paper",
    fillLevel: 92,
    status: "critical",
    lastCollection: "6 hours ago",
  },
  {
    id: "BIN-004",
    location: "Building B - Floor 1",
    type: "Mixed",
    fillLevel: 23,
    status: "normal",
    lastCollection: "1 hour ago",
  },
  {
    id: "BIN-005",
    location: "Building C - Cafeteria",
    type: "Plastic",
    fillLevel: 67,
    status: "normal",
    lastCollection: "3 hours ago",
  },
  {
    id: "BIN-006",
    location: "Building C - Floor 2",
    type: "Metal",
    fillLevel: 85,
    status: "warning",
    lastCollection: "5 hours ago",
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "critical":
      return "bg-destructive/10 text-destructive border-destructive/20"
    case "warning":
      return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
    default:
      return "bg-primary/10 text-primary border-primary/20"
  }
}

const getProgressColor = (fillLevel: number) => {
  if (fillLevel >= 90) return "#ef4444"
  if (fillLevel >= 70) return "#eab308"
  return "#34d399"
}

export function BinStatusCards() {
  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-foreground">Bin Status</CardTitle>
            <CardDescription className="text-muted-foreground">
              Real-time fill levels across all locations
            </CardDescription>
          </div>
          <Badge variant="outline" className="border-primary/20 text-primary">
            {bins.filter((b) => b.status === "critical").length} critical
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {bins.map((bin) => (
            <div
              key={bin.id}
              className="rounded-lg border border-border bg-secondary/50 p-4 transition-colors hover:bg-secondary"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="rounded-md bg-primary/10 p-2">
                    <Trash2 className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{bin.id}</p>
                    <p className="text-xs text-muted-foreground">{bin.type}</p>
                  </div>
                </div>
                <Badge variant="outline" className={cn("text-xs", getStatusColor(bin.status))}>
                  {bin.status === "critical" && <AlertTriangle className="mr-1 h-3 w-3" />}
                  {bin.fillLevel}%
                </Badge>
              </div>
              <div className="mt-3">
                <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-300"
                    style={{ 
                      width: `${bin.fillLevel}%`,
                      backgroundColor: getProgressColor(bin.fillLevel)
                    }}
                  />
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  <span className="truncate max-w-[120px]">{bin.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{bin.lastCollection}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
