import type { CalendarData } from "@/types/CalendarData";
import { supabase } from "./supabase";
import { encode } from "../Cookies";

interface DatabaseRecord {
	regNumber: string;
	user?: string;
	timetable?: string;
	course?: string;
	attendance?: string;
	marks?: string;
	lastUpdated?: number;
	token?: string;
}

class Database {
	async getEvents(): Promise<CalendarData[]> {
		if (!supabase) throw new Error("Persistence is not configured");
		const { data, error } = await supabase
			.from("gocal")
			.select("*");

		if (error) {
			console.error("Error fetching events:", error.message);
			throw new Error("Failed to fetch calendar events");
		}

		const events = data as {
			date: string;
			day: string;
			event: string;
			order: string;
		}[];
		const calendar: CalendarData[] = [];

		for (const event of events) {
			const [month, date] = event.date.split(" - ");
			const monthData = calendar?.find((cal) => cal.month === month);

			if (monthData) {
				monthData.days.push({
					date,
					day: event.day,
					event: event.event,
					dayOrder: event.order,
				});
			} else {
				calendar.push({
					month,
					days: [
						{
							date,
							day: event.day,
							event: event.event,
							dayOrder: event.order,
						},
					],
				});
			}
		}

		return calendar;
	}

	// Method to get data by regNumber
	async getData(regNumber: string): Promise<DatabaseRecord | null> {
		try {
			if (!supabase) return null;
			const { data, error } = await supabase
				.from("goscrape") // Replace with your actual table name
				.select("*")
				.eq("regNumber", regNumber)
				.single(); // Use single() to return a single record

			if (error) {
				console.error(error);
				console.error(`Error fetching data: ${error.message}`);
				return null;
			}

			return data as DatabaseRecord;
		} catch (error: any) {
			console.error(`Supabase getData error: ${error.message}`);
			return null;
		}
	}

	async getSpecific(
		cookie: string,
		selector = "*",
	): Promise<DatabaseRecord | null> {
		try {
			if (!supabase) return null;
			const { data, error } = await supabase
				.from("goscrape") // Replace with your actual table name
				.select(selector)
				.eq("token", encode(cookie))
				.single(); // Use single() to return a single record

			if (error) {
				if (error.code === "PGRST116") return null;

				console.error(`Error fetching data: ${error.message}`);
				return null;
			}

			return data as unknown as DatabaseRecord;
		} catch (error: any) {
			console.error(`Supabase getData error: ${error.message}`);
			return null;
		}
	}

	async checkCookie(cookie: string): Promise<DatabaseRecord | null> {
		try {
			if (!supabase) return null;
			const { data, error } = await supabase
				.from("goscrape") // Replace with your actual table name
				.select("*")
				.eq("token", encode(cookie))
				.single(); // Use single() to return a single record

			if (error) {
				if (error.code === "PGRST116") return null;

				console.error(`Error fetching data: ${error.message}`);
				return null;
			}

			return data as DatabaseRecord;
		} catch (error: any) {
			console.error(`Supabase getData error: ${error.message}`);
			return null;
		}
	}

	// Method to delete data by regNumber
	async deleteData(regNumber: string): Promise<void> {
		try {
			if (!supabase) throw new Error("Persistence is not configured");
			const { error } = await supabase
				.from("goscrape") // Replace with your actual table name
				.delete()
				.eq("regNumber", regNumber);

			if (error) throw new Error(`Error deleting data: ${error.message}`);
			console.info(`Data deleted for regNumber: ${regNumber}`);
		} catch (error: any) {
			console.error(`Supabase deleteData error: ${error.message}`);
		}
	}
}

export default Database;
