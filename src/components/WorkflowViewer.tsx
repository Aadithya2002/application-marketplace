'use client'

import { useState } from 'react'
import { isValidUrl } from '@/lib/utils'
import { WorkflowStep } from '@/types/app'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { AlertCircle, ArrowRight, X, ZoomIn } from 'lucide-react'

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
            <div className="space-y-6">
                {sortedSteps.map((step, index) => (
                    <motion.div
                        key={step.id}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                        <Card className="overflow-hidden border-border/50 hover:shadow-lg transition-shadow duration-300">
                            <div className="flex flex-col lg:flex-row">
                                {/* Step Number */}
                                <div className="flex items-center justify-center lg:w-24 py-4 lg:py-0 bg-primary/5 lg:bg-transparent lg:border-r border-border/50">
                                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground font-bold text-lg shadow-lg">
                                        {step.step_number}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="flex-1 p-6">
                                    <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                                        <div className="flex-1">
                                            <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                                            <p className="text-muted-foreground leading-relaxed">
                                                {step.description}
                                            </p>
                                        </div>

                                        {/* Image - Larger with lightbox */}
                                        {isValidUrl(step.image_url) && (
                                            <motion.div
                                                whileHover={{ scale: 1.02 }}
                                                onClick={() => setSelectedImage({ url: step.image_url!, title: step.title })}
                                                className="relative w-full lg:w-80 xl:w-96 aspect-video rounded-xl overflow-hidden shadow-md shrink-0 cursor-pointer group bg-muted"
                                            >
                                                <Image
                                                    src={step.image_url!}
                                                    alt={step.title}
                                                    fill
                                                    className="object-contain transition-transform duration-500 group-hover:scale-105"
                                                />
                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 backdrop-blur-sm p-2 rounded-full">
                                                        <ZoomIn className="h-5 w-5" />
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Arrow connector for non-last items */}
                            {index < sortedSteps.length - 1 && (
                                <div className="hidden lg:flex justify-center py-2 bg-muted/30">
                                    <ArrowRight className="h-5 w-5 text-muted-foreground rotate-90" />
                                </div>
                            )}
                        </Card>
                    </motion.div>
                ))}

                {/* Completion indicator */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center py-8"
                >
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/10 mb-4">
                        <svg className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-green-600 dark:text-green-400">
                        That's it! Ready to deploy.
                    </h3>
                </motion.div>
            </div>

            {/* Lightbox Modal */}
            <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
                <DialogContent className="max-w-6xl max-h-[95vh] p-0 overflow-hidden bg-black/95">
                    <DialogTitle className="sr-only">
                        {selectedImage?.title || 'Workflow Step Image'}
                    </DialogTitle>

                    {selectedImage && (
                        <div className="relative w-full h-[85vh] flex items-center justify-center">
                            {/* Close button */}
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute top-4 right-4 z-10 text-white hover:bg-white/20"
                                onClick={() => setSelectedImage(null)}
                            >
                                <X className="h-6 w-6" />
                            </Button>

                            {/* Image */}
                            <div className="relative w-full h-full p-8">
                                <Image
                                    src={selectedImage.url}
                                    alt={selectedImage.title}
                                    fill
                                    className="object-contain"
                                />
                            </div>

                            {/* Title */}
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/80 text-sm bg-black/50 px-4 py-2 rounded-full">
                                {selectedImage.title}
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    )
}

