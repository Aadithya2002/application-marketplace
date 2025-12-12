'use client'

import { useApps } from '@/hooks/useAppData'
import { AppCard } from '@/components/AppCard'
import { TrustSection } from '@/components/TrustSection'
import { CategoryFilter } from '@/components/CategoryFilter'
import { motion } from 'framer-motion'
import { Loader2, Search, Sparkles, Package, ArrowRight } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

export default function Home() {
  const { data: apps, isLoading, error } = useApps()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const filteredApps = apps?.filter(app => {
    const matchesSearch =
      app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.short_desc?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCategory = selectedCategory === 'all' ||
      app.category?.toLowerCase() === selectedCategory ||
      app.tags?.some(tag => tag.toLowerCase().includes(selectedCategory))

    return matchesSearch && matchesCategory
  })

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
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-background via-background to-muted/30">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 md:px-8 py-12 md:py-20 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-6">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">New apps every week</span>
            </div>

            {/* Responsive Typography using clamp */}
            <h1 className="font-extrabold tracking-tight mb-6" style={{ fontSize: 'clamp(2rem, 8vw, 4.5rem)', lineHeight: 1.1 }}>
              <span className="bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent">
                Premium Production-Ready
              </span>
              <br />
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Applications
              </span>
            </h1>

            <p className="text-muted-foreground max-w-2xl mx-auto mb-8" style={{ fontSize: 'clamp(1rem, 2.5vw, 1.25rem)' }}>
              100% source code included • Free lifetime updates • Direct founder support
            </p>

            {/* Search Bar - Smaller on mobile */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="max-w-md mx-auto"
            >
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search apps..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 h-12 md:h-14 text-base rounded-xl border-border/50 bg-background/80 backdrop-blur-sm shadow-lg focus:shadow-xl focus:border-primary/50 transition-all"
                />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Trust Section */}
      <TrustSection />

      {/* Apps Grid Section */}
      <section className="container mx-auto px-4 md:px-8 py-12 md:py-16">
        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mb-8"
        >
          <CategoryFilter
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </motion.div>

        {/* Results Header */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h2 className="text-xl md:text-2xl font-bold">
              {searchQuery ? 'Search Results' : selectedCategory === 'all' ? 'All Applications' : `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Apps`}
            </h2>
            <p className="text-muted-foreground text-sm mt-1">
              {filteredApps?.length || 0} application{(filteredApps?.length || 0) !== 1 ? 's' : ''} available
            </p>
          </div>
        </motion.div>

        {/* Apps Grid - Responsive */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 lg:gap-8">
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
            <Button
              variant="outline"
              onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
              className="mt-4"
            >
              Clear filters
            </Button>
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

      {/* Coming Soon Section */}
      <section className="bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              🚀 New Apps Every Week
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-6">
              We release new production-ready applications weekly. Stay tuned for more AI-powered tools,
              productivity apps, and business solutions.
            </p>
            <Button variant="outline" className="gap-2">
              <Sparkles className="h-4 w-4" />
              Subscribe for Updates
              <ArrowRight className="h-4 w-4" />
            </Button>
          </motion.div>
        </div>
      </section>
    </>
  )
}
