-- Drop everything first (ignore errors if they don't exist)
DROP SCHEMA IF EXISTS public CASCADE;
DROP SCHEMA IF EXISTS auth CASCADE;
DROP ROLE IF EXISTS anon;
DROP ROLE IF EXISTS authenticated;
DROP ROLE IF EXISTS service_role;
DROP ROLE IF EXISTS authenticator;

-- Create schemas
CREATE SCHEMA public;
CREATE SCHEMA auth;

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create roles
CREATE ROLE anon NOLOGIN NOINHERIT;
CREATE ROLE authenticated NOLOGIN NOINHERIT;
CREATE ROLE service_role NOLOGIN NOINHERIT BYPASSRLS;
CREATE ROLE authenticator NOINHERIT LOGIN PASSWORD 'your-password-here';

GRANT anon TO authenticator;
GRANT authenticated TO authenticator;
GRANT service_role TO authenticator;

-- Create auth tables
CREATE TABLE auth.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  encrypted_password TEXT NOT NULL,
  email_confirmed_at TIMESTAMPTZ,
  raw_app_meta_data JSONB,
  raw_user_meta_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  phone TEXT,
  confirmed_at TIMESTAMPTZ,
  confirmation_token TEXT,
  recovery_token TEXT,
  email_change_token TEXT,
  email_change TEXT,
  last_sign_in_at TIMESTAMPTZ,
  instance_id UUID
);

-- Create public tables
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  email TEXT UNIQUE,
  avatar_url TEXT,
  role TEXT CHECK (role IN ('student', 'teacher')),
  bio TEXT,
  timezone TEXT DEFAULT 'UTC',
  language TEXT DEFAULT 'en',
  notification_preferences JSONB DEFAULT '{"email": true, "push": true}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.health_check (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  status TEXT DEFAULT 'ok',
  checked_at TIMESTAMPTZ DEFAULT NOW(),
  details JSONB DEFAULT '{}'::jsonb
);

-- Enable RLS
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_check ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Service role can manage all profiles"
  ON public.profiles FOR ALL
  TO service_role
  USING (true);

CREATE POLICY "Users can read own auth data"
  ON auth.users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Service role has full access to auth data"
  ON auth.users FOR ALL
  TO service_role
  USING (true);

CREATE POLICY "Allow public health check read"
  ON public.health_check FOR SELECT
  TO PUBLIC
  USING (true);

-- Create functions
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    email,
    first_name,
    last_name,
    role,
    avatar_url
  )
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name',
    COALESCE(NEW.raw_user_meta_data->>'role', 'student'),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.get_system_info()
RETURNS jsonb
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT jsonb_build_object(
    'database_name', current_database(),
    'current_schema', current_schema(),
    'server_version', version(),
    'current_time', now(),
    'settings', jsonb_build_object(
      'timezone', current_setting('timezone'),
      'server_encoding', current_setting('server_encoding')
    )
  );
$$;

-- Create triggers
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Insert initial data
INSERT INTO public.health_check (status, details) 
VALUES (
  'ok',
  jsonb_build_object(
    'database_name', current_database(),
    'current_schema', current_schema(),
    'server_version', version()
  )
);

-- Grant permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON SCHEMA public TO service_role;
GRANT USAGE ON SCHEMA auth TO anon, authenticated;
GRANT ALL ON SCHEMA auth TO service_role;

GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;

GRANT SELECT ON auth.users TO authenticated;
GRANT ALL ON auth.users TO service_role;

GRANT EXECUTE ON FUNCTION public.handle_new_user() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_system_info() TO anon, authenticated;

-- Set default privileges
ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT SELECT ON TABLES TO anon;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT ALL ON TABLES TO authenticated;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT ALL ON TABLES TO service_role;

-- Set function owners
ALTER FUNCTION public.handle_new_user() OWNER TO authenticator;
ALTER FUNCTION public.get_system_info() OWNER TO authenticator;

-- Insert test users
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_user_meta_data,
  created_at,
  updated_at
) VALUES (
  'a1b2c3d4-e5f6-4a5b-8c7d-9e8f7a6b5c4d',
  'sheikh.ahmad@alraajih.com',
  crypt('password123', gen_salt('bf')),
  now(),
  jsonb_build_object(
    'first_name', 'Sheikh',
    'last_name', 'Ahmad',
    'role', 'teacher'
  ),
  now(),
  now()
), (
  'b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e',
  'abdullah@example.com',
  crypt('password123', gen_salt('bf')),
  now(),
  jsonb_build_object(
    'first_name', 'Abdullah',
    'last_name', 'Mohammed',
    'role', 'student'
  ),
  now(),
  now()
);

-- Insert test profiles (will be handled by trigger, but adding for completeness)
INSERT INTO public.profiles (
  id,
  first_name,
  last_name,
  email,
  role,
  avatar_url,
  created_at
) VALUES (
  'a1b2c3d4-e5f6-4a5b-8c7d-9e8f7a6b5c4d',
  'Sheikh',
  'Ahmad',
  'sheikh.ahmad@alraajih.com',
  'teacher',
  'https://i.pravatar.cc/150?u=sheikh.ahmad',
  now()
), (
  'b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e',
  'Abdullah',
  'Mohammed',
  'abdullah@example.com',
  'student',
  'https://i.pravatar.cc/150?u=abdullah',
  now()
) ON CONFLICT (id) DO NOTHING;