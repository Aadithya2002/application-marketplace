'use client'

import { useState, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { ImagePreviewCard } from '@/components/ImagePreviewCard'
import { Plus, Loader2, ImageIcon } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface ImageGalleryUploaderProps {
    images: string[]
    onImagesChange: (images: string[]) => void
    maxImages?: number
    label?: string
    description?: string
    bucket?: string
}

export function ImageGalleryUploader({
    images,
    onImagesChange,
    maxImages = 6,
    label = 'Application Screenshots',
    description = 'Upload screenshots of your application. First image will be used as hero.',
    bucket = 'thumbnails',
}: ImageGalleryUploaderProps) {
    const [uploading, setUploading] = useState(false)
    const [uploadingIndex, setUploadingIndex] = useState<number | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const replaceInputRef = useRef<HTMLInputElement>(null)
    const [replaceIndex, setReplaceIndex] = useState<number | null>(null)

    const handleUpload = async (
        event: React.ChangeEvent<HTMLInputElement>,
        replaceAt?: number
    ) => {
        try {
            if (!event.target.files || event.target.files.length === 0) {
                return
            }

            const file = event.target.files[0]
            const fileExt = file.name.split('.').pop()
            const fileName = `gallery_${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${fileExt}`

            setUploading(true)
            if (replaceAt !== undefined) {
                setUploadingIndex(replaceAt)
            }

            const { error: uploadError } = await supabase.storage
                .from(bucket)
                .upload(fileName, file)

            if (uploadError) throw uploadError

            const { data } = supabase.storage.from(bucket).getPublicUrl(fileName)

            if (replaceAt !== undefined) {
                const newImages = [...images]
                newImages[replaceAt] = data.publicUrl
                onImagesChange(newImages)
            } else {
                onImagesChange([...images, data.publicUrl])
            }

            toast.success('Image uploaded successfully')
        } catch (error: any) {
            toast.error(error.message || 'Failed to upload image')
        } finally {
            setUploading(false)
            setUploadingIndex(null)
            setReplaceIndex(null)
            // Reset file inputs
            if (fileInputRef.current) fileInputRef.current.value = ''
            if (replaceInputRef.current) replaceInputRef.current.value = ''
        }
    }

    const handleRemove = (index: number) => {
        const newImages = images.filter((_, i) => i !== index)
        onImagesChange(newImages)
    }

    const triggerReplace = (index: number) => {
        setReplaceIndex(index)
        replaceInputRef.current?.click()
    }

    const canAddMore = images.length < maxImages

    return (
        <div className="space-y-4">
            <div>
                <Label className="text-base font-semibold">{label}</Label>
                <p className="text-sm text-muted-foreground mt-1">{description}</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {images.map((url, index) => (
                    <ImagePreviewCard
                        key={`${url}-${index}`}
                        url={url}
                        alt={`Screenshot ${index + 1}`}
                        onRemove={() => handleRemove(index)}
                        onReplace={() => triggerReplace(index)}
                        isUploading={uploadingIndex === index}
                        size="lg"
                        className="w-full aspect-video"
                    />
                ))}

                {canAddMore && (
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className={cn(
                            'aspect-video w-full rounded-xl border-2 border-dashed border-muted-foreground/25',
                            'bg-muted/30 flex flex-col items-center justify-center gap-2',
                            'hover:border-primary/50 hover:bg-muted/50 transition-all duration-200',
                            'disabled:opacity-50 disabled:cursor-not-allowed'
                        )}
                    >
                        {uploading && uploadingIndex === null ? (
                            <Loader2 className="h-8 w-8 text-muted-foreground animate-spin" />
                        ) : (
                            <>
                                <Plus className="h-8 w-8 text-muted-foreground/50" />
                                <span className="text-sm text-muted-foreground">
                                    Add Screenshot
                                </span>
                            </>
                        )}
                    </button>
                )}
            </div>

            {images.length === 0 && (
                <div className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400">
                    <ImageIcon className="h-4 w-4" />
                    <span>No screenshots uploaded yet. Add at least one screenshot.</span>
                </div>
            )}

            <p className="text-xs text-muted-foreground">
                {images.length}/{maxImages} images uploaded
            </p>

            {/* Hidden file inputs */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => handleUpload(e)}
                className="hidden"
            />
            <input
                ref={replaceInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => handleUpload(e, replaceIndex ?? undefined)}
                className="hidden"
            />
        </div>
    )
}
