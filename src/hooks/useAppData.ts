import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { App, WorkflowStep } from '@/types/app'

export function useApps() {
    return useQuery({
        queryKey: ['apps'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('apps')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) throw error
            return data as App[]
        },
    })
}

export function useApp(id: string) {
    return useQuery({
        queryKey: ['app', id],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('apps')
                .select('*')
                .eq('id', id)
                .single()

            if (error) throw error
            return data as App
        },
        enabled: !!id,
    })
}

export function useAppWorkflow(appId: string) {
    return useQuery({
        queryKey: ['workflow', appId],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('workflow_steps')
                .select('*')
                .eq('app_id', appId)
                .order('step_number', { ascending: true })

            if (error) throw error
            return data as WorkflowStep[]
        },
        enabled: !!appId,
    })
}
