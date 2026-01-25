import Link from "next/link"
import Image from "next/image"

const footerLinks = {
  Platform: [
    { label: "R3Bin Suite", href: "#" },
    { label: "Analytics Dashboard", href: "#" },
    { label: "ROI Calculator", href: "#" },
    { label: "Technology", href: "#" },
  ],
  Solutions: [
    { label: "Universities", href: "#" },
    { label: "Corporate Campuses", href: "#" },
    { label: "Smart Cities", href: "#" },
    { label: "Municipalities", href: "#" },
  ],
  Resources: [
    { label: "Documentation", href: "#" },
    { label: "Support Center", href: "#" },
    { label: "API Reference", href: "#" },
    { label: "Case Studies", href: "#" },
  ],
  Company: [
    { label: "About Fostride", href: "https://www.fostride.com/about" },
    { label: "Careers", href: "#" },
    { label: "Contact", href: "#" },
    { label: "Press", href: "#" },
  ],
}

export function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      <div className="mx-auto max-w-7xl px-4 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center mb-4">
              <Image
                src="/images/fostride-logo-new.svg"
                alt="Fostride"
                width={120}
                height={32}
                className="h-8 w-auto"
              />
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              AI-powered waste intelligence platform combining
              smart bins with real-time analytics for
              measurable sustainability impact.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-sm font-semibold text-foreground mb-4">{category}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-8 mt-8 border-t border-border">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Fostride Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Terms of Service
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
