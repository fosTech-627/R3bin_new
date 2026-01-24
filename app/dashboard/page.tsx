"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"
import {
  BarChart3,
  TrendingUp,
  Trash2,
  Leaf,
  MapPin,
  Clock,
  AlertTriangle,
  RefreshCw,
  Download,
  Filter,
  Calendar,
  ChevronDown
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend
} from "recharts"
import { supabase } from "@/lib/supabase"
import { formatDistanceToNow } from "date-fns"

// Types matching Supabase tables
type CollectionTrend = {
  date: string
  metal: number
  plastic: number
  paper: number
  mixed_waste: number
}

type WasteComposition = {
  material: string
  value: number
}

type HourlyActivity = {
  hour: string
  activity: number
}

type BinStatus = {
  id: string
  location: string
  fill_level: number
  last_collection: string
  status: 'critical' | 'warning' | 'normal'
}

type Alert = {
  id: number
  type: 'critical' | 'warning' | 'info'
  message: string
  created_at: string
}

// UI specific types (mapped from DB)
type UIWasteComposition = {
  name: string
  value: number
  color: string
}

type UIBinStatus = {
  id: string
  location: string
  fillLevel: number
  lastCollection: string
  status: string
}

type UIAlert = {
  id: number
  type: string
  message: string
  time: string
}

const COLORS: Record<string, string> = {
  // Capitalized
  "Plastics": "#34d399",
  "Plastic": "#34d399",
  "Paper": "#60a5fa",
  "Organic": "#fbbf24",
  "Metal": "#a78bfa",
  "Glass": "#f472b6",
  "General": "#94a3b8",
  "Mixed Waste": "#94a3b8",

  // Lowercase from DB
  "plastic": "#34d399",
  "paper": "#60a5fa",
  "metal": "#a78bfa",
  "mixed": "#94a3b8",
  "mixed waste": "#94a3b8"
}

const FALLBACK_COLORS = ["#34d399", "#60a5fa", "#fbbf24", "#a78bfa", "#f472b6"]

export default function DashboardPage() {
  const [timeRange, setTimeRange] = useState("7d")
  const [selectedLocation, setSelectedLocation] = useState("all")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Data states
  const [collectionTrends, setCollectionTrends] = useState<CollectionTrend[]>([])
  const [wasteComposition, setWasteComposition] = useState<UIWasteComposition[]>([])
  const [hourlyActivity, setHourlyActivity] = useState<HourlyActivity[]>([])
  const [binStatusData, setBinStatusData] = useState<UIBinStatus[]>([])
  const [alerts, setAlerts] = useState<UIAlert[]>([])

  // Stats
  const [totalWaste, setTotalWaste] = useState("0 kg")
  const [activeBins, setActiveBins] = useState("0/0")

  useEffect(() => {
    fetchData()
  }, [timeRange])

  const fetchData = async () => {
    console.log('DEBUG: Starting fetchData...')
    setLoading(true)
    setError(null)
    let activeCount = 0
    try {
      // 1. Collection Trends (Calculated from Logs)
      const { data: rawLogs, error: logsError } = await supabase
        .from('r3bin_waste_logs')
        .select('updated_at, waste_type')
        .order('updated_at', { ascending: true })

      if (logsError) console.error('Error fetching logs:', logsError)
      else if (rawLogs) {
        // A. Aggregate for Trends (Group by Date)
        const dailyStats: Record<string, CollectionTrend> = {}
        const todayStr = new Date().toISOString().split('T')[0]

        rawLogs.forEach((log: any) => {
          // Normalize date. Handle ISO (YYYY-MM-DD...) and Custom (YY-MM-DD_...)
          let dateKey = 'Unknown'

          try {
            if (log.updated_at) {
              if (log.updated_at.includes('T')) {
                // Standard ISO format
                dateKey = log.updated_at.split('T')[0]
              } else {
                // Custom format: 26-01-17_16-15-29 (YY-MM-DD_...)
                // Split by underscore or space to get date part
                const datePart = log.updated_at.split(/[_ ]/)[0]
                const parts = datePart.split('-')

                if (parts.length >= 3) {
                  // Assuming YY-MM-DD
                  let year = parseInt(parts[0])
                  let month = parseInt(parts[1])
                  let day = parseInt(parts[2])

                  // Adjust 2-digit year to 4-digit (Assuming 20xx)
                  if (year < 100) year += 2000

                  // Create Date object (Month is 0-indexed)
                  // Use UTC to avoid timezone shifts affecting the "Day" bucket
                  const dateObj = new Date(Date.UTC(year, month - 1, day))
                  dateKey = dateObj.toISOString().split('T')[0]
                }
              }
            }
          } catch (e) {
            console.warn('Date parse error', log.updated_at)
          }

          // Skip invalid dates
          if (dateKey === 'Unknown') return

          // Clean waste_type: remove quotes if present, trim whitespace
          const rawType = log.waste_type ? String(log.waste_type).replace(/['"]/g, '').trim() : 'mixed'
          const type = rawType.toLowerCase()

          if (!dailyStats[dateKey]) {
            dailyStats[dateKey] = { date: dateKey, metal: 0, plastic: 0, paper: 0, mixed_waste: 0 }
          }

          if (type.includes('metal')) dailyStats[dateKey].metal++
          else if (type.includes('plastic')) dailyStats[dateKey].plastic++
          else if (type.includes('paper')) dailyStats[dateKey].paper++
          else dailyStats[dateKey].mixed_waste++
        })

        // Convert to array and sort
        let trendsData = Object.values(dailyStats).sort((a, b) =>
          new Date(a.date).getTime() - new Date(b.date).getTime()
        )

        // Fix for "Empty Chart" when only 1 day of data exists
        // AreaChart needs at least 2 points to show width. We add a zero-point for the previous day.
        if (trendsData.length === 1) {
          const singleDate = new Date(trendsData[0].date)
          const prevDate = new Date(singleDate)
          prevDate.setDate(singleDate.getDate() - 1)
          const prevDateStr = prevDate.toISOString().split('T')[0]

          trendsData = [
            { date: prevDateStr, metal: 0, plastic: 0, paper: 0, mixed_waste: 0 },
            ...trendsData
          ]
        }

        // Filter trends based on selected ID (timeRange)
        const now = new Date()
        let cutoffDate: Date | null = new Date()

        switch (timeRange) {
          case '24h': cutoffDate.setDate(now.getDate() - 1); break;
          case '7d': cutoffDate.setDate(now.getDate() - 7); break;
          case '30d': cutoffDate.setDate(now.getDate() - 30); break;
          case '90d': cutoffDate.setDate(now.getDate() - 90); break;
          case 'all': cutoffDate = null; break; // No cutoff
          default: cutoffDate.setDate(now.getDate() - 7);
        }

        const filteredTrends = cutoffDate
          ? trendsData.filter(d => new Date(d.date) >= cutoffDate)
          : trendsData // Show all if no cutoff

        setCollectionTrends(filteredTrends)

        // B. Total Waste Today
        const todayStats = dailyStats[todayStr]
        const todayCount = todayStats
          ? (todayStats.metal + todayStats.plastic + todayStats.paper + todayStats.mixed_waste)
          : 0
        setTotalWaste(`${todayCount} items`)

        // C. Waste Composition (Aggregate all time)
        let totalMetal = 0
        let totalPlastic = 0
        let totalPaper = 0
        let totalMixed = 0

        Object.values(dailyStats).forEach((d) => {
          totalMetal += d.metal
          totalPlastic += d.plastic
          totalPaper += d.paper
          totalMixed += d.mixed_waste
        })

        const grandTotal = totalMetal + totalPlastic + totalPaper + totalMixed
        const calcPct = (val: number) => grandTotal > 0 ? Math.round((val / grandTotal) * 100) : 0

        const compositionData = [
          { name: "Metal", value: calcPct(totalMetal), color: COLORS["Metal"] },
          { name: "Plastic", value: calcPct(totalPlastic), color: COLORS["Plastic"] },
          { name: "Paper", value: calcPct(totalPaper), color: COLORS["Paper"] },
          { name: "Mixed Waste", value: calcPct(totalMixed), color: COLORS["Mixed Waste"] }
        ]
        setWasteComposition(compositionData)
      }

      // 2. Hourly Activity
      const { data: hourData, error: hourError } = await supabase
        .from('hourly_activity')
        .select('*')
        .order('hour', { ascending: true })

      if (hourError) console.error('Error fetching hourly activity:', hourError)
      else if (hourData) setHourlyActivity(hourData)

      // 3. Bins (From Registry)
      const { data: registryData, error: registryError } = await supabase
        .from('r3bin_registry')
        .select('*')

      if (registryError) console.error('Error fetching registry:', registryError)
      else if (registryData) {
        // Map registry to UI model, creating a lookup for last activity from logs
        const mappedBins = registryData.map((bin: any) => {
          // Find last log for this bin
          // We can use the already fetched 'rawLogs' which are sorted by date ascending.
          // So reverse finding or finding last occurrence is better? 
          // Since rawLogs is sorted ASC, the LAST matching entry is the most recent.

          let lastActive = 'Never'
          let fillLevel = 0 // Default since registry doesn't track fill yet
          let status = 'normal'

          // Check if we have logs
          if (rawLogs && rawLogs.length > 0) {
            const binLogs = rawLogs.filter((l: any) => l.bin_id === bin.bin_id)
            if (binLogs.length > 0) {
              const lastLog = binLogs[binLogs.length - 1]
              // Parse date for display
              // We reuse our robust parser or just use the raw string if it's display-only?
              // Let's rely on formatDistanceToNow but we need a valid JS Date.
              // We can use the 'dateKey' logic from earlier or just try-parse

              try {
                // Try standard ISO first
                let dateObj = new Date(lastLog.updated_at)
                // If invalid, try custom parser (simple version)
                if (isNaN(dateObj.getTime())) {
                  const datePart = lastLog.updated_at.split(/[_ ]/)[0]
                  const parts = datePart.split('-')
                  if (parts.length >= 3) {
                    let y = parseInt(parts[0]); if (y < 100) y += 2000;
                    let m = parseInt(parts[1]) - 1;
                    let d = parseInt(parts[2]);
                    // Time part? '22-03-17' -> 22:03:17
                    let h = 0, min = 0, s = 0
                    const timePart = lastLog.updated_at.split(/[_ ]/)[1]
                    if (timePart) {
                      const tParts = timePart.split('-')
                      if (tParts.length >= 3) {
                        h = parseInt(tParts[0]); min = parseInt(tParts[1]); s = parseInt(tParts[2]);
                      }
                    }
                    dateObj = new Date(Date.UTC(y, m, d, h, min, s))
                  }
                }

                if (!isNaN(dateObj.getTime())) {
                  lastActive = formatDistanceToNow(dateObj, { addSuffix: true })
                }
              } catch (e) {
                lastActive = 'Unknown'
              }
            }
          }

          return {
            id: bin.bin_id,
            location: bin.location,
            fillLevel: Math.floor(Math.random() * 30) + 10, // Mock fill level for now as it's missing
            lastCollection: lastActive,
            status: status
          }
        })

        setBinStatusData(mappedBins)

        // Active Bins = Total Bins in Registry
        activeCount = registryData.length
        setActiveBins(`${activeCount}/${registryData.length}`)
      }

      // 5. Alerts (from bins table)
      // Note: Column name appears to be "bin_alerts:" based on schema debug
      const { data: binsAlertsData, error: binsAlertsError } = await supabase
        .from('bins')
        .select('bin_id, "bin_alerts:"') // Use quotes to handle special char
        .not('"bin_alerts:"', 'is', null)

      if (binsAlertsError) {
        console.error('Error fetching bin alerts:', binsAlertsError)
      } else if (binsAlertsData) {
        // Map bin alerts to the Alert structure
        const mappedAlerts: UIAlert[] = binsAlertsData.map((bin: any, index: number) => {
          // Supabase response might normalize keys or keep them with colon
          const messageStr = bin['bin_alerts:'] || bin.bin_alerts || 'Unknown Alert'

          let type = 'info'

          if (messageStr.toLowerCase().includes('critical') || messageStr.toLowerCase().includes('overflow')) {
            type = 'critical'
          } else if (messageStr.toLowerCase().includes('warning') || messageStr.toLowerCase().includes('low')) {
            type = 'warning'
          }

          return {
            id: index,
            type: type,
            message: `${bin.bin_id}: ${messageStr}`,
            time: 'Just now'
          }
        })
        setAlerts(mappedAlerts)
      }

    } catch (err: any) {
      console.error('Unexpected error:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "critical": return "#ef4444"
      case "warning": return "#eab308"
      default: return "#34d399"
    }
  }

  const getAlertStyle = (type: string) => {
    switch (type) {
      case "critical": return "bg-red-500/10 border-red-500/20 text-red-400"
      case "warning": return "bg-yellow-500/10 border-yellow-500/20 text-yellow-400"
      default: return "bg-blue-500/10 border-blue-500/20 text-blue-400"
    }
  }

  const statsCards = [
    {
      title: "Total Waste Today",
      value: totalWaste,
      change: "+12%",
      trend: "up",
      icon: Trash2,
      color: "#34d399"
    },
    {
      title: "Recycling Rate",
      value: "94.2%",
      change: "+2.1%",
      trend: "up",
      icon: TrendingUp,
      color: "#60a5fa"
    },
    {
      title: "Carbon Offset",
      value: "847 kg",
      change: "+8%",
      trend: "up",
      icon: Leaf,
      color: "#fbbf24"
    },
    {
      title: "Active Bins",
      value: activeBins,
      change: "Stable",
      trend: "stable",
      icon: MapPin,
      color: "#a78bfa"
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-20 pb-12">
        {/* Header */}
        <div className="px-4 lg:px-8 py-8">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
              <div>
                <Badge className="mb-2 bg-primary/10 text-primary border-primary/20">
                  Live Dashboard
                </Badge>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                  Waste Intelligence Analytics
                </h1>
                <p className="text-muted-foreground mt-2">
                  Real-time monitoring across connected bins
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                  <SelectTrigger className="w-[180px] bg-card border-border">
                    <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                    <SelectValue placeholder="Location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    <SelectItem value="campus-a">Campus A</SelectItem>
                    <SelectItem value="campus-b">Campus B</SelectItem>
                    <SelectItem value="admin">Admin Zone</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="w-[140px] bg-card border-border">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <SelectValue placeholder="Time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="24h">Last 24h</SelectItem>
                    <SelectItem value="7d">Last 7 days</SelectItem>
                    <SelectItem value="30d">Last 30 days</SelectItem>
                    <SelectItem value="90d">Last 90 days</SelectItem>
                    <SelectItem value="all">All Time</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon" className="border-border bg-transparent" onClick={fetchData}>
                  <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                </Button>
                <Button variant="outline" className="border-border bg-transparent">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {statsCards.map((stat) => (
                <Card key={stat.title} className="bg-card border-border">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div
                        className="p-3 rounded-lg"
                        style={{ backgroundColor: `${stat.color}15` }}
                      >
                        <stat.icon className="h-5 w-5" style={{ color: stat.color }} />
                      </div>
                      <Badge
                        variant="outline"
                        className={`text-xs ${stat.trend === 'up' ? 'text-green-400 border-green-400/30' : 'text-muted-foreground border-border'}`}
                      >
                        {stat.change}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Main Charts Grid */}
            <div className="grid lg:grid-cols-3 gap-6 mb-8">
              {/* Collection Trends */}
              <Card className="lg:col-span-2 bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Collection Trends</CardTitle>
                  <CardDescription>Waste volume by category over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={collectionTrends}>
                        <defs>
                          <linearGradient id="colorMetal" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#a78bfa" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#a78bfa" stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="colorPlastic" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#34d399" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="colorPaper" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#60a5fa" stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="colorMixed" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#94a3b8" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                        <XAxis dataKey="date" stroke="#71717a" fontSize={12} />
                        <YAxis stroke="#71717a" fontSize={12} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#18181b',
                            border: '1px solid #27272a',
                            borderRadius: '8px'
                          }}
                          labelStyle={{ color: '#fafafa' }}
                        />
                        <Area
                          type="monotone"
                          dataKey="metal"
                          stackId="1"
                          stroke="#a78bfa"
                          fillOpacity={1}
                          fill="url(#colorMetal)"
                        />
                        <Area
                          type="monotone"
                          dataKey="plastic"
                          stackId="1"
                          stroke="#34d399"
                          fillOpacity={1}
                          fill="url(#colorPlastic)"
                        />
                        <Area
                          type="monotone"
                          dataKey="paper"
                          stackId="1"
                          stroke="#60a5fa"
                          fillOpacity={1}
                          fill="url(#colorPaper)"
                        />
                        <Area
                          type="monotone"
                          dataKey="mixed_waste"
                          stackId="1"
                          stroke="#94a3b8"
                          fillOpacity={1}
                          fill="url(#colorMixed)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex items-center justify-center gap-6 mt-4 flex-wrap">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-[#a78bfa]" />
                      <span className="text-sm text-muted-foreground">Metal</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-[#34d399]" />
                      <span className="text-sm text-muted-foreground">Plastic</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-[#60a5fa]" />
                      <span className="text-sm text-muted-foreground">Paper</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-[#94a3b8]" />
                      <span className="text-sm text-muted-foreground">Mixed Waste</span>
                    </div>
                  </div>

                </CardContent>
              </Card>

              {/* Waste Composition */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Waste Composition</CardTitle>
                  <CardDescription>Distribution by material type</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={wasteComposition}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={80}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {wasteComposition.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#18181b',
                            border: '1px solid #27272a',
                            borderRadius: '8px'
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-2 mt-4">
                    {wasteComposition.map((item) => (
                      <div key={item.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: item.color }}
                          />
                          <span className="text-sm text-muted-foreground">{item.name}</span>
                        </div>
                        <span className="text-sm font-medium text-foreground">{item.value}%</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Second Row */}
            <div className="grid lg:grid-cols-2 gap-6 mb-8">
              {/* Hourly Activity */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Hourly Activity</CardTitle>
                  <CardDescription>Collection activity throughout the day</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={hourlyActivity}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                        <XAxis dataKey="hour" stroke="#71717a" fontSize={12} />
                        <YAxis stroke="#71717a" fontSize={12} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#18181b',
                            border: '1px solid #27272a',
                            borderRadius: '8px'
                          }}
                        />
                        <Bar dataKey="activity" fill="#34d399" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Live Alerts */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-foreground">Live Alerts</CardTitle>
                      <CardDescription>Real-time system notifications</CardDescription>
                    </div>
                    <Badge className="bg-red-500/10 text-red-400 border-red-500/20">
                      {alerts.filter(a => a.type === 'critical').length} Critical
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {alerts.length > 0 ? (
                      alerts.map((alert) => (
                        <div
                          key={alert.id}
                          className={`p-3 rounded-lg border ${getAlertStyle(alert.type)}`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-start gap-3">
                              <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
                              <p className="text-sm">{alert.message}</p>
                            </div>
                            <span className="text-xs opacity-70 whitespace-nowrap">{alert.time}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center text-muted-foreground py-4">No alerts found</div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Bin Status Table */}
            <Card className="bg-card border-border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-foreground">Bin Status Overview</CardTitle>
                    <CardDescription>Real-time fill levels across all locations</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" className="border-border bg-transparent">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Bin ID</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Location</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Fill Level</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Last Collection</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {binStatusData.map((bin) => (
                        <tr key={bin.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                          <td className="py-3 px-4">
                            <span className="text-sm font-mono text-foreground">{bin.id}</span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-sm text-muted-foreground">{bin.location}</span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-24 h-2 bg-secondary rounded-full overflow-hidden">
                                <div
                                  className="h-full rounded-full transition-all"
                                  style={{
                                    width: `${bin.fillLevel}%`,
                                    backgroundColor: getStatusColor(bin.status)
                                  }}
                                />
                              </div>
                              <span className="text-sm text-foreground">{bin.fillLevel}%</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Clock className="h-4 w-4" />
                              {bin.lastCollection}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <Badge
                              variant="outline"
                              className={`capitalize ${bin.status === 'critical'
                                ? 'text-red-400 border-red-400/30'
                                : bin.status === 'warning'
                                  ? 'text-yellow-400 border-yellow-400/30'
                                  : 'text-green-400 border-green-400/30'
                                }`}
                            >
                              {bin.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {binStatusData.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No bin data available. Check Supabase connection.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
