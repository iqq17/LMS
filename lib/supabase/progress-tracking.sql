-- Progress Tracking System

-- Create progress tracking table
CREATE TABLE progress_tracking (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  student_id UUID REFERENCES profiles(id),
  course_id UUID REFERENCES courses(id),
  lesson_id UUID REFERENCES lessons(id),
  status TEXT CHECK (status IN ('not_started', 'in_progress', 'completed')),
  progress INTEGER CHECK (progress >= 0 AND progress <= 100),
  time_spent INTEGER DEFAULT 0, -- in seconds
  last_accessed TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create milestones table
CREATE TABLE milestones (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  student_id UUID REFERENCES profiles(id),
  course_id UUID REFERENCES courses(id),
  title TEXT NOT NULL,
  description TEXT,
  achieved_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create study streaks table
CREATE TABLE study_streaks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  student_id UUID REFERENCES profiles(id),
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_study_date DATE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Function to update progress
CREATE OR REPLACE FUNCTION update_progress(
  p_student_id UUID,
  p_course_id UUID,
  p_lesson_id UUID,
  p_progress INTEGER
)
RETURNS void AS $$
DECLARE
  v_current_status TEXT;
  v_completion_threshold INTEGER := 90; -- Consider completed at 90%
BEGIN
  -- Get current status
  SELECT status INTO v_current_status
  FROM progress_tracking
  WHERE student_id = p_student_id
    AND course_id = p_course_id
    AND lesson_id = p_lesson_id;

  -- Insert or update progress
  INSERT INTO progress_tracking (
    student_id,
    course_id,
    lesson_id,
    status,
    progress,
    last_accessed,
    completed_at
  )
  VALUES (
    p_student_id,
    p_course_id,
    p_lesson_id,
    CASE 
      WHEN p_progress >= v_completion_threshold THEN 'completed'
      WHEN p_progress > 0 THEN 'in_progress'
      ELSE 'not_started'
    END,
    p_progress,
    NOW(),
    CASE WHEN p_progress >= v_completion_threshold THEN NOW() ELSE NULL END
  )
  ON CONFLICT (student_id, course_id, lesson_id) DO UPDATE
  SET 
    progress = p_progress,
    status = CASE 
      WHEN p_progress >= v_completion_threshold THEN 'completed'
      WHEN p_progress > 0 THEN 'in_progress'
      ELSE 'not_started'
    END,
    last_accessed = NOW(),
    completed_at = CASE 
      WHEN p_progress >= v_completion_threshold AND progress_tracking.completed_at IS NULL 
      THEN NOW() 
      ELSE progress_tracking.completed_at 
    END,
    updated_at = NOW();

  -- Update study streak
  WITH streak_update AS (
    SELECT
      CASE
        WHEN last_study_date = CURRENT_DATE - INTERVAL '1 day'
          THEN current_streak + 1
        WHEN last_study_date = CURRENT_DATE
          THEN current_streak
        ELSE 1
      END as new_streak
    FROM study_streaks
    WHERE student_id = p_student_id
  )
  INSERT INTO study_streaks (
    student_id,
    current_streak,
    longest_streak,
    last_study_date
  )
  VALUES (
    p_student_id,
    1,
    1,
    CURRENT_DATE
  )
  ON CONFLICT (student_id) DO UPDATE
  SET
    current_streak = CASE
      WHEN study_streaks.last_study_date = CURRENT_DATE - INTERVAL '1 day'
        THEN study_streaks.current_streak + 1
      WHEN study_streaks.last_study_date = CURRENT_DATE
        THEN study_streaks.current_streak
      ELSE 1
    END,
    longest_streak = GREATEST(
      study_streaks.longest_streak,
      CASE
        WHEN study_streaks.last_study_date = CURRENT_DATE - INTERVAL '1 day'
          THEN study_streaks.current_streak + 1
        WHEN study_streaks.last_study_date = CURRENT_DATE
          THEN study_streaks.current_streak
        ELSE 1
      END
    ),
    last_study_date = CURRENT_DATE,
    updated_at = NOW();

  -- Check and create milestones
  IF p_progress >= v_completion_threshold AND v_current_status != 'completed' THEN
    -- Lesson completion milestone
    INSERT INTO milestones (
      student_id,
      course_id,
      title,
      description
    )
    VALUES (
      p_student_id,
      p_course_id,
      'Lesson Completed',
      'Completed a new lesson successfully'
    );

    -- Check course completion
    IF NOT EXISTS (
      SELECT 1
      FROM progress_tracking pt
      JOIN lessons l ON pt.lesson_id = l.id
      WHERE pt.student_id = p_student_id
        AND pt.course_id = p_course_id
        AND pt.status != 'completed'
    ) THEN
      -- Course completion milestone
      INSERT INTO milestones (
        student_id,
        course_id,
        title,
        description
      )
      VALUES (
        p_student_id,
        p_course_id,
        'Course Completed',
        'Successfully completed the entire course'
      );
    END IF;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to get student progress summary
CREATE OR REPLACE FUNCTION get_student_progress_summary(p_student_id UUID)
RETURNS TABLE (
  course_id UUID,
  course_title TEXT,
  overall_progress INTEGER,
  completed_lessons INTEGER,
  total_lessons INTEGER,
  last_accessed TIMESTAMPTZ,
  current_streak INTEGER,
  longest_streak INTEGER
) AS $$
BEGIN
  RETURN QUERY
  WITH course_stats AS (
    SELECT
      c.id as course_id,
      c.title as course_title,
      COUNT(l.id) as total_lessons,
      COUNT(pt.id) FILTER (WHERE pt.status = 'completed') as completed_lessons,
      MAX(pt.last_accessed) as last_accessed
    FROM courses c
    JOIN lessons l ON l.course_id = c.id
    LEFT JOIN progress_tracking pt ON pt.lesson_id = l.id AND pt.student_id = p_student_id
    GROUP BY c.id, c.title
  )
  SELECT
    cs.course_id,
    cs.course_title,
    CASE 
      WHEN cs.total_lessons > 0 
      THEN (cs.completed_lessons * 100 / cs.total_lessons)::INTEGER
      ELSE 0
    END as overall_progress,
    cs.completed_lessons,
    cs.total_lessons,
    cs.last_accessed,
    ss.current_streak,
    ss.longest_streak
  FROM course_stats cs
  LEFT JOIN study_streaks ss ON ss.student_id = p_student_id;
END;
$$ LANGUAGE plpgsql;