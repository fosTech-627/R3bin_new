"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"

const navItems = [
  { label: "Home", href: "/" },
  { label: "R3Bin Suite", href: "/products" },
  { label: "Live Analytics", href: "/dashboard" },
  { label: "ROI Calculator", href: "/calculator" },
  { label: "Partners", href: "/partners" },
  { label: "Support", href: "/support" },
  { label: "About", href: "https://www.fostride.com/about" },
]

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [session, setSession] = useState<any>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setMobileMenuOpen(false)
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
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
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="hidden lg:flex lg:items-center lg:gap-4">
          {session ? (
            <>
              <Link href="/dashboard">
                <Button variant="ghost">Dashboard</Button>
              </Link>
              <Button onClick={handleSignOut} variant="outline">
                Sign out
              </Button>
            </>
          ) : (
            <Link href="/login">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                Sign in
              </Button>
            </Link>
          )}
        </div>

        <button
          type="button"
          className="lg:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6 text-foreground" />
          ) : (
            <Menu className="h-6 w-6 text-foreground" />
          )}
        </button>
      </nav>

      {mobileMenuOpen && (
        <div className="lg:hidden bg-background border-b border-border">
          <div className="px-4 py-4 space-y-4">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="block text-sm font-medium text-muted-foreground hover:text-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-4 border-t border-border">
              {session ? (
                <div className="space-y-3">
                  <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full" variant="ghost">Dashboard</Button>
                  </Link>
                  <Button onClick={handleSignOut} className="w-full" variant="outline">
                    Sign out
                  </Button>
                </div>
              ) : (
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                    Sign in
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
