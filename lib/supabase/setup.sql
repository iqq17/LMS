-- Basic tables and permissions that don't require superuser
-- This can be run with regular database user privileges

-- Create profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users,
  first_name TEXT,
  last_name TEXT,
  email TEXT UNIQUE,
  role TEXT CHECK (role IN ('student', 'teacher')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS (Row Level Security)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Public profiles are viewable by everyone" 
  ON profiles 
  FOR SELECT 
  USING (true);

CREATE POLICY "Users can update their own profile" 
  ON profiles 
  FOR UPDATE 
  USING (auth.uid() = id);

-- Create simple health check table
CREATE TABLE IF NOT EXISTS health_check (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  status TEXT DEFAULT 'ok',
  checked_at TIMESTAMPTZ DEFAULT NOW()
);

-- Allow public read access to health check
ALTER TABLE health_check ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public health check read"
  ON health_check
  FOR SELECT
  USING (true);

-- Insert initial data
INSERT INTO health_check (status) VALUES ('ok')
ON CONFLICT DO NOTHING;