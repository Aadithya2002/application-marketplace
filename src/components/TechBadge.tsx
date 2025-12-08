'use client'

import Image from 'next/image'
import { cn } from '@/lib/utils'

interface TechBadgeProps {
    tech: string
    className?: string
}

// Map of technology names to their logos and colors
const techConfig: Record<string, { logo: string; name: string; bgColor: string }> = {
    'react': {
        logo: '/tech-logos/react.svg',
        name: 'React',
        bgColor: 'bg-[#20232A]'
    },
    'next.js': {
        logo: '/tech-logos/nextjs.svg',
        name: 'Next.js',
        bgColor: 'bg-black'
    },
    'nextjs': {
        logo: '/tech-logos/nextjs.svg',
        name: 'Next.js',
        bgColor: 'bg-black'
    },
    'node.js': {
        logo: '/tech-logos/nodejs.svg',
        name: 'Node.js',
        bgColor: 'bg-[#339933]'
    },
    'nodejs': {
        logo: '/tech-logos/nodejs.svg',
        name: 'Node.js',
        bgColor: 'bg-[#339933]'
    },
    'node': {
        logo: '/tech-logos/nodejs.svg',
        name: 'Node.js',
        bgColor: 'bg-[#339933]'
    },
    'express': {
        logo: '/tech-logos/express.svg',
        name: 'Express.js',
        bgColor: 'bg-[#000000]'
    },
    'express.js': {
        logo: '/tech-logos/express.svg',
        name: 'Express.js',
        bgColor: 'bg-[#000000]'
    },
    'expressjs': {
        logo: '/tech-logos/express.svg',
        name: 'Express.js',
        bgColor: 'bg-[#000000]'
    },
    'typescript': {
        logo: '/tech-logos/typescript.svg',
        name: 'TypeScript',
        bgColor: 'bg-[#3178C6]'
    },
    'ts': {
        logo: '/tech-logos/typescript.svg',
        name: 'TypeScript',
        bgColor: 'bg-[#3178C6]'
    },
    'javascript': {
        logo: '/tech-logos/javascript.svg',
        name: 'JavaScript',
        bgColor: 'bg-[#F7DF1E]'
    },
    'js': {
        logo: '/tech-logos/javascript.svg',
        name: 'JavaScript',
        bgColor: 'bg-[#F7DF1E]'
    },
    'tailwind': {
        logo: '/tech-logos/tailwind.svg',
        name: 'Tailwind CSS',
        bgColor: 'bg-[#06B6D4]'
    },
    'tailwindcss': {
        logo: '/tech-logos/tailwind.svg',
        name: 'Tailwind CSS',
        bgColor: 'bg-[#06B6D4]'
    },
    'tailwind css': {
        logo: '/tech-logos/tailwind.svg',
        name: 'Tailwind CSS',
        bgColor: 'bg-[#06B6D4]'
    },
    'supabase': {
        logo: '/tech-logos/supabase.svg',
        name: 'Supabase',
        bgColor: 'bg-[#3ECF8E]'
    },
    'mongodb': {
        logo: '/tech-logos/mongodb.svg',
        name: 'MongoDB',
        bgColor: 'bg-[#47A248]'
    },
    'postgresql': {
        logo: '/tech-logos/postgresql.svg',
        name: 'PostgreSQL',
        bgColor: 'bg-[#4169E1]'
    },
    'postgres': {
        logo: '/tech-logos/postgresql.svg',
        name: 'PostgreSQL',
        bgColor: 'bg-[#4169E1]'
    },
    'python': {
        logo: '/tech-logos/python.svg',
        name: 'Python',
        bgColor: 'bg-[#3776AB]'
    },
    'docker': {
        logo: '/tech-logos/docker.svg',
        name: 'Docker',
        bgColor: 'bg-[#2496ED]'
    },
    'aws': {
        logo: '/tech-logos/aws.svg',
        name: 'AWS',
        bgColor: 'bg-[#FF9900]'
    },
    'vercel': {
        logo: '/tech-logos/vercel.svg',
        name: 'Vercel',
        bgColor: 'bg-black'
    },
    'firebase': {
        logo: '/tech-logos/firebase.svg',
        name: 'Firebase',
        bgColor: 'bg-[#FFCA28]'
    },
    'prisma': {
        logo: '/tech-logos/prisma.svg',
        name: 'Prisma',
        bgColor: 'bg-[#2D3748]'
    },
    'graphql': {
        logo: '/tech-logos/graphql.svg',
        name: 'GraphQL',
        bgColor: 'bg-[#E10098]'
    },
    'redis': {
        logo: '/tech-logos/redis.svg',
        name: 'Redis',
        bgColor: 'bg-[#DC382D]'
    },
    'github': {
        logo: '/tech-logos/github.svg',
        name: 'GitHub',
        bgColor: 'bg-[#181717]'
    },
}

// Fallback icons for technologies without logos
const fallbackIcons: Record<string, string> = {
    'react': '⚛️',
    'next.js': '▲',
    'nextjs': '▲',
    'node.js': '⬢',
    'nodejs': '⬢',
    'node': '⬢',
    'typescript': 'TS',
    'ts': 'TS',
    'javascript': 'JS',
    'js': 'JS',
    'tailwind': '🌊',
    'tailwindcss': '🌊',
    'supabase': '⚡',
    'mongodb': '🍃',
    'postgresql': '🐘',
    'postgres': '🐘',
    'python': '🐍',
    'docker': '🐳',
    'aws': '☁️',
    'firebase': '🔥',
    'prisma': '◮',
    'graphql': '◈',
    'redis': '◉',
}

export function TechBadge({ tech, className }: TechBadgeProps) {
    const normalizedTech = tech.toLowerCase().trim()
    const config = techConfig[normalizedTech]
    const fallbackIcon = fallbackIcons[normalizedTech] || tech.charAt(0).toUpperCase()

    return (
        <div
            className={cn(
                'inline-flex items-center gap-2 px-4 py-2 rounded-xl transition-all hover:scale-105',
                config?.bgColor || 'bg-muted',
                'text-white font-medium text-sm shadow-md',
                className
            )}
            title={config?.name || tech}
        >
            {config ? (
                <div className="relative w-6 h-6">
                    <Image
                        src={config.logo}
                        alt={config.name}
                        fill
                        className="object-contain"
                        onError={(e) => {
                            // Fallback to icon if logo fails to load
                            e.currentTarget.style.display = 'none'
                        }}
                    />
                </div>
            ) : (
                <span className="text-lg">{fallbackIcon}</span>
            )}
            <span>{config?.name || tech}</span>
        </div>
    )
}

interface TechStackProps {
    technologies: string[]
    className?: string
}

export function TechStack({ technologies, className }: TechStackProps) {
    if (!technologies || technologies.length === 0) return null

    return (
        <div className={cn('flex flex-wrap items-center gap-3', className)}>
            {technologies.map((tech) => (
                <TechBadge key={tech} tech={tech} />
            ))}
        </div>
    )
}
