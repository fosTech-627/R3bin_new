"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export function WelcomeNavbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/40 backdrop-blur-lg border-b border-emerald-500/20">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 lg:px-8">
        <Link href="/" className="flex items-center">
          <Image
            src="/images/fostride-logo-new.svg"
            alt="Fostride"
            width={140}
            height={36}
            className="h-9 w-auto"
          />
        </Link>

        <div className="hidden lg:flex lg:items-center lg:gap-8">
          <a href="https://www.fostride.com/about" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-gray-300 hover:text-emerald-400 transition-colors">
            About
          </a>
          <Link href="/products" className="text-sm font-medium text-gray-300 hover:text-emerald-400 transition-colors">
            R3Bin Suite
          </Link>
          <Link href="/support" className="text-sm font-medium text-gray-300 hover:text-emerald-400 transition-colors">
            Support
          </Link>
        </div>

        <div className="hidden lg:flex lg:items-center lg:gap-4">
          <Link href="/login">
            <Button variant="ghost" className="text-gray-300 hover:text-emerald-400">
              Sign in
            </Button>
          </Link>
          <Link href="/onboarding">
            <Button className="bg-emerald-500 text-black hover:bg-emerald-400">
              Request Pilot
            </Button>
          </Link>
        </div>
      </nav>
    </header>
  )
}
