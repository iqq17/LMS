-- Analytics and Reporting System

-- Student progress snapshots
CREATE TABLE progress_snapshots (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  student_id UUID REFERENCES profiles(id),
  course_id UUID REFERENCES courses(id),
  progress INTEGER CHECK (progress >= 0 AND progress <= 100),
  metrics JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Attendance records
CREATE TABLE attendance_records (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  session_id UUID REFERENCES live_sessions(id),
  student_id UUID REFERENCES profiles(id),
  status TEXT CHECK (status IN ('present', 'absent', 'late', 'excused')),
  duration INTEGER, -- in minutes
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Performance metrics
CREATE TABLE performance_metrics (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  student_id UUID REFERENCES profiles(id),
  course_id UUID REFERENCES courses(id),
  metric_type TEXT CHECK (metric_type IN ('quiz', 'assignment', 'participation', 'attendance')),
  value NUMERIC,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Custom reports
CREATE TABLE custom_reports (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT CHECK (type IN ('progress', 'attendance', 'performance', 'custom')),
  parameters JSONB,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_generated_at TIMESTAMPTZ
);

-- Report schedules
CREATE TABLE report_schedules (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  report_id UUID REFERENCES custom_reports(id),
  frequency TEXT CHECK (frequency IN ('daily', 'weekly', 'monthly')),
  recipients JSONB,
  next_run TIMESTAMPTZ,
  last_run TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Function to record attendance
CREATE OR REPLACE FUNCTION record_attendance(
  p_session_id UUID,
  p_student_id UUID,
  p_status TEXT,
  p_duration INTEGER DEFAULT NULL,
  p_notes TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_record_id UUID;
BEGIN
  INSERT INTO attendance_records (
    session_id,
    student_id,
    status,
    duration,
    notes
  ) VALUES (
    p_session_id,
    p_student_id,
    p_status,
    p_duration,
    p_notes
  ) RETURNING id INTO v_record_id;

  -- Update performance metrics
  INSERT INTO performance_metrics (
    student_id,
    course_id,
    metric_type,
    value,
    metadata
  ) SELECT
    p_student_id,
    ls.course_id,
    'attendance',
    CASE p_status
      WHEN 'present' THEN 100
      WHEN 'late' THEN 75
      WHEN 'excused' THEN 50
      ELSE 0
    END,
    jsonb_build_object(
      'session_id', p_session_id,
      'status', p_status,
      'duration', p_duration
    )
  FROM live_sessions ls
  WHERE ls.id = p_session_id;

  RETURN v_record_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to generate progress snapshot
CREATE OR REPLACE FUNCTION generate_progress_snapshot(
  p_student_id UUID,
  p_course_id UUID
)
RETURNS UUID AS $$
DECLARE
  v_snapshot_id UUID;
  v_progress INTEGER;
  v_metrics JSONB;
BEGIN
  -- Calculate overall progress
  SELECT 
    ROUND(AVG(lp.progress))::INTEGER,
    jsonb_build_object(
      'completed_lessons', COUNT(*) FILTER (WHERE lp.completed),
      'total_lessons', COUNT(*),
      'assignments_completed', (
        SELECT COUNT(*) FROM submissions s
        WHERE s.student_id = p_student_id
        AND s.status = 'completed'
      ),
      'average_score', (
        SELECT ROUND(AVG(score), 2)
        FROM submissions s
        WHERE s.student_id = p_student_id
        AND s.score IS NOT NULL
      ),
      'attendance_rate', (
        SELECT ROUND(
          COUNT(*) FILTER (WHERE status = 'present')::NUMERIC / 
          COUNT(*)::NUMERIC * 100, 2
        )
        FROM attendance_records ar
        JOIN live_sessions ls ON ar.session_id = ls.id
        WHERE ar.student_id = p_student_id
        AND ls.course_id = p_course_id
      )
    )
  INTO v_progress, v_metrics
  FROM lesson_progress lp
  JOIN lessons l ON lp.lesson_id = l.id
  JOIN modules m ON l.module_id = m.id
  WHERE m.course_id = p_course_id
  AND lp.student_id = p_student_id;

  -- Create snapshot
  INSERT INTO progress_snapshots (
    student_id,
    course_id,
    progress,
    metrics
  ) VALUES (
    p_student_id,
    p_course_id,
    v_progress,
    v_metrics
  ) RETURNING id INTO v_snapshot_id;

  RETURN v_snapshot_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to generate custom report
CREATE OR REPLACE FUNCTION generate_custom_report(
  p_report_id UUID
)
RETURNS JSONB AS $$
DECLARE
  v_report custom_reports;
  v_data JSONB;
BEGIN
  SELECT * INTO v_report
  FROM custom_reports
  WHERE id = p_report_id;

  CASE v_report.type
    WHEN 'progress' THEN
      SELECT jsonb_agg(jsonb_build_object(
        'student_id', ps.student_id,
        'student_name', p.first_name || ' ' || p.last_name,
        'course_id', ps.course_id,
        'progress', ps.progress,
        'metrics', ps.metrics,
        'snapshot_date', ps.created_at
      ))
      INTO v_data
      FROM progress_snapshots ps
      JOIN profiles p ON ps.student_id = p.id
      WHERE ps.created_at >= (v_report.parameters->>'start_date')::TIMESTAMPTZ
      AND ps.created_at <= (v_report.parameters->>'end_date')::TIMESTAMPTZ;

    WHEN 'attendance' THEN
      SELECT jsonb_agg(jsonb_build_object(
        'student_id', ar.student_id,
        'student_name', p.first_name || ' ' || p.last_name,
        'session_id', ar.session_id,
        'status', ar.status,
        'duration', ar.duration,
        'date', ar.created_at
      ))
      INTO v_data
      FROM attendance_records ar
      JOIN profiles p ON ar.student_id = p.id
      WHERE ar.created_at >= (v_report.parameters->>'start_date')::TIMESTAMPTZ
      AND ar.created_at <= (v_report.parameters->>'end_date')::TIMESTAMPTZ;

    WHEN 'performance' THEN
      SELECT jsonb_agg(jsonb_build_object(
        'student_id', pm.student_id,
        'student_name', p.first_name || ' ' || p.last_name,
        'metric_type', pm.metric_type,
        'value', pm.value,
        'metadata', pm.metadata,
        'date', pm.created_at
      ))
      INTO v_data
      FROM performance_metrics pm
      JOIN profiles p ON pm.student_id = p.id
      WHERE pm.created_at >= (v_report.parameters->>'start_date')::TIMESTAMPTZ
      AND pm.created_at <= (v_report.parameters->>'end_date')::TIMESTAMPTZ;
  END CASE;

  -- Update last generated timestamp
  UPDATE custom_reports
  SET last_generated_at = NOW()
  WHERE id = p_report_id;

  RETURN v_data;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add RLS policies
ALTER TABLE progress_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE report_schedules ENABLE ROW LEVEL SECURITY;

-- Analytics access policies
CREATE POLICY "Teachers can view all analytics"
  ON progress_snapshots FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'teacher'
    )
  );

CREATE POLICY "Students can view their own analytics"
  ON progress_snapshots FOR SELECT
  USING (student_id = auth.uid());

-- Similar policies for other analytics tables...