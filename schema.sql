-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  first_name TEXT,
  last_name TEXT,
  email TEXT UNIQUE,
  avatar_url TEXT,
  role TEXT CHECK (role IN ('student', 'teacher', 'admin')),
  bio TEXT,
  phone TEXT,
  timezone TEXT DEFAULT 'UTC',
  language TEXT DEFAULT 'en',
  notification_preferences JSONB DEFAULT '{"email": true, "sms": false, "push": true}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create courses table
CREATE TABLE courses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  instructor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  level TEXT CHECK (level IN ('beginner', 'intermediate', 'advanced')),
  duration TEXT,
  price DECIMAL(10,2),
  max_students INTEGER,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  thumbnail_url TEXT,
  syllabus JSONB,
  prerequisites TEXT[],
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create modules table
CREATE TABLE modules (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL,
  duration TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(course_id, order_index)
);

-- Create lessons table
CREATE TABLE lessons (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  module_id UUID REFERENCES modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  content TEXT,
  type TEXT CHECK (type IN ('video', 'text', 'quiz', 'assignment')),
  duration TEXT,
  order_index INTEGER NOT NULL,
  media_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(module_id, order_index)
);

-- Create enrollments table
CREATE TABLE enrollments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'dropped')),
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  enrolled_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  last_accessed_at TIMESTAMPTZ,
  UNIQUE(student_id, course_id)
);

-- Create lesson_progress table
CREATE TABLE lesson_progress (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed')),
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  completed BOOLEAN DEFAULT FALSE,
  last_position INTEGER DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  UNIQUE(student_id, lesson_id)
);

-- Create assignments table
CREATE TABLE assignments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT CHECK (type IN ('quiz', 'practical', 'memorization', 'writing')),
  due_date TIMESTAMPTZ,
  points INTEGER DEFAULT 100,
  passing_score INTEGER,
  instructions TEXT,
  resources JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create submissions table
CREATE TABLE submissions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  assignment_id UUID REFERENCES assignments(id) ON DELETE CASCADE,
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT,
  files TEXT[],
  grade TEXT,
  score INTEGER,
  feedback TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'submitted', 'graded', 'returned')),
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  graded_at TIMESTAMPTZ,
  graded_by UUID REFERENCES profiles(id),
  UNIQUE(assignment_id, student_id)
);

-- Create resources table
CREATE TABLE resources (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT CHECK (type IN ('pdf', 'video', 'audio', 'document', 'link')),
  url TEXT NOT NULL,
  size INTEGER,
  duration TEXT,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create live_sessions table
CREATE TABLE live_sessions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  instructor_id UUID REFERENCES profiles(id),
  title TEXT NOT NULL,
  description TEXT,
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration INTEGER NOT NULL, -- in minutes
  max_participants INTEGER,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'live', 'completed', 'cancelled')),
  recording_url TEXT,
  meeting_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create session_participants table
CREATE TABLE session_participants (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  session_id UUID REFERENCES live_sessions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'participant' CHECK (role IN ('host', 'participant')),
  joined_at TIMESTAMPTZ,
  left_at TIMESTAMPTZ,
  attendance_duration INTEGER, -- in minutes
  UNIQUE(session_id, user_id)
);

-- Create session_messages table
CREATE TABLE session_messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  session_id UUID REFERENCES live_sessions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  type TEXT DEFAULT 'text' CHECK (type IN ('text', 'question', 'answer')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create achievements table
CREATE TABLE achievements (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT CHECK (type IN ('completion', 'milestone', 'skill', 'participation')),
  criteria JSONB,
  icon_url TEXT,
  points INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user_achievements table
CREATE TABLE user_achievements (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  achievement_id UUID REFERENCES achievements(id) ON DELETE CASCADE,
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- Create notifications table
CREATE TABLE notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  type TEXT CHECK (type IN ('info', 'success', 'warning', 'error')),
  read BOOLEAN DEFAULT FALSE,
  action_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create feedback table
CREATE TABLE feedback (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);

-- Create subscriptions table
CREATE TABLE subscriptions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  plan_id TEXT NOT NULL,
  status TEXT CHECK (status IN ('active', 'cancelled', 'expired')),
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create payments table
CREATE TABLE payments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES subscriptions(id),
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  status TEXT CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  payment_method TEXT,
  payment_intent_id TEXT,
  receipt_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create invoices table
CREATE TABLE invoices (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  payment_id UUID REFERENCES payments(id),
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  status TEXT CHECK (status IN ('draft', 'open', 'paid', 'void', 'uncollectible')),
  due_date TIMESTAMPTZ,
  paid_at TIMESTAMPTZ,
  invoice_pdf TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE live_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

-- Create indexes for better performance
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_courses_instructor ON courses(instructor_id);
CREATE INDEX idx_courses_status ON courses(status);
CREATE INDEX idx_modules_course ON modules(course_id);
CREATE INDEX idx_lessons_module ON lessons(module_id);
CREATE INDEX idx_enrollments_student ON enrollments(student_id);
CREATE INDEX idx_enrollments_course ON enrollments(course_id);
CREATE INDEX idx_lesson_progress_student ON lesson_progress(student_id);
CREATE INDEX idx_lesson_progress_lesson ON lesson_progress(lesson_id);
CREATE INDEX idx_assignments_course ON assignments(course_id);
CREATE INDEX idx_submissions_assignment ON submissions(assignment_id);
CREATE INDEX idx_submissions_student ON submissions(student_id);
CREATE INDEX idx_resources_course ON resources(course_id);
CREATE INDEX idx_live_sessions_course ON live_sessions(course_id);
CREATE INDEX idx_live_sessions_instructor ON live_sessions(instructor_id);
CREATE INDEX idx_session_participants_session ON session_participants(session_id);
CREATE INDEX idx_session_messages_session ON session_messages(session_id);
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_feedback_course ON feedback(course_id);
CREATE INDEX idx_subscriptions_user ON subscriptions(user_id);
CREATE INDEX idx_payments_user ON payments(user_id);
CREATE INDEX idx_invoices_user ON invoices(user_id);

-- Create functions and triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at timestamps
DO $$
DECLARE
  t text;
BEGIN
  FOR t IN 
    SELECT table_name 
    FROM information_schema.columns 
    WHERE column_name = 'updated_at'
      AND table_schema = 'public'
  LOOP
    EXECUTE format('
      CREATE TRIGGER update_%I_updated_at
        BEFORE UPDATE ON %I
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
    ', t, t);
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (NEW.id, NEW.email, 'student');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Function to calculate course progress
CREATE OR REPLACE FUNCTION calculate_course_progress(p_enrollment_id UUID)
RETURNS INTEGER AS $$
DECLARE
  total_lessons INTEGER;
  completed_lessons INTEGER;
  progress INTEGER;
BEGIN
  SELECT COUNT(l.id), COUNT(lp.id) FILTER (WHERE lp.completed = TRUE)
  INTO total_lessons, completed_lessons
  FROM enrollments e
  JOIN courses c ON e.course_id = c.id
  JOIN modules m ON m.course_id = c.id
  JOIN lessons l ON l.module_id = m.id
  LEFT JOIN lesson_progress lp ON lp.lesson_id = l.id AND lp.student_id = e.student_id
  WHERE e.id = p_enrollment_id;

  IF total_lessons > 0 THEN
    progress := (completed_lessons * 100) / total_lessons;
  ELSE
    progress := 0;
  END IF;

  RETURN progress;
END;
$$ LANGUAGE plpgsql;

-- Function to update enrollment progress
CREATE OR REPLACE FUNCTION update_enrollment_progress()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE enrollments e
  SET progress = calculate_course_progress(e.id)
  WHERE e.student_id = NEW.student_id
    AND e.course_id = (
      SELECT c.id
      FROM lessons l
      JOIN modules m ON l.module_id = m.id
      JOIN courses c ON m.course_id = c.id
      WHERE l.id = NEW.lesson_id
    );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update enrollment progress
CREATE TRIGGER update_enrollment_progress_trigger
  AFTER INSERT OR UPDATE ON lesson_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_enrollment_progress();

-- Function to check course completion
CREATE OR REPLACE FUNCTION check_course_completion()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.progress = 100 AND OLD.progress < 100 THEN
    UPDATE enrollments
    SET 
      status = 'completed',
      completed_at = NOW()
    WHERE id = NEW.id;
    
    -- Grant completion achievement if it exists
    INSERT INTO user_achievements (user_id, achievement_id)
    SELECT 
      NEW.student_id,
      a.id
    FROM achievements a
    WHERE a.type = 'completion'
    AND NOT EXISTS (
      SELECT 1 
      FROM user_achievements ua 
      WHERE ua.user_id = NEW.student_id 
      AND ua.achievement_id = a.id
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for course completion
CREATE TRIGGER check_course_completion_trigger
  AFTER UPDATE OF progress ON enrollments
  FOR EACH ROW
  EXECUTE FUNCTION check_course_completion();

-- Create RLS Policies
-- Profiles
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Courses
CREATE POLICY "Anyone can view published courses"
  ON courses FOR SELECT
  USING (status = 'published');

CREATE POLICY "Teachers can manage their courses"
  ON courses FOR ALL
  USING (instructor_id = auth.uid());

-- Enrollments
CREATE POLICY "Students can view their enrollments"
  ON enrollments FOR SELECT
  USING (student_id = auth.uid());

CREATE POLICY "Students can enroll themselves"
  ON enrollments FOR INSERT
  WITH CHECK (student_id = auth.uid());

-- Resources
CREATE POLICY "Enrolled users can access resources"
  ON resources FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM enrollments
      WHERE student_id = auth.uid()
      AND course_id = resources.course_id
    ) OR
    created_by = auth.uid()
  );

-- Live Sessions
CREATE POLICY "Users can view available sessions"
  ON live_sessions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM enrollments
      WHERE student_id = auth.uid()
      AND course_id = live_sessions.course_id
    ) OR
    instructor_id = auth.uid()
  );

-- Notifications
CREATE POLICY "Users can view their notifications"
  ON notifications FOR SELECT
  USING (user_id = auth.uid());

-- Feedback
CREATE POLICY "Users can view and manage their feedback"
  ON feedback FOR ALL
  USING (user_id = auth.uid());

-- Subscriptions and Payments
CREATE POLICY "Users can view their subscriptions"
  ON subscriptions FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can view their payments"
  ON payments FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can view their invoices"
  ON invoices FOR SELECT
  USING (user_id = auth.uid());