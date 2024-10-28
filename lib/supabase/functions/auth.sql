-- Drop existing functions if they exist
DROP FUNCTION IF EXISTS public.custom_access_token_hook(jsonb);
DROP FUNCTION IF EXISTS public.handle_auth_user(jsonb);

-- Create a secure function to handle access token generation
CREATE OR REPLACE FUNCTION public.custom_access_token_hook(event jsonb)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_id uuid;
  user_role text;
  user_data jsonb;
BEGIN
  -- Extract user ID from the event
  user_id := (event ->> 'user_id')::uuid;

  -- Get user role and data from profiles
  SELECT 
    role,
    jsonb_build_object(
      'role', role,
      'first_name', first_name,
      'last_name', last_name,
      'email', email
    ) INTO user_role, user_data
  FROM profiles
  WHERE id = user_id;

  -- Add custom claims to the token
  RETURN jsonb_set(
    event,
    '{claims}',
    jsonb_build_object(
      'role', user_role,
      'user_metadata', user_data
    )
  );
END;
$$;

-- Create a function to handle user authentication events
CREATE OR REPLACE FUNCTION public.handle_auth_user(event jsonb)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_id uuid;
  user_email text;
BEGIN
  -- Extract user data from event
  user_id := (event ->> 'user_id')::uuid;
  user_email := event ->> 'email';

  -- Update or create user profile
  INSERT INTO public.profiles (id, email, role)
  VALUES (user_id, user_email, 'student')
  ON CONFLICT (id) DO UPDATE
  SET updated_at = NOW()
  WHERE profiles.id = user_id;

  RETURN event;
END;
$$;

-- Set proper permissions
ALTER FUNCTION public.custom_access_token_hook(jsonb) OWNER TO supabase_auth_admin;
ALTER FUNCTION public.handle_auth_user(jsonb) OWNER TO supabase_auth_admin;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.custom_access_token_hook(jsonb) TO supabase_auth_admin;
GRANT EXECUTE ON FUNCTION public.handle_auth_user(jsonb) TO supabase_auth_admin;

-- Revoke execute from other roles
REVOKE EXECUTE ON FUNCTION public.custom_access_token_hook(jsonb) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.custom_access_token_hook(jsonb) FROM authenticated;
REVOKE EXECUTE ON FUNCTION public.custom_access_token_hook(jsonb) FROM anon;

REVOKE EXECUTE ON FUNCTION public.handle_auth_user(jsonb) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.handle_auth_user(jsonb) FROM authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_auth_user(jsonb) FROM anon;

-- Create hook trigger for auth events
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_auth_user(to_jsonb(NEW));