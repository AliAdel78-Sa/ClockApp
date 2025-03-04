export type Lap = {
	time: number;
	totalTime: number;
	date: number;
};

export type TimeZones = {
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

export type LocalStorage = {
	get: <T>(key: string, alt?: T | null) => T | null;
	set: (key: string, value: unknown) => void;
	clear: () => void;
	remove: (key: string) => void;
	size: () => void;
};
