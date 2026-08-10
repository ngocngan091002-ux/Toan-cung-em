import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://ncfcowbnxuuiwuoagqon.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5jZmNvd2JueHV1aXd1b2FncW9uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYwOTY5NTUsImV4cCI6MjEwMTY3Mjk1NX0.qLRidCcqxUNMgKSsoPbS9cCwlrlkiDXKO1YhE43HxSc';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
