import axios from "axios";
import moment from "moment-timezone";
import { unsupportedTimeZones } from "../data/timezones";
import { formatTime } from "../utils/stopwatch.utils";
import type { TimeZones } from "../types";
import storage from "../utils/localStorage.util";

moment.tz.names().forEach(async (tz) => {
	const continent = tz.split("/")[0];
	const city = tz.split("/")[1];
	if (unsupportedTimeZones.includes(tz)) return;
	// console.log(city + ", " + continent);
	try {
		const data: TimeZones = (
			await axios.get(
				`https://timeapi.io/api/time/current/zone?timeZone=${continent}%2F${city}`
			)
		).data;
		const OurTime = new Date(
			new Date().getFullYear(),
			new Date().getMonth(),
			new Date().getDate(),
			new Date().getHours(),
			new Date().getMinutes()
		);
		const OtherTime = new Date(
			data.year,
			data.month - 1,
			data.day,
			data.hour,
			data.minute
		);
		console.log(formatTime(OurTime.getTime() - OtherTime.getTime()));
	} catch (error) {
		axios.isAxiosError(error)
			? console.log(error.response?.data)
			: console.error("An unexpected error occurred:", error);
	}
});

// Add Time Zone To The List.
// Fetch This TimeZone.
// Add It To The List.
// Loop Through The TimeZones In The List.
// Fetch Each TimeZone.
// Render All TimeZones Added.

function convertMilliseconds(ms: number) {
	const MS_IN_A_DAY = 1000 * 60 * 60 * 24;
	const MS_IN_A_YEAR = MS_IN_A_DAY * 365.25;
	const MS_IN_A_MONTH = MS_IN_A_YEAR / 12;
	const years = Math.floor(ms / MS_IN_A_YEAR);
	ms %= MS_IN_A_YEAR;
	const months = Math.floor(ms / MS_IN_A_MONTH);
	ms %= MS_IN_A_MONTH;
	const days = Math.floor(ms / MS_IN_A_DAY);
	return { years, months, days };
}
console.log(
	convertMilliseconds(Date.now() - new Date(2024, 6, 24, 21, 40, 0).getTime())
);

// 1s => s/6 deg
// 60s => m/6 deg
// 3600s => h/6 deg

let m = 0;
let s = 0;
let h = 0;

// Searching/Selecting TimeZones
// Adding TimeZones
// Deleting Timezones
// Analog Clock For Each TimeZone
