"use client"

import { Zap, Network, TrendingUp } from "lucide-react"

const features = [
  {
    icon: Zap,
    title: "AI-Powered Classification",
    description: "Computer vision engine identifying waste streams in real environments.",
  },
  {
    icon: Network,
    title: "Compounding Data Network",
    description: "Each deployment strengthens accuracy and defensibility.",
  },
  {
    icon: TrendingUp,
    title: "Infrastructure-Scale Vision",
    description: "From smart segregation to logistics, MRFs, ESG analytics, and carbon measurement.",
  },
]

export function WelcomeBuilding() {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />

      <div className="relative mx-auto max-w-5xl px-4 lg:px-8 space-y-16">
        {/* Section header */}
        <div className="text-center space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold text-white text-balance">
            An Intelligence Layer for Waste
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Waste management today lacks structured data, real-time insights, and system-wide intelligence. Fostride is building W.I.S.E. — a compounding AI engine that learns from real-world deployments and transforms waste into measurable, optimisable infrastructure.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <div
                key={feature.title}
                className="group relative rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-8 hover:bg-emerald-500/10 transition-all duration-300"
              >
                {/* Glow effect */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="relative space-y-4">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-emerald-500/20 group-hover:bg-emerald-500/30 transition-colors">
                    <Icon className="w-6 h-6 text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
