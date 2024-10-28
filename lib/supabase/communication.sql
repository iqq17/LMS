-- Communication System

-- Messages table
CREATE TABLE messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  sender_id UUID REFERENCES profiles(id),
  recipient_id UUID REFERENCES profiles(id),
  subject TEXT,
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  archived BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Announcements table
CREATE TABLE announcements (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author_id UUID REFERENCES profiles(id),
  target_role TEXT[] DEFAULT ARRAY['student', 'teacher'],
  target_course_id UUID REFERENCES courses(id),
  priority TEXT CHECK (priority IN ('low', 'medium', 'high')),
  valid_until TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notification templates
CREATE TABLE notification_templates (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  type TEXT NOT NULL,
  subject TEXT NOT NULL,
  content TEXT NOT NULL,
  variables JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Parent portal access
CREATE TABLE parent_access (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  parent_id UUID REFERENCES profiles(id),
  student_id UUID REFERENCES profiles(id),
  relationship TEXT NOT NULL,
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Parent notifications preferences
CREATE TABLE parent_notification_preferences (
  parent_id UUID REFERENCES profiles(id),
  notification_type TEXT NOT NULL,
  enabled BOOLEAN DEFAULT true,
  email_enabled BOOLEAN DEFAULT true,
  sms_enabled BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (parent_id, notification_type)
);

-- Function to send message
CREATE OR REPLACE FUNCTION send_message(
  p_sender_id UUID,
  p_recipient_id UUID,
  p_subject TEXT,
  p_content TEXT
)
RETURNS UUID AS $$
DECLARE
  v_message_id UUID;
BEGIN
  INSERT INTO messages (
    sender_id,
    recipient_id,
    subject,
    content
  ) VALUES (
    p_sender_id,
    p_recipient_id,
    p_subject,
    p_content
  ) RETURNING id INTO v_message_id;

  -- Create notification
  INSERT INTO notifications (
    user_id,
    title,
    content,
    type,
    action_url
  ) VALUES (
    p_recipient_id,
    'New Message: ' || p_subject,
    substring(p_content from 1 for 100) || '...',
    'message',
    '/messages/' || v_message_id
  );

  RETURN v_message_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create announcement
CREATE OR REPLACE FUNCTION create_announcement(
  p_author_id UUID,
  p_title TEXT,
  p_content TEXT,
  p_target_role TEXT[],
  p_target_course_id UUID DEFAULT NULL,
  p_priority TEXT DEFAULT 'medium',
  p_valid_until TIMESTAMPTZ DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_announcement_id UUID;
BEGIN
  INSERT INTO announcements (
    author_id,
    title,
    content,
    target_role,
    target_course_id,
    priority,
    valid_until
  ) VALUES (
    p_author_id,
    p_title,
    p_content,
    p_target_role,
    p_target_course_id,
    p_priority,
    COALESCE(p_valid_until, NOW() + INTERVAL '7 days')
  ) RETURNING id INTO v_announcement_id;

  -- Create notifications for target users
  INSERT INTO notifications (
    user_id,
    title,
    content,
    type,
    action_url
  )
  SELECT
    p.id,
    'New Announcement: ' || p_title,
    substring(p_content from 1 for 100) || '...',
    'announcement',
    '/announcements/' || v_announcement_id
  FROM profiles p
  WHERE p.role = ANY(p_target_role)
  AND (
    p_target_course_id IS NULL
    OR EXISTS (
      SELECT 1 FROM enrollments e
      WHERE e.student_id = p.id
      AND e.course_id = p_target_course_id
    )
  );

  RETURN v_announcement_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to verify parent access
CREATE OR REPLACE FUNCTION verify_parent_access(
  p_parent_id UUID,
  p_student_id UUID,
  p_verification_code TEXT
)
RETURNS BOOLEAN AS $$
BEGIN
  -- Implement verification logic here
  -- This could involve checking against a temporary verification code
  -- stored in a separate table or sent via email

  UPDATE parent_access
  SET 
    verified = true,
    updated_at = NOW()
  WHERE parent_id = p_parent_id
  AND student_id = p_student_id;

  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add RLS policies
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE parent_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE parent_notification_preferences ENABLE ROW LEVEL SECURITY;

-- Message policies
CREATE POLICY "Users can view their own messages"
  ON messages FOR SELECT
  USING (
    sender_id = auth.uid()
    OR recipient_id = auth.uid()
  );

CREATE POLICY "Users can send messages"
  ON messages FOR INSERT
  WITH CHECK (sender_id = auth.uid());

-- Announcement policies
CREATE POLICY "Teachers can manage announcements"
  ON announcements FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'teacher'
    )
  );

CREATE POLICY "Users can view relevant announcements"
  ON announcements FOR SELECT
  USING (
    auth.uid() IN (
      SELECT p.id
      FROM profiles p
      WHERE p.role = ANY(announcements.target_role)
      AND (
        announcements.target_course_id IS NULL
        OR EXISTS (
          SELECT 1 FROM enrollments e
          WHERE e.student_id = p.id
          AND e.course_id = announcements.target_course_id
        )
      )
    )
  );

-- Parent access policies
CREATE POLICY "Parents can view their students' data"
  ON parent_access FOR SELECT
  USING (
    parent_id = auth.uid()
    AND verified = true
  );