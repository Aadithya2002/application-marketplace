-- Create apps table
create table public.apps (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  short_desc text not null,
  full_desc text not null,
  price int not null,
  tags text[] default '{}',
  youtube_url text,
  frontend_code text,
  backend_code text,
  config_code text,
  folder_structure text,
  thumbnail_url text,
  -- Enhanced marketplace fields
  tech_stack text[] default '{}',
  gallery_images text[] default '{}',
  landing_screenshot text,
  detail_screenshot text,
  created_at timestamptz default now()
);

-- Create workflow_steps table
create table public.workflow_steps (
  id uuid default gen_random_uuid() primary key,
  app_id uuid references public.apps(id) on delete cascade not null,
  step_number int not null,
  title text not null,
  description text not null,
  image_url text
);

-- Create leads table for purchase interest tracking
create table public.leads (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  email text not null,
  phone text,
  application_id uuid references public.apps(id) on delete cascade not null,
  created_at timestamptz default now()
);

-- Enable RLS
alter table public.apps enable row level security;
alter table public.workflow_steps enable row level security;
alter table public.leads enable row level security;

-- Create policies for apps
create policy "Public apps are viewable by everyone"
  on public.apps for select
  using (true);

create policy "Admins can insert apps"
  on public.apps for insert
  with check (auth.role() = 'authenticated');

create policy "Admins can update apps"
  on public.apps for update
  using (auth.role() = 'authenticated');

create policy "Admins can delete apps"
  on public.apps for delete
  using (auth.role() = 'authenticated');

-- Create policies for workflow_steps
create policy "Public workflow steps are viewable by everyone"
  on public.workflow_steps for select
  using (true);

create policy "Admins can insert workflow steps"
  on public.workflow_steps for insert
  with check (auth.role() = 'authenticated');

create policy "Admins can update workflow steps"
  on public.workflow_steps for update
  using (auth.role() = 'authenticated');

create policy "Admins can delete workflow steps"
  on public.workflow_steps for delete
  using (auth.role() = 'authenticated');

-- Create policies for leads
create policy "Users can insert own leads"
  on public.leads for insert
  with check (auth.uid() = user_id);

create policy "Users can view own leads"
  on public.leads for select
  using (auth.uid() = user_id);

create policy "Admins can view all leads"
  on public.leads for select
  using (auth.role() = 'authenticated');

-- Create storage buckets
insert into storage.buckets (id, name, public) values ('thumbnails', 'thumbnails', true);
insert into storage.buckets (id, name, public) values ('workflow_images', 'workflow_images', true);

-- Create storage policies
create policy "Public Access"
  on storage.objects for select
  using ( bucket_id in ('thumbnails', 'workflow_images') );

create policy "Authenticated Upload"
  on storage.objects for insert
  with check ( auth.role() = 'authenticated' );
