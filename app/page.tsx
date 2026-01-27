import { Navbar } from "@/components/landing/navbar"
import { HeroSection } from "@/components/landing/hero-section"
import { ImpactStats } from "@/components/landing/impact-stats"
import { FeaturesSection } from "@/components/landing/features-section"
import { DashboardPreview } from "@/components/landing/dashboard-preview"
import { UseCasesSection } from "@/components/landing/use-cases-section"
import { CTASection } from "@/components/landing/cta-section"
import { Footer } from "@/components/landing/footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'Fostride',
            url: 'https://www.fostride.com',
            logo: 'https://www.fostride.com/images/fostride-logo-new.svg',
            sameAs: [
              'https://twitter.com/fostride',
              'https://www.linkedin.com/company/fostride',
              'https://www.instagram.com/fostride'
            ],
            contactPoint: {
              '@type': 'ContactPoint',
              telephone: '+91-9818801050',
              contactType: 'customer service'
            }
          })
        }}
      />
      <HeroSection />
      <ImpactStats />
      <FeaturesSection />
      <DashboardPreview />
      <UseCasesSection />
      <CTASection />
      <Footer />
    </main>
  )
}
