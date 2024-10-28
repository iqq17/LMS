-- Create Teacher Account
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at
) VALUES (
  'a1b2c3d4-e5f6-4a5b-8c7d-9e8f7a6b5c4d',
  'sheikh.ahmad@alraajih.com',
  crypt('password123', gen_salt('bf')),
  now(),
  now(),
  now()
);

INSERT INTO auth.identities (
  id,
  user_id,
  provider_id,
  identity_data,
  provider,
  last_sign_in_at,
  created_at,
  updated_at
) VALUES (
  'a1b2c3d4-e5f6-4a5b-8c7d-9e8f7a6b5c4d',
  'a1b2c3d4-e5f6-4a5b-8c7d-9e8f7a6b5c4d',
  'sheikh.ahmad@alraajih.com',
  jsonb_build_object(
    'sub', 'a1b2c3d4-e5f6-4a5b-8c7d-9e8f7a6b5c4d',
    'email', 'sheikh.ahmad@alraajih.com'
  ),
  'email',
  now(),
  now(),
  now()
);

INSERT INTO public.profiles (
  id,
  first_name,
  last_name,
  email,
  role,
  avatar_url,
  bio,
  timezone,
  created_at
) VALUES (
  'a1b2c3d4-e5f6-4a5b-8c7d-9e8f7a6b5c4d',
  'Sheikh',
  'Ahmad',
  'sheikh.ahmad@alraajih.com',
  'teacher',
  'https://i.pravatar.cc/150?u=sheikh.ahmad',
  'Expert Quran teacher with 15 years of experience in Tajweed and memorization.',
  'UTC',
  now()
);

-- Create Student Account
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at
) VALUES (
  'b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e',
  'abdullah@example.com',
  crypt('password123', gen_salt('bf')),
  now(),
  now(),
  now()
);

INSERT INTO auth.identities (
  id,
  user_id,
  provider_id,
  identity_data,
  provider,
  last_sign_in_at,
  created_at,
  updated_at
) VALUES (
  'b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e',
  'b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e',
  'abdullah@example.com',
  jsonb_build_object(
    'sub', 'b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e',
    'email', 'abdullah@example.com'
  ),
  'email',
  now(),
  now(),
  now()
);

INSERT INTO public.profiles (
  id,
  first_name,
  last_name,
  email,
  role,
  avatar_url,
  bio,
  timezone,
  created_at
) VALUES (
  'b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e',
  'Abdullah',
  'Mohammed',
  'abdullah@example.com',
  'student',
  'https://i.pravatar.cc/150?u=abdullah',
  'Dedicated student learning Quran with focus on proper Tajweed.',
  'UTC',
  now()
);