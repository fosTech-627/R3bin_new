"use client"

import { useState, useEffect, useRef } from "react"
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
  ChevronDown,
  Bell
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
  ScatterChart,
  Scatter,
  ZAxis
} from "recharts"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { AnimatedNumber } from "@/components/ui/animated-number"
import { supabase } from "@/lib/supabase"
import { formatDistanceToNow, format } from "date-fns"
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { DateRange } from "react-day-picker"
import { cn } from "@/lib/utils"

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
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const lastNotificationTime = useRef<number>(0)
  const [selectedLocation, setSelectedLocation] = useState("all")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Data states
  const [collectionTrends, setCollectionTrends] = useState<CollectionTrend[]>([])
  const [wasteComposition, setWasteComposition] = useState<UIWasteComposition[]>([])
  const [hourlyActivity, setHourlyActivity] = useState<HourlyActivity[]>([])
  // Trigger Vercel Deployment
  const [scatterData, setScatterData] = useState<any[]>([])
  const [binStatusData, setBinStatusData] = useState<UIBinStatus[]>([])
  const [alerts, setAlerts] = useState<UIAlert[]>([])
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [settingsPhone, setSettingsPhone] = useState("")
  const [settingsEmail, setSettingsEmail] = useState("")
  const [isConfigured, setIsConfigured] = useState(true) // Assume configured until checked

  useEffect(() => {
    // Load user prefs
    if (typeof window !== 'undefined') {
      const phone = localStorage.getItem('user_phone') || ""
      const email = localStorage.getItem('user_email') || ""

      setSettingsPhone(phone)
      setSettingsEmail(email)

      // Check if configured
      if (!phone || !email) {
        setIsConfigured(false)
        // Auto-open with a slight delay for better UX
        setTimeout(() => setIsSettingsOpen(true), 1000)
      }
    }
  }, [])

  const saveSettings = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('user_phone', settingsPhone)
      localStorage.setItem('user_email', settingsEmail)
    }
    setIsSettingsOpen(false)
    setIsConfigured(true)
    // Optional: Show toast or confirmation
  }

  useEffect(() => {
    console.log('DEBUG: scatterData', scatterData)
    console.log('DEBUG: hourlyActivity', hourlyActivity)
  }, [scatterData, hourlyActivity])



  // Stats
  const [totalWaste, setTotalWaste] = useState("0 kg")
  const [totalWasteNum, setTotalWasteNum] = useState(0) // For animation
  const [activeBins, setActiveBins] = useState("0/0")
  const [carbonOffset, setCarbonOffset] = useState("0 kg") // Keep string for fallback/export
  const [carbonOffsetNum, setCarbonOffsetNum] = useState(0) // For animation
  const [carbonBreakdown, setCarbonBreakdown] = useState({
    plastic: "0", plasticCount: 0,
    metal: "0", metalCount: 0,
    paper: "0", paperCount: 0
  })

  const handleExport = async () => {
    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.width
    const pageHeight = doc.internal.pageSize.height
    const primaryColor = "#1b7f4b"

    // --- Content Header ---
    doc.setFont("helvetica", "bold")
    doc.setTextColor(primaryColor)
    doc.setFontSize(22)

    // Logo / Brand
    doc.text("Fostride", 14, 25)

    // Title
    doc.setFontSize(20)
    doc.text("R3Bin Waste Analysis Report", pageWidth - 14, 25, { align: "right" })

    // Tagline
    doc.setFontSize(10)
    doc.setTextColor(100)
    doc.text("Smart Segregation • Data-Driven Sustainability", pageWidth - 14, 32, { align: "right" })

    // Separator Line
    doc.setDrawColor(primaryColor)
    doc.setLineWidth(1)
    doc.line(14, 38, pageWidth - 14, 38)

    // --- Installation Details ---
    let yPos = 55

    // Section Header Style Helper
    const drawSectionHeader = (title: string, y: number) => {
      doc.setFontSize(14)
      doc.setTextColor(primaryColor)
      doc.text(title, 20, y)
      doc.setDrawColor(224, 224, 224)
      doc.setLineWidth(1)
      doc.line(20, y + 2, pageWidth - 20, y + 2)
      return y + 15
    }

    yPos = drawSectionHeader("Installation Details", yPos)

    // 2x2 Grid using "Info Cards" style
    const cardWidth = (pageWidth - 44) / 2
    const cardHeight = 12
    const cardGap = 4

    doc.setFontSize(10)

    const drawInfoCard = (label: string, value: string, x: number, y: number) => {
      // Card bg
      doc.setFillColor(250, 250, 250) // #fafafa
      doc.setDrawColor(221, 221, 221) // #ddd
      doc.setLineWidth(0.1)
      doc.roundedRect(x, y, cardWidth, cardHeight, 1, 1, "FD")

      // Text
      doc.setTextColor(50)
      doc.setFont("helvetica", "bold")
      doc.text(label, x + 3, y + 8)

      doc.setFont("helvetica", "normal")
      doc.setTextColor(0)
      const labelWidth = doc.getTextWidth(label)
      doc.text(value, x + 3 + labelWidth + 2, y + 8)
    }

    drawInfoCard("Company:", "Somaiya Vidyavihar University", 20, yPos)
    drawInfoCard("Location:", selectedLocation === 'all' ? 'Engineering Building' : selectedLocation, 20 + cardWidth + cardGap, yPos)

    yPos += cardHeight + cardGap

    drawInfoCard("Bin ID:", "R3BIN-SVU-001", 20, yPos)
    drawInfoCard("Waste Types:", "Plastic, Metal, Paper, Mixed", 20 + cardWidth + cardGap, yPos)

    yPos += 25

    // --- Collection Summary ---
    yPos = drawSectionHeader("Collection Summary", yPos)

    // Green Highlight Box style
    const summaryBoxHeight = 25
    doc.setFillColor(232, 245, 233) // #e8f5e9
    doc.rect(20, yPos, pageWidth - 40, summaryBoxHeight, "F")

    doc.setFillColor(primaryColor)
    doc.rect(20, yPos, 2, summaryBoxHeight, "F") // Left border

    // Calculate Content
    const periodTotal = collectionTrends.reduce((acc, row) =>
      acc + row.plastic + row.metal + row.paper + row.mixed_waste, 0)

    // Calculate Most Collected
    let sums = { Metal: 0, Plastic: 0, Paper: 0, Mixed: 0 }
    collectionTrends.forEach(d => {
      sums.Metal += d.metal
      sums.Plastic += d.plastic
      sums.Paper += d.paper
      sums.Mixed += d.mixed_waste
    })
    const mostCollected = Object.entries(sums).reduce((a, b) => a[1] > b[1] ? a : b)[0]

    doc.setFont("helvetica", "normal")
    doc.setTextColor(0)
    doc.setFontSize(10)

    doc.setFont("helvetica", "bold")
    doc.text("Most Collected Waste:", 26, yPos + 8)
    doc.setFont("helvetica", "normal")
    doc.text(mostCollected, 70, yPos + 8)

    doc.setFont("helvetica", "bold")
    doc.text("Reporting Period:", 26, yPos + 18)
    doc.setFont("helvetica", "normal")
    doc.text(timeRange === 'all' ? 'All Time' : `Last ${timeRange}`, 70, yPos + 18)

    doc.text(`(Total Items: ${periodTotal})`, 120, yPos + 18)

    yPos += 60

    // --- Environmental Impact ---
    doc.setFontSize(14)
    doc.setTextColor(primaryColor)
    doc.setLineWidth(3)
    doc.line(14, yPos - 5, 14, yPos + 5)
    doc.text("Environmental Impact", 20, yPos)

    yPos += 15

    const impactBoxHeight = 50
    const colWidth = (pageWidth - 28) / 3

    // 3 Columns for Breakdown
    doc.setFillColor(255, 255, 255) // White bg for clarity
    doc.setDrawColor(200)
    doc.setLineWidth(0.1)

    // Box 1: Plastic
    doc.roundedRect(14, yPos, colWidth - 5, impactBoxHeight, 2, 2, "S")
    doc.setFontSize(9)
    doc.setTextColor(100)
    doc.text("Plastic Saved", 20, yPos + 15)
    doc.setFontSize(12)
    doc.setTextColor(COLORS["Plastic"])
    doc.text(`${carbonBreakdown.plastic} kg CO2`, 20, yPos + 30)

    // Box 2: Metal
    doc.roundedRect(14 + colWidth, yPos, colWidth - 5, impactBoxHeight, 2, 2, "S")
    doc.setFontSize(9)
    doc.setTextColor(100)
    doc.text("Metal Saved", 20 + colWidth, yPos + 15)
    doc.setFontSize(12)
    doc.setTextColor(COLORS["Metal"])
    doc.text(`${carbonBreakdown.metal} kg CO2`, 20 + colWidth, yPos + 30)

    // Box 3: Paper
    doc.roundedRect(14 + (colWidth * 2), yPos, colWidth - 5, impactBoxHeight, 2, 2, "S")
    doc.setFontSize(9)
    doc.setTextColor(100)
    doc.text("Paper Saved", 20 + (colWidth * 2), yPos + 15)
    doc.setFontSize(12)
    doc.setTextColor(COLORS["Paper"])
    doc.text(`${carbonBreakdown.paper} kg CO2`, 20 + (colWidth * 2), yPos + 30)

    // Total Impact Highlight
    doc.setFontSize(11)
    doc.setTextColor(primaryColor)
    doc.text(`Total Carbon Offset: ${carbonOffset}`, pageWidth - 14, yPos - 5, { align: "right" })

    yPos += 70

    // --- Table ---
    doc.setFontSize(14)
    doc.setTextColor(primaryColor)
    doc.setLineWidth(3)
    doc.line(14, yPos - 5, 14, yPos + 5)
    doc.text("Daily Waste Analysis (in items)", 20, yPos)

    // Table Config
    const tableHeaders = [['Date', 'Plastic', 'Metal', 'Paper', 'Mixed', 'Total']]
    const tableBody = collectionTrends.map(row => [
      row.date,
      row.plastic,
      row.metal,
      row.paper,
      row.mixed_waste,
      (row.plastic + row.metal + row.paper + row.mixed_waste)
    ])

    autoTable(doc, {
      startY: yPos + 15,
      head: tableHeaders,
      body: tableBody,
      theme: 'grid',
      styles: {
        fontSize: 10,
        cellPadding: 5,
        lineColor: [221, 221, 221],
        lineWidth: 0.1,
      },
      headStyles: {
        fillColor: primaryColor,
        textColor: 255,
        fontStyle: 'bold',
        halign: 'center'
      },
      bodyStyles: {
        textColor: 50,
        halign: 'center'
      },
      alternateRowStyles: {
        fillColor: [246, 246, 246]
      }
    })

    // --- Footer ---
    const finalY = (doc as any).lastAutoTable.finalY + 30
    doc.setDrawColor(200)
    doc.setLineWidth(0.5)
    doc.line(14, finalY, pageWidth - 14, finalY)

    doc.setFontSize(9)
    doc.setTextColor(100)
    doc.text("Generated by Fostride R3Bin • AI-Powered Waste Segregation System", pageWidth / 2, finalY + 15, { align: "center" })
    doc.text(`© ${new Date().getFullYear()} Fostride | Sustainability Through Innovation`, pageWidth / 2, finalY + 28, { align: "center" })

    doc.save(`waste-report-${new Date().toISOString().split('T')[0]}.pdf`)
  }

  useEffect(() => {
    fetchData()
  }, [timeRange, dateRange])

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
              let dateObj: Date | null = null

              if (log.updated_at.includes('T')) {
                // Standard ISO format
                const d = new Date(log.updated_at)
                if (!isNaN(d.getTime())) {
                  dateObj = d
                }
              } else {
                // Custom format: 26-01-17_16-15-29 (YY-MM-DD_HH-mm-ss)
                const parts = log.updated_at.split(/[_ ]/)
                const dateParts = parts[0] ? parts[0].split('-') : []
                const timeParts = parts[1] ? parts[1].split('-') : []

                if (dateParts.length >= 3) {
                  let year = parseInt(dateParts[0])
                  let month = parseInt(dateParts[1])
                  let day = parseInt(dateParts[2])

                  // Time parts
                  let hour = 0, min = 0, sec = 0
                  if (timeParts.length >= 3) {
                    hour = parseInt(timeParts[0])
                    min = parseInt(timeParts[1])
                    sec = parseInt(timeParts[2])
                  }

                  // Adjust 2-digit year to 4-digit (Assuming 20xx)
                  if (year < 100) year += 2000

                  // Create Date object (Month is 0-indexed)
                  dateObj = new Date(year, month - 1, day, hour, min, sec)
                }
              }

              if (dateObj) {
                if (timeRange === '24h') {
                  const y = dateObj.getFullYear()
                  const m = String(dateObj.getMonth() + 1).padStart(2, '0')
                  const d = String(dateObj.getDate()).padStart(2, '0')
                  const h = String(dateObj.getHours()).padStart(2, '0')
                  dateKey = `${y}-${m}-${d} ${h}:00`
                } else {
                  // For larger ranges, group by Day (YYYY-MM-DD)
                  // Use local date to keep compatible with the dateObj
                  const y = dateObj.getFullYear()
                  const m = String(dateObj.getMonth() + 1).padStart(2, '0')
                  const d = String(dateObj.getDate()).padStart(2, '0')
                  dateKey = `${y}-${m}-${d}`
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
          if (timeRange === '24h') {
            prevDate.setHours(singleDate.getHours() - 1)
            const y = prevDate.getFullYear()
            const m = String(prevDate.getMonth() + 1).padStart(2, '0')
            const d = String(prevDate.getDate()).padStart(2, '0')
            const h = String(prevDate.getHours()).padStart(2, '0')
            const prevDateStr = `${y}-${m}-${d} ${h}:00`
            trendsData = [
              { date: prevDateStr, metal: 0, plastic: 0, paper: 0, mixed_waste: 0 },
              ...trendsData
            ]
          } else {
            prevDate.setDate(singleDate.getDate() - 1)
            const prevDateStr = prevDate.toISOString().split('T')[0]
            trendsData = [
              { date: prevDateStr, metal: 0, plastic: 0, paper: 0, mixed_waste: 0 },
              ...trendsData
            ]
          }
        }


        // Filter trends based on selected ID (timeRange)
        const now = new Date()
        let cutoffDate: Date | null = new Date()

        switch (timeRange) {
          case '24h': cutoffDate.setDate(now.getDate() - 1); break;
          case '7d': cutoffDate.setDate(now.getDate() - 7); break;
          case '30d': cutoffDate.setDate(now.getDate() - 30); break;
          case '90d': cutoffDate.setDate(now.getDate() - 90); break;
          case 'custom': cutoffDate = null; break; // Handled separately
          case 'all': cutoffDate = null; break; // No cutoff
          default: cutoffDate.setDate(now.getDate() - 7);
        }

        const filteredTrends = trendsData.filter(d => {
          if (timeRange === 'custom' && dateRange?.from) {
            const dDate = new Date(d.date)
            // Set times to midnight for comparison to avoid issues if needed, 
            // but trendsData dates might be "YYYY-MM-DD" or "YYYY-MM-DD HH:mm"
            // If d.date is "YYYY-MM-DD", new Date() is UTC midnight or local?
            // trendsData date keys are either YYYY-MM-DD (ISO) or YYYY-MM-DD HH:00 (24h)
            // To be safe, compare timestamps or date parts.

            // Simple comparison
            const from = dateRange.from
            const to = dateRange.to || dateRange.from
            return dDate >= from && dDate <= new Date(to.getTime() + 86400000) // End of 'to' day inclusive
          }
          if (cutoffDate) {
            return new Date(d.date) >= cutoffDate
          }
          return true
        })

        setCollectionTrends(filteredTrends)

        // B. Total Waste (Selected Period)
        // Sum up the filtered trends to get the total for the selected time range
        const periodTotal = filteredTrends.reduce((acc, d) =>
          acc + d.metal + d.plastic + d.paper + d.mixed_waste, 0)

        setTotalWaste(`${periodTotal} items`)
        setTotalWasteNum(periodTotal)

        // C. Waste Composition (Aggregate all time)
        let totalMetal = 0
        let totalPlastic = 0
        let totalPaper = 0
        let totalMixed = 0

        // Use filteredTrends to calculate Carbon Offset for the selected period
        // OR use all-time if that's what the card implies. Usually cards reflect the filter.
        // Let's use filteredTrends for consistency with the charts.

        filteredTrends.forEach((d) => {
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

        // D. Carbon Offset Calculation
        // Factors: 
        // Plastic: 2.5 kg CO2e/kg * 0.02kg/item = 0.05
        // Metal (Alu): 10 kg CO2e/kg * 0.015kg/item = 0.15
        // Paper: 1.0 kg CO2e/kg * 0.01kg/item = 0.01

        const CO2_PLASTIC = 0.05
        const CO2_METAL = 0.15
        const CO2_PAPER = 0.01

        const offsetValue = (totalPlastic * CO2_PLASTIC) + (totalMetal * CO2_METAL) + (totalPaper * CO2_PAPER)
        // Format to 1 decimal place if small, or integer if large
        const formattedOffset = offsetValue < 10 ? offsetValue.toFixed(2) : Math.round(offsetValue).toString()

        setCarbonOffset(`${formattedOffset} kg`)
        setCarbonOffsetNum(offsetValue)

        setCarbonBreakdown({
          plastic: (totalPlastic * CO2_PLASTIC).toFixed(2),
          plasticCount: totalPlastic,
          metal: (totalMetal * CO2_METAL).toFixed(2),
          metalCount: totalMetal,
          paper: (totalPaper * CO2_PAPER).toFixed(2),
          paperCount: totalPaper
        })

        // Update stats card (finding the card object isn't state-based, we need a state for it)
        // Wait, statsCards is defined in render. I should create a state for it or just offset state.
        // I see 'const [totalWaste, setTotalWaste]' but not offset.
        // I will add a setCarbonOffset state relative to the existing code structure.

        // Actually, looking at the code, statsCards is static in render except for 'value'.
        // I submitted a separate state replacement earlier? No, I need to add state for Carbon Offset.

      }

      // 2. Hourly Activity (Calculated from FILTERED logs)
      // 2. Hourly Activity (Calculated from FILTERED logs)
      if (rawLogs) {
        const now = new Date()
        let cutoffDate: Date | null = new Date()
        switch (timeRange) {
          case '24h': cutoffDate.setDate(now.getDate() - 1); break;
          case '7d': cutoffDate.setDate(now.getDate() - 7); break;
          case '30d': cutoffDate.setDate(now.getDate() - 30); break;
          case '90d': cutoffDate.setDate(now.getDate() - 90); break;
          case 'all': cutoffDate = null; break;
          default: cutoffDate.setDate(now.getDate() - 7);
        }

        // Helper to parse dates robustly (matches trends logic)
        const getLogDate = (dateStr: string): Date | null => {
          if (!dateStr) return null;
          try {
            if (dateStr.includes('T')) {
              const d = new Date(dateStr)
              return isNaN(d.getTime()) ? null : d
            } else {
              // Custom: YY-MM-DD_HH-mm-ss
              const parts = dateStr.split(/[_ ]/)
              const dateParts = parts[0].split('-')
              const timeParts = parts[1] ? parts[1].split('-') : [0, 0, 0]

              if (dateParts.length >= 3) {
                let y = parseInt(dateParts[0]); if (y < 100) y += 2000;
                let m = parseInt(dateParts[1]) - 1;
                let d = parseInt(dateParts[2]);
                let h = parseInt(timeParts[0] as string || '0');
                let min = parseInt(timeParts[1] as string || '0');
                let s = parseInt(timeParts[2] as string || '0');

                return new Date(y, m, d, h, min, s)
              }
            }
          } catch (e) { return null }
          return null
        }

        // 2D Scatter Data Processing
        const scatterPoints: any[] = []
        const dateMap = new Map<string, number>() // Date string -> Y index

        // Helper to get consistent date keys
        const getDateKey = (d: Date) => d.toISOString().split('T')[0]

        // Initialize Y-axis indices based on time range (0 = Today/Newest)
        // We'll build this dynamically from the logs or pre-fill based on range? 
        // Dynamic is safer for "scattered" look.

        const groupedData = new Map<string, number>() // "DateKey|Hour.Minute" -> Count
        const today = new Date()

        // Helper for formatting "24th Jan 2026"
        const formatDatePretty = (dateObj: Date) => {
          const day = dateObj.getDate()
          const month = dateObj.toLocaleString('default', { month: 'short' })
          const year = dateObj.getFullYear()
          const suffix = (day === 1 || day === 21 || day === 31) ? 'st' :
            (day === 2 || day === 22) ? 'nd' :
              (day === 3 || day === 23) ? 'rd' : 'th'
          return `${day}${suffix} ${month} ${year}`
        }

        rawLogs.forEach((log: any) => {
          const dateObj = getLogDate(log.updated_at)
          if (!dateObj) return
          // Filter Future Dates
          if (dateObj > today) return
          if (cutoffDate && dateObj < cutoffDate) return

          const dKey = getDateKey(dateObj)
          // Store raw date obj via lookup if needed, or re-parse later

          // Round to nearest 30 mins
          const h = dateObj.getHours()
          const m = dateObj.getMinutes() < 30 ? 0 : 30
          const timeVal = h + (m / 60)

          const key = `${dKey}|${timeVal}`
          groupedData.set(key, (groupedData.get(key) || 0) + 1)
        })

        // Convert grouped data to scatter points
        // Sort dates to assign Y index
        // 1. Get all unique dates
        let allUniqueDates = Array.from(new Set(Array.from(groupedData.keys()).map(k => k.split('|')[0])))
        // 2. Sort Descending (Newest first)
        allUniqueDates.sort().reverse()
        // 3. Take only top 7
        const uniqueDates = allUniqueDates.slice(0, 7)

        groupedData.forEach((count, key) => {
          const [dStr, timeDesc] = key.split('|')
          const timeVal = parseFloat(timeDesc)
          const yIndex = uniqueDates.indexOf(dStr) // 0 is newest

          // Only add points matching the top 7 dates
          if (yIndex !== -1) {
            const prettyDate = formatDatePretty(new Date(dStr))

            scatterPoints.push({
              x: timeVal,
              y: yIndex,
              z: count, // Intensity
              date: prettyDate, // Use pretty date for display
              hourStr: `${Math.floor(timeVal).toString().padStart(2, '0')}:${(timeVal % 1 * 60).toString().padStart(2, '0')}`
            })
          }
        })

        setScatterData(scatterPoints)

        // Legacy Hourly Activity (Still useful to populate for backup or other views)
        const hourCounts = new Array(24).fill(0)
        rawLogs.forEach((log: any) => {
          const dateObj = getLogDate(log.updated_at)
          if (!dateObj) return
          if (cutoffDate && dateObj < cutoffDate) return
          const h = dateObj.getHours()
          if (h >= 0 && h < 24) hourCounts[h]++
        })
        const computedHourly = hourCounts.map((count, i) => ({
          hour: `${i.toString().padStart(2, '0')}:00`,
          activity: count,
          raw: count
        }))
        setHourlyActivity(computedHourly)
      }


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

      // 5. Alerts (from r3bin_records - Fill Levels)
      const { data: binRecord, error: recordError } = await supabase
        .rpc('get_latest_bin_status_v3')

      if (recordError) {
        console.error('Error fetching r3bin_records:', JSON.stringify(recordError, null, 2))
        setAlerts([]) // Reset on error
      } else if (binRecord) {
        const generatedAlerts: UIAlert[] = []
        let idCounter = 1

        // Check each bin's fill status (True = Full)
        const b1 = binRecord.bin1_plastics
        const b2 = binRecord.bin2_paper
        const b3 = binRecord.bin3_metal
        const b4 = binRecord.bin4_mixed
        const binId = binRecord.bin_id || 'Unknown'

        if (b1) generatedAlerts.push({ id: idCounter++, type: 'critical', message: `Plastic Bin Full (${binId})`, time: 'Just now' })
        if (b2) generatedAlerts.push({ id: idCounter++, type: 'critical', message: `Paper Bin Full (${binId})`, time: 'Just now' })
        if (b3) generatedAlerts.push({ id: idCounter++, type: 'critical', message: `Metal Bin Full (${binId})`, time: 'Just now' })
        if (b4) generatedAlerts.push({ id: idCounter++, type: 'critical', message: `Mixed Waste Bin Full (${binId})`, time: 'Just now' })

        // Check for notifications
        const fullBins: string[] = []
        if (b1) fullBins.push('Plastic')
        if (b2) fullBins.push('Paper')
        if (b3) fullBins.push('Metal')
        if (b4) fullBins.push('Mixed Waste')

        if (fullBins.length > 0) {
          const COOLDOWN = 30 * 60 * 1000 // 30 minutes

          // Check localStorage for the last alert time to persist cooldown across reloads
          const lastAlertStr = typeof window !== 'undefined' ? localStorage.getItem('last_bin_alert_timestamp') : null
          const lastAlertTime = lastAlertStr ? parseInt(lastAlertStr) : 0

          // Check in-memory ref as fallback or optimization
          const lastTime = Math.max(lastAlertTime, lastNotificationTime.current)

          if (Date.now() - lastTime > COOLDOWN) {
            console.log('Sending alert notification...')
            // Fire and forget - Use user prefs if available
            const userPhone = typeof window !== 'undefined' ? localStorage.getItem('user_phone') : null
            const userEmail = typeof window !== 'undefined' ? localStorage.getItem('user_email') : null

            fetch('/api/send-alert', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                binId: binId,
                wasteType: fullBins.join(', '),
                location: 'Main Campus',
                userPhone, // Pass these to API
                userEmail
              })
            }).then(() => console.log('Alert sent successfully'))
              .catch(err => console.error('Failed to send alert', err))

            const now = Date.now()
            lastNotificationTime.current = now
            if (typeof window !== 'undefined') {
              localStorage.setItem('last_bin_alert_timestamp', now.toString())
            }

          }
        }

        setAlerts(generatedAlerts)
      } else {
        setAlerts([])
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

  const getTimeLabel = (range: string) => {
    switch (range) {
      case '24h': return 'Last 24h';
      case '7d': return 'Last 7 Days';
      case '30d': return 'Last 30 Days';
      case '90d': return 'Last 90 Days';
      case 'all': return 'All Time';
      default: return 'Selected Period';
    }
  }

  const statsCards = [
    {
      title: `Total Waste`,
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
      value: carbonOffset,
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
                    <SelectItem value="custom">Custom Date</SelectItem>
                  </SelectContent>
                </Select>

                {timeRange === 'custom' && (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="date"
                        variant={"outline"}
                        className={cn(
                          "w-[240px] justify-start text-left font-normal border-border bg-card",
                          !dateRange && "text-muted-foreground"
                        )}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {dateRange?.from ? (
                          dateRange.to ? (
                            <>
                              {format(dateRange.from, "LLL dd, y")} -{" "}
                              {format(dateRange.to, "LLL dd, y")}
                            </>
                          ) : (
                            format(dateRange.from, "LLL dd, y")
                          )
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="end">
                      <CalendarComponent
                        initialFocus
                        mode="range"
                        defaultMonth={dateRange?.from}
                        selected={dateRange}
                        onSelect={setDateRange}
                        numberOfMonths={2}
                      />
                    </PopoverContent>
                  </Popover>
                )}
                <Button variant="outline" size="icon" className="border-border bg-transparent" onClick={fetchData}>
                  <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                </Button>
                <Button variant="outline" className="border-border bg-transparent" onClick={handleExport}>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>

                <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="icon" className={`border-border bg-transparent ml-2 relative ${!isConfigured ? 'animate-pulse border-red-400 text-red-400' : ''}`}>
                      <Bell className="h-4 w-4" />
                      {!isConfigured && (
                        <span className="absolute top-0 right-0 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-background transform translate-x-1/4 -translate-y-1/4"></span>
                      )}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Alert Settings</DialogTitle>
                      <DialogDescription>
                        Configure where you want to receive critical alerts for bin status.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="phone" className="text-right">
                          Phone
                        </Label>
                        <Input
                          id="phone"
                          value={settingsPhone}
                          onChange={(e) => setSettingsPhone(e.target.value)}
                          placeholder="+91..."
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right">
                          Email
                        </Label>
                        <Input
                          id="email"
                          value={settingsEmail}
                          onChange={(e) => setSettingsEmail(e.target.value)}
                          placeholder="alerts@example.com"
                          className="col-span-3"
                        />
                      </div>
                    </div>
                    <DialogFooter className="flex justify-between sm:justify-between">
                      <Button type="button" variant="secondary" onClick={() => {
                        const loadingToast = console.log("Sending test alert...") // You could add toast if available
                        fetch('/api/send-alert', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            binId: 'TEST-BIN',
                            wasteType: 'Test',
                            location: 'Test Location',
                            userPhone: settingsPhone,
                            userEmail: settingsEmail
                          })
                        }).then(async (res) => {
                          const data = await res.json()
                          if (data.success) {
                            const emailStatus = data.results?.email || 'unknown'
                            if (emailStatus === 'sent') alert("✅ Email Sent Successfully!")
                            else if (emailStatus.startsWith('failed_send')) alert(`❌ Email Failed! \n${emailStatus.split(': ')[1] || 'Check logs'}`)
                            else if (emailStatus === 'skipped_no_email') alert("⚠️ No Email Provided! Please enter an email in the settings.")
                            else if (emailStatus.startsWith('skipped_config_missing')) alert(`⚠️ Credentials missing: ${emailStatus.split(':')[1] || 'Unknown'}`)
                            else alert(`Result: Email ${emailStatus}`)
                          } else {
                            alert("Failed: " + (data.error || "Unknown error"))
                          }
                        }).catch(err => alert("Error: " + err.message))
                      }}>
                        Send Test Alert
                      </Button>
                      <Button onClick={saveSettings}>Save changes</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {statsCards.map((stat) => {
                const isCarbon = stat.title === "Carbon Offset"
                const isWaste = stat.title === "Total Waste"

                // Determine value to display (Animated or Static)
                let DisplayValue = <>{stat.value}</>

                if (isCarbon) {
                  DisplayValue = <AnimatedNumber value={carbonOffsetNum} suffix=" kg" />
                } else if (isWaste) {
                  DisplayValue = <AnimatedNumber value={totalWasteNum} suffix=" items" decimalPlaces={0} />
                }

                const CardComponent = (
                  <Card key={stat.title} className="bg-card border-border h-full">
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
                      <p className="text-2xl font-bold text-foreground">{DisplayValue}</p>
                    </CardContent>
                  </Card>
                )

                if (isCarbon) {
                  return (
                    <TooltipProvider key={stat.title}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="cursor-help transition-transform hover:scale-[1.02]">{CardComponent}</div>
                        </TooltipTrigger>
                        <TooltipContent className="bg-zinc-950 border-zinc-800 text-zinc-100 p-4 shadow-xl max-w-sm">
                          <p className="font-semibold mb-3 text-green-400 border-b border-zinc-800 pb-2">Carbon Offset Maths</p>
                          <div className="space-y-2 text-xs font-mono">
                            <div className="flex justify-between gap-4">
                              <span className="text-zinc-400">Plastic ({carbonBreakdown.plasticCount} × 0.05)</span>
                              <span>= {carbonBreakdown.plastic} kg</span>
                            </div>
                            <div className="flex justify-between gap-4">
                              <span className="text-zinc-400">Metal ({carbonBreakdown.metalCount} × 0.15)</span>
                              <span>= {carbonBreakdown.metal} kg</span>
                            </div>
                            <div className="flex justify-between gap-4">
                              <span className="text-zinc-400">Paper ({carbonBreakdown.paperCount} × 0.01)</span>
                              <span>= {carbonBreakdown.paper} kg</span>
                            </div>
                            <div className="border-t border-zinc-800 pt-2 flex justify-between gap-4 font-bold text-white mt-1">
                              <span>Total Saved</span>
                              <span>{carbonOffsetNum.toFixed(2)} kg</span>
                            </div>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )
                }

                return CardComponent
              })}
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
                        <XAxis
                          dataKey="date"
                          stroke="#71717a"
                          fontSize={12}
                          tickFormatter={(val) => {
                            // If formatted as date+time (contains :), show time only
                            if (val && val.includes(':') && val.includes(' ')) {
                              return val.split(' ')[1]
                            }
                            return val
                          }}
                        />
                        <YAxis stroke="#71717a" fontSize={12} />
                        <RechartsTooltip
                          content={({ active, payload, label }) => {
                            if (active && payload && payload.length) {
                              // Sort payload by value descending
                              const sortedPayload = [...payload].sort((a, b) => (b.value as number) - (a.value as number))

                              return (
                                <div className="bg-zinc-950 border border-zinc-800 p-3 rounded-lg shadow-xl">
                                  <p className="text-zinc-100 font-semibold mb-2">{label}</p>
                                  <div className="space-y-1">
                                    {sortedPayload.map((entry: any, index: number) => {
                                      // Capitalize name
                                      let name = entry.name
                                      if (name === 'mixed_waste') name = 'Mixed Waste'
                                      else name = name.charAt(0).toUpperCase() + name.slice(1)

                                      return (
                                        <div key={index} className="flex items-center gap-2 text-xs">
                                          <div
                                            className="w-2 h-2 rounded-full"
                                            style={{ backgroundColor: entry.color }}
                                          />
                                          <span className="text-zinc-400 capitalize">{name}:</span>
                                          <span className="text-zinc-100 font-mono font-medium">
                                            {entry.value}
                                          </span>
                                        </div>
                                      )
                                    })}
                                  </div>
                                </div>
                              )
                            }
                            return null
                          }}
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
                        <RechartsTooltip
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
                  <div className="h-[250px] w-full mt-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <ScatterChart
                        margin={{ top: 20, right: 20, bottom: 20, left: 10 }}
                      >

                        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" horizontal={true} vertical={false} />
                        <XAxis
                          type="number"
                          dataKey="x"
                          name="Time"
                          domain={[0, 24]}
                          tickCount={7}
                          stroke="#71717a"
                          fontSize={12}
                          tickFormatter={(val) => `${val}:00`}
                        />
                        <YAxis
                          type="number"
                          dataKey="y"
                          name="Date"
                          domain={['dataMin', 'dataMax']}
                          stroke="#71717a"
                          fontSize={11}
                          ticks={Array.from(new Set(scatterData.map((d: any) => d.y)))}
                          reversed={true}
                          interval={0}
                          tickFormatter={(val) => {
                            const point = scatterData.find((d: any) => d.y === val)
                            return point ? point.date : ''
                          }}
                          width={80}
                        />
                        <ZAxis type="number" dataKey="z" range={[0, 100]} name="Count" />
                        <RechartsTooltip
                          cursor={{ strokeDasharray: '3 3' }}
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              const data = payload[0].payload
                              return (
                                <div className="bg-zinc-950 border border-zinc-800 p-3 rounded-lg shadow-xl">
                                  <p className="text-zinc-100 font-semibold mb-1">{data.date}</p>
                                  <div className="flex flex-col gap-1 text-xs">
                                    <div className="flex justify-between gap-4">
                                      <span className="text-zinc-400">Time:</span>
                                      <span className="text-white font-mono">{data.hourStr}</span>
                                    </div>
                                    <div className="flex justify-between gap-4">
                                      <span className="text-zinc-400">Waste:</span>
                                      <span className="text-emerald-400 font-bold">{data.z} items</span>
                                    </div>
                                  </div>
                                </div>
                              )
                            }
                            return null
                          }}
                        />
                        <Scatter
                          name="Activity"
                          data={scatterData}
                          shape={(props: any) => {
                            const { cx, cy, payload } = props
                            const maxZ = Math.max(...scatterData.map((s: any) => s.z)) || 1
                            const intensity = payload.z / maxZ

                            // Color Logic
                            let hue = 210
                            if (intensity > 0) hue = 210 - (intensity * 210)
                            const color = `hsl(${Math.max(0, hue)}, 85%, 60%)`

                            // Render Hexagon
                            const r = 8 // Radius
                            // Points for Flat-topped Hexagon
                            // x = r * cos(angle), y = r * sin(angle)
                            // angles: 0, 60, 120, 180, 240, 300
                            const points = [
                              [r, 0],
                              [r / 2, r * 0.866],
                              [-r / 2, r * 0.866],
                              [-r, 0],
                              [-r / 2, -r * 0.866],
                              [r / 2, -r * 0.866]
                            ].map(([dx, dy]) => `${cx + dx},${cy + dy}`).join(' ')

                            return (
                              <polygon
                                points={points}
                                fill={color}
                                opacity={0.85}
                              />
                            )
                          }}
                        />
                      </ScatterChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Live Alerts */}
              < Card className="bg-card border-border" >
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
              </Card >
            </div >

            {/* Bin Status Table */}
            < Card className="bg-card border-border" >
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
            </Card >
          </div >
        </div >
      </main >

      <Footer />

      {/* Hidden PDF Report Template */}
      <div id="report-template" style={{ display: 'none', width: '800px', backgroundColor: '#f4f6f8', padding: '30px', fontFamily: '"Segoe UI", Arial, sans-serif' }}>
        <div style={{ maxWidth: '1100px', margin: 'auto', background: '#ffffff', padding: '30px 40px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>

          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '3px solid #2e7d32', paddingBottom: '15px', marginBottom: '30px' }}>
            <div className="logo-section">
              {/* Use public image if available, or text fallback */}
              <img src="/images/fostride-logo-new.svg" alt="Fostride Logo" style={{ height: '60px', filter: 'brightness(0) saturate(100%) invert(29%) sepia(35%) saturate(3088%) hue-rotate(97deg) brightness(93%) contrast(90%)' }} />
            </div>
            <div style={{ textAlign: 'right' }}>
              <h1 style={{ margin: 0, fontSize: '26px', color: '#2e7d32' }}>R3Bin Waste Analysis Report</h1>
              <p style={{ margin: '4px 0 0', fontSize: '14px', color: '#555' }}>Smart Segregation • Data-Driven Sustainability</p>
              <p style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>Generated: {new Date().toLocaleDateString()}</p>
            </div>
          </div>

          {/* Installation Details */}
          <div style={{ marginBottom: '30px' }}>
            <h2 style={{ fontSize: '18px', color: '#2e7d32', borderLeft: '5px solid #2e7d32', paddingLeft: '10px', marginBottom: '15px' }}>Installation Details</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px 30px' }}>
              <div style={{ background: '#f9fafb', padding: '12px 15px', borderRadius: '6px', border: '1px solid #e0e0e0' }}>
                <span style={{ display: 'block', fontSize: '12px', color: '#777' }}>Bin Location</span>
                <strong style={{ fontSize: '15px', color: '#222' }}>{selectedLocation === 'all' ? 'All Locations' : selectedLocation}</strong>
              </div>
              <div style={{ background: '#f9fafb', padding: '12px 15px', borderRadius: '6px', border: '1px solid #e0e0e0' }}>
                <span style={{ display: 'block', fontSize: '12px', color: '#777' }}>Active Bins</span>
                <strong style={{ fontSize: '15px', color: '#222' }}>{activeBins}</strong>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div style={{ marginBottom: '30px' }}>
            <h2 style={{ fontSize: '18px', color: '#2e7d32', borderLeft: '5px solid #2e7d32', paddingLeft: '10px', marginBottom: '15px' }}>Waste Collection Summary</h2>
            <div style={{ background: '#e8f5e9', padding: '18px', borderRadius: '6px', borderLeft: '6px solid #2e7d32', fontSize: '15px', color: '#333' }}>
              <strong>Total Waste Collected:</strong> {totalWaste}
              <br />
              <strong>Collection Period:</strong> {timeRange === 'all' ? 'All Time' : `Last ${timeRange}`}
            </div>
          </div>

          {/* Table */}
          <div style={{ marginBottom: '30px' }}>
            <h2 style={{ fontSize: '18px', color: '#2e7d32', borderLeft: '5px solid #2e7d32', paddingLeft: '10px', marginBottom: '15px' }}>Daily Waste Trends</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
              <thead>
                <tr style={{ backgroundColor: '#2e7d32', color: '#fff' }}>
                  <th style={{ padding: '12px', textAlign: 'center', border: '1px solid #ddd', fontSize: '14px' }}>Date</th>
                  <th style={{ padding: '12px', textAlign: 'center', border: '1px solid #ddd', fontSize: '14px' }}>Plastic</th>
                  <th style={{ padding: '12px', textAlign: 'center', border: '1px solid #ddd', fontSize: '14px' }}>Metal</th>
                  <th style={{ padding: '12px', textAlign: 'center', border: '1px solid #ddd', fontSize: '14px' }}>Paper</th>
                  <th style={{ padding: '12px', textAlign: 'center', border: '1px solid #ddd', fontSize: '14px' }}>Mixed</th>
                  <th style={{ padding: '12px', textAlign: 'center', border: '1px solid #ddd', fontSize: '14px' }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {collectionTrends.slice(-10).map((row, i) => (
                  <tr key={i} style={{ backgroundColor: i % 2 === 0 ? '#fff' : '#f6f6f6', color: '#333' }}>
                    <td style={{ padding: '12px', textAlign: 'center', border: '1px solid #ddd' }}>{row.date}</td>
                    <td style={{ padding: '12px', textAlign: 'center', border: '1px solid #ddd' }}>{row.plastic}</td>
                    <td style={{ padding: '12px', textAlign: 'center', border: '1px solid #ddd' }}>{row.metal}</td>
                    <td style={{ padding: '12px', textAlign: 'center', border: '1px solid #ddd' }}>{row.paper}</td>
                    <td style={{ padding: '12px', textAlign: 'center', border: '1px solid #ddd' }}>{row.mixed_waste}</td>
                    <td style={{ padding: '12px', textAlign: 'center', border: '1px solid #ddd' }}>{row.plastic + row.metal + row.paper + row.mixed_waste}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div style={{ marginTop: '40px', paddingTop: '15px', borderTop: '1px solid #ddd', textAlign: 'center', fontSize: '13px', color: '#666' }}>
            Generated by <strong style={{ color: '#2e7d32' }}>Fostride R3Bin</strong> • AI-Powered Waste Segregation System <br />
            © {new Date().getFullYear()} Fostride | Sustainability Through Innovation
          </div>

        </div>
      </div>
    </div >
  )
}
