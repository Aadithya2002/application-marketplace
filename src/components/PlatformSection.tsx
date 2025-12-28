'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

// Device component with image and centered logo - static display, scales on hover
interface DeviceProps {
    frameSrc: string
    logoSrc: string
    logoAlt: string
    frameWidth: number
    frameHeight: number
    logoSize: number
    isLaptop?: boolean
    isAndroid?: boolean
}

const DeviceMockup = ({ frameSrc, logoSrc, logoAlt, frameWidth, frameHeight, logoSize, isLaptop = false, isAndroid = false }: DeviceProps) => (
    <div className="relative flex items-center justify-center" style={{ width: frameWidth, height: frameHeight }}>
        {/* Device Frame */}
        <Image
            src={frameSrc}
            alt="Device frame"
            fill
            className="object-contain drop-shadow-2xl"
            sizes={`${frameWidth}px`}
        />
        {/* Logo centered inside device screen */}
        <div
            className="absolute inset-0 flex items-center justify-center z-10"
            style={{
                paddingBottom: isLaptop ? '18%' : '0%',
                paddingRight: isAndroid ? '4px' : '0px', // Slight shift to center Android logo
            }}
        >
            <Image
                src={logoSrc}
                alt={logoAlt}
                width={logoSize}
                height={logoSize}
                className="object-contain drop-shadow-xl"
                style={{ maxWidth: logoSize, maxHeight: logoSize }}
            />
        </div>
    </div>
)

const platforms = [
    {
        name: 'iOS',
        description: 'iPhone & iPad',
        gradient: 'from-blue-500 to-purple-500',
        frameSrc: '/devices/iphone-frame.png',
        logoSrc: '/devices/apple-logo.png',
        frameWidth: 160,
        frameHeight: 220,
        logoSize: 55,
        isLaptop: false,
        isAndroid: false,
    },
    {
        name: 'Android',
        description: 'All Android Devices',
        gradient: 'from-green-500 to-teal-500',
        frameSrc: '/devices/android-frame.png',
        logoSrc: '/devices/android-logo.png',
        frameWidth: 180,
        frameHeight: 240,
        logoSize: 70,
        isLaptop: false,
        isAndroid: true,
    },
    {
        name: 'Mac',
        description: 'macOS Applications',
        gradient: 'from-indigo-500 to-violet-500',
        frameSrc: '/devices/macbook-frame.png',
        logoSrc: '/devices/macos-logo.png',
        frameWidth: 280,
        frameHeight: 180,
        logoSize: 100,
        isLaptop: true,
        isAndroid: false,
    },
    {
        name: 'Windows',
        description: 'Windows Desktop',
        gradient: 'from-cyan-500 to-blue-500',
        frameSrc: '/devices/windows-frame.png',
        logoSrc: '/devices/windows-logo.png',
        frameWidth: 300,
        frameHeight: 240,
        logoSize: 100,
        isLaptop: true,
        isAndroid: false,
    },
]

export function PlatformSection() {
    return (
        <section className="py-20 md:py-32 overflow-hidden relative">
            {/* Subtle background gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none" />

            <div className="container mx-auto px-4 md:px-8 relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Available on <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">All Platforms</span>
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Apps can be purchased or migrated for these platforms. Deploy your applications anywhere.
                    </p>
                </motion.div>

                {/* Static Devices Grid - Scale on hover only */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4">
                    {platforms.map((platform) => (
                        <div
                            key={platform.name}
                            className="flex flex-col items-center cursor-pointer group transform hover:scale-110 transition-transform duration-200 ease-out"
                        >
                            {/* Device Mockup - Static, scales on hover */}
                            <div className="relative mb-6 h-64 flex items-center justify-center">
                                <DeviceMockup
                                    frameSrc={platform.frameSrc}
                                    logoSrc={platform.logoSrc}
                                    logoAlt={`${platform.name} logo`}
                                    frameWidth={platform.frameWidth}
                                    frameHeight={platform.frameHeight}
                                    logoSize={platform.logoSize}
                                    isLaptop={platform.isLaptop}
                                    isAndroid={platform.isAndroid}
                                />
                            </div>

                            {/* Platform Info - Below device */}
                            <div className="text-center">
                                <h3 className={`text-xl font-bold mb-1 bg-gradient-to-r ${platform.gradient} bg-clip-text text-transparent`}>
                                    {platform.name}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    {platform.description}
                                </p>

                                {/* Available Badge */}
                                <div className="mt-3 flex justify-center">
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 text-xs font-medium border border-green-500/20">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                        Available
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bottom CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="text-center mt-16"
                >
                    <p className="text-muted-foreground">
                        <span className="font-semibold text-foreground">Need a custom platform?</span> Contact us for enterprise solutions
                    </p>
                </motion.div>
            </div>
        </section>
    )
}
