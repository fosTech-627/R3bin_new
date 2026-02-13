import { WelcomeNavbar } from "@/components/welcome/welcome-navbar"
import { WelcomeHero } from "@/components/welcome/welcome-hero"
import { WelcomeInteractiveFeatures } from "@/components/welcome/welcome-interactive-features"
import { WelcomeBuilding } from "@/components/welcome/welcome-building"
import { WelcomeEngine } from "@/components/welcome/welcome-engine"
import { WelcomeDeploymentEnvironments } from "@/components/welcome/welcome-deployment-environments"
import { WelcomePositioning } from "@/components/welcome/welcome-positioning"
import { WelcomeFooter } from "@/components/welcome/welcome-footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-black">
      <WelcomeNavbar />
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
      <WelcomeHero />
      <WelcomeInteractiveFeatures />
      <WelcomeBuilding />
      <WelcomeEngine />
      <WelcomeDeploymentEnvironments />
      <WelcomePositioning />
      <WelcomeFooter />
    </main>
  )
}
