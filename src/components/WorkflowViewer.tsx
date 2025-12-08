'use client'

import { useState } from 'react'
import { isValidUrl } from '@/lib/utils'
import { WorkflowStep } from '@/types/app'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { AlertCircle, X, ZoomIn, ChevronRight } from 'lucide-react'

interface WorkflowViewerProps {
    steps: WorkflowStep[]
}

export function WorkflowViewer({ steps }: WorkflowViewerProps) {
    const sortedSteps = [...steps].sort((a, b) => a.step_number - b.step_number)
    const [selectedImage, setSelectedImage] = useState<{ url: string; title: string } | null>(null)

    if (steps.length === 0) {
        return (
            <Card className="border-dashed">
                <CardContent className="py-12 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                        <AlertCircle className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">No Workflow Steps</h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                        Workflow steps have not been added for this application yet.
                        Check back later or contact the seller for more information.
                    </p>
                </CardContent>
            </Card>
        )
    }

    return (
        <>
            <div className="space-y-8">
                {sortedSteps.map((step, index) => (
                    <motion.div
                        key={step.id}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.6, delay: index * 0.15 }}
                    >
                        <Card className="overflow-hidden border-border/50 hover:shadow-xl transition-all duration-500 bg-gradient-to-br from-card to-card/50">
                            {/* Step Header */}
                            <div className="flex items-center gap-4 p-6 border-b border-border/50 bg-muted/30">
                                <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-primary text-primary-foreground font-bold text-xl shadow-lg">
                                    {step.step_number}
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-2xl font-bold">{step.title}</h3>
                                </div>
                                {index < sortedSteps.length - 1 && (
                                    <ChevronRight className="h-6 w-6 text-muted-foreground hidden sm:block" />
                                )}
                            </div>

                            {/* Step Content */}
                            <div className="p-6 space-y-6">
                                {/* Description */}
                                <p className="text-lg text-muted-foreground leading-relaxed">
                                    {step.description}
                                </p>

                                {/* Large Screenshot */}
                                {isValidUrl(step.image_url) && (
                                    <motion.div
                                        whileHover={{ scale: 1.01 }}
                                        onClick={() => setSelectedImage({ url: step.image_url!, title: step.title })}
                                        className="relative w-full aspect-video rounded-2xl overflow-hidden cursor-pointer group bg-muted shadow-xl"
                                    >
                                        <Image
                                            src={step.image_url!}
                                            alt={step.title}
                                            fill
                                            className="object-contain transition-transform duration-700 group-hover:scale-105"
                                        />
                                        {/* Hover overlay */}
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                                            <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-90 group-hover:scale-100">
                                                <div className="bg-white/95 backdrop-blur-sm px-6 py-3 rounded-full flex items-center gap-2 shadow-xl">
                                                    <ZoomIn className="h-5 w-5" />
                                                    <span className="font-medium">Click to expand</span>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        </Card>
                    </motion.div>
                ))}

                {/* Completion indicator */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center py-12"
                >
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-green-500/20 to-emerald-500/20 mb-4">
                        <svg className="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-bold text-green-600 dark:text-green-400">
                        That's it! Ready to deploy.
                    </h3>
                    <p className="text-muted-foreground mt-2">
                        Purchase the application to get started
                    </p>
                </motion.div>
            </div>

            {/* Lightbox Modal */}
            <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
                <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 overflow-hidden bg-black/98">
                    <DialogTitle className="sr-only">
                        {selectedImage?.title || 'Workflow Step Image'}
                    </DialogTitle>

                    {selectedImage && (
                        <div className="relative w-full h-[90vh] flex items-center justify-center">
                            {/* Close button */}
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute top-4 right-4 z-10 text-white hover:bg-white/20 h-12 w-12"
                                onClick={() => setSelectedImage(null)}
                            >
                                <X className="h-8 w-8" />
                            </Button>

                            {/* Image */}
                            <div className="relative w-full h-full p-4">
                                <Image
                                    src={selectedImage.url}
                                    alt={selectedImage.title}
                                    fill
                                    className="object-contain"
                                />
                            </div>

                            {/* Title */}
                            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white bg-black/70 backdrop-blur-sm px-6 py-3 rounded-full font-medium">
                                {selectedImage.title}
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    )
}
