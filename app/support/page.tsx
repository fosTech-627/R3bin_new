"use client"

import { useState, Suspense } from "react"
import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"
import {
  Search,
  Book,
  Video,
  MessageCircle,
  Phone,
  Mail,
  FileText,
  Cpu,
  Wifi,
  BarChart3,
  Settings,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ChevronRight,
  ExternalLink,
  HelpCircle,
  Headphones,
  Zap
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const categories = [
  { id: "getting-started", name: "Getting Started", icon: Book, count: 24 },
  { id: "hardware", name: "Hardware Setup", icon: Cpu, count: 18 },
  { id: "connectivity", name: "Connectivity", icon: Wifi, count: 12 },
  { id: "analytics", name: "Analytics", icon: BarChart3, count: 31 },
  { id: "troubleshooting", name: "Troubleshooting", icon: Settings, count: 45 },
  { id: "api", name: "API & Integration", icon: FileText, count: 28 },
]

const popularArticles = [
  { title: "Quick Start Guide: Setting Up Your First R3Bin", category: "Getting Started", views: "12.4K" },
  { title: "Connecting R3Bin to Your WiFi Network", category: "Connectivity", views: "8.7K" },
  { title: "Understanding Waste Composition Analytics", category: "Analytics", views: "7.2K" },
  { title: "Troubleshooting Sensor Calibration Issues", category: "Troubleshooting", views: "6.8K" },
  { title: "REST API Authentication Guide", category: "API & Integration", views: "5.4K" },
  { title: "Optimizing Collection Routes with AI", category: "Analytics", views: "4.9K" },
]

const faqs = [
  {
    question: "How long does it take to install an R3Bin unit?",
    answer: "A standard R3Bin installation takes approximately 2-4 hours per unit. This includes physical placement, power connection, network configuration, and initial calibration. Our certified installers handle the entire process, and most deployments of 50+ units can be completed within a week."
  },
  {
    question: "What happens if a bin loses connectivity?",
    answer: "R3Bin units have a local storage buffer that can hold up to 7 days of data during connectivity outages. Once connection is restored, all data automatically syncs to the cloud. The AI classification continues to work offline using the on-device neural processor, ensuring uninterrupted waste sorting."
  },
  {
    question: "How accurate is the AI waste classification?",
    answer: "Our AI classification system achieves 94%+ accuracy across standard waste categories (recyclables, organics, general waste). For specific material types (plastics, paper, metal, glass), accuracy ranges from 89-97% depending on the material. The system continuously improves through machine learning."
  },
  {
    question: "Can R3Bin integrate with our existing waste management software?",
    answer: "Yes, R3Bin offers comprehensive integration options including REST API, GraphQL API, webhooks, and pre-built connectors for popular platforms like SAP, Oracle, and Salesforce. Our integration team can assist with custom integrations for enterprise deployments."
  },
  {
    question: "What maintenance is required for R3Bin units?",
    answer: "R3Bin units are designed for minimal maintenance. The primary requirements are: quarterly sensor cleaning (automated alerts remind you), annual camera lens cleaning, and firmware updates (automatic over-the-air). The solar panels are self-cleaning with a hydrophobic coating."
  },
  {
    question: "How do you handle data privacy and security?",
    answer: "All data is encrypted in transit (TLS 1.3) and at rest (AES-256). We are SOC 2 Type II and ISO 27001 certified. No personal identifying information is collected - the AI only analyzes waste items, not people. Data residency options are available for GDPR compliance."
  },
]

const systemStatus = [
  { name: "R3Bin Cloud Platform", status: "operational", uptime: "99.99%" },
  { name: "Analytics Dashboard", status: "operational", uptime: "99.98%" },
  { name: "REST API", status: "operational", uptime: "99.99%" },
  { name: "IoT Gateway", status: "operational", uptime: "99.97%" },
  { name: "Mobile App", status: "operational", uptime: "99.95%" },
]

const recentUpdates = [
  { date: "Jan 21, 2026", title: "Dashboard v2.8 Released", type: "feature" },
  { date: "Jan 18, 2026", title: "API Rate Limit Increase", type: "improvement" },
  { date: "Jan 15, 2026", title: "Mobile App iOS Update", type: "feature" },
  { date: "Jan 10, 2026", title: "Scheduled Maintenance Complete", type: "maintenance" },
]

const videoTutorials = [
  { title: "R3Bin Installation Walkthrough", duration: "12:34", thumbnail: "installation" },
  { title: "Dashboard Overview for Admins", duration: "8:45", thumbnail: "dashboard" },
  { title: "Setting Up Alerts and Notifications", duration: "6:22", thumbnail: "alerts" },
  { title: "API Integration Tutorial", duration: "15:18", thumbnail: "api" },
]

export default function SupportPage() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-20 pb-12">
        {/* Hero Section with Search */}
        <section className="py-16 px-4 lg:px-8 bg-gradient-to-b from-primary/5 to-transparent">
          <div className="mx-auto max-w-4xl text-center">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              Support Center
            </Badge>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 text-balance">
              How can we help you?
            </h1>
            <p className="text-muted-foreground mb-8">
              Search our knowledge base or browse categories below
            </p>

            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search for articles, guides, and tutorials..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-6 text-lg bg-card border-border"
              />
            </div>

            {/* Quick Links */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
              <span className="text-sm text-muted-foreground">Popular:</span>
              {["Setup Guide", "API Docs", "Troubleshooting", "Contact Support"].map((link) => (
                <Button
                  key={link}
                  variant="ghost"
                  size="sm"
                  className="text-primary hover:text-primary hover:bg-primary/10"
                >
                  {link}
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* Support Options */}
        <section className="py-12 px-4 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid md:grid-cols-3 gap-6 mb-16">
              <Card className="bg-card border-border hover:border-primary/50 transition-colors cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <MessageCircle className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Live Chat</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Chat with our support team in real-time
                  </p>
                  <Badge className="bg-green-500/10 text-green-400 border-green-500/20">
                    Available Now
                  </Badge>
                </CardContent>
              </Card>

              <Card className="bg-card border-border hover:border-primary/50 transition-colors cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className="w-14 h-14 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto mb-4">
                    <Phone className="h-7 w-7 text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Phone Support</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Talk to a specialist: +91 9818801050
                  </p>
                  <Badge variant="outline" className="text-muted-foreground border-border">
                    Mon-Fri, 8AM-8PM ET
                  </Badge>
                </CardContent>
              </Card>

              <Card className="bg-card border-border hover:border-primary/50 transition-colors cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className="w-14 h-14 rounded-full bg-purple-500/10 flex items-center justify-center mx-auto mb-4">
                    <Mail className="h-7 w-7 text-purple-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Email Support</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    support@fostride.com
                  </p>
                  <Badge variant="outline" className="text-muted-foreground border-border">
                    Response within 4 hours
                  </Badge>
                </CardContent>
              </Card>
            </div>

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Left Column - Categories & Articles */}
              <div className="lg:col-span-2 space-y-8">
                {/* Knowledge Base Categories */}
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-6">Knowledge Base</h2>
                  <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {categories.map((category) => (
                      <Card
                        key={category.id}
                        className="bg-card border-border hover:border-primary/50 transition-colors cursor-pointer"
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-secondary">
                              <category.icon className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium text-foreground">{category.name}</p>
                              <p className="text-xs text-muted-foreground">{category.count} articles</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Popular Articles */}
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-foreground">Popular Articles</CardTitle>
                    <CardDescription>Most viewed help articles this month</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-1">
                      {popularArticles.map((article, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer"
                        >
                          <div className="flex items-center gap-3">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="text-sm font-medium text-foreground">{article.title}</p>
                              <p className="text-xs text-muted-foreground">{article.category}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">{article.views} views</span>
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Video Tutorials */}
                <Card className="bg-card border-border">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-foreground">Video Tutorials</CardTitle>
                        <CardDescription>Step-by-step visual guides</CardDescription>
                      </div>
                      <Button variant="ghost" size="sm" className="text-primary">
                        View All
                        <ExternalLink className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {videoTutorials.map((video) => (
                        <div
                          key={video.title}
                          className="group cursor-pointer"
                        >
                          <div className="aspect-video rounded-lg bg-secondary mb-3 flex items-center justify-center group-hover:bg-secondary/80 transition-colors">
                            <Video className="h-10 w-10 text-muted-foreground group-hover:text-primary transition-colors" />
                          </div>
                          <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                            {video.title}
                          </p>
                          <p className="text-xs text-muted-foreground">{video.duration}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* FAQ Section */}
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-foreground">Frequently Asked Questions</CardTitle>
                    <CardDescription>Quick answers to common questions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                      {faqs.map((faq, index) => (
                        <AccordionItem key={index} value={`item-${index}`} className="border-border">
                          <AccordionTrigger className="text-left text-foreground hover:text-primary">
                            {faq.question}
                          </AccordionTrigger>
                          <AccordionContent className="text-muted-foreground">
                            {faq.answer}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Status & Updates */}
              <div className="space-y-6">
                {/* System Status */}
                <Card className="bg-card border-border">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-foreground text-lg">System Status</CardTitle>
                      <Badge className="bg-green-500/10 text-green-400 border-green-500/20">
                        All Systems Operational
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {systemStatus.map((service) => (
                        <div
                          key={service.name}
                          className="flex items-center justify-between py-2"
                        >
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-400" />
                            <span className="text-sm text-foreground">{service.name}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">{service.uptime}</span>
                        </div>
                      ))}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full mt-4 text-primary hover:text-primary hover:bg-primary/10"
                    >
                      View Status Page
                      <ExternalLink className="h-4 w-4 ml-1" />
                    </Button>
                  </CardContent>
                </Card>

                {/* Recent Updates */}
                <Card className="bg-card border-border">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-foreground text-lg">Recent Updates</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentUpdates.map((update, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <div className={`p-1.5 rounded-full ${update.type === 'feature' ? 'bg-primary/10' :
                              update.type === 'improvement' ? 'bg-blue-500/10' :
                                'bg-yellow-500/10'
                            }`}>
                            {update.type === 'feature' ? (
                              <Zap className="h-3 w-3 text-primary" />
                            ) : update.type === 'improvement' ? (
                              <Zap className="h-3 w-3 text-blue-400" />
                            ) : (
                              <Clock className="h-3 w-3 text-yellow-400" />
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">{update.title}</p>
                            <p className="text-xs text-muted-foreground">{update.date}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Enterprise Support CTA */}
                <Card className="bg-gradient-to-br from-primary/20 to-primary/5 border-primary/20">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 rounded-lg bg-primary/20">
                        <Headphones className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="font-semibold text-foreground">Enterprise Support</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      Get 24/7 priority support with dedicated account management and
                      guaranteed response times.
                    </p>
                    <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                      Learn More
                    </Button>
                  </CardContent>
                </Card>

                {/* Community Link */}
                <Card className="bg-card border-border">
                  <CardContent className="p-6 text-center">
                    <HelpCircle className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                    <h3 className="font-semibold text-foreground mb-2">Community Forum</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Connect with other R3Bin users and share best practices
                    </p>
                    <Button variant="outline" className="w-full border-border bg-transparent">
                      Visit Community
                      <ExternalLink className="h-4 w-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

function Loading() {
  return null
}
