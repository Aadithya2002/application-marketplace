'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PhoneInput } from '@/components/PhoneInput'
import { Loader2, Send, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'
import { User } from '@supabase/supabase-js'
import { App } from '@/types/app'
import { motion, AnimatePresence } from 'framer-motion'

interface ContactFormProps {
    user: User
    app: App
    onSuccess?: () => void
}

export function ContactForm({ user, app, onSuccess }: ContactFormProps) {
    const [phone, setPhone] = useState('')
    const [loading, setLoading] = useState(false)
    const [submitted, setSubmitted] = useState(false)

    const email = user.email || ''

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        // Validate phone if provided
        if (phone && phone !== '') {
            const phoneDigits = phone.replace(/\D/g, '')
            if (phoneDigits.length !== 12) { // +91 (2 digits) + 10 digits
                toast.error('Please enter a valid 10-digit phone number')
                return
            }
        }

        try {
            setLoading(true)

            // Insert lead into database
            const { error } = await supabase
                .from('leads')
                .insert({
                    user_id: user.id,
                    email: email,
                    phone: phone || null,
                    application_id: app.id,
                })

            if (error) throw error

            // Trigger notification (can be done via edge function or webhook)
            try {
                await sendNotifications({
                    appName: app.name,
                    email: email,
                    phone: phone || undefined,
                })
            } catch (notifyError) {
                console.error('Notification error:', notifyError)
                // Don't fail the submission if notifications fail
            }

            setSubmitted(true)
            toast.success('Your request has been submitted!')
            onSuccess?.()
        } catch (error: any) {
            toast.error(error.message || 'Failed to submit request')
        } finally {
            setLoading(false)
        }
    }

    if (submitted) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8 space-y-6"
            >
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.1 }}
                    className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30"
                >
                    <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
                </motion.div>
                <div className="space-y-2">
                    <h3 className="text-2xl font-bold">Request Submitted!</h3>
                    <p className="text-muted-foreground max-w-sm mx-auto">
                        We've received your request for <span className="font-medium text-foreground">{app.name}</span>
                    </p>
                </div>

                {/* Next Steps */}
                <div className="bg-muted/50 rounded-xl p-4 text-left space-y-3">
                    <h4 className="font-semibold text-sm">What happens next?</h4>
                    <ul className="text-sm text-muted-foreground space-y-2">
                        <li className="flex items-start gap-2">
                            <span className="text-primary">1.</span>
                            <span>You'll receive a confirmation email at <span className="font-medium text-foreground">{email}</span></span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-primary">2.</span>
                            <span>Our team will review your request within 24 hours</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-primary">3.</span>
                            <span>You can track your request status in your <a href="/profile" className="text-primary hover:underline">Profile</a></span>
                        </li>
                    </ul>
                </div>

                <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                    <p className="text-sm text-muted-foreground">
                        💳 <span className="font-medium">Online payment coming soon!</span> For now, our team will guide you through the payment process.
                    </p>
                </div>
            </motion.div>
        )
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                    id="email"
                    type="email"
                    value={email}
                    disabled
                    className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">
                    We'll use this email to contact you about your request
                </p>
            </div>

            <div className="space-y-2">
                <Label htmlFor="phone">
                    Phone Number <span className="text-muted-foreground">(optional)</span>
                </Label>
                <PhoneInput
                    id="phone"
                    value={phone}
                    onChange={setPhone}
                    disabled={loading}
                />
                <p className="text-xs text-muted-foreground">
                    Indian mobile number for faster communication
                </p>
            </div>

            <Button
                type="submit"
                className="w-full h-12 text-base gap-2"
                disabled={loading}
            >
                {loading ? (
                    <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Sending...
                    </>
                ) : (
                    <>
                        <Send className="h-5 w-5" />
                        Send Request
                    </>
                )}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
                By submitting, you agree to be contacted about this application
            </p>
        </form>
    )
}

// Helper function to send notifications
async function sendNotifications(data: {
    appName: string
    email: string
    phone?: string
}) {
    // This will call an API route that handles notifications
    const response = await fetch('/api/notify', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })

    if (!response.ok) {
        throw new Error('Failed to send notifications')
    }
}
