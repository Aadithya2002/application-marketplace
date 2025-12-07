'use client'

import { useEffect, useState } from 'react'
import { isValidUrl } from '@/lib/utils'
import { useApp } from '@/hooks/useAppData'
import { useAuth } from '@/hooks/useAuth'
import { AuthModal } from '@/components/AuthModal'
import { ContactForm } from '@/components/ContactForm'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, ArrowLeft, MessageCircle, CreditCard } from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { use } from 'react'

export default function BuyPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const { data: app, isLoading: appLoading, error: appError } = useApp(id)
    const { user, loading: authLoading } = useAuth()
    const [showAuthModal, setShowAuthModal] = useState(false)

    // Show auth modal if user tries to access buy page without being logged in
    useEffect(() => {
        if (!authLoading && !user && !showAuthModal) {
            setShowAuthModal(true)
        }
    }, [authLoading, user, showAuthModal])

    if (appLoading || authLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    if (appError || !app) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-4 text-center">
                <div className="text-destructive text-xl font-semibold">App not found</div>
                <Link href="/">
                    <Button variant="outline">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Marketplace
                    </Button>
                </Link>
            </div>
        )
    }

    return (
        <main className="min-h-screen flex items-center justify-center bg-muted/50 p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <Card className="border-border shadow-xl">
                    <CardHeader className="text-center pb-2">
                        <CardTitle className="text-2xl">Request Access</CardTitle>
                        <CardDescription>
                            Contact our team to get {app.name}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* App Preview */}
                        <div className="flex items-center gap-4 p-4 border rounded-xl bg-background">
                            <div className="relative h-16 w-16 rounded-lg overflow-hidden bg-muted shrink-0">
                                {isValidUrl(app.thumbnail_url) && (
                                    <Image
                                        src={app.thumbnail_url!}
                                        alt={app.name}
                                        fill
                                        className="object-cover"
                                    />
                                )}
                            </div>
                            <div className="min-w-0">
                                <h3 className="font-semibold truncate">{app.name}</h3>
                                <p className="text-lg font-bold text-primary">${app.price}</p>
                            </div>
                        </div>

                        {/* Contact Form or Sign In Prompt */}
                        {user ? (
                            <ContactForm user={user} app={app} />
                        ) : (
                            <div className="space-y-4">
                                <div className="p-6 border border-dashed rounded-xl bg-muted/30 text-center space-y-3">
                                    <MessageCircle className="h-10 w-10 mx-auto text-muted-foreground" />
                                    <h4 className="font-semibold text-lg">Sign in to continue</h4>
                                    <p className="text-sm text-muted-foreground">
                                        Create an account or sign in to request access to this application.
                                    </p>
                                    <Button
                                        onClick={() => setShowAuthModal(true)}
                                        className="w-full mt-2"
                                    >
                                        Sign In
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* Razorpay Notice */}
                        <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 border border-blue-200/50 dark:border-blue-800/50">
                            <div className="flex items-start gap-3">
                                <CreditCard className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                                        Coming Soon: Online Payment
                                    </p>
                                    <p className="text-xs text-blue-700/80 dark:text-blue-300/80 mt-0.5">
                                        Razorpay integration will be available soon for instant purchases.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Back Link */}
                <div className="text-center mt-4">
                    <Link
                        href={`/app/${app.id}`}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                        ← Back to app details
                    </Link>
                </div>
            </motion.div>

            {/* Auth Modal */}
            <AuthModal
                open={showAuthModal}
                onOpenChange={setShowAuthModal}
                redirectTo={`${typeof window !== 'undefined' ? window.location.origin : ''}/buy/${id}`}
            />
        </main>
    )
}
