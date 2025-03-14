export type Lap = {
	time: number;
	totalTime: number;
	date: number;
};

export type fetchedTimeZone = {
	date: string;
	dateTime: string;
	day: number;
	dayOfWeek: string;
	dstActive: boolean;
	hour: number;
	milliSeconds: number;
	minute: number;
	month: number;
	seconds: number;
	time: string;
	timeZone: string;
	year: number;
};

export type cleanedTimeZone = {
	id: number;
	timezonename: string;
	differenceBetweenLocal: number;
	date: string;
	time: string;
	cityName: string;
	night: boolean | null;
};
