import React from "react"
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://www.fostride.com'),
  title: {
    default: 'Fostride - Waste Intelligence Infrastructure for India',
    template: '%s | Fostride'
  },
  description: 'Building W.I.S.E. — Waste Intelligent Sorting Engine. An engine-first climate technology company transforming waste management with AI and machine learning.',
  keywords: ['Waste Intelligence', 'Climate Tech', 'AI Waste Management', 'Sustainability Infrastructure', 'W.I.S.E Engine', 'Smart Waste'],
  authors: [{ name: 'Fostride Inc.' }],
  creator: 'Fostride Inc.',
  publisher: 'Fostride Inc.',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.fostride.com',
    title: 'Fostride - Waste Intelligence Infrastructure',
    description: 'Building foundational waste intelligence infrastructure for India with W.I.S.E.',
    siteName: 'Fostride',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Fostride - Waste Intelligent Sorting Engine',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fostride - Waste Intelligence Infrastructure',
    description: 'Transforming waste management with W.I.S.E. — Waste Intelligent Sorting Engine.',
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
        {children}
        <Analytics />
      </body>
    </html>
  )
}
