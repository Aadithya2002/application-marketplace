import { createClient } from '@supabase/supabase-js'

const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co').trim()
const supabaseAnonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key').trim()

if (typeof window !== 'undefined') {
    console.log('Supabase Config:', {
        url: supabaseUrl,
        keyLength: supabaseAnonKey.length,
        keyStart: supabaseAnonKey.substring(0, 5) + '...'
    })
}

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    console.error('Missing env.NEXT_PUBLIC_SUPABASE_URL')
}
if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.error('Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
