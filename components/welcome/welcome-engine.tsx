"use client"

import { useState } from "react"
import { ArrowRight } from "lucide-react"

export function WelcomeEngine() {
  const [selectedStep, setSelectedStep] = useState<string | null>(null)
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
                onClick={() => setSelectedStep(selectedStep === item.title ? null : item.title)}
                className={`rounded-lg border transition-all duration-300 cursor-pointer group
                  ${selectedStep === item.title 
                    ? 'border-emerald-400 bg-emerald-500/15 shadow-lg shadow-emerald-500/20' 
                    : 'border-emerald-500/20 bg-black/40 hover:border-emerald-500/40 hover:bg-emerald-500/5'}
                `}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-white">{item.title}</h4>
                    <div className={`w-2 h-2 rounded-full transition-all ${
                      selectedStep === item.title ? 'bg-emerald-400' : 'bg-gray-600 group-hover:bg-emerald-400/60'
                    }`} />
                  </div>
                  <p className="text-sm text-gray-400">{item.desc}</p>
                  {selectedStep === item.title && (
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
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-2">
            {["Deploy", "Collect Data", "Train", "Improve", "Scale"].map((step, idx) => (
              <div key={step} className="flex items-center gap-4 md:gap-2 w-full md:w-auto">
                <div 
                  onClick={() => setSelectedStep(selectedStep === step ? null : step)}
                  className="relative group cursor-pointer flex-1 md:flex-none"
                >
                  <div className={`absolute inset-0 rounded-full blur-lg transition-all ${
                    selectedStep === step 
                      ? 'bg-emerald-400/40 blur-xl' 
                      : 'bg-emerald-500/10 group-hover:bg-emerald-500/20 group-hover:blur-xl'
                  }`} />
                  <div className={`relative w-full md:w-24 py-3 px-4 rounded-full border transition-all duration-300 text-center
                    ${selectedStep === step 
                      ? 'border-emerald-400 bg-emerald-500/20 shadow-lg shadow-emerald-500/30' 
                      : 'border-emerald-500/40 bg-black/60 hover:border-emerald-500/60'}
                  `}>
                    <span className="text-sm md:text-xs font-semibold text-white whitespace-nowrap">{step}</span>
                  </div>
                  {selectedStep === step && (
                    <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 text-xs text-emerald-300 font-mono whitespace-nowrap animate-slideIn">
                      ✓ Processing
                    </div>
                  )}
                </div>
                {idx < 4 && (
                  <ArrowRight className="hidden md:block w-5 h-5 text-emerald-500/40 flex-shrink-0 group-hover:text-emerald-500/60 transition-colors" />
                )}
                {idx < 4 && (
                  <div className="md:hidden w-full h-px bg-gradient-to-r from-emerald-500/40 to-transparent" />
                )}
              </div>
            ))}
          </div>

          {/* Center label */}
          <div className="text-center mt-12">
            <p className="text-gray-400 text-sm">
              <span className="text-emerald-400">💫</span> Deployment-based machine learning loop — Click any step to see what happens
            </p>
          </div>

          {/* Animated flow visualization */}
          <div className="mt-12 p-6 rounded-lg border border-emerald-500/20 bg-emerald-500/5">
            <div className="space-y-2 text-sm text-gray-300">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                <span>W.I.S.E. operates as a continuous learning system</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
                <span>Every deployment strengthens the intelligence layer</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
                <span>Improvements compound across your entire waste management network</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
