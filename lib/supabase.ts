import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://qkoejbrdrqirhznsovnj.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFrb2VqYnJkcnFpcmh6bnNvdm5qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjk2OTI2OTMsImV4cCI6MjA0NTI2ODY5M30.v6LXizxQj-hdKEQsZ_2uohEz9D-ucg3RWok9ZvKTv0s'

export const supabase = createClient(supabaseUrl, supabaseKey)