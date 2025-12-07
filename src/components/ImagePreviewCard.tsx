'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { X, ZoomIn, RefreshCw, ImageIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ImagePreviewCardProps {
    url?: string
    alt?: string
    onRemove: () => void
    onReplace: () => void
    isUploading?: boolean
    className?: string
    size?: 'sm' | 'md' | 'lg'
}

const sizeClasses = {
    sm: 'h-24 w-24',
    md: 'h-32 w-32',
    lg: 'h-40 w-40',
}

export function ImagePreviewCard({
    url,
    alt = 'Preview',
    onRemove,
    onReplace,
    isUploading = false,
    className,
    size = 'md',
}: ImagePreviewCardProps) {
    const [isOpen, setIsOpen] = useState(false)

    if (!url) {
        return (
            <div
                className={cn(
                    'rounded-xl border-2 border-dashed border-muted-foreground/25 bg-muted/30 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-primary/50 hover:bg-muted/50 transition-all duration-200',
                    sizeClasses[size],
                    className
                )}
                onClick={onReplace}
            >
                <ImageIcon className="h-8 w-8 text-muted-foreground/50" />
                <span className="text-xs text-muted-foreground">Upload</span>
            </div>
        )
    }

    return (
        <div
            className={cn(
                'relative rounded-xl overflow-hidden border border-border group',
                sizeClasses[size],
                isUploading && 'animate-pulse',
                className
            )}
        >
            <Image
                src={url}
                alt={alt}
                fill
                className="object-cover"
            />

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                        <Button
                            size="icon"
                            variant="secondary"
                            className="h-8 w-8 rounded-full"
                        >
                            <ZoomIn className="h-4 w-4" />
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden">
                        <div className="relative w-full h-[70vh]">
                            <Image
                                src={url}
                                alt={alt}
                                fill
                                className="object-contain"
                            />
                        </div>
                    </DialogContent>
                </Dialog>

                <Button
                    size="icon"
                    variant="secondary"
                    className="h-8 w-8 rounded-full"
                    onClick={(e) => {
                        e.stopPropagation()
                        onReplace()
                    }}
                >
                    <RefreshCw className="h-4 w-4" />
                </Button>

                <Button
                    size="icon"
                    variant="destructive"
                    className="h-8 w-8 rounded-full"
                    onClick={(e) => {
                        e.stopPropagation()
                        onRemove()
                    }}
                >
                    <X className="h-4 w-4" />
                </Button>
            </div>
        </div>
    )
}
