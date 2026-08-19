"use client";

import * as React from "react";
import { format, isWithinInterval, startOfToday } from "date-fns";
import { LuTrash2 } from "react-icons/lu";
import { LuCrown } from "react-icons/lu";

import { cn } from "@/lib/utils";
import { Calendar as CalendarComp } from "@/components/ui/calendar";
import type { CategorizedDateRange } from "@/types/Attendance";
import type { Calendar as CalendarType } from "@/types/Calendar";
import { months } from "..";

type DateCategory = "Leave" | "OD";

/** First day of the month a "Aug '26" entry names, or undefined when the
 * calendar failed to load. Returning undefined lets the picker fall back to its
 * own bounds; findIndex answering -1 used to build December of the year
 * before. */
function boundaryMonth(entry: CalendarType | undefined): Date | undefined {
	const [name, year] = (entry?.month ?? "").split("'");
	const index = months.findIndex((month) => month.trim() === name?.trim());
	if (index === -1) return undefined;
	return new Date(
		year?.trim() ? 2000 + Number(year.trim()) : new Date().getFullYear(),
		index,
	);
}

interface LeaveOdRangeCalendarProps {
    categorizedRanges: CategorizedDateRange[];
    setCategorizedRanges: React.Dispatch<React.SetStateAction<CategorizedDateRange[]>>;
    calendar: CalendarType[];
}

export function LeaveODRangeCalendar({
    categorizedRanges,
    setCategorizedRanges,
    calendar,
}: LeaveOdRangeCalendarProps) {
	const [dateRange, setDateRange] = React.useState<{
		from: Date | undefined;
		to: Date | undefined;
	}>({ from: undefined, to: undefined });

	const handleSelect = (value: any) => {
		if (!value) return;
		setDateRange(value);
	};

	const handleCategoryAdd = (category: DateCategory) => {
		if (window.navigator.vibrate) {
			window.navigator.vibrate(30);
		}
		if (dateRange.from && dateRange.to) {
			const newRange = { from: dateRange.from, to: dateRange.to, category };

			const hasOverlap = categorizedRanges.some(
				(range) =>
					isWithinInterval(newRange.from, {
						start: range.from,
						end: range.to,
					}) ||
					isWithinInterval(newRange.to, { start: range.from, end: range.to }) ||
					isWithinInterval(range.from, {
						start: newRange.from,
						end: newRange.to,
					}) ||
					isWithinInterval(range.to, {
						start: newRange.from,
						end: newRange.to,
					}),
			);

			if (!hasOverlap) {
				setCategorizedRanges((prev) => [...prev, newRange]);
				setDateRange({ from: undefined, to: undefined });
			} else {
				alert("This range overlaps with an existing categorized range.");
			}
		}
	};

	const handleDelete = (rangeToDelete: CategorizedDateRange) => {
		if (window.navigator.vibrate) {
			window.navigator.vibrate(30);
		}
		setCategorizedRanges((prev) =>
			prev.filter((range) => range !== rangeToDelete),
		);
	};

	const today = startOfToday();

	return (
		<div className="flex w-full h-full flex-col overflow-auto gap-4 rounded-xl bg-light-background-light dark:bg-dark-background-dark">
			<div className="flex w-full flex-col lg:flex-row">
				<div className="w-full lg:w-1/2 lg:max-w-[50%]">
					<CalendarComp
						mode="range"
						selected={dateRange}
						onSelect={handleSelect}
						className="w-full rounded-xl"
						modifiers={{
							today: (date) =>
								format(date, "dd-MM-yyyy") === format(today, "dd-MM-yyyy"),
							holidays: (date) => {
								const monthIndex =
									calendar?.findIndex((month) =>
										month.month?.includes(format(date, "MMM")),
									) || 0;
								const formatted = format(date, "dd");
								const cal = calendar?.[monthIndex]?.days?.find(
									(day) => day.date.padStart(2, "0") === formatted,
								);
								return (
									cal?.dayOrder === "-" &&
									format(date, "dd-MM-yyyy") !== format(today, "dd-MM-yyyy")
								);
							},
							leave: (date) =>
								categorizedRanges.some(
									(range) =>
										isWithinInterval(date, {
											start: range.from,
											end: range.to,
										}) && range.category === "Leave",
								),
							od: (date) =>
								categorizedRanges.some(
									(range) =>
										isWithinInterval(date, {
											start: range.from,
											end: range.to,
										}) && range.category === "OD",
								),
							todayHoliday: (date) =>
								format(date, "dd-MM-yyyy") === format(today, "dd-MM-yyyy") &&
								calendar.some((month) =>
									month.days.some(
										(day) =>
											format(date, "dd") === day.date.padStart(2, "0") &&
											day?.dayOrder === "-",
									),
								),
						}}
						modifiersClassNames={{
							todayHoliday:
								"bg-light-error-background! border border-light-error-color dark:bg-dark-error-background! text-light-error-color! border-dark-error-color dark:text-dark-error-color! opacity-100! rounded-full!",
							today:
								"bg-light-success-color dark:bg-dark-success-color opacity-100! text-white! !dark:text-black rounded-full!",
							holidays:
								"text-light-error-color! dark:text-dark-error-color! opacity-60! cursor-not-allowed bg-transparent dark:bg-transparent",
							leave:
								"bg-light-error-color dark:bg-dark-error-color text-black border border-transparent hover:border-light-error-color dark:hover:border-dark-error-color hover:bg-light-error-background rounded-lg dark:hover:bg-dark-error-background hover:text-light-error-color dark:hover:text-dark-error-color",
							od: "bg-light-success-color dark:bg-dark-success-color text-black border border-transparent hover:bg-light-success-background rounded-lg hover:border-light-success-color dark:hover:border-dark-success-color dark:hover:bg-dark-success-background hover:text-light-success-color dark:hover:text-dark-success-color",
						}}
						disabled={[
							(date) =>
								date >
								new Date(
									today.getFullYear(),
									today.getMonth() + 3,
									today.getDate(),
								),
							{ dayOfWeek: [0] },
							(date) => {
								const monthIndex =
									calendar?.findIndex((month) =>
										month.month?.includes(format(date, "MMM")),
									) || 0;

								const formatted = format(date, "dd");

								const cal = calendar?.[monthIndex]?.days?.find(
									(day) => day.date.padStart(2, "0") === formatted,
								);

								return cal?.dayOrder === "-";
							},
						]}
						startMonth={boundaryMonth(calendar[0])}
						endMonth={boundaryMonth(calendar[calendar.length - 1])}
					/>
				</div>
				<div className="w-full lg:w-1/2 lg:max-w-[50%]">
					<div className="h-full border-t border-neutral-200 p-2 md:border-l md:border-t-0 lg:h-[330px] dark:border-neutral-800">
						<div className="flex flex-col gap-1">
							{categorizedRanges.filter((a) => a.category === "Leave").length >
								0 && (
								<span className="ml-1 font-mono text-xs font-semibold text-light-color dark:text-dark-color opacity-15">
									Leave
								</span>
							)}
							{categorizedRanges
								.filter((a) => a.category === "Leave")
								.map((range, index) => (
									<div
										key={index}
										className={cn(
											"flex items-center justify-between rounded-md p-1 bg-light-background-normal dark:bg-dark-background-normal text-light-color dark:text-dark-color",
										)}
									>
										<span className="px-3 py-1 text-sm font-medium">
											{format(range.from, "MMM dd")} to{" "}
											{format(range.to, "MMM dd")}
										</span>
										<button
											type="button"
											className="bg-light-error-background p-2 rounded-md text-light-error-color hover:bg-light-error-background dark:bg-dark-error-background dark:text-dark-error-color dark:hover:bg-dark-error-background"
											onClick={() => handleDelete(range)}
										>
											<LuTrash2 className="h-4 w-4" />
										</button>
									</div>
								))}
							{categorizedRanges.filter((a) => a.category === "OD").length >
								0 && (
								<span className="ml-1 mt-2 font-mono text-xs font-semibold opacity-15 text-light-color dark:text-dark-color">
									OD/ML
								</span>
							)}
							{categorizedRanges
								.filter((a) => a.category === "OD")
								.map((range, index) => (
									<div
										key={index}
										className={cn(
											"flex items-center justify-between rounded-md p-1 bg-light-background-normal dark:bg-dark-background-normal",
										)}
									>
										<span className="px-3 py-1 text-sm font-medium">
											{format(range.from, "MMM dd")} to{" "}
											{format(range.to, "MMM dd")}
										</span>
										<button
											type="button"
											className="bg-light-error-background p-2 rounded-md text-light-error-color hover:bg-light-error-background dark:bg-dark-error-background dark:text-dark-error-color dark:hover:bg-dark-error-background"
											onClick={() => handleDelete(range)}
										>
											<LuTrash2 className="h-4 w-4" />
										</button>
									</div>
								))}
						</div>
					</div>
				</div>
			</div>
			<div className="mt-4 flex space-x-2 p-1">
				<button
					type="submit"
					onClick={() => handleCategoryAdd("Leave")}
					disabled={
						!dateRange.from ||
						!dateRange.to ||
						dateRange.from < today ||
						dateRange.to < today
					}
					className="flex-1 rounded-lg py-2 border-light-error-color bg-light-error-background font-semibold text-light-error-color hover:bg-light-error-color hover:text-dark-error-background disabled:cursor-not-allowed disabled:opacity-50 dark:border-dark-error-color dark:bg-dark-error-background dark:text-dark-error-color dark:hover:bg-dark-error-color"
				>
					Add as Leave
				</button>
				<button
					onClick={() => handleCategoryAdd("OD")}
					type="submit"
					disabled={
						!dateRange.from ||
						!dateRange.to ||
						dateRange.from > today ||
						dateRange.to > today
					}
					className="flex-1 rounded-lg py-2 border-light-success-color bg-light-success-background font-semibold text-light-success-color hover:bg-light-success-color hover:text-dark-success-background disabled:cursor-not-allowed disabled:opacity-50 dark:border-dark-success-color dark:bg-dark-success-background dark:text-dark-success-color dark:hover:bg-dark-success-color flex items-center justify-center gap-2"
				>
					Add as OD/ML
				</button>
			</div>
		</div>
	);
}
