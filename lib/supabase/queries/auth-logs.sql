-- Query auth logs for debugging authentication issues
SELECT 
  created_at as timestamp,
  event_message,
  level,
  path,
  status,
  error_code
FROM auth.audit_log_entries
WHERE 
  -- Filter by log level
  level IN ('info', 'warning', 'error', 'fatal')
  
  -- Optionally filter by specific auth endpoints
  AND path IN ('/auth/v1/token', '/auth/v1/recover', '/auth/v1/signup', '/auth/v1/otp')
  
  -- Add time range if needed
  AND created_at > NOW() - INTERVAL '24 hours'
  
ORDER BY created_at DESC
LIMIT 100;