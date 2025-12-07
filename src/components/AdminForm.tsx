'use client'

import { useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { App, WorkflowStep, ValidationErrors } from '@/types/app'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ValidationAlert } from '@/components/ValidationAlert'
import { ImageGalleryUploader } from '@/components/ImageGalleryUploader'
import { TechStackInput } from '@/components/TechStackInput'
import { ImagePreviewCard } from '@/components/ImagePreviewCard'
import { WorkflowEditor } from '@/components/WorkflowEditor'
import { toast } from 'sonner'
import {
    Loader2, Save, ArrowLeft, FileText, Image as ImageIcon,
    Code, Workflow, Youtube, DollarSign, Tag, Layers,
    CheckCircle2, AlertCircle, HelpCircle
} from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

interface AdminFormProps {
    initialApp?: App
    initialWorkflow?: WorkflowStep[]
}

interface FieldWrapperProps {
    label: string
    description?: string
    example?: string
    required?: boolean
    error?: string
    icon?: React.ReactNode
    children: React.ReactNode
    id?: string
}

function FieldWrapper({ label, description, example, required, error, icon, children, id }: FieldWrapperProps) {
    return (
        <div className="space-y-2" id={id}>
            <div className="flex items-center gap-2">
                {icon && <span className="text-muted-foreground">{icon}</span>}
                <Label className="text-base font-semibold">
                    {label}
                    {required && <span className="text-destructive ml-1">*</span>}
                </Label>
            </div>
            {description && (
                <p className="text-sm text-muted-foreground">{description}</p>
            )}
            {children}
            {example && !error && (
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <HelpCircle className="h-3 w-3" />
                    Example: {example}
                </p>
            )}
            {error && (
                <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {error}
                </p>
            )}
        </div>
    )
}

export function AdminForm({ initialApp, initialWorkflow = [] }: AdminFormProps) {
    const router = useRouter()
    const queryClient = useQueryClient()
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState<ValidationErrors>({})
    const [hasValidated, setHasValidated] = useState(false)
    const thumbnailInputRef = useRef<HTMLInputElement>(null)

    const [appData, setAppData] = useState<Partial<App>>(
        initialApp || {
            name: '',
            short_desc: '',
            full_desc: '',
            price: 0,
            tags: [],
            youtube_url: '',
            frontend_code: '',
            backend_code: '',
            config_code: '',
            folder_structure: '',
            thumbnail_url: '',
            tech_stack: [],
            gallery_images: [],
        }
    )

    const [workflowSteps, setWorkflowSteps] = useState<WorkflowStep[]>(initialWorkflow)

    const validate = useCallback((): boolean => {
        const newErrors: ValidationErrors = {}

        if (!appData.name?.trim()) {
            newErrors.name = 'App name is required'
        }

        if (!appData.short_desc?.trim()) {
            newErrors.short_desc = 'Short description is required'
        }

        if (!appData.full_desc?.trim()) {
            newErrors.full_desc = 'Full description is required'
        }

        if (!appData.price || appData.price <= 0) {
            newErrors.price = 'Price must be greater than 0'
        }

        if (!appData.thumbnail_url) {
            newErrors.thumbnail = 'Thumbnail image is required'
        }

        if (!appData.gallery_images || appData.gallery_images.length === 0) {
            newErrors.gallery = 'At least one application screenshot is required'
        }

        if (!appData.youtube_url?.trim()) {
            newErrors.youtube = 'YouTube demo link is required'
        }

        if (!appData.tech_stack || appData.tech_stack.length === 0) {
            newErrors.tech_stack = 'At least one tech stack item is required'
        }

        if (workflowSteps.length === 0) {
            newErrors.workflow = 'At least one workflow step is required'
        }

        setErrors(newErrors)
        setHasValidated(true)
        return Object.keys(newErrors).length === 0
    }, [appData, workflowSteps])

    const handleThumbnailUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            if (!event.target.files || event.target.files.length === 0) {
                return
            }

            const file = event.target.files[0]
            const fileExt = file.name.split('.').pop()
            const fileName = `thumbnail_${Date.now()}.${fileExt}`

            const { error: uploadError } = await supabase.storage
                .from('thumbnails')
                .upload(fileName, file)

            if (uploadError) throw uploadError

            const { data } = supabase.storage.from('thumbnails').getPublicUrl(fileName)
            setAppData({ ...appData, thumbnail_url: data.publicUrl })
            toast.success('Thumbnail uploaded successfully')
        } catch (error: any) {
            toast.error(error.message || 'Failed to upload thumbnail')
        }
    }

    const handleSave = async () => {
        if (!validate()) {
            toast.error('Please fix all validation errors before saving')
            return
        }

        try {
            setLoading(true)

            // 1. Save App Data
            const { data: savedApp, error: appError } = await supabase
                .from('apps')
                .upsert({
                    ...appData,
                    id: initialApp?.id,
                })
                .select()
                .single()

            if (appError) throw appError

            // 2. Save Workflow Steps
            if (initialApp?.id) {
                await supabase.from('workflow_steps').delete().eq('app_id', initialApp.id)
            }

            const stepsToInsert = workflowSteps.map((step, index) => ({
                app_id: savedApp.id,
                step_number: index + 1,
                title: step.title,
                description: step.description,
                image_url: step.image_url,
            }))

            if (stepsToInsert.length > 0) {
                const { error: workflowError } = await supabase
                    .from('workflow_steps')
                    .insert(stepsToInsert)

                if (workflowError) throw workflowError
            }

            toast.success('Application saved successfully!')
            queryClient.invalidateQueries({ queryKey: ['apps'] })
            queryClient.invalidateQueries({ queryKey: ['app', savedApp.id] })
            router.push('/admin')
        } catch (error: any) {
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    const handleJumpToField = (field: keyof ValidationErrors) => {
        const element = document.getElementById(`field-${field}`)
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
    }

    const getTabStatus = (tab: string): 'complete' | 'error' | 'default' => {
        if (!hasValidated) return 'default'

        switch (tab) {
            case 'details':
                if (errors.name || errors.short_desc || errors.full_desc || errors.price || errors.tech_stack) {
                    return 'error'
                }
                if (appData.name && appData.short_desc && appData.full_desc && appData.price && appData.tech_stack?.length) {
                    return 'complete'
                }
                return 'default'
            case 'media':
                if (errors.thumbnail || errors.gallery || errors.youtube) {
                    return 'error'
                }
                if (appData.thumbnail_url && appData.gallery_images?.length && appData.youtube_url) {
                    return 'complete'
                }
                return 'default'
            case 'code':
                return appData.frontend_code || appData.backend_code ? 'complete' : 'default'
            case 'workflow':
                if (errors.workflow) return 'error'
                if (workflowSteps.length > 0) return 'complete'
                return 'default'
            default:
                return 'default'
        }
    }

    const TabIndicator = ({ status }: { status: 'complete' | 'error' | 'default' }) => {
        if (status === 'complete') {
            return <CheckCircle2 className="h-4 w-4 text-green-500" />
        }
        if (status === 'error') {
            return <AlertCircle className="h-4 w-4 text-destructive" />
        }
        return null
    }

    return (
        <div className="space-y-6 pb-20">
            {/* Header */}
            <div className="flex items-center justify-between">
                <Link href="/admin">
                    <Button variant="ghost">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Dashboard
                    </Button>
                </Link>
                <div className="flex items-center gap-3">
                    <Button variant="outline" onClick={validate}>
                        Validate
                    </Button>
                    <Button onClick={handleSave} disabled={loading}>
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                        Save Application
                    </Button>
                </div>
            </div>

            {/* Validation Alert */}
            <ValidationAlert errors={errors} onJumpToField={handleJumpToField} />

            {/* Section Header */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-8"
            >
                <h1 className="text-3xl font-bold mb-2">
                    {initialApp ? 'Edit Application' : 'Add New Application'}
                </h1>
                <p className="text-muted-foreground">
                    Fill in all required fields to list your application in the marketplace
                </p>
            </motion.div>

            <Tabs defaultValue="details" className="w-full">
                <TabsList className="w-full justify-start mb-6 h-auto p-1 bg-muted/50">
                    <TabsTrigger value="details" className="px-6 py-3 gap-2">
                        <FileText className="h-4 w-4" />
                        Basic Details
                        <TabIndicator status={getTabStatus('details')} />
                    </TabsTrigger>
                    <TabsTrigger value="media" className="px-6 py-3 gap-2">
                        <ImageIcon className="h-4 w-4" />
                        Media & Assets
                        <TabIndicator status={getTabStatus('media')} />
                    </TabsTrigger>
                    <TabsTrigger value="code" className="px-6 py-3 gap-2">
                        <Code className="h-4 w-4" />
                        Code Snippets
                        <TabIndicator status={getTabStatus('code')} />
                    </TabsTrigger>
                    <TabsTrigger value="workflow" className="px-6 py-3 gap-2">
                        <Workflow className="h-4 w-4" />
                        Workflow Builder
                        <TabIndicator status={getTabStatus('workflow')} />
                    </TabsTrigger>
                </TabsList>

                {/* Basic Details Tab */}
                <TabsContent value="details" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="h-5 w-5" />
                                Application Information
                            </CardTitle>
                            <CardDescription>
                                Provide the core details about your application
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FieldWrapper
                                    id="field-name"
                                    label="Application Name"
                                    description="A clear, descriptive name for your application"
                                    example="AI Dashboard Pro, E-commerce Starter Kit"
                                    required
                                    error={errors.name}
                                    icon={<Tag className="h-4 w-4" />}
                                >
                                    <Input
                                        value={appData.name}
                                        onChange={(e) => setAppData({ ...appData, name: e.target.value })}
                                        placeholder="Enter application name..."
                                        className={errors.name ? 'border-destructive' : ''}
                                    />
                                </FieldWrapper>

                                <FieldWrapper
                                    id="field-price"
                                    label="Price (USD)"
                                    description="Set a competitive price for your application"
                                    example="$49, $99, $199"
                                    required
                                    error={errors.price}
                                    icon={<DollarSign className="h-4 w-4" />}
                                >
                                    <Input
                                        type="number"
                                        min="0"
                                        step="1"
                                        value={appData.price}
                                        onChange={(e) => setAppData({ ...appData, price: Number(e.target.value) })}
                                        placeholder="49"
                                        className={errors.price ? 'border-destructive' : ''}
                                    />
                                </FieldWrapper>
                            </div>

                            <FieldWrapper
                                id="field-short_desc"
                                label="Short Description"
                                description="A brief one-liner that appears on the marketplace card"
                                example="A modern dashboard template with AI-powered analytics"
                                required
                                error={errors.short_desc}
                            >
                                <Input
                                    value={appData.short_desc}
                                    onChange={(e) => setAppData({ ...appData, short_desc: e.target.value })}
                                    placeholder="Enter a brief description..."
                                    maxLength={120}
                                    className={errors.short_desc ? 'border-destructive' : ''}
                                />
                                <p className="text-xs text-muted-foreground text-right">
                                    {appData.short_desc?.length || 0}/120 characters
                                </p>
                            </FieldWrapper>

                            <FieldWrapper
                                id="field-full_desc"
                                label="Full Description"
                                description="Detailed description shown on the application detail page"
                                example="Include features, use cases, and what makes your app unique"
                                required
                                error={errors.full_desc}
                            >
                                <Textarea
                                    className={`min-h-[180px] ${errors.full_desc ? 'border-destructive' : ''}`}
                                    value={appData.full_desc}
                                    onChange={(e) => setAppData({ ...appData, full_desc: e.target.value })}
                                    placeholder="Describe your application in detail..."
                                />
                            </FieldWrapper>

                            <FieldWrapper
                                label="Tags"
                                description="Keywords to help users find your application"
                                example="dashboard, analytics, AI, SaaS"
                            >
                                <Input
                                    value={appData.tags?.join(', ')}
                                    onChange={(e) => setAppData({ ...appData, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })}
                                    placeholder="Enter tags separated by commas..."
                                />
                            </FieldWrapper>

                            <div id="field-tech_stack">
                                <TechStackInput
                                    value={appData.tech_stack || []}
                                    onChange={(tech_stack) => setAppData({ ...appData, tech_stack })}
                                />
                                {errors.tech_stack && (
                                    <p className="text-sm text-destructive flex items-center gap-1 mt-2">
                                        <AlertCircle className="h-3 w-3" />
                                        {errors.tech_stack}
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Media Tab */}
                <TabsContent value="media" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <ImageIcon className="h-5 w-5" />
                                Images & Videos
                            </CardTitle>
                            <CardDescription>
                                Upload compelling visuals to showcase your application
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-8">
                            {/* Thumbnail */}
                            <div id="field-thumbnail">
                                <FieldWrapper
                                    label="App Thumbnail"
                                    description="Main image shown on the marketplace card (recommended 1200x800px)"
                                    required
                                    error={errors.thumbnail}
                                    icon={<ImageIcon className="h-4 w-4" />}
                                >
                                    <div className="flex items-start gap-6 mt-3">
                                        <ImagePreviewCard
                                            url={appData.thumbnail_url}
                                            alt="Thumbnail"
                                            onRemove={() => setAppData({ ...appData, thumbnail_url: '' })}
                                            onReplace={() => thumbnailInputRef.current?.click()}
                                            size="lg"
                                        />
                                        <div className="flex-1 space-y-3">
                                            <input
                                                ref={thumbnailInputRef}
                                                type="file"
                                                accept="image/*"
                                                onChange={handleThumbnailUpload}
                                                className="hidden"
                                            />
                                            <Button
                                                variant="outline"
                                                onClick={() => thumbnailInputRef.current?.click()}
                                            >
                                                {appData.thumbnail_url ? 'Replace Thumbnail' : 'Upload Thumbnail'}
                                            </Button>
                                            <p className="text-xs text-muted-foreground">
                                                Supported formats: JPG, PNG, WebP. Max size: 5MB
                                            </p>
                                        </div>
                                    </div>
                                </FieldWrapper>
                            </div>

                            {/* Gallery */}
                            <div id="field-gallery" className="pt-6 border-t">
                                <ImageGalleryUploader
                                    images={appData.gallery_images || []}
                                    onImagesChange={(gallery_images) => setAppData({ ...appData, gallery_images })}
                                    maxImages={6}
                                    label="Application Screenshots"
                                    description="Upload up to 6 screenshots showcasing your application's features"
                                />
                                {errors.gallery && (
                                    <p className="text-sm text-destructive flex items-center gap-1 mt-2">
                                        <AlertCircle className="h-3 w-3" />
                                        {errors.gallery}
                                    </p>
                                )}
                            </div>

                            {/* YouTube */}
                            <div id="field-youtube" className="pt-6 border-t">
                                <FieldWrapper
                                    label="YouTube Demo Video"
                                    description="Link to a video walkthrough of your application"
                                    example="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                                    required
                                    error={errors.youtube}
                                    icon={<Youtube className="h-4 w-4" />}
                                >
                                    <Input
                                        value={appData.youtube_url || ''}
                                        onChange={(e) => setAppData({ ...appData, youtube_url: e.target.value })}
                                        placeholder="https://www.youtube.com/watch?v=..."
                                        className={errors.youtube ? 'border-destructive' : ''}
                                    />
                                </FieldWrapper>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Code Tab */}
                <TabsContent value="code" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Code className="h-5 w-5" />
                                Code Snippets
                            </CardTitle>
                            <CardDescription>
                                Showcase sample code to give buyers a preview of code quality
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <FieldWrapper
                                label="Frontend Code Sample"
                                description="A compelling code snippet from your frontend"
                                example="React component, Vue template, or Svelte component"
                            >
                                <Textarea
                                    className="font-mono text-xs min-h-[200px]"
                                    value={appData.frontend_code || ''}
                                    onChange={(e) => setAppData({ ...appData, frontend_code: e.target.value })}
                                    placeholder="// Paste your frontend code here..."
                                />
                            </FieldWrapper>

                            <FieldWrapper
                                label="Backend Code Sample"
                                description="API endpoint or server-side logic sample"
                                example="Express route, FastAPI endpoint, or database query"
                            >
                                <Textarea
                                    className="font-mono text-xs min-h-[200px]"
                                    value={appData.backend_code || ''}
                                    onChange={(e) => setAppData({ ...appData, backend_code: e.target.value })}
                                    placeholder="// Paste your backend code here..."
                                />
                            </FieldWrapper>

                            <FieldWrapper
                                label="Configuration Example"
                                description="Environment variables, config files, or setup instructions"
                            >
                                <Textarea
                                    className="font-mono text-xs min-h-[150px]"
                                    value={appData.config_code || ''}
                                    onChange={(e) => setAppData({ ...appData, config_code: e.target.value })}
                                    placeholder="// Environment variables or config..."
                                />
                            </FieldWrapper>

                            <FieldWrapper
                                label="Folder Structure"
                                description="Show the project's file organization"
                                icon={<Layers className="h-4 w-4" />}
                            >
                                <Textarea
                                    className="font-mono text-xs min-h-[150px]"
                                    value={appData.folder_structure || ''}
                                    onChange={(e) => setAppData({ ...appData, folder_structure: e.target.value })}
                                    placeholder="├── src/
│   ├── components/
│   ├── pages/
│   └── utils/
└── package.json"
                                />
                            </FieldWrapper>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Workflow Tab */}
                <TabsContent value="workflow" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Workflow className="h-5 w-5" />
                                Workflow Steps
                            </CardTitle>
                            <CardDescription>
                                Show buyers how your application works step by step.
                                Drag and drop to reorder steps.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div id="field-workflow">
                                <WorkflowEditor steps={workflowSteps} setSteps={setWorkflowSteps} />
                                {errors.workflow && (
                                    <p className="text-sm text-destructive flex items-center gap-1 mt-4">
                                        <AlertCircle className="h-3 w-3" />
                                        {errors.workflow}
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Bottom Save Bar */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border p-4 z-50"
            >
                <div className="container mx-auto flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                        {Object.keys(errors).length > 0 ? (
                            <span className="text-destructive flex items-center gap-1">
                                <AlertCircle className="h-4 w-4" />
                                {Object.keys(errors).length} issue(s) need attention
                            </span>
                        ) : hasValidated ? (
                            <span className="text-green-600 flex items-center gap-1">
                                <CheckCircle2 className="h-4 w-4" />
                                All validations passed
                            </span>
                        ) : (
                            'Fill in required fields to save'
                        )}
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="outline" onClick={validate}>
                            Validate
                        </Button>
                        <Button onClick={handleSave} disabled={loading} size="lg">
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                            Save Application
                        </Button>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}
