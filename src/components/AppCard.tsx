'use client'

import { isValidUrl } from '@/lib/utils'
import { App } from '@/types/app'
import { motion } from 'framer-motion'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'
import { ImageOff, ArrowRight, Eye } from 'lucide-react'

interface AppCardProps {
    app: App
}

export function AppCard({ app }: AppCardProps) {
    return (
        <motion.div
            layoutId={`card-${app.id}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{
                scale: 1.04,
                transition: { duration: 0.3, ease: 'easeOut' }
            }}
            transition={{ duration: 0.4 }}
            className="cursor-pointer group"
        >
            <Card className="overflow-hidden h-full flex flex-col border-border/40 bg-card hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 rounded-2xl">
                {/* Image Container */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
                    {isValidUrl(app.thumbnail_url) ? (
                        <>
                            <Image
                                src={app.thumbnail_url!}
                                alt={app.name}
                                fill
                                className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                            />
                            {/* Gradient overlay on hover */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                            {/* View button on hover */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                    <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2 text-sm font-medium text-foreground shadow-lg">
                                        <Eye className="h-4 w-4" />
                                        View Details
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-muted to-muted/50">
                            <div className="p-4 rounded-full bg-muted-foreground/10">
                                <ImageOff className="h-8 w-8 text-muted-foreground/50" />
                            </div>
                            <div className="text-center px-4">
                                <p className="text-sm font-medium text-muted-foreground">Image not uploaded</p>
                                <p className="text-xs text-muted-foreground/60 mt-1">Please upload a thumbnail</p>
                            </div>
                        </div>
                    )}

                    {/* Price Badge */}
                    <div className="absolute top-3 right-3 z-10">
                        <Badge className="backdrop-blur-md bg-background/90 text-foreground border-0 shadow-lg px-3 py-1.5 text-sm font-bold">
                            ${app.price}
                        </Badge>
                    </div>
                </div>

                {/* Content */}
                <CardContent className="flex-grow p-5">
                    <h3 className="text-lg font-bold tracking-tight mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                        {app.name}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                        {app.short_desc || 'No description available'}
                    </p>

                    {/* Tags */}
                    {app.tags && app.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                            {app.tags.slice(0, 3).map((tag) => (
                                <Badge
                                    key={tag}
                                    variant="secondary"
                                    className="text-xs px-2 py-0.5 bg-secondary/50 hover:bg-secondary/80 transition-colors"
                                >
                                    {tag}
                                </Badge>
                            ))}
                            {app.tags.length > 3 && (
                                <Badge variant="outline" className="text-xs px-2 py-0.5">
                                    +{app.tags.length - 3}
                                </Badge>
                            )}
                        </div>
                    )}
                </CardContent>

                {/* Footer */}
                <CardFooter className="p-5 pt-0">
                    <Link href={`/app/${app.id}`} className="w-full">
                        <Button className="w-full group/btn rounded-xl h-11 font-medium">
                            View Application
                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                        </Button>
                    </Link>
                </CardFooter>
            </Card>
        </motion.div>
    )
}
