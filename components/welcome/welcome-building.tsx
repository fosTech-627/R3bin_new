"use client"

import { useState } from "react"
import { Zap, Network, TrendingUp } from "lucide-react"

const features = [
  {
    icon: Zap,
    title: "AI-Powered Classification",
    description: "Computer vision engine identifying waste streams in real environments.",
    detail: "Processes 1000s of waste items daily with 98% accuracy across 50+ categories",
  },
  {
    icon: Network,
    title: "Compounding Data Network",
    description: "Each deployment strengthens accuracy and defensibility.",
    detail: "Every deployment adds data that improves the model for the entire network",
  },
  {
    icon: TrendingUp,
    title: "Infrastructure-Scale Vision",
    description: "From smart segregation to logistics, MRFs, ESG analytics, and carbon measurement.",
    detail: "Unified platform spanning collection, processing, and compliance reporting",
  },
]

export function WelcomeBuilding() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
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
          {features.map((feature, index) => {
            const Icon = feature.icon
            const isHovered = hoveredIndex === index
            return (
              <div
                key={feature.title}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className={`group relative rounded-xl border transition-all duration-300 overflow-hidden
                  ${isHovered 
                    ? 'border-emerald-400 bg-emerald-500/15 shadow-lg shadow-emerald-500/20' 
                    : 'border-emerald-500/20 bg-emerald-500/5 hover:border-emerald-500/30'}
                `}
              >
                {/* Animated background gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-transparent opacity-0 transition-opacity duration-300
                  ${isHovered ? 'opacity-100' : ''}
                `} />

                <div className={`relative p-8 space-y-4 transition-all duration-300 ${isHovered ? 'translate-y-0' : 'translate-y-0'}`}>
                  {/* Icon with animation */}
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg transition-all duration-300
                    ${isHovered 
                      ? 'bg-emerald-500/40 shadow-lg shadow-emerald-500/30 scale-110' 
                      : 'bg-emerald-500/20'}
                  `}>
                    <Icon className={`w-6 h-6 text-emerald-400 transition-transform duration-300 ${isHovered ? 'scale-125' : ''}`} />
                  </div>
                  
                  <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
                  <p className={`text-sm leading-relaxed transition-all duration-300
                    ${isHovered ? 'text-gray-300' : 'text-gray-400'}
                  `}>
                    {feature.description}
                  </p>

                  {/* Expanded detail on hover */}
                  {isHovered && (
                    <div className="pt-4 border-t border-emerald-500/30 animate-slideIn">
                      <p className="text-sm text-emerald-300 font-medium">{feature.detail}</p>
                    </div>
                  )}

                  {/* Animated dot indicator */}
                  <div className={`absolute top-4 right-4 w-2 h-2 rounded-full transition-all duration-300
                    ${isHovered ? 'bg-emerald-400 scale-100' : 'bg-gray-600 scale-75'}
                  `} />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
