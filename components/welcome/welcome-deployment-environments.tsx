"use client"

import { useState } from "react"
import { Building2, Leaf, Users, Plane, Factory, ArrowRight, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"

const deployments = [
  {
    id: "campuses",
    title: "Campuses & Universities",
    icon: Building2,
    description: "Large student populations generate diverse and high-volume waste streams daily.",
    details: "W.I.S.E.-enabled systems improve segregation at source, enable behavioural analytics, and create measurable sustainability dashboards for institutions.",
    points: [
      "Behaviour change tracking",
      "Real-time contamination detection",
      "ESG reporting alignment",
      "Closed-loop campus sustainability"
    ],
    color: "emerald"
  },
  {
    id: "itparks",
    title: "IT Parks & Corporate Campuses",
    icon: Zap,
    description: "Modern enterprises require verifiable ESG data and structured sustainability reporting.",
    details: "Fostride enables intelligent waste tracking, contamination reduction, and enterprise-grade analytics.",
    points: [
      "Scope 3 reporting support",
      "Data-backed sustainability metrics",
      "Carbon impact estimation pathways",
      "Smart infrastructure integration"
    ],
    color: "cyan"
  },
  {
    id: "residential",
    title: "Residential Societies & Smart Communities",
    icon: Users,
    description: "High-density urban housing creates recurring, predictable waste patterns.",
    details: "W.I.S.E. enables decentralised intelligence at source, reducing downstream sorting inefficiencies.",
    points: [
      "Source-level accountability",
      "Resident engagement insights",
      "Reduction in landfill-bound waste",
      "Structured data across buildings"
    ],
    color: "blue"
  },
  {
    id: "agriculture",
    title: "Agriculture Markets & Agri Clusters",
    icon: Leaf,
    description: "Organic-heavy waste streams present large recovery and composting opportunities.",
    details: "W.I.S.E. enhances waste stream categorisation, organic diversion tracking, and recovery optimisation.",
    points: [
      "Organic waste intelligence",
      "Compost stream optimisation",
      "Contamination reduction",
      "Circular value potential"
    ],
    color: "green"
  },
  {
    id: "airports",
    title: "Airports & High-Footfall Transit Hubs",
    icon: Plane,
    description: "Complex waste streams and regulatory scrutiny demand precision and traceability.",
    details: "Fostride enables intelligent classification and measurable sustainability performance at scale.",
    points: [
      "Multi-stream waste identification",
      "High-footfall behavioural analytics",
      "Compliance-ready reporting",
      "Infrastructure-scale deployment"
    ],
    color: "amber"
  }
]

export function WelcomeDeploymentEnvironments() {
  const [selectedId, setSelectedId] = useState<string | null>("campuses")
  const selectedDeployment = deployments.find(d => d.id === selectedId)

  return (
    <section className="relative py-24 overflow-hidden bg-black">
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.05)_1px,transparent_1px)] bg-[size:60px_60px] animate-grid" />
      </div>

      {/* Parallax gradient layers */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/8 rounded-full blur-3xl parallax-slow" />
      <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl parallax-fast" style={{ animationDelay: '2s' }} />

      <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
        {/* Section header */}
        <div className="space-y-4 mb-16 text-center">
          <h2 className="text-5xl md:text-6xl font-bold text-white text-balance">
            Built for <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">High-Impact Environments</span>
          </h2>
          <p className="text-gray-300 text-lg max-w-3xl mx-auto">
            W.I.S.E. is designed to operate in high-density, high-waste, high-accountability environments. From campuses to airports, Fostride integrates intelligent segregation into critical infrastructure.
          </p>
        </div>

        {/* Deployment cards grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4 mb-12">
          {deployments.map((deployment) => {
            const Icon = deployment.icon
            const isSelected = selectedId === deployment.id
            
            return (
              <button
                key={deployment.id}
                onClick={() => setSelectedId(deployment.id)}
                className={`group relative hover-lift rounded-lg border transition-all duration-300 overflow-hidden
                  ${isSelected
                    ? 'border-emerald-400 bg-emerald-500/20 shadow-lg shadow-emerald-500/30'
                    : 'border-gray-700 bg-gray-900/40 hover:border-emerald-500/50 hover:bg-gray-800/60'
                  }
                `}
              >
                {/* Tech scanline effect */}
                <div className="absolute inset-0 scanline-effect pointer-events-none" />

                <div className="relative p-4 space-y-3">
                  {/* Icon with glow */}
                  <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-300
                    ${isSelected 
                      ? 'bg-emerald-500/40 text-emerald-300 shadow-lg shadow-emerald-500/30' 
                      : 'bg-gray-800 text-gray-400 group-hover:bg-emerald-500/20 group-hover:text-emerald-400'}
                  `}>
                    <Icon className="w-5 h-5" />
                  </div>

                  {/* Text content */}
                  <div className="text-left">
                    <h3 className={`text-sm font-semibold transition-colors ${
                      isSelected ? 'text-white' : 'text-gray-300 group-hover:text-white'
                    }`}>
                      {deployment.title.split(' ')[0]}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{deployment.title.split(' ').slice(1).join(' ')}</p>
                  </div>

                  {/* Selection indicator */}
                  <div className={`absolute top-3 right-3 w-2 h-2 rounded-full transition-all ${
                    isSelected ? 'bg-emerald-400 shadow-lg shadow-emerald-400/50' : 'bg-gray-600'
                  }`} />
                </div>
              </button>
            )
          })}
        </div>

        {/* Detailed view - Parallax content */}
        {selectedDeployment && (
          <div className="relative rounded-xl border border-gray-700 bg-gray-900/40 backdrop-blur-sm p-8 md:p-12 overflow-hidden animate-slideIn">
            {/* Background gradient accent */}
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl parallax-slow pointer-events-none" />

            <div className="relative grid md:grid-cols-2 gap-8 items-start">
              {/* Left content */}
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  {(() => {
                    const Icon = selectedDeployment.icon
                    return (
                      <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-emerald-500/30 to-cyan-500/20 flex items-center justify-center flex-shrink-0 shadow-lg shadow-emerald-500/20">
                        <Icon className="w-7 h-7 text-emerald-300" />
                      </div>
                    )
                  })()}
                  <div>
                    <h3 className="text-2xl font-bold text-white">{selectedDeployment.title}</h3>
                    <p className="text-emerald-400 text-sm font-medium mt-1">Deployment Environment</p>
                  </div>
                </div>

                <p className="text-gray-300 text-base leading-relaxed">
                  {selectedDeployment.description}
                </p>

                <p className="text-gray-400 text-sm leading-relaxed">
                  {selectedDeployment.details}
                </p>

                <div className="pt-4">
                  <Button className="bg-emerald-500 text-black hover:bg-emerald-400 group w-full">
                    Deploy W.I.S.E. Here
                    <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </div>
              </div>

              {/* Right - Focus points */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                  <div className="w-1 h-1 bg-emerald-400 rounded-full" />
                  Focus Points
                </h4>

                <div className="grid gap-3">
                  {selectedDeployment.points.map((point, idx) => (
                    <div
                      key={point}
                      className="flex items-start gap-3 p-3 rounded-lg border border-emerald-500/20 bg-emerald-500/5 hover:border-emerald-500/40 hover:bg-emerald-500/10 transition-all duration-300 group cursor-default"
                      style={{ animationDelay: `${idx * 100}ms` }}
                    >
                      <div className="w-5 h-5 rounded-lg bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-emerald-500/40 transition-colors">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full" />
                      </div>
                      <span className="text-sm text-gray-300 group-hover:text-gray-200 transition-colors">{point}</span>
                    </div>
                  ))}
                </div>

                {/* Tech stat */}
                <div className="mt-6 p-4 rounded-lg border border-cyan-500/20 bg-cyan-500/5">
                  <p className="text-xs text-cyan-400 font-mono uppercase tracking-wider">Infrastructure Ready</p>
                  <p className="text-2xl font-bold text-white mt-2">Enterprise Scale</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bottom CTA */}
        <div className="mt-16 text-center space-y-6">
          <div className="space-y-2">
            <h3 className="text-3xl md:text-4xl font-bold text-white text-balance">
              One Engine. Multiple Environments. <span className="text-emerald-400">Compounding Intelligence</span>
            </h3>
            <p className="text-gray-400">Deploy W.I.S.E. across your entire infrastructure ecosystem</p>
          </div>

          <Button size="lg" className="bg-emerald-500 text-black hover:bg-emerald-400 group">
            Deploy W.I.S.E. in Your Infrastructure
            <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </div>
    </section>
  )
}
