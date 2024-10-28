-- Add session management tables
CREATE TABLE sessions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  instructor_id UUID REFERENCES profiles(id),
  title TEXT NOT NULL,
  description TEXT,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'live', 'completed')),
  participants INTEGER DEFAULT 0,
  recording_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE session_participants (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ NOT NULL,
  left_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(session_id, user_id)
);

CREATE TABLE session_messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add RLS policies
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_messages ENABLE ROW LEVEL SECURITY;

-- Session policies
CREATE POLICY "Anyone can view active sessions"
  ON sessions FOR SELECT
  USING (status = 'live');

CREATE POLICY "Teachers can manage their sessions"
  ON sessions FOR ALL
  USING (instructor_id = auth.uid());

-- Participant policies
CREATE POLICY "Participants can view session members"
  ON session_participants FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM sessions
      WHERE id = session_participants.session_id
      AND status = 'live'
    )
  );

CREATE POLICY "Users can join sessions"
  ON session_participants FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM sessions
      WHERE id = session_participants.session_id
      AND status = 'live'
    )
  );

-- Message policies
CREATE POLICY "Anyone can view session messages"
  ON session_messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM sessions
      WHERE id = session_messages.session_id
      AND status = 'live'
    )
  );

CREATE POLICY "Session participants can send messages"
  ON session_messages FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM session_participants
      WHERE session_id = session_messages.session_id
      AND user_id = auth.uid()
      AND left_at IS NULL
    )
  );