'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { useProfile } from '@/hooks/useProfile'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, User, Mail, Phone, LogOut, ShoppingBag, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Lead } from '@/types/app'
import { useState } from 'react'

export default function ProfilePage() {
    const router = useRouter()
    const { user, loading: authLoading, signOut } = useAuth()
    const { profile, loading: profileLoading } = useProfile()
    const [leads, setLeads] = useState<(Lead & { app_name?: string })[]>([])
    const [leadsLoading, setLeadsLoading] = useState(true)

    // Fetch user's leads
    useEffect(() => {
        if (!user) return

        const fetchLeads = async () => {
            const { data, error } = await supabase
                .from('leads')
                .select('*, apps(name)')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })

            if (!error && data) {
                setLeads(data.map(lead => ({
                    ...lead,
                    app_name: lead.apps?.name
                })))
            }
            setLeadsLoading(false)
        }

        fetchLeads()
    }, [user])

    // Redirect to home if not authenticated
    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/')
        }
    }, [authLoading, user, router])

    const handleLogout = async () => {
        try {
            await signOut()
            toast.success('Logged out successfully')
            router.push('/')
        } catch (error) {
            toast.error('Failed to log out')
        }
    }

    if (authLoading || profileLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    if (!user) return null

    return (
        <main className="min-h-screen bg-background">
            <div className="container mx-auto px-4 md:px-8 py-8 max-w-4xl">
                {/* Back link */}
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Marketplace
                </Link>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Profile Card */}
                    <Card className="mb-8">
                        <CardHeader>
                            <div className="flex items-center gap-4">
                                <div className="h-16 w-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold">
                                    {profile?.full_name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || '?'}
                                </div>
                                <div>
                                    <CardTitle className="text-2xl">
                                        {profile?.full_name || 'User'}
                                    </CardTitle>
                                    <CardDescription>Manage your profile and requests</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                                <Mail className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Email</p>
                                    <p className="font-medium">{user.email}</p>
                                </div>
                            </div>

                            <Button
                                variant="destructive"
                                onClick={handleLogout}
                                className="w-full sm:w-auto gap-2"
                            >
                                <LogOut className="h-4 w-4" />
                                Log out
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Requests Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <ShoppingBag className="h-5 w-5" />
                                Your Requests
                            </CardTitle>
                            <CardDescription>
                                Applications you've expressed interest in
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {leadsLoading ? (
                                <div className="flex items-center justify-center py-8">
                                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                                </div>
                            ) : leads.length === 0 ? (
                                <div className="text-center py-8">
                                    <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                    <p className="text-muted-foreground">No requests yet</p>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        Browse the marketplace and request access to applications
                                    </p>
                                    <Link href="/">
                                        <Button variant="outline" className="mt-4">
                                            Browse Applications
                                        </Button>
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {leads.map((lead) => (
                                        <div
                                            key={lead.id}
                                            className="flex items-center justify-between p-4 rounded-lg bg-muted/50"
                                        >
                                            <div>
                                                <p className="font-medium">{lead.app_name || 'Unknown App'}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    Requested {new Date(lead.created_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div className="text-xs px-2 py-1 rounded-full bg-yellow-500/10 text-yellow-600 dark:text-yellow-400">
                                                Pending
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </main>
    )
}
