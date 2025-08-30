import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://whlkalghlkzndsrgcphg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndobGthbGdobGt6bmRzcmdjcGhnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg3Mzk4NjIsImV4cCI6MjA2NDMxNTg2Mn0.bzioCh402L19LGYh5flk9Qg3rfeNzkvJnxVHFcnghtQ';

export const supabase = createClient(supabaseUrl, supabaseKey);
