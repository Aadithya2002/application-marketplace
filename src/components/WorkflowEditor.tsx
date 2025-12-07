'use client'

import { useState, useRef } from 'react'
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core'
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { supabase } from '@/lib/supabase'
import { WorkflowStep } from '@/types/app'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { GripVertical, Trash2, Plus, Upload, X, Loader2, ImageIcon } from 'lucide-react'
import { v4 as uuidv4 } from 'uuid'
import { toast } from 'sonner'
import Image from 'next/image'
import { isValidUrl } from '@/lib/utils'

interface WorkflowEditorProps {
    steps: WorkflowStep[]
    setSteps: (steps: WorkflowStep[]) => void
}

interface SortableStepProps {
    step: WorkflowStep
    index: number
    updateStep: (id: string, field: keyof WorkflowStep, value: string) => void
    removeStep: (id: string) => void
    onImageUpload: (id: string, file: File) => void
    uploadingId: string | null
}

function SortableStep({ step, index, updateStep, removeStep, onImageUpload, uploadingId }: SortableStepProps) {
    const fileInputRef = useRef<HTMLInputElement>(null)
    const isUploading = uploadingId === step.id

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: step.id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    }

    return (
        <div ref={setNodeRef} style={style} className="mb-4">
            <Card className="relative bg-card border-border overflow-hidden">
                <CardHeader className="p-4 pb-0 flex flex-row items-center gap-4 space-y-0 bg-muted/30">
                    <div {...attributes} {...listeners} className="cursor-grab hover:text-primary touch-none">
                        <GripVertical className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                        {index + 1}
                    </div>
                    <div className="flex-1 font-semibold">Step {index + 1}</div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeStep(step.id)}
                        className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-sm font-medium">Step Title *</Label>
                                <Input
                                    placeholder="e.g., Install Dependencies"
                                    value={step.title}
                                    onChange={(e) => updateStep(step.id, 'title', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm font-medium">Description *</Label>
                                <Textarea
                                    placeholder="Describe what happens in this step..."
                                    value={step.description}
                                    onChange={(e) => updateStep(step.id, 'description', e.target.value)}
                                    className="min-h-[100px]"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-sm font-medium">Step Image (Optional)</Label>
                            <div className="h-[156px]">
                                {isValidUrl(step.image_url) ? (
                                    <div className="relative h-full w-full rounded-lg overflow-hidden border border-border group">
                                        <Image
                                            src={step.image_url!}
                                            alt={step.title || 'Step image'}
                                            fill
                                            className="object-cover"
                                        />
                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                            <Button
                                                size="sm"
                                                variant="secondary"
                                                onClick={() => fileInputRef.current?.click()}
                                            >
                                                Replace
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                onClick={() => updateStep(step.id, 'image_url', '')}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={isUploading}
                                        className="h-full w-full rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/30 flex flex-col items-center justify-center gap-2 hover:border-primary/50 hover:bg-muted/50 transition-all disabled:opacity-50"
                                    >
                                        {isUploading ? (
                                            <Loader2 className="h-8 w-8 text-muted-foreground animate-spin" />
                                        ) : (
                                            <>
                                                <Upload className="h-8 w-8 text-muted-foreground/50" />
                                                <span className="text-sm text-muted-foreground">Upload Image</span>
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files?.[0]
                                    if (file) {
                                        onImageUpload(step.id, file)
                                    }
                                    e.target.value = ''
                                }}
                                className="hidden"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export function WorkflowEditor({ steps, setSteps }: WorkflowEditorProps) {
    const [uploadingId, setUploadingId] = useState<string | null>(null)

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event

        if (over && active.id !== over.id) {
            const oldIndex = steps.findIndex((item) => item.id === active.id)
            const newIndex = steps.findIndex((item) => item.id === over.id)
            const newItems = arrayMove(steps, oldIndex, newIndex)
            // Re-assign step numbers
            setSteps(newItems.map((item, idx) => ({ ...item, step_number: idx + 1 })))
        }
    }

    const handleImageUpload = async (stepId: string, file: File) => {
        try {
            setUploadingId(stepId)
            const fileExt = file.name.split('.').pop()
            const fileName = `workflow_${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${fileExt}`

            const { error: uploadError } = await supabase.storage
                .from('workflow_images')
                .upload(fileName, file)

            if (uploadError) throw uploadError

            const { data } = supabase.storage.from('workflow_images').getPublicUrl(fileName)

            setSteps(
                steps.map((step) =>
                    step.id === stepId ? { ...step, image_url: data.publicUrl } : step
                )
            )

            toast.success('Image uploaded successfully')
        } catch (error: any) {
            toast.error(error.message || 'Failed to upload image')
        } finally {
            setUploadingId(null)
        }
    }

    const addStep = () => {
        const newStep: WorkflowStep = {
            id: uuidv4(),
            app_id: '',
            step_number: steps.length + 1,
            title: '',
            description: '',
            image_url: '',
        }
        setSteps([...steps, newStep])
    }

    const updateStep = (id: string, field: keyof WorkflowStep, value: string) => {
        setSteps(
            steps.map((step) =>
                step.id === id ? { ...step, [field]: value } : step
            )
        )
    }

    const removeStep = (id: string) => {
        const newSteps = steps.filter((step) => step.id !== id)
        setSteps(newSteps.map((item, idx) => ({ ...item, step_number: idx + 1 })))
    }

    return (
        <div className="space-y-4">
            {steps.length === 0 && (
                <div className="text-center py-12 border-2 border-dashed border-muted-foreground/25 rounded-xl bg-muted/30">
                    <ImageIcon className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Workflow Steps Yet</h3>
                    <p className="text-muted-foreground mb-4">
                        Add steps to show how your application works
                    </p>
                    <Button onClick={addStep}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add First Step
                    </Button>
                </div>
            )}

            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={steps.map((s) => s.id)}
                    strategy={verticalListSortingStrategy}
                >
                    {steps.map((step, index) => (
                        <SortableStep
                            key={step.id}
                            step={step}
                            index={index}
                            updateStep={updateStep}
                            removeStep={removeStep}
                            onImageUpload={handleImageUpload}
                            uploadingId={uploadingId}
                        />
                    ))}
                </SortableContext>
            </DndContext>

            {steps.length > 0 && (
                <Button onClick={addStep} className="w-full" variant="outline">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Step
                </Button>
            )}

            {steps.length > 0 && (
                <p className="text-xs text-muted-foreground text-center">
                    Drag and drop steps to reorder them. {steps.length} step{steps.length !== 1 ? 's' : ''} total.
                </p>
            )}
        </div>
    )
}
