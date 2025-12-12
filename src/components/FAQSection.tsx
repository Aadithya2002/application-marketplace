'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, HelpCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FAQItem {
    question: string
    answer: string
}

const defaultFAQs: FAQItem[] = [
    {
        question: 'Do I get the full source code?',
        answer: 'Yes! You receive 100% of the source code with full ownership. No hidden files, no obfuscation. You can modify, extend, and deploy the code however you like.',
    },
    {
        question: 'Can I self-host this application?',
        answer: 'Absolutely. The application is designed to be self-hosted on your own infrastructure. We provide detailed deployment guides for Vercel, AWS, and other popular platforms.',
    },
    {
        question: 'Is documentation included?',
        answer: 'Yes, comprehensive documentation is included covering setup, configuration, customization, and deployment. We also provide inline code comments for easier understanding.',
    },
    {
        question: 'How many users can the app support?',
        answer: 'The applications are built to scale. With proper infrastructure, they can support thousands of concurrent users. We use modern architecture patterns and optimized database queries.',
    },
    {
        question: 'Do you provide updates?',
        answer: 'Yes, you receive free lifetime updates for the version you purchased. This includes bug fixes, security patches, and minor feature improvements.',
    },
    {
        question: 'What tech stack is used?',
        answer: 'Our applications are built with modern technologies including Next.js, React, TypeScript, Tailwind CSS, and various backend services like Supabase, Prisma, or MongoDB depending on the app.',
    },
]

interface FAQSectionProps {
    faqs?: FAQItem[]
}

export function FAQSection({ faqs = defaultFAQs }: FAQSectionProps) {
    const [openIndex, setOpenIndex] = useState<number | null>(null)

    const toggle = (index: number) => {
        setOpenIndex(openIndex === index ? null : index)
    }

    return (
        <section className="py-8">
            <div className="flex items-center gap-2 mb-6">
                <HelpCircle className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
            </div>

            <div className="space-y-3">
                {faqs.map((faq, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border border-border/50 rounded-xl overflow-hidden bg-card"
                    >
                        <button
                            onClick={() => toggle(index)}
                            className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/50 transition-colors"
                        >
                            <span className="font-medium pr-4">{faq.question}</span>
                            <ChevronDown
                                className={cn(
                                    'h-5 w-5 text-muted-foreground shrink-0 transition-transform',
                                    openIndex === index && 'rotate-180'
                                )}
                            />
                        </button>

                        <AnimatePresence>
                            {openIndex === index && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <div className="px-4 pb-4 text-muted-foreground">
                                        {faq.answer}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                ))}
            </div>
        </section>
    )
}
