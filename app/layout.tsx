import React from "react"
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from "@/components/theme-provider"
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://www.fostride.com'),
  title: {
    default: 'Fostride R3Bin - AI-Powered Smart Waste Intelligence',
    template: '%s | Fostride R3Bin'
  },
  description: 'Transform waste into actionable intelligence with R3Bin. AI-powered segregation, real-time analytics, and ESG compliance for campuses, corporates, and smart cities.',
  keywords: ['Smart Waste Management', 'AI Waste Segregation', 'Sustainability Tech', 'ESG Reporting', 'Smart City IoT', 'Carbon Footprint Reduction'],
  authors: [{ name: 'Fostride Inc.' }],
  creator: 'Fostride Inc.',
  publisher: 'Fostride Inc.',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.fostride.com',
    title: 'Fostride R3Bin - AI-Powered Smart Waste Intelligence',
    description: 'Transform waste into actionable intelligence with R3Bin. AI-powered segregation, real-time analytics, and ESG compliance.',
    siteName: 'Fostride R3Bin',
    images: [
      {
        url: '/images/og-image.jpg', // Make sure to add this image later or use a generic one
        width: 1200,
        height: 630,
        alt: 'Fostride R3Bin Dashboard',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fostride R3Bin - AI-Powered Smart Waste Intelligence',
    description: 'Automatic waste segregation and real-time analytics for modern enterprises.',
    creator: '@fostride',
    images: ['/images/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
