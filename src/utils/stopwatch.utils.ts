export function formatTime(ms: number, showMs: boolean = true): string {
	const hours = Math.floor(ms / 3600000);
	const minutes = Math.floor((ms % 3600000) / 60000);
	const seconds = Math.floor((ms % 60000) / 1000);
	const centiseconds = Math.floor((ms % 1000) / 10);
	const pad = (num: number) => String(num).padStart(2, "0");
	return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}${
		!showMs ? "" : `.${pad(centiseconds)}`
	}`;
}

export function formatTime24to12(time24: string) {
	let [hours, minutes] = time24.split(":").map(Number);
	let period = hours >= 12 ? "PM" : "AM";
	hours = hours % 12 || 12; // Convert 24-hour format to 12-hour format
	return `${hours}:${minutes.toString().padStart(2, "0")} ${period}`;
}

