"use client"

import { ArrowRight, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function WelcomeHero() {
  return (
    <section className="relative min-h-screen pt-32 pb-16 overflow-hidden flex items-center">
      {/* Background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />

      {/* Animated gradients */}
      <div className="absolute top-20 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl animate-pulse delay-700" />

      <div className="relative mx-auto max-w-5xl px-4 lg:px-8 text-center space-y-8">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-sm text-emerald-300 font-medium">Waste Intelligence Infrastructure</span>
        </div>

        {/* Main headline */}
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white text-balance leading-tight">
          Building India's Waste Intelligence Infrastructure
        </h1>

        {/* Subheadline */}
        <p className="text-lg md:text-xl text-gray-300 text-balance max-w-3xl mx-auto leading-relaxed">
          Fostride is an engine-first climate technology company building <span className="text-emerald-300 font-semibold">W.I.S.E.</span> — the Waste Intelligent Sorting Engine — an AI + ML intelligence layer designed to understand, classify, and optimise waste across the full waste lifecycle.
        </p>

        {/* Supporting line */}
        <p className="text-base text-emerald-400 font-medium">
          Segregation at source. Intelligence at scale.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Link href="/products">
            <Button size="lg" className="bg-emerald-500 text-black hover:bg-emerald-400 group">
              Explore W.I.S.E.
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
          <Link href="/partners">
            <Button size="lg" variant="outline" className="border-emerald-500/30 text-gray-300 hover:bg-emerald-500/10">
              Partner With Us
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
