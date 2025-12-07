'use client'

import { useApps } from '@/hooks/useAppData'
import { AppCard } from '@/components/AppCard'
import { motion } from 'framer-motion'
import { Loader2, Search, Sparkles, Package } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useState } from 'react'

export default function Home() {
  const { data: apps, isLoading, error } = useApps()
  const [searchQuery, setSearchQuery] = useState('')

  const filteredApps = apps?.filter(app =>
    app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.short_desc?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-muted-foreground">Loading applications...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-destructive gap-4">
        <Package className="h-12 w-12" />
        <p>Error loading applications. Please try again later.</p>
      </div>
    )
  }

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-background via-background to-muted/30">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 md:px-8 py-16 md:py-24 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-6">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Premium Applications</span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6">
              <span className="bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent">
                Application
              </span>
              <br />
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Marketplace
              </span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              Discover and deploy production-ready applications with modern architecture,
              beautiful UI, and comprehensive documentation.
            </p>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="max-w-xl mx-auto"
            >
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search applications..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 py-6 text-lg rounded-2xl border-border/50 bg-background/80 backdrop-blur-sm shadow-lg focus:shadow-xl focus:border-primary/50 transition-all"
                />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Apps Grid Section */}
      <section className="container mx-auto px-4 md:px-8 py-12 md:py-16">
        {/* Results Header */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h2 className="text-2xl font-bold">
              {searchQuery ? 'Search Results' : 'All Applications'}
            </h2>
            <p className="text-muted-foreground mt-1">
              {filteredApps?.length || 0} application{(filteredApps?.length || 0) !== 1 ? 's' : ''} available
            </p>
          </div>
        </motion.div>

        {/* Apps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {filteredApps?.map((app, index) => (
            <motion.div
              key={app.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
            >
              <AppCard app={app} />
            </motion.div>
          ))}
        </div>

        {/* Empty States */}
        {filteredApps?.length === 0 && searchQuery && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No results found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search terms or browse all applications
            </p>
          </motion.div>
        )}

        {filteredApps?.length === 0 && !searchQuery && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No applications yet</h3>
            <p className="text-muted-foreground">
              Check back later for new applications!
            </p>
          </motion.div>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-muted/30">
        <div className="container mx-auto px-4 md:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <span className="font-bold text-lg">Application Marketplace</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 Application Marketplace. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </main>
  )
}
