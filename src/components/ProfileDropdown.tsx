'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { useProfile } from '@/hooks/useProfile'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { AuthModal } from '@/components/AuthModal'
import { User, LogOut, ShoppingBag, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export function ProfileDropdown() {
    const router = useRouter()
    const { user, signOut, loading: authLoading } = useAuth()
    const { profile, loading: profileLoading } = useProfile()
    const [showAuthModal, setShowAuthModal] = useState(false)

    const loading = authLoading || profileLoading

    const handleLogout = async () => {
        try {
            await signOut()
            toast.success('Logged out successfully')
            router.push('/')
        } catch (error) {
            toast.error('Failed to log out')
        }
    }

    const getInitial = () => {
        if (profile?.full_name) {
            return profile.full_name.charAt(0).toUpperCase()
        }
        if (user?.email) {
            return user.email.charAt(0).toUpperCase()
        }
        return '?'
    }

    if (loading) {
        return (
            <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </div>
        )
    }

    if (!user) {
        return (
            <>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAuthModal(true)}
                    className="gap-2"
                >
                    <User className="h-4 w-4" />
                    Sign In
                </Button>
                <AuthModal
                    open={showAuthModal}
                    onOpenChange={setShowAuthModal}
                />
            </>
        )
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                    {getInitial()}
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">{profile?.full_name || 'User'}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push('/profile')}>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/profile')}>
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    My Requests
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
