"use client"

import { useState, useEffect } from "react"
import { Recycle, Leaf, TrendingUp, Gauge } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { AnimatedNumber } from "@/components/ui/animated-number"

const logos = [
  "TechCorp",
  "EcoUniversity",
  "GreenCity",
  "SmartCampus",
]

export function ImpactStats() {
  const [deploymentCount, setDeploymentCount] = useState(127)
  const [wasteSorted, setWasteSorted] = useState(0)
  const [carbonOffset, setCarbonOffset] = useState(0)

  useEffect(() => {
    async function fetchStats() {
      const { data, error } = await supabase.rpc('get_public_impact_stats', { time_filter: 'live' })

      if (!error && data) {
        setDeploymentCount(data.active_bins || 127)

        // Calculate Total Waste (Items)
        const totalItems = (data.plastic || 0) + (data.metal || 0) + (data.paper || 0) + (data.mixed || 0)
        setWasteSorted(totalItems)

        // Calculate Carbon Offset
        // Estimating average item weights: Plastic 20g, Metal 15g, Paper 10g
        // Factors: Plastic 2.5kg CO2/kg, Metal 10kg CO2/kg, Paper 1kg CO2/kg

        // Offset = (Count * Weight_kg * Factor)
        const plasticOffset = (data.plastic || 0) * 0.02 * 2.5  // 0.05 per item
        const metalOffset = (data.metal || 0) * 0.015 * 10  // 0.15 per item
        const paperOffset = (data.paper || 0) * 0.01 * 1    // 0.01 per item

        setCarbonOffset(plasticOffset + metalOffset + paperOffset)
      }
    }
    fetchStats()
  }, [])

  const stats = [
    {
      icon: Recycle,
      value: <AnimatedNumber value={deploymentCount} decimalPlaces={0} />,
      label: "Active Deployments",
      description: "Across campuses and cities",
    },
    {
      icon: TrendingUp,
      value: <><AnimatedNumber value={wasteSorted} decimalPlaces={0} /> items</>,
      label: "Waste Sorted",
      description: "And counting daily",
    },
    {
      icon: Leaf,
      value: <><AnimatedNumber value={carbonOffset} decimalPlaces={2} /> kg</>,
      label: "Carbon Offset",
      description: "CO2 emissions prevented",
    },
    {
      icon: Gauge,
      value: <><AnimatedNumber value={50} decimalPlaces={0} />k+</>,
      label: "Training Images",
      description: "Diverse AI dataset",
    },
  ]

  return (
    <section className="py-20 border-y border-border bg-secondary/30">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-sm text-primary font-medium mb-2">Trusted by industry leaders</p>
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl text-balance">
            Proven Impact Across Sectors
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Real-time data from active deployments demonstrating measurable environmental and
            financial results.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="relative group rounded-xl bg-card border border-border p-6 transition-all hover:border-primary/50"
            >
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <stat.icon className="h-5 w-5 text-primary" />
                </div>
                <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
                <div className="text-sm font-medium text-foreground">{stat.label}</div>
                <div className="text-xs text-muted-foreground mt-1">{stat.description}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Partner logos */}
        <div className="border-t border-border pt-12">
          <p className="text-center text-sm text-muted-foreground mb-8">
            Powering Sustainability for Leading Organizations
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 lg:gap-16">
            {logos.map((logo) => (
              <div
                key={logo}
                className="text-xl font-semibold text-muted-foreground/50 hover:text-muted-foreground transition-colors"
              >
                {logo}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
