import { createClient } from "@supabase/supabase-js";

// Define your Supabase URL and Key
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SERVICE_KEY;

// Keep builds deterministic when optional persistence credentials are absent.
const supabase = SUPABASE_URL && SUPABASE_KEY
	? createClient(SUPABASE_URL, SUPABASE_KEY)
	: null;

export { supabase };
