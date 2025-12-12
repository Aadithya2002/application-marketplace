'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface Category {
    id: string
    name: string
    icon: string
}

const categories: Category[] = [
    { id: 'all', name: 'All Apps', icon: '🚀' },
    { id: 'ai', name: 'AI / LLM', icon: '🤖' },
    { id: 'health', name: 'Health', icon: '🏥' },
    { id: 'productivity', name: 'Productivity', icon: '📊' },
    { id: 'finance', name: 'Finance', icon: '💰' },
    { id: 'tools', name: 'Tools', icon: '🛠️' },
]

interface CategoryFilterProps {
    selectedCategory: string
    onCategoryChange: (category: string) => void
}

export function CategoryFilter({ selectedCategory, onCategoryChange }: CategoryFilterProps) {
    return (
        <div className="flex flex-wrap items-center gap-2 md:gap-3">
            {categories.map((category) => (
                <motion.button
                    key={category.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onCategoryChange(category.id)}
                    className={cn(
                        'inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all',
                        selectedCategory === category.id
                            ? 'bg-primary text-primary-foreground shadow-md'
                            : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
                    )}
                >
                    <span>{category.icon}</span>
                    <span>{category.name}</span>
                </motion.button>
            ))}
        </div>
    )
}
