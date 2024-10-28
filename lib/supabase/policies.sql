-- Update RLS policies for profiles table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Allow public read access to profiles for authentication
CREATE POLICY "Allow public read access to profiles"
  ON profiles FOR SELECT
  TO PUBLIC
  USING (true);

-- Allow authenticated users to update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Allow service role to manage all profiles
CREATE POLICY "Service role can manage all profiles"
  ON profiles FOR ALL
  TO service_role
  USING (true);

-- Allow authenticated users to read other profiles
CREATE POLICY "Authenticated users can view other profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

-- Enable RLS on auth schema
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own auth data
CREATE POLICY "Users can read own auth data"
  ON auth.users FOR SELECT
  USING (auth.uid() = id);

-- Allow service role full access to auth data
CREATE POLICY "Service role has full access to auth data"
  ON auth.users FOR ALL
  TO service_role
  USING (true);