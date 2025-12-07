'use client'

import { useState, useMemo } from 'react'
import { Play } from 'lucide-react'

interface YouTubePlayerProps {
    url: string
    className?: string
}

function extractYouTubeId(url: string): string | null {
    const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
        /youtube\.com\/v\/([^&\n?#]+)/,
        /youtube\.com\/shorts\/([^&\n?#]+)/,
    ]

    for (const pattern of patterns) {
        const match = url.match(pattern)
        if (match) return match[1]
    }
    return null
}

export function YouTubePlayer({ url, className }: YouTubePlayerProps) {
    const [isLoaded, setIsLoaded] = useState(false)
    const [showVideo, setShowVideo] = useState(false)

    const videoId = useMemo(() => extractYouTubeId(url), [url])

    if (!videoId) {
        return (
            <div className={`relative w-full rounded-2xl overflow-hidden shadow-2xl bg-muted ${className || ''}`}>
                <div className="relative pt-[56.25%]">
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center p-6">
                            <Play className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <p className="text-muted-foreground">Invalid YouTube URL</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`

    return (
        <div className={`relative w-full rounded-2xl overflow-hidden shadow-2xl ${className || ''}`}>
            {/* Solid black background to prevent any code visibility */}
            <div className="absolute inset-0 bg-black z-0" />

            {/* Aspect ratio container */}
            <div className="relative pt-[56.25%] z-10">
                {!showVideo ? (
                    // Thumbnail with play button
                    <button
                        type="button"
                        onClick={() => setShowVideo(true)}
                        className="absolute inset-0 group cursor-pointer focus:outline-none"
                    >
                        {/* Thumbnail image */}
                        <img
                            src={thumbnailUrl}
                            alt="Video thumbnail"
                            className="absolute inset-0 w-full h-full object-cover"
                            onError={(e) => {
                                // Fallback to lower quality thumbnail
                                (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
                            }}
                        />

                        {/* Play button overlay */}
                        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                            <div className="w-20 h-20 rounded-full bg-red-600 flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-transform">
                                <Play className="h-10 w-10 text-white ml-1" fill="white" />
                            </div>
                        </div>
                    </button>
                ) : (
                    // YouTube iframe
                    <>
                        <iframe
                            src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
                            title="YouTube video player"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                            className="absolute inset-0 w-full h-full z-20"
                            onLoad={() => setIsLoaded(true)}
                        />

                        {/* Loading overlay until iframe loads */}
                        {!isLoaded && (
                            <div className="absolute inset-0 bg-black flex items-center justify-center z-30">
                                <div className="animate-pulse flex flex-col items-center gap-3">
                                    <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                                        <Play className="h-8 w-8 text-primary" />
                                    </div>
                                    <span className="text-sm text-muted-foreground">Loading video...</span>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Decorative border */}
            <div className="absolute inset-0 rounded-2xl ring-1 ring-white/10 pointer-events-none z-40" />
        </div>
    )
}
