-- Course Management Tables and Functions

-- Course schedule table
CREATE TABLE course_schedules (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  course_id UUID REFERENCES courses ON DELETE CASCADE,
  weekday INTEGER CHECK (weekday BETWEEN 0 AND 6),
  start_time TIME NOT NULL,
  duration INTEGER NOT NULL, -- in minutes
  max_students INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Course materials table
CREATE TABLE course_materials (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  course_id UUID REFERENCES courses ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT CHECK (type IN ('pdf', 'video', 'audio', 'document', 'link')),
  url TEXT NOT NULL,
  order_index INTEGER,
  is_required BOOLEAN DEFAULT false,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Course prerequisites table
CREATE TABLE course_prerequisites (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  course_id UUID REFERENCES courses ON DELETE CASCADE,
  prerequisite_id UUID REFERENCES courses ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(course_id, prerequisite_id)
);

-- Course enrollment workflow
CREATE TYPE enrollment_status AS ENUM (
  'pending',
  'approved',
  'rejected',
  'waitlisted'
);

ALTER TABLE enrollments
ADD COLUMN status enrollment_status DEFAULT 'pending',
ADD COLUMN approved_by UUID REFERENCES profiles(id),
ADD COLUMN approved_at TIMESTAMPTZ,
ADD COLUMN notes TEXT;

-- Function to handle enrollment requests
CREATE OR REPLACE FUNCTION handle_enrollment_request(
  p_course_id UUID,
  p_student_id UUID
)
RETURNS enrollment_status AS $$
DECLARE
  v_course courses;
  v_current_enrollments INTEGER;
  v_status enrollment_status;
BEGIN
  -- Get course details
  SELECT * INTO v_course
  FROM courses
  WHERE id = p_course_id;

  -- Check prerequisites
  IF EXISTS (
    SELECT 1 FROM course_prerequisites cp
    WHERE cp.course_id = p_course_id
    AND NOT EXISTS (
      SELECT 1 FROM enrollments e
      WHERE e.course_id = cp.prerequisite_id
      AND e.student_id = p_student_id
      AND e.status = 'completed'
    )
  ) THEN
    RETURN 'rejected';
  END IF;

  -- Check current enrollments
  SELECT COUNT(*) INTO v_current_enrollments
  FROM enrollments
  WHERE course_id = p_course_id
  AND status IN ('approved', 'pending');

  -- Determine enrollment status
  IF v_current_enrollments >= v_course.max_students THEN
    v_status := 'waitlisted';
  ELSE
    v_status := 'pending';
  END IF;

  -- Create enrollment
  INSERT INTO enrollments (
    course_id,
    student_id,
    status,
    created_at
  )
  VALUES (
    p_course_id,
    p_student_id,
    v_status,
    NOW()
  );

  -- Notify instructor
  INSERT INTO notifications (
    user_id,
    title,
    content,
    type
  )
  VALUES (
    v_course.instructor_id,
    'New Enrollment Request',
    format('New enrollment request for %s', v_course.title),
    'info'
  );

  RETURN v_status;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to approve/reject enrollment
CREATE OR REPLACE FUNCTION process_enrollment(
  p_enrollment_id UUID,
  p_status enrollment_status,
  p_approved_by UUID,
  p_notes TEXT DEFAULT NULL
)
RETURNS VOID AS $$
DECLARE
  v_enrollment enrollments;
BEGIN
  SELECT * INTO v_enrollment
  FROM enrollments
  WHERE id = p_enrollment_id;

  UPDATE enrollments
  SET
    status = p_status,
    approved_by = p_approved_by,
    approved_at = NOW(),
    notes = p_notes,
    updated_at = NOW()
  WHERE id = p_enrollment_id;

  -- Notify student
  INSERT INTO notifications (
    user_id,
    title,
    content,
    type
  )
  VALUES (
    v_enrollment.student_id,
    format('Enrollment %s', p_status),
    format('Your enrollment request has been %s', p_status),
    CASE p_status
      WHEN 'approved' THEN 'success'
      WHEN 'rejected' THEN 'error'
      ELSE 'info'
    END
  );

  -- If approved and there was a waitlist, check if we can approve someone
  IF p_status = 'approved' THEN
    PERFORM process_waitlist(v_enrollment.course_id);
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to process waitlist
CREATE OR REPLACE FUNCTION process_waitlist(p_course_id UUID)
RETURNS VOID AS $$
DECLARE
  v_course courses;
  v_current_enrollments INTEGER;
  v_next_waitlisted enrollments;
BEGIN
  -- Get course details
  SELECT * INTO v_course
  FROM courses
  WHERE id = p_course_id;

  -- Get current enrollment count
  SELECT COUNT(*) INTO v_current_enrollments
  FROM enrollments
  WHERE course_id = p_course_id
  AND status = 'approved';

  -- Process waitlist if there's space
  WHILE v_current_enrollments < v_course.max_students LOOP
    -- Get next waitlisted student
    SELECT * INTO v_next_waitlisted
    FROM enrollments
    WHERE course_id = p_course_id
    AND status = 'waitlisted'
    ORDER BY created_at
    LIMIT 1;

    EXIT WHEN v_next_waitlisted IS NULL;

    -- Approve enrollment
    UPDATE enrollments
    SET
      status = 'approved',
      approved_at = NOW(),
      updated_at = NOW()
    WHERE id = v_next_waitlisted.id;

    -- Notify student
    INSERT INTO notifications (
      user_id,
      title,
      content,
      type
    )
    VALUES (
      v_next_waitlisted.student_id,
      'Enrollment Approved',
      format('Your waitlisted enrollment for %s has been approved', v_course.title),
      'success'
    );

    v_current_enrollments := v_current_enrollments + 1;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;