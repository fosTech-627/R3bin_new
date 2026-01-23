"use client"

import React from "react"

import { useState } from "react"
import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"
import { 
  Handshake,
  Building2,
  Wrench,
  Truck,
  GraduationCap,
  Globe,
  Award,
  TrendingUp,
  Users,
  ArrowRight,
  Check,
  Star,
  MapPin,
  Mail,
  Phone
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const partnerTypes = [
  {
    id: "reseller",
    title: "Reseller Partner",
    icon: Building2,
    description: "Distribute R3Bin solutions to your customer base with exclusive territory rights and competitive margins.",
    benefits: [
      "25-40% partner margins",
      "Exclusive territory rights",
      "Lead generation support",
      "Co-marketing funds",
      "Partner portal access",
      "Quarterly business reviews"
    ],
    requirements: [
      "Established customer base",
      "Dedicated sales team",
      "Technical support capability",
      "Annual revenue commitment"
    ]
  },
  {
    id: "integrator",
    title: "Systems Integrator",
    icon: Wrench,
    description: "Integrate R3Bin into smart city and enterprise solutions with deep technical collaboration and support.",
    benefits: [
      "Technical certification program",
      "API access and documentation",
      "Joint solution development",
      "Priority technical support",
      "Reference architecture library",
      "Co-development opportunities"
    ],
    requirements: [
      "IoT/Smart city expertise",
      "Engineering team",
      "Project delivery capability",
      "Security compliance"
    ]
  },
  {
    id: "service",
    title: "Service Provider",
    icon: Truck,
    description: "Offer R3Bin-powered waste management services to municipalities and commercial clients.",
    benefits: [
      "Fleet management platform",
      "Route optimization tools",
      "Customer analytics dashboard",
      "White-label options",
      "Operational training",
      "SLA support"
    ],
    requirements: [
      "Waste management license",
      "Service fleet",
      "Customer service team",
      "Geographic coverage"
    ]
  },
  {
    id: "academic",
    title: "Academic Partner",
    icon: GraduationCap,
    description: "Collaborate on research, pilot programs, and workforce development in sustainable technology.",
    benefits: [
      "Research grants access",
      "Student internship program",
      "Curriculum development",
      "Pilot deployment support",
      "Publication opportunities",
      "Conference sponsorship"
    ],
    requirements: [
      "Accredited institution",
      "Sustainability program",
      "Research capability",
      "Student engagement"
    ]
  }
]

const successStories = [
  {
    partner: "GreenTech Solutions",
    type: "Reseller",
    location: "California, USA",
    metric: "$2.4M",
    description: "First year revenue",
    quote: "R3Bin transformed our waste management portfolio. The technology sells itself, and the margins are exceptional.",
    author: "Sarah Chen, VP Sales"
  },
  {
    partner: "Smart City Systems",
    type: "Integrator",
    location: "Singapore",
    metric: "47",
    description: "Municipal deployments",
    quote: "The API flexibility and support team made integration seamless. We've made R3Bin our standard recommendation.",
    author: "Michael Tan, CTO"
  },
  {
    partner: "CleanWaste Services",
    type: "Service Provider",
    location: "London, UK",
    metric: "40%",
    description: "Route efficiency gain",
    quote: "Our operational costs dropped dramatically while service quality improved. Game-changer for our business.",
    author: "James Wilson, COO"
  }
]

const globalStats = [
  { value: "150+", label: "Active Partners" },
  { value: "42", label: "Countries" },
  { value: "$85M", label: "Partner Revenue" },
  { value: "98%", label: "Partner Satisfaction" },
]

export default function PartnersPage() {
  const [selectedPartnerType, setSelectedPartnerType] = useState("")
  const [formSubmitted, setFormSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFormSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-20 pb-12">
        {/* Hero Section */}
        <section className="py-20 px-4 lg:px-8 bg-gradient-to-b from-primary/5 to-transparent">
          <div className="mx-auto max-w-7xl">
            <div className="text-center mb-16">
              <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
                Partner Program
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 text-balance">
                Grow with the Leader in<br />Waste Intelligence
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
                Join our global partner ecosystem and help organizations achieve their 
                sustainability goals while building a profitable business.
              </p>
            </div>

            {/* Global Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
              {globalStats.map((stat) => (
                <Card key={stat.label} className="bg-card border-border text-center">
                  <CardContent className="p-6">
                    <p className="text-3xl font-bold text-primary mb-1">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Partner Types */}
        <section className="py-20 px-4 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Choose Your Partnership Path
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                We offer multiple partnership models designed to fit your business 
                capabilities and market focus.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {partnerTypes.map((partner) => (
                <Card 
                  key={partner.id} 
                  className="bg-card border-border hover:border-primary/50 transition-colors"
                >
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-lg bg-primary/10">
                        <partner.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-foreground">{partner.title}</CardTitle>
                        <CardDescription className="mt-1">{partner.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-sm font-semibold text-foreground mb-3">Benefits</h4>
                        <ul className="space-y-2">
                          {partner.benefits.map((benefit) => (
                            <li key={benefit} className="flex items-start gap-2">
                              <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                              <span className="text-sm text-muted-foreground">{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-foreground mb-3">Requirements</h4>
                        <ul className="space-y-2">
                          {partner.requirements.map((req) => (
                            <li key={req} className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground shrink-0 mt-2" />
                              <span className="text-sm text-muted-foreground">{req}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Success Stories */}
        <section className="py-20 px-4 lg:px-8 bg-card/50">
          <div className="mx-auto max-w-7xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Partner Success Stories
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Hear from partners who are building successful businesses with R3Bin.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {successStories.map((story) => (
                <Card key={story.partner} className="bg-card border-border">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Badge variant="outline" className="text-primary border-primary/30">
                        {story.type}
                      </Badge>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {story.location}
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <p className="text-4xl font-bold text-primary">{story.metric}</p>
                      <p className="text-sm text-muted-foreground">{story.description}</p>
                    </div>

                    <blockquote className="border-l-2 border-primary/30 pl-4 mb-4">
                      <p className="text-sm text-foreground italic">&quot;{story.quote}&quot;</p>
                    </blockquote>

                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                        <Users className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{story.author}</p>
                        <p className="text-xs text-muted-foreground">{story.partner}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Partner Benefits */}
        <section className="py-20 px-4 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
                  Why Partner with Us
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                  Built for Partner Success
                </h2>
                <p className="text-muted-foreground mb-8">
                  Our partner program is designed to help you succeed with comprehensive 
                  support, training, and resources at every stage of your journey.
                </p>

                <div className="space-y-4">
                  {[
                    { icon: Award, title: "Certification Program", desc: "Comprehensive training and certification to become an R3Bin expert" },
                    { icon: TrendingUp, title: "Growth Support", desc: "Marketing resources, lead generation, and co-selling opportunities" },
                    { icon: Globe, title: "Global Network", desc: "Access to our worldwide partner community and collaboration opportunities" },
                    { icon: Handshake, title: "Dedicated Support", desc: "Partner account managers and priority technical support" },
                  ].map((item) => (
                    <div key={item.title} className="flex items-start gap-4">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <item.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{item.title}</h3>
                        <p className="text-sm text-muted-foreground">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Application Form */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Become a Partner</CardTitle>
                  <CardDescription>
                    Fill out the form below and our partner team will contact you within 24 hours.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {formSubmitted ? (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                        <Check className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="text-xl font-semibold text-foreground mb-2">
                        Application Submitted
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        Thank you for your interest! Our partner team will contact you within 24 hours.
                      </p>
                      <Button 
                        variant="outline" 
                        onClick={() => setFormSubmitted(false)}
                        className="border-border"
                      >
                        Submit Another Application
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-foreground">First Name</Label>
                          <Input 
                            required 
                            placeholder="John" 
                            className="bg-secondary border-border"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-foreground">Last Name</Label>
                          <Input 
                            required 
                            placeholder="Smith" 
                            className="bg-secondary border-border"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-foreground">Company Name</Label>
                        <Input 
                          required 
                          placeholder="Acme Corporation" 
                          className="bg-secondary border-border"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-foreground">Work Email</Label>
                        <Input 
                          required 
                          type="email" 
                          placeholder="john@acme.com" 
                          className="bg-secondary border-border"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-foreground">Partnership Type</Label>
                        <Select value={selectedPartnerType} onValueChange={setSelectedPartnerType}>
                          <SelectTrigger className="bg-secondary border-border">
                            <SelectValue placeholder="Select partnership type" />
                          </SelectTrigger>
                          <SelectContent>
                            {partnerTypes.map((type) => (
                              <SelectItem key={type.id} value={type.id}>
                                {type.title}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-foreground">Tell us about your business</Label>
                        <Textarea 
                          placeholder="Describe your company, target market, and why you're interested in partnering with R3Bin..."
                          className="bg-secondary border-border min-h-[100px]"
                        />
                      </div>

                      <Button 
                        type="submit" 
                        className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                      >
                        Submit Application
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>

                      <p className="text-xs text-muted-foreground text-center">
                        By submitting, you agree to our Partner Program Terms and Privacy Policy.
                      </p>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-12 px-4 lg:px-8 bg-card/50">
          <div className="mx-auto max-w-4xl">
            <Card className="bg-card border-border">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    Have Questions About Partnership?
                  </h3>
                  <p className="text-muted-foreground">
                    Our partner team is here to help you find the right program for your business.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                  <a 
                    href="mailto:partners@fostride.com"
                    className="flex items-center gap-2 text-primary hover:underline"
                  >
                    <Mail className="h-4 w-4" />
                    partners@fostride.com
                  </a>
                  <a 
                    href="tel:+1-888-R3BIN-01"
                    className="flex items-center gap-2 text-primary hover:underline"
                  >
                    <Phone className="h-4 w-4" />
                    +1-888-R3BIN-01
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
