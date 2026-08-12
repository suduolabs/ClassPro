import type { Schedule } from "@/types/Timetable";
import React from "react";
import TimetableStack from "./components/TimetableStack";
import { FiDownload } from "react-icons/fi";
import EditTimetable from "./EditTimetable";

import { CalendarResponse } from "@/types/Calendar";

export default function Timetable({
	schedule,
	ophours,
	cal
}: {
	schedule: Schedule[];
	ophours: string[];
	cal: CalendarResponse
}) {
	const { today, tomorrow } = cal;

	return (
		<section id="timetable">
			<div className="flex justify-between items-center px-2 mb-1">
				<h1 className="text-2xl font-semibold">Timetable</h1>
				<div className="flex items-center justify-center gap-3">
					<a
						href="/api/timetable"
						download="Timetable-ClassPro.png"
						className="p-1 rounded-lg transition-all duration-150 hover:bg-light-button dark:hover:bg-dark-button"
					>
						<FiDownload className="text-lg text-light-accent dark:text-dark-accent cursor-pointer" />
					</a>
					<EditTimetable timetable={schedule} ophours={ophours} />
				</div>
			</div>
			<div className={"transition duration-150"}>
				{today || tomorrow ? <TimetableStack schedule={schedule} ophours={ophours} today={today} tomorrow={tomorrow} /> : <div className="text-center text-lg font-semibold">No timetable available</div>}
				<div id="edit-timetable" />
			</div>
		</section>
	);
}
