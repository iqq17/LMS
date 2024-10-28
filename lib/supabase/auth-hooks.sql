-- Enable Row Level Security
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Create auth hooks for user management
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- Create profile for new user
  INSERT INTO public.profiles (
    id,
    email,
    first_name,
    last_name,
    role,
    email_verified,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name',
    COALESCE(NEW.raw_user_meta_data->>'role', 'student'),
    NEW.email_confirmed_at IS NOT NULL,
    NOW(),
    NOW()
  );

  -- Create user settings with defaults
  INSERT INTO public.user_settings (
    user_id,
    theme,
    language,
    timezone,
    notifications,
    session_reminders,
    email_digest
  )
  VALUES (
    NEW.id,
    'system',
    'en',
    COALESCE(NEW.raw_user_meta_data->>'timezone', 'UTC'),
    jsonb_build_object(
      'email', true,
      'push', true,
      'sms', false
    ),
    30,
    'weekly'
  );

  -- Send welcome notification
  INSERT INTO public.notifications (
    user_id,
    title,
    content,
    type
  )
  VALUES (
    NEW.id,
    'Welcome to Al''Raajih Quran Institute',
    'Thank you for joining. Complete your profile to get started.',
    'info'
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Handle email verification
CREATE OR REPLACE FUNCTION handle_email_verification()
RETURNS trigger AS $$
BEGIN
  UPDATE public.profiles
  SET 
    email_verified = true,
    updated_at = NOW()
  WHERE id = NEW.id;

  -- Send email verification notification
  INSERT INTO public.notifications (
    user_id,
    title,
    content,
    type
  )
  VALUES (
    NEW.id,
    'Email Verified',
    'Your email has been successfully verified.',
    'success'
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Handle password reset
CREATE OR REPLACE FUNCTION handle_password_reset()
RETURNS trigger AS $$
BEGIN
  -- Send password reset notification
  INSERT INTO public.notifications (
    user_id,
    title,
    content,
    type
  )
  VALUES (
    NEW.id,
    'Password Reset',
    'Your password has been successfully reset.',
    'info'
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

DROP TRIGGER IF EXISTS on_email_verification ON auth.users;
CREATE TRIGGER on_email_verification
  AFTER UPDATE OF email_confirmed_at ON auth.users
  FOR EACH ROW
  WHEN (OLD.email_confirmed_at IS NULL AND NEW.email_confirmed_at IS NOT NULL)
  EXECUTE FUNCTION handle_email_verification();

DROP TRIGGER IF EXISTS on_password_reset ON auth.users;
CREATE TRIGGER on_password_reset
  AFTER UPDATE OF encrypted_password ON auth.users
  FOR EACH ROW
  WHEN (OLD.encrypted_password IS DISTINCT FROM NEW.encrypted_password)
  EXECUTE FUNCTION handle_password_reset();