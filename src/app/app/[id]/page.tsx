'use client'

import { isValidUrl } from '@/lib/utils'
import { useApp, useAppWorkflow } from '@/hooks/useAppData'
import { YouTubePlayer } from '@/components/YouTubePlayer'
import { WorkflowViewer } from '@/components/WorkflowViewer'
import { ScreenshotGallery } from '@/components/ScreenshotGallery'
import { TechStack } from '@/components/TechBadge'
import { FAQSection } from '@/components/FAQSection'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Loader2, ShoppingCart, ArrowLeft, Play, ImageOff, Workflow, CheckCircle2, Lock } from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { use, useState } from 'react'

export default function AppDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const { data: app, isLoading: appLoading, error: appError } = useApp(id)
    const { data: workflow, isLoading: workflowLoading } = useAppWorkflow(id)
    const [showPurchaseModal, setShowPurchaseModal] = useState(false)

    if (appLoading || workflowLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-4">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="text-muted-foreground">Loading application...</p>
            </div>
        )
    }

    if (appError || !app) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-4">
                <div className="p-4 rounded-full bg-destructive/10">
                    <ImageOff className="h-8 w-8 text-destructive" />
                </div>
                <h2 className="text-xl font-semibold">Application not found</h2>
                <p className="text-muted-foreground">The application you're looking for doesn't exist.</p>
                <Link href="/">
                    <Button variant="outline">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Marketplace
                    </Button>
                </Link>
            </div>
        )
    }

    const galleryImages = app.gallery_images || []
    const techStack = app.tech_stack || []

    // What's included items (without "Support included")
    const includedFeatures = [
        'Full source code',
        'Documentation',
        'Free updates',
        'Modern tech stack',
        'Production ready',
    ]

    return (
        <main className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="relative">
                {/* Background */}
                <div className="absolute inset-0 h-[50vh] overflow-hidden">
                    {isValidUrl(app.thumbnail_url) ? (
                        <>
                            <Image
                                src={app.thumbnail_url!}
                                alt={app.name}
                                fill
                                className="object-cover blur-2xl opacity-30 scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/80 to-background" />
                        </>
                    ) : (
                        <div className="absolute inset-0 bg-gradient-to-b from-muted to-background" />
                    )}
                </div>

                {/* Content */}
                <div className="container mx-auto px-4 md:px-8 py-12 md:py-20 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="max-w-4xl"
                    >
                        {/* Title */}
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
                            {app.name}
                        </h1>

                        {/* Description */}
                        <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
                            {app.short_desc}
                        </p>

                        {/* Price and CTA */}
                        <div className="flex items-center gap-6 mb-8">
                            <div>
                                <p className="text-sm text-muted-foreground mb-1">Price</p>
                                <p className="text-4xl font-bold">${app.price}</p>
                            </div>
                            <Link href={`/buy/${app.id}`}>
                                <Button size="lg" className="gap-2 h-14 px-8 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all">
                                    <ShoppingCart className="h-5 w-5" />
                                    Buy Now
                                </Button>
                            </Link>
                        </div>

                        {/* Tech Stack with Large Icons */}
                        {techStack.length > 0 && (
                            <div className="space-y-3">
                                <span className="text-sm text-muted-foreground">Built with:</span>
                                <TechStack technologies={techStack} />
                            </div>
                        )}
                    </motion.div>
                </div>
            </section>

            {/* Main Content */}
            <div className="container mx-auto px-4 md:px-8 pb-20">
                <Tabs defaultValue="overview" className="w-full">
                    <TabsList className="w-full justify-start h-auto p-1 bg-muted/50 rounded-xl mb-8 overflow-x-auto">
                        <TabsTrigger value="overview" className="px-6 py-3 gap-2 rounded-lg">
                            <Play className="h-4 w-4" />
                            Overview
                        </TabsTrigger>
                        <TabsTrigger value="workflow" className="px-6 py-3 gap-2 rounded-lg">
                            <Workflow className="h-4 w-4" />
                            How It Works
                        </TabsTrigger>
                    </TabsList>

                    {/* Overview Tab */}
                    <TabsContent value="overview" className="space-y-12">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            {/* Video Section */}
                            {app.youtube_url ? (
                                <section className="mb-12">
                                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                        <Play className="h-6 w-6 text-primary" />
                                        Video Demo
                                    </h2>
                                    <div className="max-w-4xl mx-auto">
                                        <YouTubePlayer url={app.youtube_url} />
                                    </div>
                                </section>
                            ) : null}

                            {/* Description Section */}
                            <section>
                                <h2 className="text-2xl font-bold mb-6">About This Application</h2>
                                <Card>
                                    <CardContent className="py-6">
                                        <div className="prose dark:prose-invert max-w-none">
                                            <p className="whitespace-pre-wrap text-lg leading-relaxed">
                                                {app.full_desc || 'No detailed description available.'}
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </section>

                            {/* Screenshots Section - Moved here from separate tab */}
                            {galleryImages.length > 0 && (
                                <section>
                                    <h2 className="text-2xl font-bold mb-6">Application Screenshots</h2>
                                    <ScreenshotGallery images={galleryImages} appName={app.name} />
                                </section>
                            )}

                            {/* What's Included (without Support) */}
                            <section>
                                <h2 className="text-2xl font-bold mb-6">What's Included</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {includedFeatures.map((feature) => (
                                        <div key={feature} className="flex items-center gap-3 p-4 rounded-xl bg-muted/50">
                                            <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                                            <span>{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* Locked Code Preview Section */}
                            <section>
                                <h2 className="text-2xl font-bold mb-6">Code Preview</h2>
                                <Card className="relative overflow-hidden">
                                    <CardContent className="py-12">
                                        {/* Blurred code background */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-muted/80 to-muted/50 backdrop-blur-sm" />

                                        {/* Fake code lines for visual effect */}
                                        <div className="relative opacity-20 blur-sm pointer-events-none select-none font-mono text-sm space-y-2 px-4">
                                            <p>import {'{ useState }'} from 'react'</p>
                                            <p>import {'{ Button }'} from '@/components/ui/button'</p>
                                            <p></p>
                                            <p>export function Component() {'{'}</p>
                                            <p>  const [state, setState] = useState(null)</p>
                                            <p>  return {'<div>...</div>'}</p>
                                            <p>{'}'}</p>
                                        </div>

                                        {/* Lock overlay */}
                                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/60 backdrop-blur-[2px]">
                                            <div className="text-center space-y-4">
                                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
                                                    <Lock className="h-8 w-8 text-primary" />
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-semibold">Code Preview Locked</h3>
                                                    <p className="text-muted-foreground text-sm mt-1 max-w-sm">
                                                        Purchase this application to access the full source code
                                                    </p>
                                                </div>
                                                <Button
                                                    onClick={() => setShowPurchaseModal(true)}
                                                    className="gap-2"
                                                >
                                                    <Lock className="h-4 w-4" />
                                                    Unlock Code
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </section>

                            {/* FAQ Section */}
                            <FAQSection />
                        </motion.div>
                    </TabsContent>

                    {/* Workflow Tab */}
                    <TabsContent value="workflow">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <h2 className="text-2xl font-bold mb-6">How It Works</h2>
                            <WorkflowViewer steps={workflow || []} />
                        </motion.div>
                    </TabsContent>
                </Tabs>
            </div>

            {/* Floating Buy Bar (Mobile) */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border/50 p-4 z-40 md:hidden"
            >
                <div className="container mx-auto flex items-center justify-between">
                    <div>
                        <p className="font-bold text-lg">${app.price}</p>
                        <p className="text-sm text-muted-foreground">{app.name}</p>
                    </div>
                    <Link href={`/buy/${app.id}`}>
                        <Button size="lg" className="gap-2 rounded-xl">
                            <ShoppingCart className="h-5 w-5" />
                            Buy Now
                        </Button>
                    </Link>
                </div>
            </motion.div>

            {/* Purchase Modal */}
            <Dialog open={showPurchaseModal} onOpenChange={setShowPurchaseModal}>
                <DialogContent className="sm:max-w-md">
                    <DialogTitle className="text-xl font-bold text-center">
                        Unlock Full Source Code
                    </DialogTitle>
                    <DialogDescription className="text-center">
                        To unlock the complete source code, please purchase this application.
                    </DialogDescription>
                    <div className="py-6 text-center space-y-4">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10">
                            <Lock className="h-10 w-10 text-primary" />
                        </div>
                        <div>
                            <p className="text-3xl font-bold">${app.price}</p>
                            <p className="text-muted-foreground text-sm mt-1">One-time purchase</p>
                        </div>
                    </div>
                    <div className="flex flex-col gap-3">
                        <Link href={`/buy/${app.id}`} className="w-full">
                            <Button className="w-full h-12 gap-2">
                                <ShoppingCart className="h-5 w-5" />
                                Purchase Now
                            </Button>
                        </Link>
                        <Button variant="outline" onClick={() => setShowPurchaseModal(false)}>
                            Maybe Later
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </main >
    )
}
