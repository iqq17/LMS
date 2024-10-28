-- Enable RLS
ALTER TABLE IF EXISTS health_check ENABLE ROW LEVEL SECURITY;

-- Create health check table in public schema if it doesn't exist
CREATE TABLE IF NOT EXISTS health_check (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  status TEXT NOT NULL DEFAULT 'ok',
  last_checked TIMESTAMPTZ DEFAULT NOW(),
  details JSONB DEFAULT '{}'::jsonb
);

-- Create policy to allow reading health check data
CREATE POLICY "Allow reading health check data for all users"
  ON health_check
  FOR SELECT
  TO PUBLIC
  USING (true);

-- Insert initial status if not exists
INSERT INTO health_check (status, details) 
SELECT 
  'ok',
  jsonb_build_object(
    'database_name', current_database(),
    'current_schema', current_schema(),
    'server_version', version()
  )
WHERE NOT EXISTS (SELECT 1 FROM health_check LIMIT 1);

-- Create function to get system info
CREATE OR REPLACE FUNCTION get_system_info()
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

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON health_check TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_system_info() TO anon, authenticated;

-- Ensure the function is owned by authenticator role
ALTER FUNCTION get_system_info() OWNER TO authenticator;