import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database.types';

// Perhatikan: kita menggunakan createClient dari '@supabase/supabase-js'
// bukan dari auth-helpers, karena ini untuk akses backend langsung.
export const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);