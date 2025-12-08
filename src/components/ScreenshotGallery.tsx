'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Card, CardContent } from '@/components/ui/card'
import { ImageOff, ChevronLeft, ChevronRight, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ScreenshotGalleryProps {
    images: string[]
    appName?: string
}

export function ScreenshotGallery({ images, appName = 'Application' }: ScreenshotGalleryProps) {
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

    if (!images || images.length === 0) {
        return (
            <Card className="border-dashed">
                <CardContent className="py-12 text-center">
                    <ImageOff className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Screenshots Available</h3>
                    <p className="text-muted-foreground">
                        Screenshots have not been uploaded for this application.
                    </p>
                </CardContent>
            </Card>
        )
    }

    const openLightbox = (index: number) => setSelectedIndex(index)
    const closeLightbox = () => setSelectedIndex(null)

    const goToPrevious = () => {
        if (selectedIndex !== null) {
            setSelectedIndex(selectedIndex === 0 ? images.length - 1 : selectedIndex - 1)
        }
    }

    const goToNext = () => {
        if (selectedIndex !== null) {
            setSelectedIndex(selectedIndex === images.length - 1 ? 0 : selectedIndex + 1)
        }
    }

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {images.map((imageUrl, index) => (
                    <motion.div
                        key={index}
                        whileHover={{ scale: 1.02 }}
                        onClick={() => openLightbox(index)}
                        className="relative aspect-video rounded-xl overflow-hidden cursor-pointer group shadow-md hover:shadow-xl transition-shadow bg-muted"
                    >
                        <Image
                            src={imageUrl}
                            alt={`${appName} screenshot ${index + 1}`}
                            fill
                            className="object-contain transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-medium">
                                Click to expand
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Lightbox Modal */}
            <Dialog open={selectedIndex !== null} onOpenChange={closeLightbox}>
                <DialogContent className="max-w-6xl max-h-[95vh] p-0 overflow-hidden bg-black/95">
                    <DialogTitle className="sr-only">
                        {appName} Screenshot {selectedIndex !== null ? selectedIndex + 1 : ''}
                    </DialogTitle>

                    {selectedIndex !== null && (
                        <div className="relative w-full h-[90vh] flex items-center justify-center">
                            {/* Close button */}
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute top-4 right-4 z-10 text-white hover:bg-white/20"
                                onClick={closeLightbox}
                            >
                                <X className="h-6 w-6" />
                            </Button>

                            {/* Navigation arrows */}
                            {images.length > 1 && (
                                <>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="absolute left-4 z-10 text-white hover:bg-white/20 h-12 w-12"
                                        onClick={goToPrevious}
                                    >
                                        <ChevronLeft className="h-8 w-8" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="absolute right-4 z-10 text-white hover:bg-white/20 h-12 w-12"
                                        onClick={goToNext}
                                    >
                                        <ChevronRight className="h-8 w-8" />
                                    </Button>
                                </>
                            )}

                            {/* Image */}
                            <div className="relative w-full h-full p-8">
                                <Image
                                    src={images[selectedIndex]}
                                    alt={`${appName} screenshot ${selectedIndex + 1}`}
                                    fill
                                    className="object-contain"
                                />
                            </div>

                            {/* Counter */}
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/80 text-sm">
                                {selectedIndex + 1} / {images.length}
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    )
}
