"use client"

import { useState } from "react"
import Image from "next/image"
import { ArrowRight, Brain, Wifi, BarChart3, Leaf, Sparkles, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

import { AnimatedNumber } from "@/components/ui/animated-number"

const features = [
  {
    icon: Brain,
    label: "AI Vision",
    description: "50k+ Training Set",
    position: "top-8 -left-4 lg:-left-12",
  },
  {
    icon: Wifi,
    label: "IoT Sensors",
    description: "Real-time monitoring",
    position: "top-1/3 -right-4 lg:-right-16",
  },
  {
    icon: BarChart3,
    label: "Analytics",
    description: "Live dashboard",
    position: "bottom-1/3 -left-4 lg:-left-16",
  },
  {
    icon: Leaf,
    label: "Eco Impact",
    description: "Track carbon savings",
    position: "bottom-16 -right-4 lg:-right-12",
  },
]

export function HeroSection() {
  const [activeFeature, setActiveFeature] = useState<number | null>(null)

  return (
    <section className="relative min-h-screen pt-24 pb-16 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      {/* Animated grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(52,211,153,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(52,211,153,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />

      <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left column - Text content */}
          <div className="space-y-8 order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2">
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              <span className="text-sm text-primary">AI-Powered Waste Intelligence Platform</span>
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl text-balance">
              Intelligence at the Source Transforms{" "}
              <span className="text-primary">Waste into Wisdom</span>
            </h1>

            <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
              Every bin becomes a data point for planetary impact. R3Bin combines AI
              segregation, IoT sensors, and real-time analytics to deliver measurable
              sustainability results and ESG accountability.
            </p>

            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 group">
                View Live Dashboard
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button size="lg" variant="outline" className="border-border text-foreground hover:bg-secondary bg-transparent">
                Calculate Your Impact
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-border">
              <div>
                <div className="text-2xl font-bold text-primary flex items-baseline">
                  <AnimatedNumber value={8.1} decimalPlaces={1} />k
                </div>
                <div className="text-sm text-muted-foreground">Items Scanned</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground flex items-baseline">
                  <AnimatedNumber value={2.4} decimalPlaces={1} />M
                </div>
                <div className="text-sm text-muted-foreground">kg Waste Sorted</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground flex items-baseline">
                  <AnimatedNumber value={850} decimalPlaces={0} />+
                </div>
                <div className="text-sm text-muted-foreground">Active Bins</div>
              </div>
            </div>
          </div>

          {/* Right column - Product showcase */}
          <div className="relative order-1 lg:order-2 flex items-center justify-center py-8 lg:py-0">
            {/* Glowing backdrop */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-64 h-64 lg:w-96 lg:h-96 rounded-full bg-primary/20 blur-[100px] animate-pulse" />
            </div>

            {/* Product image container */}
            <div className="relative z-10 group">
              {/* Rotating ring effect */}
              <div className="absolute inset-0 -m-8 lg:-m-12 rounded-full border border-primary/20 animate-[spin_20s_linear_infinite]">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-primary" />
              </div>
              <div className="absolute inset-0 -m-16 lg:-m-24 rounded-full border border-primary/10 animate-[spin_30s_linear_infinite_reverse]">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary/50" />
              </div>

              {/* Product image */}
              <div className="relative w-64 h-80 sm:w-72 sm:h-96 lg:w-80 lg:h-[28rem] transition-transform duration-500 group-hover:scale-105">
                <Image
                  src="/images/r3bin-product.svg"
                  alt="R3Bin Smart Waste Management System"
                  fill
                  className="object-contain"
                  priority
                />
              </div>

              {/* Interactive feature callouts */}
              {features.map((feature, index) => (
                <div
                  key={feature.label}
                  className={cn(
                    "absolute z-20 cursor-pointer transition-all duration-300",
                    feature.position,
                    activeFeature === index ? "scale-110" : "hover:scale-105"
                  )}
                  onMouseEnter={() => setActiveFeature(index)}
                  onMouseLeave={() => setActiveFeature(null)}
                >
                  <div className={cn(
                    "flex items-center gap-3 rounded-xl border bg-card/80 backdrop-blur-md p-3 shadow-lg transition-all duration-300",
                    activeFeature === index
                      ? "border-primary bg-card shadow-primary/20"
                      : "border-border hover:border-primary/50"
                  )}>
                    <div className={cn(
                      "h-10 w-10 rounded-lg flex items-center justify-center transition-colors",
                      activeFeature === index ? "bg-primary" : "bg-primary/20"
                    )}>
                      <feature.icon className={cn(
                        "h-5 w-5 transition-colors",
                        activeFeature === index ? "text-primary-foreground" : "text-primary"
                      )} />
                    </div>
                    <div className={cn(
                      "overflow-hidden transition-all duration-300",
                      activeFeature === index ? "w-auto opacity-100" : "w-0 opacity-0 lg:w-auto lg:opacity-100"
                    )}>
                      <div className="text-sm font-semibold text-foreground whitespace-nowrap">{feature.label}</div>
                      <div className="text-xs text-muted-foreground whitespace-nowrap">{feature.description}</div>
                    </div>
                  </div>

                  {/* Connecting line */}
                  <div className={cn(
                    "absolute top-1/2 h-px bg-gradient-to-r from-primary/50 to-transparent transition-all duration-300",
                    index % 2 === 0 ? "right-0 translate-x-full w-4 lg:w-8" : "left-0 -translate-x-full w-4 lg:w-8 rotate-180"
                  )} />
                </div>
              ))}
            </div>

            {/* Bottom badges */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex items-center gap-4">
              <div className="flex items-center gap-2 rounded-full border border-border bg-card/80 backdrop-blur-md px-4 py-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-xs text-muted-foreground">AI-Powered</span>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-border bg-card/80 backdrop-blur-md px-4 py-2">
                <Shield className="h-4 w-4 text-primary" />
                <span className="text-xs text-muted-foreground">Enterprise Ready</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
