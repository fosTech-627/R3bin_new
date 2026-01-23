import { 
  Brain, 
  BarChart3, 
  Wifi, 
  FileText, 
  CheckCircle,
  ArrowRight
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const features = [
  {
    icon: Brain,
    title: "AI-Powered Segregation",
    description: "Computer vision and machine learning classify waste at the source with 94%+ accuracy, eliminating manual sorting errors.",
    benefits: [
      "Real-time waste classification",
      "Multi-category detection",
      "Continuous learning improvement",
      "Custom category training",
    ],
    cta: "Explore R3Bin Technology",
  },
  {
    icon: BarChart3,
    title: "Live Analytics Dashboard",
    description: "Comprehensive analytics platform delivering real-time insights, smart alerts, and automated ESG reporting for data-driven sustainability decisions.",
    benefits: [
      "Real-time waste tracking",
      "Predictive analytics",
      "Custom report generation",
      "Multi-site comparison",
    ],
    cta: "View Dashboard Demo",
  },
  {
    icon: Wifi,
    title: "IoT Sensor Network",
    description: "Smart sensors monitor fill levels, maintenance needs, and usage patterns, optimizing collection routes and reducing operational costs.",
    benefits: [
      "Fill level monitoring",
      "Predictive maintenance",
      "Usage pattern analysis",
      "Alert notifications",
    ],
    cta: "See Technical Specs",
  },
  {
    icon: FileText,
    title: "ESG Compliance Reporting",
    description: "Automated sustainability reporting with verified carbon offset calculations, regulatory compliance tracking, and stakeholder-ready documentation.",
    benefits: [
      "Automated ESG reports",
      "Carbon footprint tracking",
      "Compliance monitoring",
      "Audit-ready documentation",
    ],
    cta: "Calculate Your Impact",
  },
]

export function FeaturesSection() {
  return (
    <section id="about" className="py-20 bg-background">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-sm text-primary font-medium mb-2">Platform Capabilities</p>
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl text-balance">
            Complete Waste Intelligence Ecosystem
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            From AI-powered segregation to automated ESG reporting, R3Bin delivers end-to-end waste
            management intelligence that drives measurable environmental and financial impact.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {features.map((feature) => (
            <Card 
              key={feature.title} 
              className="bg-card border-border hover:border-primary/50 transition-all group"
            >
              <CardHeader>
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl text-foreground">{feature.title}</CardTitle>
                <CardDescription className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {feature.benefits.map((benefit) => (
                    <li key={benefit} className="flex items-center gap-3 text-sm text-muted-foreground">
                      <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                      {benefit}
                    </li>
                  ))}
                </ul>
                <button className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors">
                  {feature.cta}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
