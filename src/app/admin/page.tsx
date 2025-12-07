'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useApps } from '@/hooks/useAppData'
import { Button } from '@/components/ui/button'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Loader2, Plus, Pencil, Trash2, LogOut } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import { useQueryClient } from '@tanstack/react-query'

export default function AdminDashboard() {
    const router = useRouter()
    const queryClient = useQueryClient()
    const { data: apps, isLoading } = useApps()
    const [checkingAuth, setCheckingAuth] = useState(true)

    useEffect(() => {
        const checkAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) {
                router.push('/admin/login')
            } else {
                setCheckingAuth(false)
            }
        }
        checkAuth()
    }, [router])

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push('/admin/login')
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this app?')) return

        try {
            const { error } = await supabase.from('apps').delete().eq('id', id)
            if (error) throw error
            toast.success('App deleted successfully')
            queryClient.invalidateQueries({ queryKey: ['apps'] })
        } catch (error: any) {
            toast.error(error.message)
        }
    }

    if (checkingAuth || isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="min-h-screen p-8 bg-background">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                <div className="flex gap-4">
                    <Button variant="outline" onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                    </Button>
                    <Link href="/admin/app-editor">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Add New App
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="border rounded-lg bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Created At</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {apps?.map((app) => (
                            <TableRow key={app.id}>
                                <TableCell className="font-medium">{app.name}</TableCell>
                                <TableCell>${app.price}</TableCell>
                                <TableCell>{new Date(app.created_at).toLocaleDateString()}</TableCell>
                                <TableCell className="text-right space-x-2">
                                    <Link href={`/admin/app-editor/${app.id}`}>
                                        <Button variant="ghost" size="icon">
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                    </Link>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-destructive hover:text-destructive/90"
                                        onClick={() => handleDelete(app.id)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        {apps?.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                    No apps found. Create one to get started.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
