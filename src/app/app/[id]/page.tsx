'use client'

import { isValidUrl } from '@/lib/utils'
import { useApp, useAppWorkflow } from '@/hooks/useAppData'
import { YouTubePlayer } from '@/components/YouTubePlayer'
import { CodeTabs } from '@/components/CodeTabs'
import { WorkflowViewer } from '@/components/WorkflowViewer'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Loader2, ShoppingCart, ArrowLeft, Play, ImageOff, Layers, Code, Workflow, BarChart3, CheckCircle2, ExternalLink } from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { use, useState } from 'react'
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from '@/components/ui/dialog'

export default function AppDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const { data: app, isLoading: appLoading, error: appError } = useApp(id)
    const { data: workflow, isLoading: workflowLoading } = useAppWorkflow(id)
    const [selectedImage, setSelectedImage] = useState<string | null>(null)

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

    const codeFiles = [
        { fileName: 'Frontend', code: app.frontend_code || '// No code available', language: 'tsx' },
        { fileName: 'Backend', code: app.backend_code || '// No code available', language: 'typescript' },
        { fileName: 'Config', code: app.config_code || '// No code available', language: 'json' },
        { fileName: 'Structure', code: app.folder_structure || '// No structure available', language: 'bash' },
    ]

    const galleryImages = app.gallery_images || []
    const techStack = app.tech_stack || []

    return (
        <main className="min-h-screen bg-background">
            {/* Navigation */}
            <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/50">
                <div className="container mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                        <ArrowLeft className="h-4 w-4" />
                        <span>Back to Marketplace</span>
                    </Link>
                    <Link href={`/buy/${app.id}`}>
                        <Button size="lg" className="gap-2 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                            <ShoppingCart className="h-5 w-5" />
                            Buy Now - ${app.price}
                        </Button>
                    </Link>
                </div>
            </nav>

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
                        {/* Tags */}
                        {app.tags && app.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-4">
                                {app.tags.map((tag) => (
                                    <Badge key={tag} variant="secondary" className="text-sm px-3 py-1">
                                        {tag}
                                    </Badge>
                                ))}
                            </div>
                        )}

                        {/* Title */}
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4">
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

                        {/* Tech Stack */}
                        {techStack.length > 0 && (
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="text-sm text-muted-foreground mr-2">Built with:</span>
                                {techStack.map((tech) => (
                                    <Badge key={tech} variant="outline" className="bg-background/50">
                                        {tech}
                                    </Badge>
                                ))}
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
                        <TabsTrigger value="gallery" className="px-6 py-3 gap-2 rounded-lg">
                            <Layers className="h-4 w-4" />
                            Screenshots
                        </TabsTrigger>
                        <TabsTrigger value="code" className="px-6 py-3 gap-2 rounded-lg">
                            <Code className="h-4 w-4" />
                            Code Preview
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
                            ) : (
                                <Card className="mb-12 border-dashed">
                                    <CardContent className="py-12 text-center">
                                        <Play className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                        <h3 className="text-lg font-semibold mb-2">No Video Demo</h3>
                                        <p className="text-muted-foreground">
                                            Video demonstration is not available for this application.
                                        </p>
                                    </CardContent>
                                </Card>
                            )}

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

                            {/* Features List */}
                            <section>
                                <h2 className="text-2xl font-bold mb-6">What's Included</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {[
                                        'Full source code',
                                        'Documentation',
                                        'Free updates',
                                        'Support included',
                                        'Modern tech stack',
                                        'Production ready',
                                    ].map((feature) => (
                                        <div key={feature} className="flex items-center gap-3 p-4 rounded-xl bg-muted/50">
                                            <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                                            <span>{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </motion.div>
                    </TabsContent>

                    {/* Gallery Tab */}
                    <TabsContent value="gallery">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <h2 className="text-2xl font-bold mb-6">Application Screenshots</h2>

                            {galleryImages.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {galleryImages.map((imageUrl, index) => (
                                        <Dialog key={index}>
                                            <DialogTrigger asChild>
                                                <motion.div
                                                    whileHover={{ scale: 1.02 }}
                                                    className="relative aspect-video rounded-2xl overflow-hidden cursor-pointer group shadow-lg hover:shadow-2xl transition-shadow"
                                                >
                                                    <Image
                                                        src={imageUrl}
                                                        alt={`Screenshot ${index + 1}`}
                                                        fill
                                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                                    />
                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                        <ExternalLink className="h-8 w-8 text-white" />
                                                    </div>
                                                </motion.div>
                                            </DialogTrigger>
                                            <DialogContent className="max-w-5xl max-h-[90vh] p-0 overflow-hidden">
                                                <DialogTitle className="sr-only">Screenshot {index + 1}</DialogTitle>
                                                <div className="relative w-full h-[80vh]">
                                                    <Image
                                                        src={imageUrl}
                                                        alt={`Screenshot ${index + 1}`}
                                                        fill
                                                        className="object-contain"
                                                    />
                                                </div>
                                            </DialogContent>
                                        </Dialog>
                                    ))}
                                </div>
                            ) : (
                                <Card className="border-dashed">
                                    <CardContent className="py-12 text-center">
                                        <ImageOff className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                        <h3 className="text-lg font-semibold mb-2">No Screenshots Available</h3>
                                        <p className="text-muted-foreground">
                                            Screenshots have not been uploaded for this application.
                                        </p>
                                    </CardContent>
                                </Card>
                            )}
                        </motion.div>
                    </TabsContent>

                    {/* Code Tab */}
                    <TabsContent value="code">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <h2 className="text-2xl font-bold mb-6">Code Preview</h2>
                            <CodeTabs files={codeFiles} />
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

            {/* Floating Buy Bar */}
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
        </main>
    )
}
