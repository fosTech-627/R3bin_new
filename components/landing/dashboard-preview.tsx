"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

const wasteComposition = [
  { name: "Recyclables", value: 45, color: "#34d399" },
  { name: "Organic", value: 30, color: "#60a5fa" },
  { name: "Paper", value: 15, color: "#fbbf24" },
  { name: "General", value: 10, color: "#a78bfa" },
]

const keyMetrics = [
  { label: "Total Bins", value: "127" },
  { label: "Collection Rate", value: "94%" },
  { label: "Avg. Fill Time", value: "18" },
]

export function DashboardPreview() {
  const [activeTab, setActiveTab] = useState("live")

  return (
    <section id="dashboard" className="py-20 bg-secondary/30">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-sm text-primary font-medium mb-2">Analytics Platform</p>
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl text-balance">
            Experience Waste Intelligence in Action
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Explore real-time data visualization and analytics capabilities that power data-driven
            sustainability decisions.
          </p>
        </div>

        <Card className="bg-card border-border overflow-hidden">
          <CardHeader className="border-b border-border">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                  <span className="text-sm text-muted-foreground">Live Dashboard Preview</span>
                </span>
              </div>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="bg-secondary">
                  <TabsTrigger value="live">Live</TabsTrigger>
                  <TabsTrigger value="daily">Daily</TabsTrigger>
                  <TabsTrigger value="weekly">Weekly</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          
          <CardContent className="p-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Waste Composition */}
              <div className="lg:col-span-2 space-y-6">
                <Card className="bg-secondary/50 border-border">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base text-foreground">Waste Composition Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {wasteComposition.map((item) => (
                        <div key={item.name} className="flex items-center gap-4">
                          <div className="w-24 text-sm text-muted-foreground">{item.name}</div>
                          <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-700"
                              style={{ width: `${item.value}%`, backgroundColor: item.color }}
                            />
                          </div>
                          <div className="w-12 text-sm text-foreground text-right">{item.value}%</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Collection Schedule Heatmap */}
                <Card className="bg-secondary/50 border-border">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base text-foreground">Collection Schedule</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-7 gap-2">
                      {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                        <div key={day} className="text-center text-xs text-muted-foreground mb-2">
                          {day}
                        </div>
                      ))}
                      {Array.from({ length: 28 }).map((_, i) => (
                        <div
                          key={i}
                          className="aspect-square rounded-md transition-colors hover:ring-2 hover:ring-primary/50"
                          style={{
                            backgroundColor: `rgba(52, 211, 153, ${Math.random() * 0.8 + 0.15})`,
                          }}
                        />
                      ))}
                    </div>
                    <div className="flex items-center justify-between mt-4 text-xs text-muted-foreground">
                      <span>Less activity</span>
                      <div className="flex gap-1">
                        {[0.2, 0.4, 0.6, 0.8, 1].map((opacity) => (
                          <div
                            key={opacity}
                            className="w-3 h-3 rounded-sm"
                            style={{ backgroundColor: `rgba(52, 211, 153, ${opacity})` }}
                          />
                        ))}
                      </div>
                      <span>More activity</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Key Metrics Sidebar */}
              <div className="space-y-6">
                <Card className="bg-secondary/50 border-border">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base text-foreground">Key Metrics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {keyMetrics.map((metric) => (
                      <div key={metric.label} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                        <span className="text-sm text-muted-foreground">{metric.label}</span>
                        <span className="text-lg font-semibold text-foreground">{metric.value}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-primary/20 to-primary/5 border-primary/30">
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-foreground mb-2">AI-Powered Insights</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Based on current trends, consider adding 2 more bins near the North Wing to reduce overflow incidents.
                    </p>
                    <span className="text-xs text-primary">View recommendation details</span>
                  </CardContent>
                </Card>

                <div className="flex flex-col gap-3">
                  <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                    Explore Full Dashboard
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button variant="outline" className="w-full border-border text-foreground hover:bg-secondary bg-transparent">
                    Calculate Your ROI
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
