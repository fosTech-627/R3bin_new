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
  recyclables: number
  organic: number
  general: number
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
  }, [])

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      // 1. Collection Trends
      const { data: trendsData, error: trendsError } = await supabase
        .from('waste_collections')
        .select('*')
        .order('date', { ascending: true })

      if (trendsError) console.error('Error fetching trends:', trendsError)
      else if (trendsData) setCollectionTrends(trendsData)

      // 2. Waste Composition
      // 2. Waste Composition
      // Try fetching from logs first
      const { data: logsData, error: logsError } = await supabase
        .from('3bin_waste_logs')
        .select('waste_type')

      if (!logsError && logsData && logsData.length > 0) {
        // Aggregate counts from individual logs
        const counts: Record<string, number> = {}
        logsData.forEach((log: any) => {
          let type = log.waste_type || 'Unknown'
          // Normalize to lowercase
          type = type.toLowerCase()
          counts[type] = (counts[type] || 0) + 1
        })

        const total = logsData.length
        const mappedComp = Object.entries(counts).map(([material, count]) => {
          // Capitalize for display: "plastic" -> "Plastic"
          const displayName = material.charAt(0).toUpperCase() + material.slice(1)
          return {
            name: displayName,
            value: Math.round((count / total) * 100),
            color: COLORS[material] || COLORS[displayName] || FALLBACK_COLORS[Math.floor(Math.random() * FALLBACK_COLORS.length)]
          }
        })
        setWasteComposition(mappedComp)
      } else {
        // Fallback to manual table if logs table is missing/empty
        const { data: compData, error: compError } = await supabase
          .from('waste_composition')
          .select('*')

        if (compError) console.error('Error fetching composition:', compError)
        else if (compData) {
          const mappedComp = compData.map((item: any, index: number) => ({
            name: item.material,
            value: item.percentage || item.value,
            color: COLORS[item.material] || FALLBACK_COLORS[index % FALLBACK_COLORS.length]
          }))
          setWasteComposition(mappedComp)
        }
      }

      // 3. Hourly Activity
      const { data: hourData, error: hourError } = await supabase
        .from('hourly_activity')
        .select('*')
        .order('hour', { ascending: true })

      if (hourError) console.error('Error fetching hourly activity:', hourError)
      else if (hourData) setHourlyActivity(hourData)

      // 4. Bins
      const { data: binsData, error: binsError } = await supabase
        .from('bins')
        .select('*')

      if (binsError) console.error('Error fetching bins:', binsError)
      else if (binsData) {
        const mappedBins = binsData.map((bin: any) => ({
          id: bin.bin_id || bin.id,
          location: bin.location,
          fillLevel: bin.fill_level,
          lastCollection: bin.last_collection ? formatDistanceToNow(new Date(bin.last_collection), { addSuffix: true }) : 'N/A',
          status: bin.status
        }))
        setBinStatusData(mappedBins)
        setActiveBins(`${binsData.length}/${binsData.length}`) // Simplified active count
      }

      // 5. Alerts
      const { data: alertsData, error: alertsError } = await supabase
        .from('alerts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10)

      if (alertsError) console.error('Error fetching alerts:', alertsError)
      else if (alertsData) {
        const mappedAlerts = alertsData.map((alert: any) => ({
          id: alert.id,
          type: alert.type,
          message: alert.message,
          time: alert.created_at ? formatDistanceToNow(new Date(alert.created_at), { addSuffix: true }) : 'Just now'
        }))
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
      value: "2,847 kg",  // Hardcoded for now as calculating daily sum needs more data logic
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
                          <linearGradient id="colorRecyclables" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#34d399" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="colorOrganic" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#fbbf24" stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="colorGeneral" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#60a5fa" stopOpacity={0} />
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
                          dataKey="recyclables"
                          stroke="#34d399"
                          fillOpacity={1}
                          fill="url(#colorRecyclables)"
                        />
                        <Area
                          type="monotone"
                          dataKey="organic"
                          stroke="#fbbf24"
                          fillOpacity={1}
                          fill="url(#colorOrganic)"
                        />
                        <Area
                          type="monotone"
                          dataKey="general"
                          stroke="#60a5fa"
                          fillOpacity={1}
                          fill="url(#colorGeneral)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex items-center justify-center gap-6 mt-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-[#34d399]" />
                      <span className="text-sm text-muted-foreground">Recyclables</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-[#fbbf24]" />
                      <span className="text-sm text-muted-foreground">Organic</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-[#60a5fa]" />
                      <span className="text-sm text-muted-foreground">General</span>
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
