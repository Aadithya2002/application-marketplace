'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, User } from 'lucide-react'
import { toast } from 'sonner'

interface NameEntryModalProps {
    open: boolean
    onComplete: (name: string) => Promise<boolean>
}

export function NameEntryModal({ open, onComplete }: NameEntryModalProps) {
    const [name, setName] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!name.trim()) {
            toast.error('Please enter your name')
            return
        }

        try {
            setLoading(true)
            const success = await onComplete(name.trim())

            if (success) {
                toast.success('Profile updated successfully!')
            } else {
                toast.error('Failed to save profile')
            }
        } catch (error) {
            toast.error('Something went wrong')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={() => { }}>
            <DialogContent className="sm:max-w-md" onPointerDownOutside={(e) => e.preventDefault()}>
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-center flex items-center justify-center gap-2">
                        <User className="h-6 w-6 text-primary" />
                        Welcome!
                    </DialogTitle>
                    <DialogDescription className="text-center">
                        Please enter your name to complete your profile
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input
                            id="fullName"
                            type="text"
                            placeholder="Enter your full name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            disabled={loading}
                            autoFocus
                            required
                        />
                    </div>

                    <Button
                        type="submit"
                        className="w-full h-12"
                        disabled={loading || !name.trim()}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                                Saving...
                            </>
                        ) : (
                            'Continue'
                        )}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}
