"use client"

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

const data = [
  { date: "Jan", plastic: 420, metal: 280, paper: 180, mixed: 120 },
  { date: "Feb", plastic: 480, metal: 320, paper: 210, mixed: 140 },
  { date: "Mar", plastic: 520, metal: 350, paper: 240, mixed: 160 },
  { date: "Apr", plastic: 580, metal: 380, paper: 260, mixed: 180 },
  { date: "May", plastic: 640, metal: 420, paper: 290, mixed: 200 },
  { date: "Jun", plastic: 720, metal: 460, paper: 320, mixed: 220 },
  { date: "Jul", plastic: 780, metal: 500, paper: 350, mixed: 240 },
]

export function CollectionTrends() {
  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-foreground">Collection Trends</CardTitle>
            <CardDescription className="text-muted-foreground">
              Waste collection volume over time (kg)
            </CardDescription>
          </div>
          <Tabs defaultValue="6m" className="w-fit">
            <TabsList className="bg-secondary">
              <TabsTrigger value="7d" className="text-xs">7D</TabsTrigger>
              <TabsTrigger value="1m" className="text-xs">1M</TabsTrigger>
              <TabsTrigger value="6m" className="text-xs">6M</TabsTrigger>
              <TabsTrigger value="1y" className="text-xs">1Y</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorPlastic" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#34d399" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorMetal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#60a5fa" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(140 10% 22%)" />
              <XAxis 
                dataKey="date" 
                stroke="hsl(140 10% 50%)" 
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="hsl(140 10% 50%)" 
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(140 10% 13%)",
                  border: "1px solid hsl(140 10% 22%)",
                  borderRadius: "8px",
                  color: "#fff",
                }}
              />
              <Area
                type="monotone"
                dataKey="plastic"
                stroke="#34d399"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorPlastic)"
              />
              <Area
                type="monotone"
                dataKey="metal"
                stroke="#60a5fa"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorMetal)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 flex items-center justify-center gap-6">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-[#34d399]" />
            <span className="text-sm text-muted-foreground">Plastic</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-[#60a5fa]" />
            <span className="text-sm text-muted-foreground">Metal</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-[#fbbf24]" />
            <span className="text-sm text-muted-foreground">Paper</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-[#a78bfa]" />
            <span className="text-sm text-muted-foreground">Mixed</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
