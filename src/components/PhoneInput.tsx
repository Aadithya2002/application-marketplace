'use client'

import { forwardRef, useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface PhoneInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
    value: string
    onChange: (value: string) => void
    error?: boolean
}

export const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
    ({ value, onChange, error, className, ...props }, ref) => {
        const [inputValue, setInputValue] = useState('')

        // Sync internal state with external value
        useEffect(() => {
            // If value already has +91, strip it for internal state
            if (value.startsWith('+91')) {
                setInputValue(value.slice(3).replace(/\s/g, ''))
            } else {
                setInputValue(value.replace(/\s/g, ''))
            }
        }, [value])

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            // Only allow digits
            const digits = e.target.value.replace(/\D/g, '')

            // Limit to 10 digits
            const limitedDigits = digits.slice(0, 10)

            setInputValue(limitedDigits)

            // Always prepend +91 when calling onChange
            onChange(limitedDigits ? `+91${limitedDigits}` : '')
        }

        const isValidLength = inputValue.length === 10 || inputValue.length === 0

        return (
            <div className="relative">
                <div className={cn(
                    "flex items-center rounded-md border bg-background",
                    error && "border-destructive",
                    !isValidLength && inputValue.length > 0 && "border-yellow-500",
                    className
                )}>
                    {/* Fixed +91 prefix */}
                    <span className="flex items-center px-3 py-2 text-sm text-muted-foreground bg-muted border-r rounded-l-md select-none">
                        +91
                    </span>
                    <Input
                        ref={ref}
                        type="tel"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={inputValue}
                        onChange={handleChange}
                        placeholder="9876543210"
                        className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                        maxLength={10}
                        {...props}
                    />
                </div>
                {inputValue.length > 0 && !isValidLength && (
                    <p className="text-xs text-yellow-600 dark:text-yellow-500 mt-1">
                        Please enter a valid 10-digit mobile number
                    </p>
                )}
            </div>
        )
    }
)

PhoneInput.displayName = 'PhoneInput'
