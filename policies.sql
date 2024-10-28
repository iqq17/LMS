-- Drop existing policies
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Service role can manage all profiles" ON profiles;
DROP POLICY IF EXISTS "Authenticated users can view other profiles" ON profiles;
DROP POLICY IF EXISTS "Users can read own auth data" ON auth.users;
DROP POLICY IF EXISTS "Service role has full access to auth data" ON auth.users;
DROP POLICY IF EXISTS "Allow public health check read" ON health_check;

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_check ENABLE ROW LEVEL SECURITY;

-- Recreate policies for profiles table
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Service role can manage all profiles"
  ON profiles FOR ALL
  TO service_role
  USING (true);

CREATE POLICY "Authenticated users can view other profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

-- Recreate policies for auth.users table
CREATE POLICY "Users can read own auth data"
  ON auth.users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Service role has full access to auth data"
  ON auth.users FOR ALL
  TO service_role
  USING (true);

-- Recreate policies for health check table
CREATE POLICY "Allow public health check read"
  ON health_check FOR SELECT
  TO PUBLIC
  USING (true);

-- Grant basic permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;

-- Set default privileges
ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT SELECT ON TABLES TO anon;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT ALL ON TABLES TO authenticated;