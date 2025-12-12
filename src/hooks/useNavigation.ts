'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useCallback, useEffect } from 'react'

const STORAGE_KEYS = {
    PREVIOUS_PAGE: 'marketplace_previous_page',
    INTENDED_DESTINATION: 'marketplace_intended_destination',
    SCROLL_POSITION: 'marketplace_scroll_position',
}

export function useNavigation() {
    const router = useRouter()
    const pathname = usePathname()

    // Save current page as previous when navigating
    useEffect(() => {
        // Don't save auth-related pages
        if (pathname && !pathname.includes('/auth')) {
            const current = sessionStorage.getItem(STORAGE_KEYS.PREVIOUS_PAGE)
            if (current !== pathname) {
                sessionStorage.setItem(STORAGE_KEYS.PREVIOUS_PAGE, pathname)
            }
        }
    }, [pathname])

    // Save intended destination (for post-auth redirect)
    const saveIntendedDestination = useCallback((path?: string) => {
        const destination = path || pathname || '/'
        sessionStorage.setItem(STORAGE_KEYS.INTENDED_DESTINATION, destination)
    }, [pathname])

    // Get intended destination
    const getIntendedDestination = useCallback(() => {
        return sessionStorage.getItem(STORAGE_KEYS.INTENDED_DESTINATION) || '/'
    }, [])

    // Clear intended destination
    const clearIntendedDestination = useCallback(() => {
        sessionStorage.removeItem(STORAGE_KEYS.INTENDED_DESTINATION)
    }, [])

    // Go back with fallback
    const goBack = useCallback((fallback: string = '/') => {
        const previousPage = sessionStorage.getItem(STORAGE_KEYS.PREVIOUS_PAGE)

        // Check if we have browser history
        if (window.history.length > 2 && previousPage && previousPage !== pathname) {
            router.back()
        } else {
            router.push(fallback)
        }
    }, [router, pathname])

    // Save scroll position
    const saveScrollPosition = useCallback(() => {
        sessionStorage.setItem(STORAGE_KEYS.SCROLL_POSITION, window.scrollY.toString())
    }, [])

    // Restore scroll position
    const restoreScrollPosition = useCallback(() => {
        const savedPosition = sessionStorage.getItem(STORAGE_KEYS.SCROLL_POSITION)
        if (savedPosition) {
            window.scrollTo(0, parseInt(savedPosition, 10))
            sessionStorage.removeItem(STORAGE_KEYS.SCROLL_POSITION)
        }
    }, [])

    // Navigate to intended destination after auth
    const redirectAfterAuth = useCallback(() => {
        const destination = getIntendedDestination()
        clearIntendedDestination()
        router.push(destination)
    }, [router, getIntendedDestination, clearIntendedDestination])

    return {
        goBack,
        saveIntendedDestination,
        getIntendedDestination,
        clearIntendedDestination,
        saveScrollPosition,
        restoreScrollPosition,
        redirectAfterAuth,
        currentPath: pathname,
    }
}
