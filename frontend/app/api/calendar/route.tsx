import type { Day } from "@/types/Calendar";
import { ImageResponse } from "next/og";
import { fetchCalendar } from "@/hooks/fetchCalendar";
import { NextRequest } from "next/server";
import { monthName, monthYear } from "@/utils/Times";

const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export async function GET(request: NextRequest) {
	// Session redirects must reach Next.js rather than the image-rendering catch.
	const { calendar } = await fetchCalendar();
	try {
		const { searchParams } = new URL(request.url);
		const monthIndex = parseInt(searchParams.get("month") || "0");

		// A signed-out session scrapes to an empty calendar. Reading a month off
		// it threw, and the catch below turned that into a 500 on a download the
		// user asked for; say plainly that there is nothing to draw.
		const requested = calendar?.[monthIndex] ?? calendar?.[0];
		if (!requested) {
			return new Response("Calendar not available", { status: 404 });
		}
		const month = requested.month;
		const days = requested.days ?? [];

		const geist = await fetch(
			new URL("../../../public/fonts/Geist.ttf", import.meta.url),
		).then((res) => res.arrayBuffer());

		const getFirstDayIndex = () => weekdays.indexOf(days[0]?.day);

		return new ImageResponse(
			(
				<div tw="bg-[#0a0d12] flex flex-col items-center justify-center h-screen w-screen">

					<div
						tw="my-8 flex items-baseline min-w-[220px] justify-start ml-48 w-full"
					>
						<h1 tw="font-semibold text-[#FFF] mt-3 text-6xl">
							{monthName(month)}
						</h1>
						<p tw="text-3xl text-[#FFF] -mt-2 font-medium md:font-semibold ml-2 opacity-60">
							{monthYear(month)}
						</p>
					</div>

					<div tw="max-w-[2000px] flex text-center font-bold bg-[#06090d]">
						{weekdays.map((weekday) => (
							<div
								key={weekday}
								tw="w-[285px] h-[56px] text-lg p-2 font-medium text-center text-white flex items-center justify-center"
							>
								{weekday}
							</div>
						))}
					</div>
					<div tw="bg-[#0a0d12] text-center flex flex-row flex-wrap max-w-[2000px] w-screen">
						{Array.from({ length: getFirstDayIndex() }, (_, index) => (
							<div tw="flex w-[285px] h-[370px] border-[#1E232B] border opacity-20" key={`empty-${index}`} />
						))}
						{days
							.filter((a: any) => a.dayOrder.length <= 1)
							.map((day, index: number) => (
								<DayCell key={index} day={day} />
							))}
					</div>
				</div>
			),
			{
				width: 2100,
				height: 2500,
				fonts: [
					{
						name: "Geist",
						data: geist,
						style: "normal",
					},
				],
				headers: {
					"Cache-Control": "public, max-age=7200, stale-while-revalidate=86400",
					"CDN-Cache-Control": "max-age=7200",
					"Vercel-CDN-Cache-Control": "max-age=7200",
				},
			},
		);
	} catch (err: any) {
		console.warn(err);
		return new Response(
			JSON.stringify({
				// The stack used to go out in the body of a public route.
				error: "Failed to render the calendar image",
			}),
			{
				status: 500,
				statusText: "Server Error",
				headers: {
					"Cache-Control": "no-cache",
				},
			},
		);
	}
}

function DayCell({ day }: { day: Day }) {
	const isErrorDay = day?.dayOrder === "-";

	return (
		<div
			aria-label={day.date}
			title={`${day.date} - Day Order: ${day.dayOrder}`}
			tw={
				`${isErrorDay ? "bg-[#1D0C0C]" : ""} flex max-w-[285px] h-[370px] w-full flex-col justify-between border m-0 border-[#1E232B] p-4 items-end`
			}
		>
			<DateDisplay
				date={day.date}
				day={day?.day}
				isToday={false}
				isErrorDay={isErrorDay}
			/>
			<EventDisplay holiday={day.event || ""} isErrorDay={isErrorDay} />
			<DayOrderDisplay dayOrder={day.dayOrder} isToday={false} />
		</div>
	);
}

interface DateDisplayProps {
	date: string;
	day: string;
	isToday: boolean;
	isErrorDay: boolean;
}

const DateDisplay: React.FC<DateDisplayProps> = ({
	date,
	isErrorDay,
}) => (
	<div tw="flex flex-col">
		<h3
			tw={`text-4xl font-bold ${
				isErrorDay ? "text-[#FF6B6B]" : "text-white"
			}`}
		>
			{date}
		</h3>
	</div>
);

interface EventDisplayProps {
	holiday: string | null;
	isErrorDay: boolean;
}

const EventDisplay: React.FC<EventDisplayProps> = ({
	holiday,
	isErrorDay,
}) => {
	if (!holiday) return null;
	return (
		<p
			tw={`text-sm ${
				isErrorDay ? "text-[#FF6B6B]" : "text-[#7DD3FC]"
			} px-2 py-1 rounded border-l-2 ${
				isErrorDay ? "border-[#FF6B6B]" : "border-[#7DD3FC]"
			} bg-opacity-20 max-w-[250px]`}
		>
			{holiday.replaceAll(",", ", ")}
		</p>
	);
};

interface DayOrderDisplayProps {
	dayOrder: string;
	isToday: boolean;
}

const DayOrderDisplay: React.FC<DayOrderDisplayProps> = ({
	dayOrder,
}) => {
	if (dayOrder === "-") return null;
	return (
		<h2 tw="text-right text-2xl font-bold text-white">
			Day Order {dayOrder}
		</h2>
	);
};

export const runtime = "edge";
