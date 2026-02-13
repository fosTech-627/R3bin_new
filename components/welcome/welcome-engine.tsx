"use client"

import { ArrowRight } from "lucide-react"

export function WelcomeEngine() {
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
              { title: "Real-time Waste Recognition", desc: "AI-powered computer vision identifying waste types instantly" },
              { title: "Behavioural Data Capture", desc: "Understanding and tracking segregation patterns" },
              { title: "Contamination Detection", desc: "Ensuring quality and accuracy across deployments" },
              { title: "ESG & Carbon Reporting", desc: "Measurable sustainability metrics and compliance" },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-lg border border-emerald-500/20 bg-black/40 p-6 hover:bg-emerald-500/5 transition-colors duration-300"
              >
                <h4 className="font-semibold text-white mb-2">{item.title}</h4>
                <p className="text-sm text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Process flow */}
        <div className="relative">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-2">
            {["Deploy", "Collect Data", "Train", "Improve", "Scale"].map((step, idx) => (
              <div key={step} className="flex items-center gap-4 md:gap-2">
                <div className="relative group">
                  <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-lg group-hover:blur-xl transition-all" />
                  <div className="relative w-32 md:w-24 py-3 px-4 rounded-full border border-emerald-500/40 bg-black/60 text-center">
                    <span className="text-sm md:text-xs font-semibold text-white whitespace-nowrap">{step}</span>
                  </div>
                </div>
                {idx < 4 && (
                  <ArrowRight className="hidden md:block w-5 h-5 text-emerald-500/40 flex-shrink-0" />
                )}
                {idx < 4 && (
                  <div className="md:hidden w-full h-px bg-gradient-to-r from-emerald-500/40 to-transparent" />
                )}
              </div>
            ))}
          </div>

          {/* Center label */}
          <div className="text-center mt-8">
            <p className="text-gray-400 text-sm">Deployment-based machine learning loop</p>
          </div>
        </div>
      </div>
    </section>
  )
}
