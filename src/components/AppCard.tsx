'use client'

import { isValidUrl } from '@/lib/utils'
import { App } from '@/types/app'
import { motion } from 'framer-motion'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'
import { ImageOff, ArrowRight } from 'lucide-react'

interface AppCardProps {
    app: App
}

export function AppCard({ app }: AppCardProps) {
    return (
        <Link href={`/app/${app.id}`} className="block">
            <motion.div
                layoutId={`card-${app.id}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{
                    scale: 1.02,
                    transition: { duration: 0.3, ease: 'easeOut' }
                }}
                transition={{ duration: 0.4 }}
                className="cursor-pointer group h-full"
            >
                <Card className="overflow-hidden h-full flex flex-col border-border/40 bg-card hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 rounded-2xl">
                    {/* Image Container */}
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
                        {isValidUrl(app.thumbnail_url) ? (
                            <>
                                <Image
                                    src={app.thumbnail_url!}
                                    alt={app.name}
                                    fill
                                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                                />
                                {/* Gradient overlay on hover */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </>
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-muted to-muted/50">
                                <div className="p-4 rounded-full bg-muted-foreground/10">
                                    <ImageOff className="h-8 w-8 text-muted-foreground/50" />
                                </div>
                                <div className="text-center px-4">
                                    <p className="text-sm font-medium text-muted-foreground">Image not uploaded</p>
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
                        <p className="text-sm text-muted-foreground line-clamp-3">
                            {app.short_desc || 'No description available'}
                        </p>
                    </CardContent>

                    {/* Footer */}
                    <CardFooter className="p-5 pt-0">
                        <Button className="w-full group/btn rounded-xl h-11 font-medium">
                            View Application
                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                        </Button>
                    </CardFooter>
                </Card>
            </motion.div>
        </Link>
    )
}

