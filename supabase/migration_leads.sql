-- Migration: Add leads table and missing app columns
-- Run this in your Supabase SQL Editor

-- Step 1: Add missing columns to apps table (if they don't exist)
ALTER TABLE public.apps 
ADD COLUMN IF NOT EXISTS tech_stack text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS gallery_images text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS landing_screenshot text,
ADD COLUMN IF NOT EXISTS detail_screenshot text;

-- Step 2: Create leads table
CREATE TABLE IF NOT EXISTS public.leads (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  email text NOT NULL,
  phone text,
  application_id uuid REFERENCES public.apps(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Step 3: Enable RLS on leads table
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Step 4: Create RLS policies for leads
-- Users can insert their own leads
CREATE POLICY "Users can insert own leads"
  ON public.leads FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can view their own leads
CREATE POLICY "Users can view own leads"
  ON public.leads FOR SELECT
  USING (auth.uid() = user_id);

-- Authenticated users (admins) can view all leads
CREATE POLICY "Admins can view all leads"
  ON public.leads FOR SELECT
  USING (auth.role() = 'authenticated');

-- Step 5: Create index for faster queries
CREATE INDEX IF NOT EXISTS leads_application_id_idx ON public.leads(application_id);
CREATE INDEX IF NOT EXISTS leads_user_id_idx ON public.leads(user_id);
CREATE INDEX IF NOT EXISTS leads_created_at_idx ON public.leads(created_at DESC);

-- Verify: Check table structure
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'leads';
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'apps';
