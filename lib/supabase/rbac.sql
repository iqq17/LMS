-- Role-Based Access Control (RBAC) Policies

-- Profiles
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Courses
CREATE POLICY "Teachers can create courses"
  ON courses FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role = 'teacher'
  ));

CREATE POLICY "Teachers can update their own courses"
  ON courses FOR UPDATE
  USING (instructor_id = auth.uid());

CREATE POLICY "Teachers can delete their own courses"
  ON courses FOR DELETE
  USING (instructor_id = auth.uid());

-- Course Materials
CREATE POLICY "Teachers can manage course materials"
  ON course_materials FOR ALL
  USING (EXISTS (
    SELECT 1 FROM courses
    WHERE courses.id = course_materials.course_id
    AND courses.instructor_id = auth.uid()
  ));

CREATE POLICY "Students can view enrolled course materials"
  ON course_materials FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM enrollments
    WHERE enrollments.course_id = course_materials.course_id
    AND enrollments.student_id = auth.uid()
  ));

-- Enrollments
CREATE POLICY "Students can enroll in courses"
  ON enrollments FOR INSERT
  WITH CHECK (
    auth.uid() = student_id
    AND EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'student'
    )
  );

-- Progress Tracking
CREATE POLICY "Students can update their own progress"
  ON lesson_progress FOR INSERT
  WITH CHECK (student_id = auth.uid());

CREATE POLICY "Teachers can view student progress"
  ON lesson_progress FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM courses
    JOIN enrollments ON enrollments.course_id = courses.id
    WHERE courses.instructor_id = auth.uid()
    AND enrollments.student_id = lesson_progress.student_id
  ));

-- Session Management
CREATE POLICY "Teachers can manage sessions"
  ON live_sessions FOR ALL
  USING (instructor_id = auth.uid());

CREATE POLICY "Students can view and join sessions"
  ON live_sessions FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM enrollments
    WHERE enrollments.course_id = live_sessions.course_id
    AND enrollments.student_id = auth.uid()
  ));

-- Assignments
CREATE POLICY "Teachers can manage assignments"
  ON assignments FOR ALL
  USING (EXISTS (
    SELECT 1 FROM courses
    WHERE courses.id = assignments.course_id
    AND courses.instructor_id = auth.uid()
  ));

CREATE POLICY "Students can view assignments"
  ON assignments FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM enrollments
    WHERE enrollments.course_id = assignments.course_id
    AND enrollments.student_id = auth.uid()
  ));

-- Submissions
CREATE POLICY "Students can submit assignments"
  ON submissions FOR INSERT
  WITH CHECK (student_id = auth.uid());

CREATE POLICY "Teachers can grade submissions"
  ON submissions FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM assignments
    JOIN courses ON courses.id = assignments.course_id
    WHERE assignments.id = submissions.assignment_id
    AND courses.instructor_id = auth.uid()
  ));