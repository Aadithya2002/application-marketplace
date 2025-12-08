'use client'

import { cn } from '@/lib/utils'

interface TechBadgeProps {
    tech: string
    className?: string
}

// Map of technology names to their icons/colors
const techConfig: Record<string, { icon: string; color: string; bgColor: string }> = {
    'react': { icon: '⚛️', color: 'text-cyan-500', bgColor: 'bg-cyan-500/10' },
    'next.js': { icon: '▲', color: 'text-foreground', bgColor: 'bg-foreground/10' },
    'nextjs': { icon: '▲', color: 'text-foreground', bgColor: 'bg-foreground/10' },
    'node.js': { icon: '⬢', color: 'text-green-500', bgColor: 'bg-green-500/10' },
    'nodejs': { icon: '⬢', color: 'text-green-500', bgColor: 'bg-green-500/10' },
    'node': { icon: '⬢', color: 'text-green-500', bgColor: 'bg-green-500/10' },
    'typescript': { icon: 'TS', color: 'text-blue-500', bgColor: 'bg-blue-500/10' },
    'ts': { icon: 'TS', color: 'text-blue-500', bgColor: 'bg-blue-500/10' },
    'javascript': { icon: 'JS', color: 'text-yellow-500', bgColor: 'bg-yellow-500/10' },
    'js': { icon: 'JS', color: 'text-yellow-500', bgColor: 'bg-yellow-500/10' },
    'tailwind': { icon: '🌊', color: 'text-cyan-400', bgColor: 'bg-cyan-400/10' },
    'tailwindcss': { icon: '🌊', color: 'text-cyan-400', bgColor: 'bg-cyan-400/10' },
    'supabase': { icon: '⚡', color: 'text-emerald-500', bgColor: 'bg-emerald-500/10' },
    'prisma': { icon: '◮', color: 'text-indigo-500', bgColor: 'bg-indigo-500/10' },
    'mongodb': { icon: '🍃', color: 'text-green-600', bgColor: 'bg-green-600/10' },
    'postgresql': { icon: '🐘', color: 'text-blue-600', bgColor: 'bg-blue-600/10' },
    'postgres': { icon: '🐘', color: 'text-blue-600', bgColor: 'bg-blue-600/10' },
    'python': { icon: '🐍', color: 'text-yellow-500', bgColor: 'bg-yellow-500/10' },
    'docker': { icon: '🐳', color: 'text-blue-500', bgColor: 'bg-blue-500/10' },
    'aws': { icon: '☁️', color: 'text-orange-500', bgColor: 'bg-orange-500/10' },
    'vercel': { icon: '▲', color: 'text-foreground', bgColor: 'bg-foreground/10' },
    'firebase': { icon: '🔥', color: 'text-orange-500', bgColor: 'bg-orange-500/10' },
    'graphql': { icon: '◈', color: 'text-pink-500', bgColor: 'bg-pink-500/10' },
    'redis': { icon: '◉', color: 'text-red-500', bgColor: 'bg-red-500/10' },
    'stripe': { icon: '💳', color: 'text-purple-500', bgColor: 'bg-purple-500/10' },
}

const getDefaultConfig = (tech: string) => ({
    icon: tech.charAt(0).toUpperCase(),
    color: 'text-muted-foreground',
    bgColor: 'bg-muted',
})

export function TechBadge({ tech, className }: TechBadgeProps) {
    const normalizedTech = tech.toLowerCase().trim()
    const config = techConfig[normalizedTech] || getDefaultConfig(tech)

    return (
        <div
            className={cn(
                'inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold transition-transform hover:scale-110',
                config.bgColor,
                config.color,
                className
            )}
            title={tech}
        >
            {config.icon}
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
        <div className={cn('flex flex-wrap items-center gap-2', className)}>
            {technologies.map((tech) => (
                <TechBadge key={tech} tech={tech} />
            ))}
        </div>
    )
}
