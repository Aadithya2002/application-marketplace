'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, Upload, X } from 'lucide-react'
import Image from 'next/image'
import { toast } from 'sonner'

interface FileUploaderProps {
    bucket: 'thumbnails' | 'workflow_images'
    onUpload: (url: string) => void
    currentUrl?: string
    label: string
}

export function FileUploader({ bucket, onUpload, currentUrl, label }: FileUploaderProps) {
    const [uploading, setUploading] = useState(false)

    const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUploading(true)
            if (!event.target.files || event.target.files.length === 0) {
                throw new Error('You must select an image to upload.')
            }

            const file = event.target.files[0]
            const fileExt = file.name.split('.').pop()
            const fileName = `${Math.random()}.${fileExt}`
            const filePath = `${fileName}`

            const { error: uploadError } = await supabase.storage
                .from(bucket)
                .upload(filePath, file)

            if (uploadError) {
                throw uploadError
            }

            const { data } = supabase.storage
                .from(bucket)
                .getPublicUrl(filePath)

            onUpload(data.publicUrl)
            toast.success('Image uploaded successfully')
        } catch (error: any) {
            toast.error(error.message)
        } finally {
            setUploading(false)
        }
    }

    return (
        <div className="space-y-4">
            <Label>{label}</Label>
            <div className="flex items-center gap-4">
                {currentUrl ? (
                    <div className="relative h-40 w-40 rounded-md overflow-hidden border border-border group">
                        <Image
                            src={currentUrl}
                            alt="Preview"
                            fill
                            className="object-cover"
                        />
                        <Button
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => onUpload('')}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                ) : (
                    <div className="h-40 w-40 rounded-md border border-dashed border-border flex items-center justify-center bg-muted/50">
                        <Upload className="h-8 w-8 text-muted-foreground" />
                    </div>
                )}
                <div className="flex-1">
                    <Input
                        type="file"
                        accept="image/*"
                        onChange={handleUpload}
                        disabled={uploading}
                    />
                    {uploading && (
                        <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Uploading...
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
