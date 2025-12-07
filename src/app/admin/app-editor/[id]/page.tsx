'use client'

import { useApp, useAppWorkflow } from '@/hooks/useAppData'
import { AdminForm } from '@/components/AdminForm'
import { Loader2 } from 'lucide-react'

import { use } from 'react'

export default function EditAppPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const { data: app, isLoading: appLoading, error: appError } = useApp(id)
    const { data: workflow, isLoading: workflowLoading } = useAppWorkflow(id)

    if (appLoading || workflowLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    if (appError || !app) {
        return (
            <div className="flex items-center justify-center min-h-screen text-destructive">
                App not found.
            </div>
        )
    }

    return (
        <div className="min-h-screen p-8 bg-background">
            <div className="max-w-5xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold">Edit App: {app.name}</h1>
                    <p className="text-muted-foreground">Update application details and content.</p>
                </div>
                <AdminForm initialApp={app} initialWorkflow={workflow || []} />
            </div>
        </div>
    )
}
