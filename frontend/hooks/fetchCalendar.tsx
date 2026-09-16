"use server";
import type { CalendarResponse } from "@/types/Calendar";
import { token } from "@/utils/Tokenize";
import rotateUrl from "@/utils/URL";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";

let cachedData: CalendarResponse | null = null;
let lastFetchTime: number | null = null;
const CACHE_DURATION = 10 * 60 * 1000;

export default async function fetchCal() {
	const now = Date.now();
	if (cachedData && lastFetchTime && now - lastFetchTime < CACHE_DURATION) {
		return cachedData;
	}

	const cookie = (await cookies()).get("key");
	const a = await fetch(`${rotateUrl()}/calendar`, {
		method: "GET",
		// This is the shared academic planner, not per-user data, which is why
		// the memo below is a single value and fetchUserData's is keyed by
		// cookie. force-cache was still wrong: with revalidate 1800 it pinned a
		// failed scrape for the full half hour, and the backend serves this from
		// its own store anyway.
		cache: "no-store",
		headers: {
			"Content-Type": "application/json",
			"X-CSRF-Token": cookie?.value ?? "",
			// biome-ignore lint/style/useNamingConvention: <explanation>
			Authorization: `Bearer ${token()}`,
		},
	});

	const json: CalendarResponse = await a.json();

	if (json.ratelimit) redirect("/ratelimit");
	// /get already redirects on an expired session. /calendar has to as well,
	// or the calendar page is the one place that renders a dead session as an
	// empty calendar instead of sending you back to log in.
	if (json.tokenInvalid) redirect("/invalid");

	// Only memoise a good answer. Caching a failed scrape kept the empty
	// calendar on screen for ten minutes after the session was fixed.
	if (json.calendar?.length) {
		cachedData = json;
		lastFetchTime = now;
	}

	return json;
}

export const fetchCalendar = cache(fetchCal);
