'use client'

import { isValidUrl } from '@/lib/utils'
import { WorkflowStep } from '@/types/app'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, ImageOff, ArrowRight } from 'lucide-react'

interface WorkflowViewerProps {
    steps: WorkflowStep[]
}

export function WorkflowViewer({ steps }: WorkflowViewerProps) {
    const sortedSteps = [...steps].sort((a, b) => a.step_number - b.step_number)

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
                        <div className="flex flex-col md:flex-row">
                            {/* Step Number */}
                            <div className="flex items-center justify-center md:w-24 py-4 md:py-0 bg-primary/5 md:bg-transparent md:border-r border-border/50">
                                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground font-bold text-lg shadow-lg">
                                    {step.step_number}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex-1 p-6">
                                <div className="flex flex-col md:flex-row md:items-start gap-6">
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                                        <p className="text-muted-foreground leading-relaxed">
                                            {step.description}
                                        </p>
                                    </div>

                                    {/* Image */}
                                    {isValidUrl(step.image_url) ? (
                                        <motion.div
                                            whileHover={{ scale: 1.02 }}
                                            className="relative w-full md:w-64 h-40 rounded-xl overflow-hidden shadow-md shrink-0"
                                        >
                                            <Image
                                                src={step.image_url!}
                                                alt={step.title}
                                                fill
                                                className="object-cover transition-transform duration-500 hover:scale-105"
                                            />
                                        </motion.div>
                                    ) : null}
                                </div>
                            </div>
                        </div>

                        {/* Arrow connector for non-last items */}
                        {index < sortedSteps.length - 1 && (
                            <div className="hidden md:flex justify-center py-2 bg-muted/30">
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
    )
}
