-- Resource Management System

-- Resource categories table
CREATE TABLE resource_categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  parent_id UUID REFERENCES resource_categories(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Resource versions table
CREATE TABLE resource_versions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  resource_id UUID REFERENCES resources(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL,
  url TEXT NOT NULL,
  changes TEXT,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(resource_id, version_number)
);

-- Resource access levels table
CREATE TABLE resource_access_levels (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  resource_id UUID REFERENCES resources(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('student', 'teacher', 'admin')),
  course_id UUID REFERENCES courses(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Resource tags table
CREATE TABLE resource_tags (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Resource tag mappings
CREATE TABLE resource_tag_mappings (
  resource_id UUID REFERENCES resources(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES resource_tags(id) ON DELETE CASCADE,
  PRIMARY KEY (resource_id, tag_id)
);

-- Add columns to resources table
ALTER TABLE resources 
ADD COLUMN category_id UUID REFERENCES resource_categories(id),
ADD COLUMN current_version INTEGER DEFAULT 1,
ADD COLUMN is_archived BOOLEAN DEFAULT false,
ADD COLUMN metadata JSONB DEFAULT '{}'::jsonb,
ADD COLUMN downloads INTEGER DEFAULT 0;

-- Function to create a new resource version
CREATE OR REPLACE FUNCTION create_resource_version(
  p_resource_id UUID,
  p_url TEXT,
  p_changes TEXT,
  p_created_by UUID
)
RETURNS UUID AS $$
DECLARE
  v_version_number INTEGER;
  v_version_id UUID;
BEGIN
  -- Get next version number
  SELECT COALESCE(MAX(version_number), 0) + 1
  INTO v_version_number
  FROM resource_versions
  WHERE resource_id = p_resource_id;

  -- Create new version
  INSERT INTO resource_versions (
    resource_id,
    version_number,
    url,
    changes,
    created_by
  ) VALUES (
    p_resource_id,
    v_version_number,
    p_url,
    p_changes,
    p_created_by
  ) RETURNING id INTO v_version_id;

  -- Update resource current version
  UPDATE resources
  SET 
    current_version = v_version_number,
    updated_at = NOW()
  WHERE id = p_resource_id;

  RETURN v_version_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to track resource downloads
CREATE OR REPLACE FUNCTION track_resource_download(
  p_resource_id UUID,
  p_user_id UUID
)
RETURNS VOID AS $$
BEGIN
  -- Increment download count
  UPDATE resources
  SET downloads = downloads + 1
  WHERE id = p_resource_id;

  -- Log download
  INSERT INTO resource_downloads (
    resource_id,
    user_id,
    downloaded_at
  ) VALUES (
    p_resource_id,
    p_user_id,
    NOW()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to search resources
CREATE OR REPLACE FUNCTION search_resources(
  p_query TEXT,
  p_category_id UUID DEFAULT NULL,
  p_tags TEXT[] DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  description TEXT,
  type TEXT,
  url TEXT,
  category_name TEXT,
  tags TEXT[],
  created_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    r.id,
    r.title,
    r.description,
    r.type,
    r.url,
    rc.name as category_name,
    ARRAY_AGG(rt.name) as tags,
    r.created_at
  FROM resources r
  LEFT JOIN resource_categories rc ON r.category_id = rc.id
  LEFT JOIN resource_tag_mappings rtm ON r.id = rtm.resource_id
  LEFT JOIN resource_tags rt ON rtm.tag_id = rt.id
  WHERE 
    (p_query IS NULL OR 
     r.title ILIKE '%' || p_query || '%' OR 
     r.description ILIKE '%' || p_query || '%')
    AND (p_category_id IS NULL OR r.category_id = p_category_id)
    AND (p_tags IS NULL OR rt.name = ANY(p_tags))
    AND NOT r.is_archived
  GROUP BY r.id, rc.name;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add RLS policies
ALTER TABLE resource_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE resource_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE resource_access_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE resource_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE resource_tag_mappings ENABLE ROW LEVEL SECURITY;

-- Resource access policies
CREATE POLICY "Teachers can manage resources"
  ON resources FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'teacher'
    )
  );

CREATE POLICY "Students can view accessible resources"
  ON resources FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM resource_access_levels ral
      WHERE ral.resource_id = resources.id
      AND (
        ral.role = (
          SELECT role FROM profiles WHERE id = auth.uid()
        )
        OR EXISTS (
          SELECT 1 FROM enrollments e
          WHERE e.course_id = ral.course_id
          AND e.student_id = auth.uid()
        )
      )
    )
  );