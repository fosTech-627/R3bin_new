import { 
  GraduationCap, 
  Building2, 
  Lightbulb,
  Building,
  CheckCircle 
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const useCases = [
  {
    icon: GraduationCap,
    title: "Sustainability Directors",
    description: "Real-time insights for strategic decisions",
    challenge: "Meet ESG compliance and demonstrate clear environmental impact to stakeholders.",
    benefits: [
      "ESG audit readiness",
      "Simplified compliance reports",
      "Real-time impact metrics",
    ],
    color: "from-emerald-500/20 to-emerald-500/5",
  },
  {
    icon: Building2,
    title: "Facilities Managers",
    description: "Operational efficiency through intelligence",
    challenge: "Optimize operations while meeting sustainability targets with limited resources.",
    benefits: [
      "Optimized collection routes",
      "Reduced operational costs",
      "Predictive maintenance alerts",
    ],
    color: "from-blue-500/20 to-blue-500/5",
  },
  {
    icon: Building,
    title: "IT Directors",
    description: "Seamless integration and security",
    challenge: "Implement smart solutions while ensuring data security and system compatibility.",
    benefits: [
      "API-first integration",
      "Enterprise-grade security",
      "Cloud-native infrastructure",
    ],
    color: "from-violet-500/20 to-violet-500/5",
  },
  {
    icon: Lightbulb,
    title: "Innovation Champions",
    description: "Lead sustainability transformation",
    challenge: "Drive sustainable initiatives that demonstrate clear ROI and engagement.",
    benefits: [
      "Data-driven storytelling",
      "Engagement dashboards",
      "Innovation metrics",
    ],
    color: "from-amber-500/20 to-amber-500/5",
  },
]

export function UseCasesSection() {
  return (
    <section id="use-cases" className="py-20 bg-background">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-sm text-primary font-medium mb-2">Solutions for Every Role</p>
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl text-balance">
            Tailored Intelligence for Every Decision Maker
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Whether you&apos;re driving ESG compliance, optimizing operations, evaluating technical architecture, or
            leading innovation, R3Bin delivers the specific insights and tools you need.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {useCases.map((useCase) => (
            <Card 
              key={useCase.title}
              className="bg-card border-border hover:border-primary/50 transition-all overflow-hidden group"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${useCase.color} opacity-0 group-hover:opacity-100 transition-opacity`} />
              <CardHeader className="relative">
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <useCase.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg text-foreground">{useCase.title}</CardTitle>
                    <CardDescription className="text-sm">{useCase.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="relative">
                <p className="text-sm text-muted-foreground mb-4">
                  <span className="font-medium text-foreground">Challenge: </span>
                  {useCase.challenge}
                </p>
                <ul className="space-y-2">
                  {useCase.benefits.map((benefit) => (
                    <li key={benefit} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
