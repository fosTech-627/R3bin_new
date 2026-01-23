"use client"

import { useState, useMemo } from "react"
import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"
import { 
  Calculator,
  Leaf,
  DollarSign,
  TrendingUp,
  Trash2,
  Building2,
  Users,
  ArrowRight,
  Info,
  Download,
  RotateCcw
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  LineChart,
  Line,
  Tooltip as RechartsTooltip,
  Legend
} from "recharts"

const organizationTypes = [
  { value: "university", label: "University Campus", wastePerPerson: 0.8 },
  { value: "corporate", label: "Corporate Office", wastePerPerson: 0.5 },
  { value: "hospital", label: "Hospital/Healthcare", wastePerPerson: 2.5 },
  { value: "municipality", label: "Municipality", wastePerPerson: 1.2 },
  { value: "retail", label: "Retail/Shopping Center", wastePerPerson: 1.8 },
]

export default function CalculatorPage() {
  const [orgType, setOrgType] = useState("university")
  const [population, setPopulation] = useState(5000)
  const [currentRecyclingRate, setCurrentRecyclingRate] = useState(35)
  const [wasteDisposalCost, setWasteDisposalCost] = useState(85)
  const [numberOfBins, setNumberOfBins] = useState(50)

  const calculations = useMemo(() => {
    const org = organizationTypes.find(o => o.value === orgType)
    const dailyWaste = population * (org?.wastePerPerson || 0.8)
    const annualWaste = dailyWaste * 365
    
    // R3Bin projections
    const projectedRecyclingRate = Math.min(currentRecyclingRate + 45, 95) // Up to 95%
    const recyclingImprovement = projectedRecyclingRate - currentRecyclingRate
    
    // Cost savings
    const currentAnnualCost = (annualWaste * (100 - currentRecyclingRate) / 100) * wasteDisposalCost
    const projectedAnnualCost = (annualWaste * (100 - projectedRecyclingRate) / 100) * wasteDisposalCost
    const annualSavings = currentAnnualCost - projectedAnnualCost
    
    // Environmental impact
    const wasteReducedTons = (annualWaste * recyclingImprovement / 100) / 1000
    const carbonOffsetTons = wasteReducedTons * 0.5 // 0.5 tons CO2 per ton recycled
    const treesEquivalent = Math.round(carbonOffsetTons * 16) // 16 trees per ton CO2
    
    // Collection efficiency
    const currentCollections = numberOfBins * 365 // Assume daily collection
    const optimizedCollections = Math.round(currentCollections * 0.6) // 40% reduction
    const collectionSavings = (currentCollections - optimizedCollections) * 25 // $25 per collection
    
    // ROI calculation
    const systemCost = numberOfBins * 2500 // $2500 per smart bin
    const implementationCost = numberOfBins * 500 // Installation and setup
    const totalInvestment = systemCost + implementationCost
    const totalAnnualSavings = annualSavings + collectionSavings
    const paybackMonths = Math.round((totalInvestment / totalAnnualSavings) * 12)
    const threeYearROI = ((totalAnnualSavings * 3 - totalInvestment) / totalInvestment * 100)
    
    return {
      dailyWaste: Math.round(dailyWaste),
      annualWaste: Math.round(annualWaste / 1000), // in tons
      projectedRecyclingRate,
      recyclingImprovement,
      currentAnnualCost: Math.round(currentAnnualCost),
      projectedAnnualCost: Math.round(projectedAnnualCost),
      annualSavings: Math.round(annualSavings),
      wasteReducedTons: Math.round(wasteReducedTons),
      carbonOffsetTons: Math.round(carbonOffsetTons),
      treesEquivalent,
      collectionSavings: Math.round(collectionSavings),
      totalInvestment,
      totalAnnualSavings: Math.round(totalAnnualSavings),
      paybackMonths,
      threeYearROI: Math.round(threeYearROI),
    }
  }, [orgType, population, currentRecyclingRate, wasteDisposalCost, numberOfBins])

  const projectionData = [
    { year: "Year 1", savings: calculations.totalAnnualSavings, cumulative: calculations.totalAnnualSavings - calculations.totalInvestment },
    { year: "Year 2", savings: calculations.totalAnnualSavings, cumulative: (calculations.totalAnnualSavings * 2) - calculations.totalInvestment },
    { year: "Year 3", savings: calculations.totalAnnualSavings, cumulative: (calculations.totalAnnualSavings * 3) - calculations.totalInvestment },
    { year: "Year 4", savings: calculations.totalAnnualSavings, cumulative: (calculations.totalAnnualSavings * 4) - calculations.totalInvestment },
    { year: "Year 5", savings: calculations.totalAnnualSavings, cumulative: (calculations.totalAnnualSavings * 5) - calculations.totalInvestment },
  ]

  const comparisonData = [
    { metric: "Recycling Rate", current: currentRecyclingRate, projected: calculations.projectedRecyclingRate },
    { metric: "Annual Cost ($K)", current: Math.round(calculations.currentAnnualCost / 1000), projected: Math.round(calculations.projectedAnnualCost / 1000) },
  ]

  const resetForm = () => {
    setOrgType("university")
    setPopulation(5000)
    setCurrentRecyclingRate(35)
    setWasteDisposalCost(85)
    setNumberOfBins(50)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-20 pb-12">
        <div className="px-4 lg:px-8 py-8">
          <div className="mx-auto max-w-7xl">
            {/* Header */}
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
                ROI Calculator
              </Badge>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 text-balance">
                Calculate Your Sustainability Impact
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
                See how R3Bin can transform your waste management operations with 
                projected savings, environmental impact, and ROI estimates.
              </p>
            </div>

            <div className="grid lg:grid-cols-5 gap-8">
              {/* Input Form */}
              <Card className="lg:col-span-2 bg-card border-border h-fit">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-foreground flex items-center gap-2">
                        <Calculator className="h-5 w-5 text-primary" />
                        Your Organization
                      </CardTitle>
                      <CardDescription>Enter your details for personalized estimates</CardDescription>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={resetForm}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <RotateCcw className="h-4 w-4 mr-1" />
                      Reset
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Organization Type */}
                  <div className="space-y-2">
                    <Label className="text-foreground flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      Organization Type
                    </Label>
                    <Select value={orgType} onValueChange={setOrgType}>
                      <SelectTrigger className="bg-secondary border-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {organizationTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Population */}
                  <div className="space-y-3">
                    <Label className="text-foreground flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      Daily Population
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-3 w-3 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Average number of people on-site daily</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </Label>
                    <div className="flex items-center gap-4">
                      <Slider
                        value={[population]}
                        onValueChange={(v) => setPopulation(v[0])}
                        min={100}
                        max={50000}
                        step={100}
                        className="flex-1"
                      />
                      <Input
                        type="number"
                        value={population}
                        onChange={(e) => setPopulation(Number(e.target.value))}
                        className="w-24 bg-secondary border-border"
                      />
                    </div>
                  </div>

                  {/* Current Recycling Rate */}
                  <div className="space-y-3">
                    <Label className="text-foreground flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                      Current Recycling Rate
                    </Label>
                    <div className="flex items-center gap-4">
                      <Slider
                        value={[currentRecyclingRate]}
                        onValueChange={(v) => setCurrentRecyclingRate(v[0])}
                        min={5}
                        max={80}
                        step={1}
                        className="flex-1"
                      />
                      <div className="w-20 text-right">
                        <span className="text-lg font-semibold text-foreground">{currentRecyclingRate}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Waste Disposal Cost */}
                  <div className="space-y-3">
                    <Label className="text-foreground flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      Waste Disposal Cost ($/ton)
                    </Label>
                    <div className="flex items-center gap-4">
                      <Slider
                        value={[wasteDisposalCost]}
                        onValueChange={(v) => setWasteDisposalCost(v[0])}
                        min={30}
                        max={200}
                        step={5}
                        className="flex-1"
                      />
                      <Input
                        type="number"
                        value={wasteDisposalCost}
                        onChange={(e) => setWasteDisposalCost(Number(e.target.value))}
                        className="w-24 bg-secondary border-border"
                      />
                    </div>
                  </div>

                  {/* Number of Bins */}
                  <div className="space-y-3">
                    <Label className="text-foreground flex items-center gap-2">
                      <Trash2 className="h-4 w-4 text-muted-foreground" />
                      Number of Smart Bins
                    </Label>
                    <div className="flex items-center gap-4">
                      <Slider
                        value={[numberOfBins]}
                        onValueChange={(v) => setNumberOfBins(v[0])}
                        min={10}
                        max={500}
                        step={5}
                        className="flex-1"
                      />
                      <Input
                        type="number"
                        value={numberOfBins}
                        onChange={(e) => setNumberOfBins(Number(e.target.value))}
                        className="w-24 bg-secondary border-border"
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border">
                    <p className="text-xs text-muted-foreground">
                      * Estimates based on industry averages and R3Bin deployment data
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Results */}
              <div className="lg:col-span-3 space-y-6">
                {/* Key Metrics */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card className="bg-gradient-to-br from-primary/20 to-primary/5 border-primary/20">
                    <CardContent className="p-5">
                      <DollarSign className="h-8 w-8 text-primary mb-3" />
                      <p className="text-sm text-muted-foreground mb-1">Annual Savings</p>
                      <p className="text-2xl font-bold text-foreground">
                        ${calculations.totalAnnualSavings.toLocaleString()}
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="bg-card border-border">
                    <CardContent className="p-5">
                      <Leaf className="h-8 w-8 text-green-400 mb-3" />
                      <p className="text-sm text-muted-foreground mb-1">Carbon Offset</p>
                      <p className="text-2xl font-bold text-foreground">
                        {calculations.carbonOffsetTons} tons
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="bg-card border-border">
                    <CardContent className="p-5">
                      <TrendingUp className="h-8 w-8 text-blue-400 mb-3" />
                      <p className="text-sm text-muted-foreground mb-1">Recycling Rate</p>
                      <p className="text-2xl font-bold text-foreground">
                        {calculations.projectedRecyclingRate}%
                      </p>
                      <p className="text-xs text-green-400">+{calculations.recyclingImprovement}%</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-card border-border">
                    <CardContent className="p-5">
                      <Calculator className="h-8 w-8 text-purple-400 mb-3" />
                      <p className="text-sm text-muted-foreground mb-1">Payback Period</p>
                      <p className="text-2xl font-bold text-foreground">
                        {calculations.paybackMonths} months
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* ROI Projection Chart */}
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-foreground">5-Year ROI Projection</CardTitle>
                    <CardDescription>Cumulative savings over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[280px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={projectionData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                          <XAxis dataKey="year" stroke="#71717a" fontSize={12} />
                          <YAxis 
                            stroke="#71717a" 
                            fontSize={12}
                            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
                          />
                          <RechartsTooltip 
                            contentStyle={{ 
                              backgroundColor: '#18181b', 
                              border: '1px solid #27272a',
                              borderRadius: '8px'
                            }}
                            formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
                          />
                          <Legend />
                          <Line 
                            type="monotone" 
                            dataKey="savings" 
                            name="Annual Savings"
                            stroke="#34d399" 
                            strokeWidth={2}
                            dot={{ fill: '#34d399' }}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="cumulative" 
                            name="Cumulative ROI"
                            stroke="#60a5fa" 
                            strokeWidth={2}
                            dot={{ fill: '#60a5fa' }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Detailed Breakdown */}
                <div className="grid sm:grid-cols-2 gap-6">
                  {/* Financial Impact */}
                  <Card className="bg-card border-border">
                    <CardHeader>
                      <CardTitle className="text-foreground text-lg">Financial Impact</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between items-center py-2 border-b border-border">
                        <span className="text-sm text-muted-foreground">Initial Investment</span>
                        <span className="text-sm font-medium text-foreground">
                          ${calculations.totalInvestment.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-border">
                        <span className="text-sm text-muted-foreground">Disposal Cost Savings</span>
                        <span className="text-sm font-medium text-green-400">
                          +${calculations.annualSavings.toLocaleString()}/yr
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-border">
                        <span className="text-sm text-muted-foreground">Collection Savings</span>
                        <span className="text-sm font-medium text-green-400">
                          +${calculations.collectionSavings.toLocaleString()}/yr
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2 bg-primary/10 px-3 -mx-3 rounded-lg">
                        <span className="text-sm font-medium text-foreground">3-Year ROI</span>
                        <span className="text-lg font-bold text-primary">
                          {calculations.threeYearROI}%
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Environmental Impact */}
                  <Card className="bg-card border-border">
                    <CardHeader>
                      <CardTitle className="text-foreground text-lg">Environmental Impact</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between items-center py-2 border-b border-border">
                        <span className="text-sm text-muted-foreground">Annual Waste Generated</span>
                        <span className="text-sm font-medium text-foreground">
                          {calculations.annualWaste} tons
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-border">
                        <span className="text-sm text-muted-foreground">Waste Diverted</span>
                        <span className="text-sm font-medium text-green-400">
                          {calculations.wasteReducedTons} tons
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-border">
                        <span className="text-sm text-muted-foreground">Carbon Offset</span>
                        <span className="text-sm font-medium text-green-400">
                          {calculations.carbonOffsetTons} tons CO2
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2 bg-green-500/10 px-3 -mx-3 rounded-lg">
                        <span className="text-sm font-medium text-foreground">Trees Equivalent</span>
                        <span className="text-lg font-bold text-green-400">
                          {calculations.treesEquivalent.toLocaleString()} trees
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* CTA */}
                <Card className="bg-gradient-to-r from-primary/20 via-primary/10 to-transparent border-primary/20">
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-semibold text-foreground mb-1">
                          Ready to see these results?
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Get a detailed proposal customized for your organization
                        </p>
                      </div>
                      <div className="flex gap-3">
                        <Button variant="outline" className="border-border bg-transparent">
                          <Download className="h-4 w-4 mr-2" />
                          Download Report
                        </Button>
                        <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                          Schedule Demo
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
