import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/Providers'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { cn } from '@/lib/utils'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'APPTZO | Premium Production-Ready Applications',
  description: 'Discover and deploy production-ready applications. 100% source code included with free lifetime updates.',
  keywords: ['apps', 'marketplace', 'source code', 'production-ready', 'next.js', 'react'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(inter.className, "min-h-screen bg-background font-sans antialiased flex flex-col")}>
        <Providers>
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}

