'use client'

import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { User, Session } from '@supabase/supabase-js'

interface AuthState {
    user: User | null
    session: Session | null
    loading: boolean
}

export function useAuth() {
    const [authState, setAuthState] = useState<AuthState>({
        user: null,
        session: null,
        loading: true,
    })

    useEffect(() => {
        // Get initial session
        const getInitialSession = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            setAuthState({
                user: session?.user ?? null,
                session,
                loading: false,
            })
        }

        getInitialSession()

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                setAuthState({
                    user: session?.user ?? null,
                    session,
                    loading: false,
                })
            }
        )

        return () => {
            subscription.unsubscribe()
        }
    }, [])

    const signInWithGoogle = useCallback(async (redirectTo?: string) => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: redirectTo || `${window.location.origin}/auth/callback`,
            },
        })
        if (error) throw error
    }, [])

    const signInWithEmail = useCallback(async (email: string, redirectTo?: string) => {
        const { error } = await supabase.auth.signInWithOtp({
            email,
            options: {
                emailRedirectTo: redirectTo || `${window.location.origin}/auth/callback`,
            },
        })
        if (error) throw error
    }, [])

    const signOut = useCallback(async () => {
        const { error } = await supabase.auth.signOut()
        if (error) throw error
    }, [])

    return {
        user: authState.user,
        session: authState.session,
        loading: authState.loading,
        signInWithGoogle,
        signInWithEmail,
        signOut,
    }
}
