import type { Schedule, ScheduleSlot } from "@/types/Timetable";
import { ImageResponse } from "next/og";
import { Time, timeConvert } from "@/utils/Times";
import { fetchUserData } from "@/hooks/fetchUserData";

export async function GET() {
	const { timetable: data, ophour } = await fetchUserData();

	const timetable = data?.schedule;
	if (!timetable) {
		return new Response("Timetable not found", { status: 404 });
	}

	const ophours = ophour?.split(",");
	if (ophours?.[0]) {
		for (const ophour of ophours) {
			const [day, hour] = ophour.split("-");
			const dayIndex = Number.parseInt(day.replace("D", "")) - 1;
			const hourIndex = Number.parseInt(hour.replace("H", "")) - 1;

			const slot = timetable[dayIndex]?.table[hourIndex];
			if (slot) slot.isOptional = true;
		}
	}

	const geist = await fetch(
		new URL("../../../public/fonts/Geist.ttf", import.meta.url),
	).then((res) => res.arrayBuffer());

	return new ImageResponse(
		<section
			style={{
				height: "100%",
				width: "100%",
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				background: "#11151B",
				justifyContent: "space-around",
			}}
		>
			<div style={{ display: "flex", flexDirection: "column" }}>
				<TimeArr />
				<TimetableImage timetable={timetable} />
			</div>
			<p tw="text-white text-lg opacity-70 pb-2">Made with ClassPro</p>
		</section>,
		{
			width: 2400,
			height: 1000,
			fonts: [
				{
					name: "Geist",
					data: geist,
					style: "normal",
				},
			],
			headers: {
				"Cache-Control": "private, no-store, must-revalidate",
				"Vary": "Cookie",
			},
		},
	);
}
function TimeArr() {
	return (
		<div style={{ height: "50px" }} tw="flex flex-row justify-between w-full">
			{Time.start.map((start, index) => (
				<div
					style={{ width: "240px" }}
					tw="flex flex-col items-center justify-center"
					key={index}
				>
					<p tw="text-white text-lg opacity-70">
						{timeConvert(start)} - {timeConvert(Time.end[index])}
					</p>
				</div>
			))}
		</div>
	);
}

function TimetableImage({ timetable }: { timetable: Schedule[] }) {
	return (
		<div
			tw="flex flex-col"
			style={{ display: "flex", flexDirection: "column", height: "900px" }}
		>
			{timetable.map((item, index) => (
				<ImageGenerator timetable={item} key={index} />
			))}
		</div>
	);
}

function ImageGenerator({ timetable }: { timetable: Schedule }) {
	const theoryPosition = timetable?.table
		?.slice(0, 5)
		.some((item) => item?.courseType === "Theory")
		? 0
		: 1;
	return (
		<div tw="h-full flex flex-row" style={{ height: "180px" }}>
			<div
				tw={`${theoryPosition === 0 ? "bg-[#F2D869]" : "bg-[#69E069]"} h-full flex w-[1200px]`}
			>
				{timetable?.table?.slice(0, 5).map((item, index) => (
					<TableCell key={index} cell={item} />
				))}
			</div>
			<div
				tw={`${theoryPosition === 0 ? "bg-[#69E069]" : "bg-[#F2D869]"} h-full flex w-[1200px]`}
			>
				{timetable?.table?.slice(5, 10).map((item, index) => (
					<TableCell key={index} cell={item} />
				))}
			</div>
		</div>
	);
}

function TableCell({ cell }: { cell: ScheduleSlot | null }) {
	return (
		<div
			style={{ width: "240px" }}
			tw={`border-2 flex flex-col text-black relative justify-between items-start px-6 ${!cell ? "bg-black/70" : cell.isOptional ? "bg-black/40" : ""} border-black/60`}
		>
			<p tw="text-xl font-semibold text-left mr-3">
				{cell?.name.split(":")[0]}
			</p>
			<div tw="flex items-end justify-between w-full opacity-60 flex">
				<p tw="text-lg font-semibold">{cell?.roomNo}</p>
				{cell?.isOptional && <p tw="text-lg font-semibold">(Optional)</p>}
			</div>
		</div>
	);
}

export const runtime = "edge";
