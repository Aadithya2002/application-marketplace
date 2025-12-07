'use client'

import { useState, useEffect } from 'react'
import Prism from 'prismjs'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-css'
import 'prismjs/components/prism-json'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-tsx'
import 'prismjs/components/prism-bash'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Copy, Check } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface CodeTabsProps {
    files: {
        fileName: string
        code: string
        language: string
    }[]
}

export function CodeTabs({ files }: CodeTabsProps) {
    const [copied, setCopied] = useState(false)

    useEffect(() => {
        Prism.highlightAll()
    }, [files])

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="w-full rounded-lg border border-border bg-card overflow-hidden shadow-sm">
            <Tabs defaultValue={files[0]?.fileName} className="w-full">
                <div className="flex items-center justify-between px-4 py-2 bg-muted/50 border-b border-border">
                    <TabsList className="bg-transparent p-0 h-auto">
                        {files.map((file) => (
                            <TabsTrigger
                                key={file.fileName}
                                value={file.fileName}
                                className="data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-md px-3 py-1.5 text-sm"
                            >
                                {file.fileName}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </div>
                {files.map((file) => (
                    <TabsContent key={file.fileName} value={file.fileName} className="m-0 relative group">
                        <Button
                            size="icon"
                            variant="ghost"
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 bg-background/50 hover:bg-background"
                            onClick={() => copyToClipboard(file.code)}
                        >
                            {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                        </Button>
                        <div className="max-h-[500px] overflow-auto p-4 bg-[#1e1e1e]">
                            <pre className={`language-${file.language} text-sm`}>
                                <code>{file.code}</code>
                            </pre>
                        </div>
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    )
}
