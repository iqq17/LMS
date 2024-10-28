-- Assessment System Tables

-- Quizzes table
CREATE TABLE quizzes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  course_id UUID REFERENCES courses ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  duration INTEGER, -- in minutes
  passing_score INTEGER,
  max_attempts INTEGER,
  shuffle_questions BOOLEAN DEFAULT false,
  show_answers BOOLEAN DEFAULT false,
  status TEXT CHECK (status IN ('draft', 'published', 'archived')),
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ
);

-- Questions table
CREATE TABLE questions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  quiz_id UUID REFERENCES quizzes ON DELETE CASCADE,
  type TEXT CHECK (type IN ('multiple_choice', 'true_false', 'short_answer', 'essay')),
  content TEXT NOT NULL,
  correct_answer TEXT,
  points INTEGER DEFAULT 1,
  explanation TEXT,
  order_index INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Question options for multiple choice
CREATE TABLE question_options (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  question_id UUID REFERENCES questions ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_correct BOOLEAN DEFAULT false,
  order_index INTEGER
);

-- Quiz attempts
CREATE TABLE quiz_attempts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  quiz_id UUID REFERENCES quizzes ON DELETE CASCADE,
  student_id UUID REFERENCES profiles(id),
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  score INTEGER,
  passed BOOLEAN,
  attempt_number INTEGER,
  status TEXT CHECK (status IN ('in_progress', 'completed', 'abandoned'))
);

-- Student answers
CREATE TABLE student_answers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  attempt_id UUID REFERENCES quiz_attempts ON DELETE CASCADE,
  question_id UUID REFERENCES questions ON DELETE CASCADE,
  answer TEXT,
  is_correct BOOLEAN,
  points_awarded INTEGER,
  graded_by UUID REFERENCES profiles(id),
  graded_at TIMESTAMPTZ,
  feedback TEXT
);

-- Functions for assessment management

-- Function to create a new quiz
CREATE OR REPLACE FUNCTION create_quiz(
  p_course_id UUID,
  p_title TEXT,
  p_description TEXT,
  p_duration INTEGER,
  p_passing_score INTEGER,
  p_created_by UUID
)
RETURNS UUID AS $$
DECLARE
  v_quiz_id UUID;
BEGIN
  INSERT INTO quizzes (
    course_id,
    title,
    description,
    duration,
    passing_score,
    created_by,
    status
  ) VALUES (
    p_course_id,
    p_title,
    p_description,
    p_duration,
    p_passing_score,
    p_created_by,
    'draft'
  ) RETURNING id INTO v_quiz_id;

  RETURN v_quiz_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to add a question to a quiz
CREATE OR REPLACE FUNCTION add_question(
  p_quiz_id UUID,
  p_type TEXT,
  p_content TEXT,
  p_correct_answer TEXT,
  p_points INTEGER,
  p_explanation TEXT DEFAULT NULL,
  p_options JSONB DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_question_id UUID;
  v_option JSONB;
BEGIN
  -- Insert question
  INSERT INTO questions (
    quiz_id,
    type,
    content,
    correct_answer,
    points,
    explanation,
    order_index
  ) VALUES (
    p_quiz_id,
    p_type,
    p_content,
    p_correct_answer,
    p_points,
    p_explanation,
    (SELECT COALESCE(MAX(order_index), 0) + 1 FROM questions WHERE quiz_id = p_quiz_id)
  ) RETURNING id INTO v_question_id;

  -- Add options for multiple choice questions
  IF p_type = 'multiple_choice' AND p_options IS NOT NULL THEN
    FOR v_option IN SELECT * FROM jsonb_array_elements(p_options)
    LOOP
      INSERT INTO question_options (
        question_id,
        content,
        is_correct,
        order_index
      ) VALUES (
        v_question_id,
        v_option->>'content',
        (v_option->>'is_correct')::boolean,
        (v_option->>'order_index')::integer
      );
    END LOOP;
  END IF;

  RETURN v_question_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to start a quiz attempt
CREATE OR REPLACE FUNCTION start_quiz_attempt(
  p_quiz_id UUID,
  p_student_id UUID
)
RETURNS UUID AS $$
DECLARE
  v_attempt_id UUID;
  v_attempt_number INTEGER;
BEGIN
  -- Get the next attempt number for this student
  SELECT COALESCE(MAX(attempt_number), 0) + 1
  INTO v_attempt_number
  FROM quiz_attempts
  WHERE quiz_id = p_quiz_id
  AND student_id = p_student_id;

  -- Create new attempt
  INSERT INTO quiz_attempts (
    quiz_id,
    student_id,
    attempt_number,
    status
  ) VALUES (
    p_quiz_id,
    p_student_id,
    v_attempt_number,
    'in_progress'
  ) RETURNING id INTO v_attempt_id;

  RETURN v_attempt_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to submit an answer
CREATE OR REPLACE FUNCTION submit_answer(
  p_attempt_id UUID,
  p_question_id UUID,
  p_answer TEXT
)
RETURNS VOID AS $$
DECLARE
  v_question questions;
  v_is_correct BOOLEAN;
  v_points INTEGER;
BEGIN
  -- Get question details
  SELECT * INTO v_question
  FROM questions
  WHERE id = p_question_id;

  -- Auto-grade if possible
  IF v_question.type IN ('multiple_choice', 'true_false') THEN
    v_is_correct := p_answer = v_question.correct_answer;
    v_points := CASE WHEN v_is_correct THEN v_question.points ELSE 0 END;
  END IF;

  -- Insert answer
  INSERT INTO student_answers (
    attempt_id,
    question_id,
    answer,
    is_correct,
    points_awarded
  ) VALUES (
    p_attempt_id,
    p_question_id,
    p_answer,
    v_is_correct,
    v_points
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to complete quiz attempt
CREATE OR REPLACE FUNCTION complete_quiz_attempt(
  p_attempt_id UUID
)
RETURNS VOID AS $$
DECLARE
  v_quiz_id UUID;
  v_passing_score INTEGER;
  v_total_score INTEGER;
  v_passed BOOLEAN;
BEGIN
  -- Get quiz details
  SELECT q.id, q.passing_score
  INTO v_quiz_id, v_passing_score
  FROM quiz_attempts qa
  JOIN quizzes q ON qa.quiz_id = q.id
  WHERE qa.id = p_attempt_id;

  -- Calculate total score
  SELECT COALESCE(SUM(points_awarded), 0)
  INTO v_total_score
  FROM student_answers
  WHERE attempt_id = p_attempt_id;

  -- Determine if passed
  v_passed := v_total_score >= v_passing_score;

  -- Update attempt
  UPDATE quiz_attempts
  SET
    completed_at = NOW(),
    score = v_total_score,
    passed = v_passed,
    status = 'completed'
  WHERE id = p_attempt_id;

  -- Notify student
  INSERT INTO notifications (
    user_id,
    title,
    content,
    type
  ) SELECT
    student_id,
    'Quiz Completed',
    format('You scored %s points. %s', 
      v_total_score,
      CASE WHEN v_passed THEN 'Congratulations, you passed!' ELSE 'Keep practicing!' END
    ),
    CASE WHEN v_passed THEN 'success' ELSE 'info' END
  FROM quiz_attempts
  WHERE id = p_attempt_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;