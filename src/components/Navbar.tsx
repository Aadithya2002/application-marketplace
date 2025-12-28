'use client'

import Link from 'next/link'
import { ProfileDropdown } from '@/components/ProfileDropdown'
import { NameEntryModal } from '@/components/NameEntryModal'
import { useProfile } from '@/hooks/useProfile'
import { useAuth } from '@/hooks/useAuth'

export function Navbar() {
    const { user } = useAuth()
    const { needsName, updateProfile, loading } = useProfile()

    // Only show name modal when user is logged in AND needs a name
    const showNameModal = !loading && !!user && needsName

    return (
        <>
            <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/50">
                <div className="container mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="hover:opacity-80 transition-opacity">
                        <span className="font-bold text-xl bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">APPTZO</span>
                    </Link>

                    {/* Profile */}
                    <ProfileDropdown />
                </div>
            </nav>

            {/* Name Entry Modal - shown after OAuth if name not set */}
            <NameEntryModal
                open={showNameModal}
                onComplete={updateProfile}
            />
        </>
    )
}
