// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://dspjihwodollejheroyy.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRzcGppaHdvZG9sbGVqaGVyb3l5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIwMzEyNjMsImV4cCI6MjA1NzYwNzI2M30.ybBVRIaWk7Z6gWWfqvJy91rc8qbBzGLSZQz5BIxWQhA";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);