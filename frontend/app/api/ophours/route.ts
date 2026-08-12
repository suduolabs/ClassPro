import { supabase } from "@/utils/Database/supabase";
import { cookies } from "next/headers";
import { encode } from "@/utils/Cookies";

export async function POST(req: Request) {
	const cookie = await cookies();
	const key = cookie.get("key")?.value ?? "";
	const body = await req.json();
	const { ophours } = body;

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

	if (!supabase) {
		return Response.json(
			{ error: "Optional hours storage is not configured" },
			{ status: 503 },
		);
	}

	const ophoursString = ophours.join(",");

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
