'use client'

import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { Profile } from '@/types/app'
import { useAuth } from '@/hooks/useAuth'

interface ProfileState {
    profile: Profile | null
    loading: boolean
    needsName: boolean
}

export function useProfile() {
    const { user, loading: authLoading } = useAuth()
    const [state, setState] = useState<ProfileState>({
        profile: null,
        loading: true,
        needsName: false,
    })

    // Fetch profile when user changes
    useEffect(() => {
        if (authLoading) return

        if (!user) {
            setState({ profile: null, loading: false, needsName: false })
            return
        }

        const fetchProfile = async () => {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single()

            if (error && error.code !== 'PGRST116') {
                // PGRST116 = no rows returned, which is fine for new users
                console.error('Error fetching profile:', error)
            }

            const profile = data as Profile | null
            setState({
                profile,
                loading: false,
                needsName: !profile?.full_name,
            })
        }

        fetchProfile()
    }, [user, authLoading])

    const updateProfile = useCallback(async (fullName: string) => {
        if (!user) return false

        try {
            const { error } = await supabase
                .from('profiles')
                .upsert({
                    id: user.id,
                    full_name: fullName,
                    updated_at: new Date().toISOString(),
                })

            if (error) throw error

            setState(prev => ({
                ...prev,
                profile: {
                    id: user.id,
                    full_name: fullName,
                    avatar_url: prev.profile?.avatar_url || null,
                    created_at: prev.profile?.created_at || new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                },
                needsName: false,
            }))

            return true
        } catch (error) {
            console.error('Error updating profile:', error)
            return false
        }
    }, [user])

    return {
        profile: state.profile,
        loading: state.loading || authLoading,
        needsName: state.needsName,
        updateProfile,
    }
}
