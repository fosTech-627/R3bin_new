"use client"

import Link from "next/link"

export function WelcomeFooter() {
  return (
    <footer className="relative border-t border-emerald-500/20 bg-black/40 py-12">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Left - Copyright */}
          <div>
            <p className="text-sm text-gray-400">
              Fostride © 2026
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Waste Intelligence Infrastructure for India
            </p>
          </div>

          {/* Right - Links */}
          <div className="flex flex-wrap gap-6 justify-center md:justify-end">
            <Link href="/products" className="text-sm text-gray-400 hover:text-emerald-400 transition-colors">
              Products
            </Link>
            <Link href="/partners" className="text-sm text-gray-400 hover:text-emerald-400 transition-colors">
              Partners
            </Link>
            <Link href="/support" className="text-sm text-gray-400 hover:text-emerald-400 transition-colors">
              Support
            </Link>
            <a href="https://www.fostride.com/about" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-400 hover:text-emerald-400 transition-colors">
              About
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
