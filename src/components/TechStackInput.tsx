'use client'

import { useState, KeyboardEvent } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { X, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TechStackInputProps {
    value: string[]
    onChange: (value: string[]) => void
    label?: string
    description?: string
    placeholder?: string
    suggestions?: string[]
}

const defaultSuggestions = [
    'React',
    'Next.js',
    'Node.js',
    'TypeScript',
    'JavaScript',
    'Python',
    'FastAPI',
    'Express.js',
    'PostgreSQL',
    'MongoDB',
    'Redis',
    'Tailwind CSS',
    'Prisma',
    'Supabase',
    'Firebase',
    'AWS',
    'Docker',
    'GraphQL',
    'REST API',
    'WebSocket',
]

export function TechStackInput({
    value,
    onChange,
    label = 'Tech Stack',
    description = 'Add the technologies used in this application',
    placeholder = 'Type and press Enter to add...',
    suggestions = defaultSuggestions,
}: TechStackInputProps) {
    const [inputValue, setInputValue] = useState('')
    const [showSuggestions, setShowSuggestions] = useState(false)

    const filteredSuggestions = suggestions.filter(
        (s) =>
            s.toLowerCase().includes(inputValue.toLowerCase()) &&
            !value.includes(s)
    )

    const addTech = (tech: string) => {
        const trimmed = tech.trim()
        if (trimmed && !value.includes(trimmed)) {
            onChange([...value, trimmed])
        }
        setInputValue('')
        setShowSuggestions(false)
    }

    const removeTech = (tech: string) => {
        onChange(value.filter((t) => t !== tech))
    }

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            if (inputValue.trim()) {
                addTech(inputValue)
            }
        } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
            removeTech(value[value.length - 1])
        }
    }

    return (
        <div className="space-y-3">
            <div>
                <Label className="text-base font-semibold">{label}</Label>
                <p className="text-sm text-muted-foreground mt-1">{description}</p>
            </div>

            {/* Current tags */}
            {value.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {value.map((tech) => (
                        <Badge
                            key={tech}
                            variant="secondary"
                            className="px-3 py-1.5 text-sm gap-1.5 hover:bg-secondary/80"
                        >
                            {tech}
                            <button
                                type="button"
                                onClick={() => removeTech(tech)}
                                className="hover:text-destructive transition-colors"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </Badge>
                    ))}
                </div>
            )}

            {/* Input with suggestions dropdown */}
            <div className="relative">
                <Input
                    value={inputValue}
                    onChange={(e) => {
                        setInputValue(e.target.value)
                        setShowSuggestions(true)
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    className="pr-10"
                />
                <button
                    type="button"
                    onClick={() => inputValue && addTech(inputValue)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded"
                >
                    <Plus className="h-4 w-4 text-muted-foreground" />
                </button>

                {/* Suggestions dropdown */}
                {showSuggestions && filteredSuggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
                        {filteredSuggestions.slice(0, 8).map((suggestion) => (
                            <button
                                key={suggestion}
                                type="button"
                                onClick={() => addTech(suggestion)}
                                className="w-full px-3 py-2 text-left text-sm hover:bg-muted transition-colors first:rounded-t-lg last:rounded-b-lg"
                            >
                                {suggestion}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {value.length === 0 && (
                <p className="text-xs text-amber-600 dark:text-amber-400">
                    Add at least one technology to your tech stack
                </p>
            )}
        </div>
    )
}
