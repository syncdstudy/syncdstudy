// // lib/supabaseClient.ts
// // testing
// import { createClient } from '@supabase/supabase-js';

// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
// const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// const supabase = createClient(supabaseUrl, supabaseAnonKey);

// export default supabase;

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true, // ⬅️ persist session across refreshes
    autoRefreshToken: true, // ⬅️ auto-refresh tokens
    detectSessionInUrl: true, // ⬅️ useful for magic link flow
  },
});

export default supabase;
