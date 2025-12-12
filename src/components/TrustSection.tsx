'use client'

import { motion } from 'framer-motion'
import { Code2, Shield, Zap, RefreshCw, Cpu, HeadphonesIcon } from 'lucide-react'

const trustItems = [
    {
        icon: Code2,
        title: '100% Source Code',
        description: 'Full access to every line of code',
    },
    {
        icon: Zap,
        title: 'Production Ready',
        description: 'Deploy immediately to production',
    },
    {
        icon: Shield,
        title: 'Secure & Audited',
        description: 'Security best practices built-in',
    },
    {
        icon: RefreshCw,
        title: 'Free Updates',
        description: 'Lifetime updates at no extra cost',
    },
    {
        icon: Cpu,
        title: 'Modern Tech Stack',
        description: 'Built with Next.js, React, TypeScript',
    },
    {
        icon: HeadphonesIcon,
        title: 'Founder Support',
        description: 'Direct support from the dev team',
    },
]

export function TrustSection() {
    return (
        <section className="py-16 md:py-20 bg-muted/30">
            <div className="container mx-auto px-4 md:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Why Trust APPTZO?
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Every application is built with quality, security, and your success in mind.
                    </p>
                </motion.div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                    {trustItems.map((item, index) => (
                        <motion.div
                            key={item.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="flex flex-col items-center text-center p-4"
                        >
                            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                                <item.icon className="h-7 w-7 text-primary" />
                            </div>
                            <h3 className="font-semibold mb-1 text-sm md:text-base">
                                {item.title}
                            </h3>
                            <p className="text-xs md:text-sm text-muted-foreground">
                                {item.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
