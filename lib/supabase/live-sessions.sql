-- Live Session Management Tables

-- Session recordings table
CREATE TABLE session_recordings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  session_id UUID REFERENCES live_sessions ON DELETE CASCADE,
  recording_url TEXT NOT NULL,
  duration INTEGER, -- in seconds
  size BIGINT, -- in bytes
  status TEXT CHECK (status IN ('processing', 'ready', 'failed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Breakout rooms table
CREATE TABLE breakout_rooms (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  session_id UUID REFERENCES live_sessions ON DELETE CASCADE,
  name TEXT NOT NULL,
  max_participants INTEGER,
  duration INTEGER, -- in minutes
  status TEXT CHECK (status IN ('active', 'ended')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ
);

-- Breakout room participants
CREATE TABLE breakout_room_participants (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  room_id UUID REFERENCES breakout_rooms ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id),
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  left_at TIMESTAMPTZ
);

-- Screen sharing sessions
CREATE TABLE screen_shares (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  session_id UUID REFERENCES live_sessions ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id),
  started_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ
);

-- Hand raises
CREATE TABLE hand_raises (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  session_id UUID REFERENCES live_sessions ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id),
  reason TEXT,
  status TEXT CHECK (status IN ('pending', 'acknowledged', 'resolved')),
  raised_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

-- Chat moderation
CREATE TABLE chat_moderation (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  message_id UUID REFERENCES session_messages ON DELETE CASCADE,
  moderator_id UUID REFERENCES profiles(id),
  action TEXT CHECK (action IN ('delete', 'warn', 'timeout', 'ban')),
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Functions for session management
CREATE OR REPLACE FUNCTION start_recording(
  p_session_id UUID
)
RETURNS UUID AS $$
DECLARE
  v_recording_id UUID;
BEGIN
  INSERT INTO session_recordings (
    session_id,
    recording_url,
    status
  ) VALUES (
    p_session_id,
    '', -- URL will be updated when recording is ready
    'processing'
  ) RETURNING id INTO v_recording_id;

  RETURN v_recording_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create breakout room
CREATE OR REPLACE FUNCTION create_breakout_room(
  p_session_id UUID,
  p_name TEXT,
  p_max_participants INTEGER,
  p_duration INTEGER
)
RETURNS UUID AS $$
DECLARE
  v_room_id UUID;
BEGIN
  INSERT INTO breakout_rooms (
    session_id,
    name,
    max_participants,
    duration,
    status
  ) VALUES (
    p_session_id,
    p_name,
    p_max_participants,
    p_duration,
    'active'
  ) RETURNING id INTO v_room_id;

  RETURN v_room_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to handle hand raises
CREATE OR REPLACE FUNCTION handle_hand_raise(
  p_session_id UUID,
  p_user_id UUID,
  p_reason TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_hand_raise_id UUID;
BEGIN
  INSERT INTO hand_raises (
    session_id,
    user_id,
    reason,
    status
  ) VALUES (
    p_session_id,
    p_user_id,
    p_reason,
    'pending'
  ) RETURNING id INTO v_hand_raise_id;

  -- Notify session host
  INSERT INTO notifications (
    user_id,
    title,
    content,
    type
  ) SELECT
    instructor_id,
    'Hand Raise',
    format('Student %s has raised their hand', (
      SELECT first_name || ' ' || last_name
      FROM profiles
      WHERE id = p_user_id
    )),
    'info'
  FROM live_sessions
  WHERE id = p_session_id;

  RETURN v_hand_raise_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to moderate chat message
CREATE OR REPLACE FUNCTION moderate_chat_message(
  p_message_id UUID,
  p_moderator_id UUID,
  p_action TEXT,
  p_reason TEXT
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO chat_moderation (
    message_id,
    moderator_id,
    action,
    reason
  ) VALUES (
    p_message_id,
    p_moderator_id,
    p_action,
    p_reason
  );

  -- If action is delete, remove the message
  IF p_action = 'delete' THEN
    DELETE FROM session_messages
    WHERE id = p_message_id;
  END IF;

  -- Notify user about moderation
  INSERT INTO notifications (
    user_id,
    title,
    content,
    type
  ) SELECT
    user_id,
    'Message Moderated',
    format('Your message has been %s: %s', p_action, p_reason),
    'warning'
  FROM session_messages
  WHERE id = p_message_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;