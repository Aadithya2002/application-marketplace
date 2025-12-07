'use client'

import { AdminForm } from '@/components/AdminForm'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function CreateAppPage() {
    return (
        <div className="min-h-screen p-8 bg-background">
            <div className="max-w-5xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold">Create New App</h1>
                    <p className="text-muted-foreground">Add a new application to the marketplace.</p>
                </div>
                <AdminForm />
            </div>
        </div>
    )
}
