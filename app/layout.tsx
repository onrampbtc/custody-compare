import type { Metadata } from 'next'
import './globals.css'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: {
    default: 'Bitcoin Custody Comparison — Published Scores, Every Provider on the Same Rules',
    template: '%s | CustodyCompare',
  },
  description: 'Compare every Bitcoin custody solution. Published Custody Scores on one methodology, operated by the team behind Onramp Bitcoin, and head-to-head comparisons across 30+ providers.',
  openGraph: {
    type: 'website',
    siteName: 'CustodyCompare',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col bg-white">
        <Navigation />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
