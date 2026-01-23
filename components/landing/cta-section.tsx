import { ArrowRight, Shield, Clock, Percent } from "lucide-react"
import { Button } from "@/components/ui/button"

const benefits = [
  { icon: Clock, label: "15 min", description: "Quick setup & integration" },
  { icon: Shield, label: "24/7", description: "Real-time monitoring" },
  { icon: Percent, label: "94%", description: "AI accuracy guarantee" },
]

export function CTASection() {
  return (
    <section id="impact" className="py-20 bg-gradient-to-b from-secondary/30 to-background">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-background border border-primary/30 p-8 lg:p-12">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/5 rounded-full blur-2xl" />
          
          <div className="relative text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl text-balance">
              Transform Waste into Measurable Environmental Impact
            </h2>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
              Join leading universities, corporations, and municipalities using R3Bin to achieve
              verified waste reduction, automated ESG reporting, and data-driven
              sustainability results.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                Explore Live Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" className="border-border text-foreground hover:bg-secondary bg-transparent">
                Calculate Your ROI
              </Button>
            </div>
            
            {/* Benefits grid */}
            <div className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-border">
              {benefits.map((benefit) => (
                <div key={benefit.label} className="text-center">
                  <div className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-primary/10 mb-3">
                    <benefit.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-2xl font-bold text-foreground">{benefit.label}</div>
                  <div className="text-sm text-muted-foreground">{benefit.description}</div>
                </div>
              ))}
            </div>
            
            {/* Trust badges */}
            <div className="flex flex-wrap justify-center items-center gap-6 mt-8 pt-8 border-t border-border">
              <span className="text-sm text-muted-foreground">Trusted for ESG Standards:</span>
              <span className="text-xs text-muted-foreground/70">Enterprise Security</span>
              <span className="text-xs text-muted-foreground/70">ISO Certified</span>
              <span className="text-xs text-muted-foreground/70">GDPR Verified</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
