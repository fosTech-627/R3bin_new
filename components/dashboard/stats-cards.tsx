"use client"

import { Recycle, Scale, Leaf, TrendingUp } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const stats = [
  {
    label: "Total Waste Sorted",
    value: "2.4M",
    unit: "kg",
    change: "+12.5%",
    trend: "up",
    icon: Scale,
    description: "vs last month",
  },
  {
    label: "Recycling Rate",
    value: "94.2",
    unit: "%",
    change: "+2.3%",
    trend: "up",
    icon: Recycle,
    description: "vs last month",
  },
  {
    label: "Carbon Offset",
    value: "1,847",
    unit: "tons",
    change: "+8.7%",
    trend: "up",
    icon: Leaf,
    description: "CO₂ equivalent",
  },
  {
    label: "Active Bins",
    value: "127",
    unit: "",
    change: "+5",
    trend: "up",
    icon: TrendingUp,
    description: "across 12 sites",
  },
]

export function StatsCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="border-border bg-card">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-foreground">{stat.value}</span>
                  {stat.unit && <span className="text-lg text-muted-foreground">{stat.unit}</span>}
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-medium text-primary">{stat.change}</span>
                  <span className="text-xs text-muted-foreground">{stat.description}</span>
                </div>
              </div>
              <div className="rounded-lg bg-primary/10 p-2.5">
                <stat.icon className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
