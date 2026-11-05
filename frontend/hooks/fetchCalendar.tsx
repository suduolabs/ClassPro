"use server";
import { cache } from "react";
import type { CalendarResponse } from "@/types/Calendar";
import { token } from "@/utils/Tokenize";
import rotateUrl from "@/utils/URL";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

let cachedData: CalendarResponse | null = null;
let lastFetchTime = 0;
const CACHE_DURATION = 5 * 60 * 1000;

export default async function fetchCal() {
	const cookie = (await cookies()).get("key")?.value;
	if (!cookie) redirect("/auth/login");

	const now = Date.now();
	if (cachedData && now - lastFetchTime < CACHE_DURATION) return cachedData;

	const controller = new AbortController();
	const timeoutId = setTimeout(() => controller.abort(), 10_000);
	let response: Response;

	try {
		response = await fetch(`${rotateUrl()}/calendar`, {
			method: "GET",
			cache: "no-store",
			headers: {
				Accept: "application/json",
				"X-CSRF-Token": cookie,
				Authorization: `Bearer ${token()}`,
			},
			signal: controller.signal,
		});
	} finally {
		clearTimeout(timeoutId);
	}

	const json = (await response.json().catch(() => null)) as CalendarResponse | null;
	if (!json) throw new Error("Calendar service returned an invalid response.");
	if (json.tokenInvalid || response.status === 401) redirect("/invalid");
	if (json.ratelimit || response.status === 429) redirect("/ratelimit");
	if (!response.ok && !json.calendar) {
		throw new Error(json.message || `Calendar service error (${response.status}).`);
	}

	if (response.ok && Array.isArray(json.calendar) && json.calendar.length) {
		cachedData = json;
		lastFetchTime = now;
	}
	return json;
}

export const fetchCalendar = cache(fetchCal);
