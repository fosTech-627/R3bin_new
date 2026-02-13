"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Download } from "lucide-react"

export function WelcomePositioning() {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/10 via-transparent to-transparent" />
      <div className="absolute top-0 right-1/3 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />

      <div className="relative mx-auto max-w-4xl px-4 lg:px-8 text-center space-y-12">
        {/* Main statement */}
        <h2 className="text-5xl md:text-6xl font-bold text-white text-balance leading-tight">
          The Future of Waste is{" "}
          <span className="text-emerald-400">Intelligent</span>
        </h2>

        {/* Supporting statement */}
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Fostride is building foundational waste intelligence infrastructure for India.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Link href="/onboarding">
            <Button size="lg" className="bg-emerald-500 text-black hover:bg-emerald-400">
              Request Pilot
            </Button>
          </Link>
          <Button size="lg" variant="outline" className="border-emerald-500/30 text-gray-300 hover:bg-emerald-500/10">
            <Download className="w-4 h-4 mr-2" />
            Investor Deck
          </Button>
        </div>
      </div>
    </section>
  )
}
