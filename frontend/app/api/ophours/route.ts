import { supabase } from "@/utils/Database/supabase";
import { cookies } from "next/headers";
import { encode } from "@/utils/Cookies";

export async function POST(req: Request) {
	let cookie;
	try {
		cookie = await cookies();
	} catch {
		return Response.json({ error: "Invalid request context" }, { status: 400 });
	}

	const key = cookie.get("key")?.value ?? "";

	if (!key) {
		return Response.json({ error: "Unauthorized" }, { status: 401 });
	}

	let body: unknown;
	try {
		body = await req.json();
	} catch {
		return Response.json({ error: "Invalid JSON body" }, { status: 400 });
	}

	const { ophours } = (body ?? {}) as { ophours?: unknown };

	if (
		!Array.isArray(ophours) ||
		!ophours.every((item) => typeof item === "string")
	) {
		return Response.json(
			{ error: "Invalid input" },
			{
				status: 400,
			},
		);
	}

	const normalizedOphours = ophours
		.map((item) => item.trim().toUpperCase())
		.filter(Boolean)
		.filter((item, index, values) => values.indexOf(item) === index);

	if (!normalizedOphours.every((item) => /^D[1-7]-H(?:1[0-2]|[1-9])$/.test(item))) {
		return Response.json(
			{ error: "Invalid academic hour" },
			{ status: 400 },
		);
	}

	const ophoursString = normalizedOphours.join(",");

	if (!supabase) {
		return Response.json(
			{ error: "Persistence is not configured" },
			{ status: 503 },
		);
	}

	try {
		const { error } = await supabase
			.from("goscrape")
			.update({ ophour: ophoursString })
			.eq("token", encode(key));

		if (error) {
			return Response.json(
				{ error: error.message },
				{
					status: 400,
				},
			);
		}

		return Response.json(
			{ success: true },
			{
				status: 200,
			},
		);
	} catch (error) {
		return Response.json(
			{ error: (error as any).message },
			{
				status: 500,
			},
		);
	}
}
