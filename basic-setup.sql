-- Basic setup that doesn't require superuser privileges
-- Only creates tables in public schema

-- Create basic tables
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY,
  first_name TEXT,
  last_name TEXT,
  email TEXT UNIQUE,
  avatar_url TEXT,
  role TEXT CHECK (role IN ('student', 'teacher')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create health check table for connection testing
CREATE TABLE IF NOT EXISTS public.health_check (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  status TEXT DEFAULT 'ok',
  checked_at TIMESTAMPTZ DEFAULT NOW(),
  details JSONB DEFAULT '{}'::jsonb
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_check ENABLE ROW LEVEL SECURITY;

-- Create basic policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Allow public health check read"
  ON public.health_check FOR SELECT
  USING (true);

-- Insert test data
INSERT INTO public.health_check (status, details) 
VALUES (
  'ok',
  jsonb_build_object(
    'database_name', current_database(),
    'current_schema', current_schema(),
    'server_version', version()
  )
) ON CONFLICT DO NOTHING;

-- Function to check connection
CREATE OR REPLACE FUNCTION public.check_connection()
RETURNS jsonb
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT jsonb_build_object(
    'status', 'ok',
    'timestamp', now(),
    'database', current_database(),
    'schema', current_schema(),
    'version', version()
  );
$$;