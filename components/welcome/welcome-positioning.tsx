"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Download, ChevronRight } from "lucide-react"

export function WelcomePositioning() {
  return (
    <section className="relative py-32 overflow-hidden bg-black">
      {/* Tech-forward background grid */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.08)_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>

      {/* Animated gradient overlays */}
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl parallax-slow" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl parallax-fast" style={{ animationDelay: '3s' }} />

      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />

      <div className="relative mx-auto max-w-5xl px-4 lg:px-8 text-center space-y-16">
        {/* Status badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-sm text-emerald-300 font-medium">Building the Future</span>
        </div>

        {/* Main statement with gradient */}
        <div className="space-y-6">
          <h2 className="text-6xl md:text-7xl font-bold text-white text-balance leading-tight">
            The Future of Waste is{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-cyan-300 to-emerald-300 animate-pulse">Intelligent</span>
          </h2>

          {/* Supporting statement */}
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Fostride is building foundational waste intelligence infrastructure for India. From segregation at source to intelligence at scale, W.I.S.E. transforms how the world manages waste.
          </p>
        </div>

        {/* Stats row */}
        <div className="grid md:grid-cols-3 gap-6 py-8 px-6 rounded-lg border border-gray-700/50 bg-gray-900/30 backdrop-blur-sm">
          <div>
            <p className="text-3xl font-bold text-emerald-400">50+</p>
            <p className="text-sm text-gray-400 mt-1">Waste Categories</p>
          </div>
          <div className="border-l border-r border-gray-700/50">
            <p className="text-3xl font-bold text-emerald-400">5</p>
            <p className="text-sm text-gray-400 mt-1">Deployment Types</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-emerald-400">1M+</p>
            <p className="text-sm text-gray-400 mt-1">Daily Classifications</p>
          </div>
        </div>

        {/* CTAs with enhanced styling */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
          <Link href="/onboarding" className="w-full sm:w-auto">
            <Button size="lg" className="bg-emerald-500 text-black hover:bg-emerald-400 group w-full sm:w-auto">
              Request Pilot Program
              <ChevronRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
          <Button size="lg" variant="outline" className="border-emerald-500/30 text-gray-300 hover:bg-emerald-500/10 hover:border-emerald-500/50 w-full sm:w-auto group">
            <Download className="w-4 h-4 mr-2 transition-transform group-hover:scale-110" />
            Download Investor Deck
          </Button>
        </div>

        {/* Bottom accent */}
        <div className="pt-8 border-t border-gray-700/50">
          <p className="text-sm text-gray-500">
            <span className="text-emerald-400">→</span> Deploy W.I.S.E. in your infrastructure today
          </p>
        </div>
      </div>
    </section>
  )
}
