import React from "react"
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Fostride R3Bin - AI-Powered Smart Waste Intelligence',
  description: 'Transform waste into actionable intelligence with R3Bin. AI-powered segregation, real-time analytics, and ESG compliance for campuses, corporates, and smart cities.',

  icons: {
    icon: '/images/fostride-logo-new.svg',
    apple: '/images/fostride-logo-new.svg',
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
