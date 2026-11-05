"use server";
import { cache } from "react";
import type { AllResponse } from "@/types/Response";
import { token } from "@/utils/Tokenize";
import rotateUrl from "@/utils/URL";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

type CachedData = { data: AllResponse; timestamp: number };
const dataCache = new Map<string, CachedData>();
const CACHE_TTL_MS = 2 * 60 * 1000;
const CACHE_LIMIT = 100;
const REQUEST_TIMEOUT_MS = 10_000;

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null;
}

function pruneCache(now: number) {
	for (const [key, value] of dataCache) {
		if (now - value.timestamp > CACHE_TTL_MS) dataCache.delete(key);
	}
}

async function fetchData(): Promise<AllResponse> {
	const cookie = (await cookies()).get("key")?.value;
	if (!cookie) redirect("/auth/login");

	const userKey = `key-${cookie}`;
	const now = Date.now();
	const cachedData = dataCache.get(userKey);
	if (cachedData && now - cachedData.timestamp < CACHE_TTL_MS) {
		return cachedData.data;
	}

	const controller = new AbortController();
	const timeoutId = setTimeout(
		() => controller.abort(),
		REQUEST_TIMEOUT_MS,
	);

	try {
		const response = await fetch(`${rotateUrl()}/get`, {
			method: "GET",
			cache: "no-store",
			headers: {
				Accept: "application/json",
				"X-CSRF-Token": cookie,
				Authorization: `Bearer ${token()}`,
			},
			signal: controller.signal,
		});
		clearTimeout(timeoutId);

		const payload: unknown = await response.json().catch(() => null);
		if (!isRecord(payload)) {
			throw new Error("The academic service returned an invalid response.");
		}

		const json = payload as unknown as AllResponse;
		if (json.tokenInvalid || response.status === 401) redirect("/invalid");
		if (json.ratelimit || response.status === 429) redirect("/ratelimit");
		if (!response.ok) {
			throw new Error(json.error || `Academic service error (${response.status}).`);
		}

		dataCache.set(userKey, { data: json, timestamp: now });
		if (dataCache.size > CACHE_LIMIT) pruneCache(now);

		return json;
	} catch (error) {
		clearTimeout(timeoutId);
		if ((error as Error).name === "AbortError") redirect("/sleeping");
		throw error;
	}
}

export const fetchUserData = cache(async () => fetchData());
