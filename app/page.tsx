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
