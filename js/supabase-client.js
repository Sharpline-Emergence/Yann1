// ============================================
// Supabase client — shared across all pages
//
// FILL THESE IN from your Sharpline Digital Supabase
// project: Settings → API → Project URL / anon public key.
// The anon key is safe to expose in client-side code —
// it's designed for this, access is controlled by
// Row Level Security policies (see supabase/schema.sql).
// ============================================

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = 'https://pvpmjmalwjzqehqbvinp.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_y-M5GWJJZCnAdCIOcKCMZw_EkzbqHIg';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Redirect target after magic-link click. Update if you host
// this under a different path/domain than sharplinedigital.com/vivelo/
export const SITE_URL = window.location.origin + window.location.pathname.replace(/[^/]*$/, '');
