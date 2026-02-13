"use client"

import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { WiseMascot } from "./wise-mascot"

export function WelcomeHero() {
  return (
    <section className="relative min-h-screen pt-20 pb-16 overflow-hidden flex items-center">
      {/* Background grid with animated opacity */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.03)_1px,transparent_1px)] bg-[size:60px_60px] animate-pulse" />

      {/* Animated radial gradients */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.7s' }} />
      
      {/* Top accent glow */}
      <div className="absolute top-0 left-1/2 w-screen h-96 -translate-x-1/2 bg-gradient-to-b from-emerald-500/5 to-transparent pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="space-y-8 text-left lg:text-left order-2 lg:order-1">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 w-fit">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-sm text-emerald-300 font-medium">Waste Intelligence</span>
            </div>

            {/* Main headline */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white text-balance leading-tight">
              Building India's <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Waste Intelligence</span>
            </h1>

            {/* Subheadline */}
            <p className="text-base md:text-lg text-gray-300 max-w-2xl leading-relaxed">
              Fostride is building <span className="text-emerald-300 font-semibold">W.I.S.E.</span> — the Waste Intelligent Sorting Engine. An AI + ML intelligence layer designed to understand, classify, and optimize waste across the full lifecycle.
            </p>

            {/* Supporting tagline */}
            <div className="pt-2 space-y-3">
              <p className="text-emerald-400 font-medium text-sm uppercase tracking-widest">Our Mission</p>
              <p className="text-lg text-gray-200 font-semibold">
                Segregation at source. Intelligence at scale.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <Link href="/products">
                <Button size="lg" className="bg-emerald-500 text-black hover:bg-emerald-400 group w-full sm:w-auto">
                  Explore W.I.S.E.
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-emerald-500/30 text-gray-300 hover:bg-emerald-500/10 w-full sm:w-auto">
                Request Demo
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="pt-4 grid grid-cols-2 gap-4 border-t border-gray-800 pt-6">
              <div>
                <p className="text-2xl font-bold text-emerald-400">98%</p>
                <p className="text-xs text-gray-400">Classification Accuracy</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-emerald-400">1M+</p>
                <p className="text-xs text-gray-400">Items Sorted Daily</p>
              </div>
            </div>
          </div>

          {/* Right - Mascot */}
          <div className="flex justify-center items-center order-1 lg:order-2">
            <WiseMascot />
          </div>
        </div>
      </div>
    </section>
  )
}
