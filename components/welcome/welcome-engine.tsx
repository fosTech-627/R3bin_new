"use client"

import { useState } from "react"
import { ArrowRight } from "lucide-react"

export function WelcomeEngine() {
  const [hoveredStep, setHoveredStep] = useState<string | null>(null)
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />

      <div className="relative mx-auto max-w-5xl px-4 lg:px-8 space-y-16">
        {/* Header */}
        <div className="text-center space-y-6">
          <h2 className="text-4xl md:text-5xl font-bold text-white text-balance">
            W.I.S.E. — Waste Intelligent Sorting Engine
          </h2>
          <p className="text-lg text-gray-400">
            W.I.S.E. is not a single product. It is a continuously improving intelligence system.
          </p>
        </div>

        {/* Engine components */}
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { title: "Real-time Waste Recognition", desc: "AI-powered computer vision identifying waste types instantly", detail: "98% accuracy across 50+ waste categories with <100ms response time" },
              { title: "Behavioural Data Capture", desc: "Understanding and tracking segregation patterns", detail: "Learns from every interaction to improve system understanding" },
              { title: "Contamination Detection", desc: "Ensuring quality and accuracy across deployments", detail: "Flags contamination issues before they impact sorting accuracy" },
              { title: "ESG & Carbon Reporting", desc: "Measurable sustainability metrics and compliance", detail: "Automatic tracking and reporting of environmental impact metrics" },
            ].map((item) => (
              <div
                key={item.title}
                onMouseEnter={() => setHoveredStep(item.title)}
                onMouseLeave={() => setHoveredStep(null)}
                className={`rounded-lg border transition-all duration-300 group
                  ${hoveredStep === item.title 
                    ? 'border-emerald-400 bg-emerald-500/15 shadow-lg shadow-emerald-500/20' 
                    : 'border-emerald-500/20 bg-black/40 hover:border-emerald-500/40 hover:bg-emerald-500/5'}
                `}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-white">{item.title}</h4>
                    <div className={`w-2 h-2 rounded-full transition-all ${
                      hoveredStep === item.title ? 'bg-emerald-400' : 'bg-gray-600 group-hover:bg-emerald-400/60'
                    }`} />
                  </div>
                  <p className="text-sm text-gray-400">{item.desc}</p>
                  {hoveredStep === item.title && (
                    <div className="mt-4 pt-4 border-t border-emerald-500/30 animate-slideIn">
                      <p className="text-sm text-emerald-300">{item.detail}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Process flow */}
        <div className="relative">
          {/* Main flow container */}
          <div className="flex flex-col lg:flex-row items-stretch justify-center gap-6 lg:gap-0">
            {["Deploy", "Collect Data", "Train", "Improve", "Scale"].map((step, idx) => (
              <div key={step} className="flex-1 flex items-center gap-0">
                {/* Step node */}
                <div 
                  onMouseEnter={() => setHoveredStep(step)}
                  onMouseLeave={() => setHoveredStep(null)}
                  className="relative group flex-1 lg:flex-none"
                >
                  {/* Background glow */}
                  <div className={`absolute inset-0 rounded-lg blur-lg transition-all duration-500 ${
                    hoveredStep === step 
                      ? 'bg-emerald-400/50 blur-xl' 
                      : 'bg-emerald-500/10 group-hover:bg-emerald-500/25 group-hover:blur-xl'
                  }`} />
                  
                  {/* Card */}
                  <div className={`relative px-6 py-4 rounded-lg border transition-all duration-500 text-center
                    ${hoveredStep === step 
                      ? 'border-emerald-300 bg-emerald-500/25 shadow-lg shadow-emerald-500/40' 
                      : 'border-emerald-500/30 bg-black/50 hover:border-emerald-400/60'}
                  `}>
                    <span className="text-sm font-semibold text-white">{step}</span>
                    {hoveredStep === step && (
                      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-emerald-300 font-mono whitespace-nowrap animate-slideIn">
                        ✓ Active
                      </div>
                    )}
                  </div>
                </div>

                {/* Arrow separator */}
                {idx < 4 && (
                  <div className="hidden lg:flex items-center justify-center w-12 h-12 flex-shrink-0">
                    <div className={`relative transition-all duration-500 ${hoveredStep === step || hoveredStep === ["Deploy", "Collect Data", "Train", "Improve", "Scale"][idx + 1] ? 'scale-125' : ''}`}>
                      <svg
                        className={`w-6 h-6 transition-colors duration-500 ${
                          hoveredStep === step || hoveredStep === ["Deploy", "Collect Data", "Train", "Improve", "Scale"][idx + 1]
                            ? 'text-emerald-400'
                            : 'text-emerald-500/40 group-hover:text-emerald-500/60'
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2.5}
                          d="M13 5l7 7m0 0l-7 7m7-7H6"
                        />
                      </svg>
                    </div>
                  </div>
                )}

                {/* Mobile arrow */}
                {idx < 4 && (
                  <div className="lg:hidden w-full h-px bg-gradient-to-r from-emerald-500/30 to-transparent" />
                )}
              </div>
            ))}
          </div>

          {/* Details section */}
          <div className="mt-16 grid md:grid-cols-5 gap-4">
            {[
              { step: "Deploy", desc: "Launch W.I.S.E. in your waste management ecosystem" },
              { step: "Collect Data", desc: "Real-time data collection from AI vision systems" },
              { step: "Train", desc: "ML models learn from deployment data patterns" },
              { step: "Improve", desc: "System accuracy improves with each deployment" },
              { step: "Scale", desc: "Scale intelligence across entire infrastructure" },
            ].map((item) => (
              <div
                key={item.step}
                onMouseEnter={() => setHoveredStep(item.step)}
                onMouseLeave={() => setHoveredStep(null)}
                className={`p-4 rounded-lg border transition-all duration-300 text-center
                  ${hoveredStep === item.step
                    ? 'border-emerald-400 bg-emerald-500/15'
                    : 'border-emerald-500/20 bg-black/30 hover:border-emerald-500/30'}
                `}
              >
                <p className={`text-xs font-semibold uppercase tracking-wide transition-colors ${
                  hoveredStep === item.step ? 'text-emerald-300' : 'text-gray-400'
                }`}>
                  {item.step}
                </p>
                <p className={`text-xs mt-2 leading-relaxed transition-colors ${
                  hoveredStep === item.step ? 'text-gray-200' : 'text-gray-500'
                }`}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Continuous learning info */}
          <div className="mt-12 p-6 rounded-lg border border-emerald-500/20 bg-emerald-500/5 backdrop-blur-sm">
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-emerald-300">Continuous Learning Loop</h3>
              <div className="space-y-2 text-sm text-gray-300">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                  <span>Every deployment feeds data back into the training cycle</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
                  <span>Intelligence compounds across your entire waste network</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
                  <span>W.I.S.E. becomes smarter with every unit deployed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
