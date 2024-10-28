-- Test Users for Al'Raajih Quran Institute

-- Create Teacher Account
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at
) VALUES (
  'f1e2d3c4-b5a6-47b8-9c0d-1e2f3a4b5c6d',
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
  'f1e2d3c4-b5a6-47b8-9c0d-1e2f3a4b5c6d',
  'f1e2d3c4-b5a6-47b8-9c0d-1e2f3a4b5c6d',
  'sheikh.ahmad@alraajih.com',
  jsonb_build_object(
    'sub', 'f1e2d3c4-b5a6-47b8-9c0d-1e2f3a4b5c6d',
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
  created_at
) VALUES (
  'f1e2d3c4-b5a6-47b8-9c0d-1e2f3a4b5c6d',
  'Sheikh',
  'Ahmad',
  'sheikh.ahmad@alraajih.com',
  'teacher',
  'https://i.pravatar.cc/150?u=sheikh.ahmad',
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
  'g2f3e4d5-c6b7-48c9-0d1e-2f3a4b5c6d7e',
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
  'g2f3e4d5-c6b7-48c9-0d1e-2f3a4b5c6d7e',
  'g2f3e4d5-c6b7-48c9-0d1e-2f3a4b5c6d7e',
  'abdullah@example.com',
  jsonb_build_object(
    'sub', 'g2f3e4d5-c6b7-48c9-0d1e-2f3a4b5c6d7e',
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
  created_at
) VALUES (
  'g2f3e4d5-c6b7-48c9-0d1e-2f3a4b5c6d7e',
  'Abdullah',
  'Mohammed',
  'abdullah@example.com',
  'student',
  'https://i.pravatar.cc/150?u=abdullah',
  now()
);