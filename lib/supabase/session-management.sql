-- Session Management Tables and Functions

-- Create session tracking table
CREATE TABLE user_sessions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  token TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  last_activity TIMESTAMPTZ DEFAULT NOW()
);

-- Create session activity log
CREATE TABLE session_activity_log (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  session_id UUID REFERENCES user_sessions ON DELETE CASCADE,
  activity_type TEXT NOT NULL,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Function to create new session
CREATE OR REPLACE FUNCTION create_user_session(
  p_user_id UUID,
  p_token TEXT,
  p_ip_address TEXT,
  p_user_agent TEXT,
  p_duration_minutes INTEGER DEFAULT 60
)
RETURNS UUID AS $$
DECLARE
  v_session_id UUID;
BEGIN
  INSERT INTO user_sessions (
    user_id,
    token,
    ip_address,
    user_agent,
    expires_at
  )
  VALUES (
    p_user_id,
    p_token,
    p_ip_address,
    p_user_agent,
    NOW() + (p_duration_minutes || ' minutes')::INTERVAL
  )
  RETURNING id INTO v_session_id;

  -- Log session creation
  INSERT INTO session_activity_log (
    session_id,
    activity_type,
    ip_address
  )
  VALUES (
    v_session_id,
    'session_created',
    p_ip_address
  );

  RETURN v_session_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to validate and update session
CREATE OR REPLACE FUNCTION validate_session(
  p_session_id UUID,
  p_token TEXT,
  p_ip_address TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
  v_session user_sessions;
BEGIN
  SELECT *
  INTO v_session
  FROM user_sessions
  WHERE id = p_session_id
  AND token = p_token
  FOR UPDATE;

  IF v_session IS NULL THEN
    RETURN FALSE;
  END IF;

  IF v_session.expires_at < NOW() THEN
    -- Session expired
    DELETE FROM user_sessions WHERE id = p_session_id;
    RETURN FALSE;
  END IF;

  -- Update last activity
  UPDATE user_sessions
  SET 
    last_activity = NOW(),
    ip_address = p_ip_address
  WHERE id = p_session_id;

  -- Log activity
  INSERT INTO session_activity_log (
    session_id,
    activity_type,
    ip_address
  )
  VALUES (
    p_session_id,
    'session_validated',
    p_ip_address
  );

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to end session
CREATE OR REPLACE FUNCTION end_session(
  p_session_id UUID,
  p_token TEXT,
  p_ip_address TEXT
)
RETURNS VOID AS $$
BEGIN
  -- Log session end
  INSERT INTO session_activity_log (
    session_id,
    activity_type,
    ip_address
  )
  VALUES (
    p_session_id,
    'session_ended',
    p_ip_address
  );

  -- Delete session
  DELETE FROM user_sessions
  WHERE id = p_session_id
  AND token = p_token;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Cleanup expired sessions
CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS INTEGER AS $$
DECLARE
  v_count INTEGER;
BEGIN
  WITH deleted AS (
    DELETE FROM user_sessions
    WHERE expires_at < NOW()
    RETURNING id
  )
  SELECT COUNT(*) INTO v_count
  FROM deleted;

  RETURN v_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create scheduled job for session cleanup
SELECT cron.schedule(
  'cleanup-expired-sessions',
  '*/15 * * * *', -- Run every 15 minutes
  'SELECT cleanup_expired_sessions();'
);