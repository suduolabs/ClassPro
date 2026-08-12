import { createClient } from "@supabase/supabase-js";

// Define your Supabase URL and Key
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SERVICE_KEY;


// Supabase only backs optional-hour saving. Without it the app still works, so
// stay null instead of throwing at import and taking the whole build down.
const supabase =
	SUPABASE_URL && SUPABASE_KEY ? createClient(SUPABASE_URL, SUPABASE_KEY) : null;

if (!supabase) {
	console.warn(
		"NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SERVICE_KEY not set - optional hours cannot be saved",
	);
}

export { supabase };
