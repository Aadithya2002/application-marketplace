'use client'

import { AlertCircle } from 'lucide-react'
import { ValidationErrors } from '@/types/app'
import { motion, AnimatePresence } from 'framer-motion'

interface ValidationAlertProps {
    errors: ValidationErrors
    onJumpToField?: (field: keyof ValidationErrors) => void
}

const fieldLabels: Record<keyof ValidationErrors, string> = {
    name: 'App Name',
    short_desc: 'Short Description',
    full_desc: 'Full Description',
    price: 'Price',
    thumbnail: 'Thumbnail Image',
    gallery: 'Application Screenshots',
    youtube: 'YouTube Demo Link',
    workflow: 'Workflow Steps',
    tech_stack: 'Tech Stack',
}

export function ValidationAlert({ errors, onJumpToField }: ValidationAlertProps) {
    const errorKeys = Object.keys(errors).filter(
        (key) => errors[key as keyof ValidationErrors]
    ) as (keyof ValidationErrors)[]

    if (errorKeys.length === 0) return null

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-destructive/10 border border-destructive/30 rounded-xl p-4 mb-6"
            >
                <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                    <div className="flex-1">
                        <h4 className="font-semibold text-destructive mb-2">
                            Please fix the following issues before saving
                        </h4>
                        <ul className="space-y-1">
                            {errorKeys.map((key) => (
                                <li key={key} className="text-sm text-destructive/80">
                                    <button
                                        type="button"
                                        onClick={() => onJumpToField?.(key)}
                                        className="hover:underline text-left"
                                    >
                                        • {fieldLabels[key]}: {errors[key]}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    )
}
