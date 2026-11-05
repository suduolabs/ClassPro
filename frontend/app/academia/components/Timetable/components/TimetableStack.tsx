"use client";
import type { Day } from "@/types/Calendar";
import type { Schedule } from "@/types/Timetable";
import React, { useCallback, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import TableCell from "./TableCell";
import { getIstTime, Time } from "@/utils/Times";
import { timeRange } from "@/utils/Range";
import { useInterval } from "@/utils/Interval";
import { motion, AnimatePresence } from "motion/react";

export default function TimetableStack({
	schedule,
	today,
	ophours,
	tomorrow
}: {
	schedule: Schedule[];
	today: Day;
	tomorrow: Day;
	ophours: string[];
}) {
	const [dOrder, setDo] = useState<string>(
		today?.dayOrder === "-" ? "0" : today?.dayOrder,
	);
	const [currentTime, setTime] = useState<Date>(getIstTime());

	useInterval(() => {
		setTime(getIstTime());
	}, 30 * 1000);

	const scheduleToday =
		schedule?.find((item) => item.day === Number(dOrder)) ?? schedule?.[0];
	const theoryPosition = scheduleToday?.table
		?.slice(0, 5)
		.some((item) => item?.courseType === "Theory")
		? 0
		: 1;

	const prevDay = useCallback(() => {
		setDo((prev) => (Number(prev) <= 1 ? "5" : String(Number(prev) - 1)));
	}, []);

	const nextDay = useCallback(() => {
		setDo((prev) => (prev === "5" ? "1" : String(Number(prev) + 1)));
	}, []);

	if (ophours?.[0]) {
		for (const ophour of ophours) {
			const [day, hour] = ophour.split("-");
			const dayIndex = Number.parseInt(day.replace("D", "")) - 1;
			const hourIndex = Number.parseInt(hour.replace("H", "")) - 1;
			const slot = schedule[dayIndex].table[hourIndex];
			if (slot) slot.isOptional = true;
		}
	}

	const isClassGoing = timeRange(
		currentTime,
		`${Time.start[0]}-${Time.end[Time.end.length - 1]}`,
	);

	return (
		<>
			<AnimatePresence mode="wait">
			{dOrder === "0" ? (
				<motion.div
					key={dOrder}
					className="my-4 dark:bg-dark-background-normal h-32 bg-light-background-dark rounded-2xl p-1"
					initial={{ opacity: 0, x: 10 }}
					animate={{ opacity: 1, x: 0 }}
					exit={{ opacity: 0, x: -10 }}
					transition={{ duration: 0.2 }}
				>
					<div className="w-full rounded-xl h-full bg-light-error-background dark:bg-dark-error-background flex items-center justify-center">
						<h1 className="text-center text-3xl font-medium text-light-error-color dark:text-dark-error-color">
							Holiday
						</h1>
					</div>
				</motion.div>
			) : (
				<motion.div
					key={dOrder}
					className="my-4 lg:w-full md:min-w-[600px] md:w-full lg:h-32 dark:bg-dark-background-normal bg-light-background-dark rounded-2xl flex flex-col p-1"
					initial={{ opacity: 0, x: 10 }}
					animate={{ opacity: 1, x: 0 }}
					exit={{ opacity: 0, x: -10 }}
					transition={{ duration: 0.2 }}
				>
					<div className="grid-cols-10 hidden h-6 lg:grid">
						{[...Array(10)].map((_, index) => (
							<span
								key={index}
								className={`h-full ${index === 4 ? "border-r-2 border-light-accent/20 dark:border-dark-accent/20" : ""} text-xs font-semibold text-light-accent dark:text-dark-accent flex items-center justify-center`}
							>
								{index + 1}
							</span>
						))}
					</div>
					<div className="h-full flex lg:flex-row flex-col">
						<div
							className={`lg:w-1/2 w-full ${theoryPosition === 0 ? "bg-theory" : "bg-practical"} h-full rounded-t-xl lg:rounded-tr-none lg:rounded-l-xl flex flex-col lg:grid lg:grid-cols-5`}
						>
							{scheduleToday?.table?.slice(0, 5).map((item, index) => (
								<TableCell
									isClassGoing={isClassGoing && today?.dayOrder === dOrder}
									key={index}
									cell={item}
									index={index}
									first
									currentTime={currentTime}
								/>
							))}
						</div>
						<div
							className={`lg:w-1/2 w-full ${theoryPosition === 0 ? "bg-practical" : "bg-theory"} h-full rounded-b-xl lg:rounded-bl-none lg:rounded-r-xl flex flex-col lg:grid lg:grid-cols-5`}
						>
							{scheduleToday?.table?.slice(5, 10).map((item, index) => (
								<TableCell
									isClassGoing={isClassGoing && today?.dayOrder === dOrder}
									key={index}
									cell={item}
									index={index}
									last
									currentTime={currentTime}
								/>
							))}
						</div>
					</div>
				</motion.div>
			)}
			</AnimatePresence>
			<div className="flex items-center justify-center gap-4">
				<div className="flex items-center justify-center gap-2">
					<button
						type="button"
						onClick={prevDay}
						className=" p-1 rounded-md transition-all duration-150 hover:bg-light-button dark:hover:bg-dark-button"
					>
						<FaChevronLeft className="text-light-accent dark:text-dark-accent text-xs opacity-80" />
					</button>
					<h1 className="text-sm font-medium text-light-accent dark:text-dark-accent">
						{dOrder === "0" ? "Holiday" : `Day ${dOrder}`}
					</h1>
					<button
						type="button"
						onClick={nextDay}
						className="p-1 rounded-md transition-all duration-150 hover:bg-light-button dark:hover:bg-dark-button"
					>
						<FaChevronRight className="text-light-accent dark:text-dark-accent opacity-80 text-xs" />
					</button>
				</div>
				<button
					type="button"
					onClick={() => setDo(today?.dayOrder === "-" ? "0" : today?.dayOrder)}
					className={`rounded-full px-4 py-1 font-medium text-sm border border-dashed ${dOrder === (today?.dayOrder === "-" ? "0" : today?.dayOrder) ? "dark:bg-dark-success-background bg-light-success-background border-transparent text-light-success-color dark:text-dark-success-color" : "dark:bg-dark-color/5 bg-light-color/5 dark:border-dark-color/10 border-light-color/10 dark:text-dark-color text-light-color"} `}
				>
					Today
				</button>
				{currentTime && currentTime.getHours() >= 17 && Number(tomorrow?.dayOrder) > 0 && <button
					type="button"
					onClick={() => setDo(tomorrow?.dayOrder)}
					className={`rounded-full px-4 py-1 font-medium text-sm border border-dashed dark:bg-dark-info-background bg-light-info-background border-light-info-color dark:border-dark-info-color text-light-info-color dark:text-dark-info-color `}
				>
					Tom: DO{Number(tomorrow?.dayOrder)}
				</button>}
			</div>
		</>
	);
}
