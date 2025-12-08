export interface App {
    id: string
    name: string
    short_desc: string
    full_desc: string
    price: number
    tags: string[]
    youtube_url?: string
    frontend_code?: string
    backend_code?: string
    config_code?: string
    folder_structure?: string
    thumbnail_url?: string
    // Enhanced marketplace fields
    tech_stack?: string[]
    gallery_images?: string[]
    landing_screenshot?: string
    detail_screenshot?: string
    created_at: string
}

export interface WorkflowStep {
    id: string
    app_id: string
    step_number: number
    title: string
    description: string
    image_url?: string
}

export interface ValidationErrors {
    name?: string
    short_desc?: string
    full_desc?: string
    price?: string
    thumbnail?: string
    gallery?: string
    youtube?: string
    workflow?: string
    tech_stack?: string
}

export interface Lead {
    id: string
    user_id: string
    email: string
    phone?: string
    application_id: string
    created_at: string
}

export interface Profile {
    id: string
    full_name: string | null
    avatar_url: string | null
    created_at: string
    updated_at: string
}

